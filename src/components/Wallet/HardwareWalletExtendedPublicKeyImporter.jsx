import React from 'react';
import PropTypes from 'prop-types';
import {
  UNSUPPORTED, PENDING, ACTIVE, ERROR,
  HardwareWalletExportExtendedPublicKey,
} from "unchained-wallets";

// Components
import {
  Button, TextField, FormHelperText,
  Box, Grid
} from '@material-ui/core';
import WalletFeedback from '../WalletFeedback';

class HardwareWalletExtendedPublicKeyImporter extends React.Component {

  static propTypes =  {
    network: PropTypes.string.isRequired,
    addressType: PropTypes.string.isRequired,
    extendedPublicKeyImporter: PropTypes.shape({}).isRequired,
    validateAndSetExtendedPublicKey: PropTypes.func.isRequired,
    validateAndSetBIP32Path: PropTypes.func.isRequired,
    defaultBIP32Path: PropTypes.string.isRequired,
    resetBIP32Path: PropTypes.func.isRequired,
    enableChangeMethod: PropTypes.func.isRequired,
    disableChangeMethod: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    this.resetBIP32Path();
  }

  constructor(props) {
    super(props);
    this.state = {
      extendedPublicKeyError: '',
      bip32PathError: '',
      walletState: (this.interaction().isSupported() ? PENDING : UNSUPPORTED),
    };
  }

  interaction = () => {
    const {network, extendedPublicKeyImporter} = this.props;
    return HardwareWalletExportExtendedPublicKey({network, walletType: extendedPublicKeyImporter.method, bip32Path: extendedPublicKeyImporter.bip32Path});
  }

  render = () => {
    const {extendedPublicKeyImporter} = this.props;
    const {walletState, extendedPublicKeyError} = this.state;
    const interaction = this.interaction();
    if (walletState === UNSUPPORTED) {
      return <FormHelperText className="text-danger">{interaction.messageTextFor({walletState})}</FormHelperText>;
    }
    return (
      <Box mt={2}>
       <Grid container>
        <Grid item md={6}>
            <TextField
              fullWidth
              label="BIP32 Path"
              value={extendedPublicKeyImporter.bip32Path}
              onChange={this.handleBIP32PathChange}
              disabled={walletState !== PENDING}
              error={this.hasBIP32PathError()}
              helperText={this.bip32PathError()}
            />
        </Grid>
        <Grid item md={6}>
          {!this.bip32PathIsDefault() && <Button type="button" variant="contained" size="small" onClick={this.resetBIP32Path}  disabled={walletState !== PENDING}>Default</Button>}
        </Grid>
       </Grid>
        <FormHelperText>Use the default value if you don&rsquo;t understand BIP32 paths.</FormHelperText>
        <Box mt={2}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            onClick={this.import}
            disabled={this.hasBIP32PathError() || walletState === ACTIVE}>Import Extended Public Key</Button>
        </Box>
        <WalletFeedback messages={interaction.messagesFor({walletState})} excludeCodes={["bip32"]}/>
        <FormHelperText className="text-danger">{extendedPublicKeyError}</FormHelperText>
      </Box>
    );
  }

  import = async () => {
    const {validateAndSetExtendedPublicKey, enableChangeMethod, disableChangeMethod} = this.props;
    disableChangeMethod();
    this.setState({extendedPublicKeyError: '', walletState: ACTIVE});
    try {
      const extendedPublicKey = await this.interaction().run();
      validateAndSetExtendedPublicKey(extendedPublicKey, (error) => {this.setState({extendedPublicKeyError: error, walletState: PENDING});});
    } catch(e) {
      console.error(e);
      this.setState({extendedPublicKeyError: e.message, walletState: PENDING});
    }

    enableChangeMethod();
  }


  hasBIP32PathError = () => {
    const {bip32PathError, walletState} = this.state;
    return (bip32PathError !== '' || this.interaction().hasMessagesFor({walletState, level: ERROR, code: "bip32"}));
  }

  bip32PathError = () => {
    const {bip32PathError, walletState} = this.state;
    if (bip32PathError !== '') { return bip32PathError; }
    return this.interaction().messageTextFor({walletState, level: ERROR, code: "bip32"});
  }

  setBIP32PathError = (value) => {
    this.setState({bip32PathError: value});
  }

  handleBIP32PathChange = (event) => {
    const { validateAndSetBIP32Path } = this.props;
    const bip32Path = event.target.value;
    validateAndSetBIP32Path(bip32Path, () => {}, this.setBIP32PathError);
  };

  bip32PathIsDefault = () => {
    const {extendedPublicKeyImporter, defaultBIP32Path} = this.props;
    return extendedPublicKeyImporter.bip32Path === defaultBIP32Path;
  }

  resetBIP32Path = () => {
    const {resetBIP32Path} = this.props;
    this.setBIP32PathError('');
    resetBIP32Path();
  }

}

export default HardwareWalletExtendedPublicKeyImporter;
