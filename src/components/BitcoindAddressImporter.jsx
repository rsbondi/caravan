import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { bitcoindImportMulti, bitcoindGetAddressStatus } from '../bitcoind';
import { bitcoindParams } from '../bitcoind'
import { FormHelperText, Button, Box, Switch, FormControlLabel } from '@material-ui/core'

let interval;
class BitcoindAddressImporter extends React.Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    client: PropTypes.object.isRequired,
    autoImport: PropTypes.bool
  };

  state = {
    imported: false,
    importError: "",
    rescan: false,
    addressesError: "",
    addressPresent: false,
  };

  componentDidMount = () => {
    interval = setInterval(this.checkAddress, 5000);
  }

  componentWillUnmount = () => {
    clearInterval(interval);
  }

  render() {
    const { imported, importError, rescan, addressPresent, addressesError } = this.state;

     return (
      <Box>
        {
          imported && rescan && <FormHelperText>{this.pluralOrSingularAddress()} imported, rescan of your node may take some time.</FormHelperText>
        }
        {
          imported && !rescan && <FormHelperText>{this.pluralOrSingularAddress()} imported.</FormHelperText>
        }
      { addressPresent &&
        <div>
          <FormHelperText>Address {imported ? 'imported to' : 'found in'} your wallet!</FormHelperText>
          <FormHelperText>You can properly determine your addresses current balance.</FormHelperText>
          <FormHelperText>
            Your node may need to do a rescan to determine if an address has been previously used. If you
            are sure you have done so, or you are sure of the address's history, you may proceed.  If you
            are unsure, you may select "rescan" and import.
          </FormHelperText>
        </div>
      }

      {
        !addressPresent && // addressesError &&
        <FormHelperText>Checking node for presence of {this.pluralOrSingularAddress()}</FormHelperText>
      }
      <FormHelperText error>{addressesError}</FormHelperText>
        {/* <FormHelperText>Addresses used with bitcoind node must be imported to your node.  If you have not already, you can import now.</FormHelperText> */}
        <p>
          {/* Import {this.pluralOrSingularAddress()} to your node? */}
          <Box component="span" ml={2}>
            <Button variant="contained" disabled = {addressPresent && !rescan } onClick={this.import}>Import</Button>
          </Box>
          <Box component="span" ml={2}>
            <FormControlLabel
              control={
                <Switch
                checked={rescan}
                onChange={this.handleRescan}
                color="secondary"
                />
              }
              label="Rescan"
            />

          </Box>
          <Box component="span" ml={2}>
            <FormControlLabel
              control={
                <Switch
                checked={rescan}
                onChange={this.handleRescan}
                color="secondary"
                />
              }
              label="Rescan"
            />

          </Box>
        </p>
        <FormHelperText error>{importError}</FormHelperText>

      </Box>
    )
  }

  pluralOrSingularAddress() {
    const { addresses } = this.props;
    return `address${addresses.length > 1 ? 'es' : ''}`
  }

  handleRescan = (e) => {
    this.setState({rescan: e.target.checked})
  }

  checkAddress = async () => {
    const { client, addresses, autoImport } = this.props;
    const address = addresses[0] // TODO: loop, or maybe just check one

    try {
      const status = await bitcoindGetAddressStatus({ // TODO: use this to warn if spent
        ...bitcoindParams(client),
        address
      });
      if (typeof status.used !== 'undefined') {
        this.setState({addressPresent: true, addressesError: ""});
        clearInterval(interval);
      }
    } catch (e) {
      // e.status 401 e.statusText
      // e.status 500 e.data.error.message
      const status = (e.response && e.response.status) || 'unknown'
      if (autoImport
        && e.response &&
        e.response.data &&
        e.response.data.error &&
        e.response.data.error.code === -4 && !this.state.rescan) {
        this.import();
      }
      this.setState({
        addressesError: status === 401 ?
        e.response.statusText : status === 500 ?
        e.response.data.error.message :
        e.message || "An unknown address error occured"})
      console.log(status, e.response)
    }

  }

  import = () => {
    const { addresses, client } = this.props;
    const { rescan } = this.state;
    const label = ""; // TODO: do we want to allow to set? or set to "caravan"?
    bitcoindImportMulti({
      ...bitcoindParams(client),
      ...{addresses, label, rescan}
    })
    .then(response => {
      const responseError = response.result.reduce((e, c) => {
        return (c.error && c.error.message) || e
      }, "")
      this.setState({
        importError: responseError,
        imported: responseError === ""
      })
    })
    .catch(e => {
      this.setState({
        importError: "Unable to import, check your settings and try again",
        imported: false
      });
    });
  }
}

function mapStateToProps(state) {
  return {
    client: state.client,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BitcoindAddressImporter);