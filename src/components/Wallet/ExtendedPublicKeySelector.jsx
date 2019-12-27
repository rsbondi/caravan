import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Actions
import {
  setSignatureImporterBIP32Path,
  setSignatureImporterMethod,
} from "../../actions/signatureImporterActions";

// Components
import {
  deriveChildPublicKey,
} from 'unchained-bitcoin';
import SignatureImporter from '../Spend/SignatureImporter';

import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";

class ExtendedPublicKeySelector extends React.Component {
  static propTypes =  {
     number: PropTypes.number.isRequired,
     totalSigners: PropTypes.number.isRequired,
     extendedPublicKeyImporters: PropTypes.shape({}).isRequired,
  };

  state = {
    selection: 0,
  };

  render = () => {
    const { selection } = this.state;
    return (<div>
      {this.renderKeySelectorMenu()}
      {selection > 0 && this.renderSignatureImporter()}
    </div>

    )
  }

  renderSignatureImporter = () => {
    const { number } = this.props;
    return (
      <Box mt={2}>
        <SignatureImporter number={number} />
      </Box>
    )
  }

  renderKeySelectorMenu = () => {
    const { number } = this.props;
    const { selection } = this.state
    const labelId = `keySelector${number}`
    return (
      <form>

      <FormControl fullWidth>
        <InputLabel id={labelId}>Select Key</InputLabel>

        <Select
          labelId={labelId}
          id={`signature-${number}-key-select`}
          // disabled={disableChangeMethod}
          value={selection}
          onChange={this.handleKeyChange}
        >
          <MenuItem value="">{'< Select Extended Public Key >'}</MenuItem>
          {this.renderKeySelectorMenuItems()}
        </Select>
      </FormControl>

    </form>
    )

  }

  extendedPublicKeyImporterNotUsed = (extendedPublicKeyImporter) => {
    const { inputs, network, signatureImporters} = this.props;

    for(let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
      const input = inputs[inputIndex];
      const derivedKey = deriveChildPublicKey(extendedPublicKeyImporter.extendedPublicKey, input.bip32Path, network);
      for(let importerIndex = 1; importerIndex <= Object.keys(signatureImporters).length; importerIndex++) {
        const importer = signatureImporters[importerIndex];
        for(let publicKeyIndex = 0; publicKeyIndex < importer.publicKeys.length; publicKeyIndex++) {
          const publicKey = importer.publicKeys[publicKeyIndex];
          if (publicKey === derivedKey) return false;
        }
      }
    }
    return true;
  }

  renderKeySelectorMenuItems = () => {
    const { extendedPublicKeyImporters, totalSigners } = this.props;
    const extendedPublicKeys = [];
    for (var extendedPublicKeyImporterNum = 1; extendedPublicKeyImporterNum <= totalSigners; extendedPublicKeyImporterNum++) {
      const extendedPublicKeyImporter = extendedPublicKeyImporters[extendedPublicKeyImporterNum]
      if (this.extendedPublicKeyImporterNotUsed(extendedPublicKeyImporter)) {
        extendedPublicKeys.push(<MenuItem value={extendedPublicKeyImporterNum}  key={extendedPublicKeyImporterNum}>
          {extendedPublicKeyImporter.name}

      </MenuItem>)
      }
    }
    return extendedPublicKeys;
  }

  handleKeyChange = (event) => {
    const { extendedPublicKeyImporters , setBIP32Path, setMethod, number} = this.props;
    const extendedPublicKeyImporter = extendedPublicKeyImporters[event.target.value]
    const importMethod = extendedPublicKeyImporter.method;
    this.setState({selection: event.target.value});
    if (importMethod === 'trezor' || importMethod === 'ledger') {
      setMethod(number, importMethod)
      setTimeout(() => {
        setBIP32Path(number, extendedPublicKeyImporter.bip32Path);
      },0)
    } else if (importMethod === 'hermit') {
      setMethod(number, importMethod)
    }
  }

}

function mapStateToProps(state) {
  return {
    ...state.quorum,
    totalSigners: state.spend.transaction.totalSigners,
    inputs: state.spend.transaction.inputs,
    network: state.settings.network,
    signatureImporters: state.spend.signatureImporters
  };
}

const mapDispatchToProps = {
  setBIP32Path: setSignatureImporterBIP32Path,
  setMethod: setSignatureImporterMethod,
};


export default connect(mapStateToProps, mapDispatchToProps)(ExtendedPublicKeySelector);