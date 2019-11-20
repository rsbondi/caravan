import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import NetworkPicker from '../NetworkPicker';
import ClientPicker from '../ClientPicker';
import AddressTypePicker from '../AddressTypePicker';
import ScriptEntry from './ScriptEntry';
import UTXOSet from './UTXOSet';
import OutputsForm from './OutputsForm';
import SignatureImporter from './SignatureImporter';
import Transaction from './Transaction';
import {Grid, Box} from "@material-ui/core";
import ConfirmOwnership from './ConfirmOwnership';
import '../styles.css';

class Spend extends React.Component {

  static propTypes = {
    transaction: PropTypes.object.isRequired,
    ownership: PropTypes.object.isRequired,
    signatureImporters: PropTypes.object.isRequired,
  };

  render = () => {
    return (
      <Box mt={2}>
        <Grid container spacing={3}>
          <Grid item md={8}>
            <Box><ScriptEntry /></Box>
            {this.renderBody()}
          </Grid>
          <Grid item md={4}>
            <Box><AddressTypePicker /></Box>
            <Box mt={2}><NetworkPicker /></Box>
            <Box mt={2}><ClientPicker /></Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  renderBody = () => {
    const {transaction, ownership} = this.props;
    if (ownership.chosen) {
      return <Box mt={2}><ConfirmOwnership /></Box>;
    } else return (
      <Box>
      {
        this.spendable() &&
        <Box>
          <Box mt={2}>
            <UTXOSet
              inputs={transaction.inputs}
              inputsTotalSats={transaction.inputsTotalSats}
            />
          </Box>
          <Box mt={2}><OutputsForm/></Box>
        </Box>
      }

      {
        transaction.finalizedOutputs &&
        <Box>
          {this.renderSignatureImporters()}
        </Box>

      }

      {
        this.signaturesFinalized() &&
        <Box mt={2}>
          <Transaction/>
        </Box>
      }
      </Box>

    )
  }

  renderSignatureImporters = () => {
    const {transaction} = this.props;
    const signatureImporters = [];
    for (var signatureImporterNum = 1; signatureImporterNum <= transaction.requiredSigners; signatureImporterNum++) {
      signatureImporters.push(
        <Box key={signatureImporterNum} mt={2}>
          <SignatureImporter number={signatureImporterNum} />
        </Box>
      );
    }
    return signatureImporters;
  }

  spendable = () => {
    const {transaction} = this.props;
    return transaction.inputs.length > 0;
  }

  signaturesFinalized = () => {
    const {signatureImporters} = this.props;
    return Object.values(signatureImporters).length > 0 && Object.values(signatureImporters).every((signatureImporter) => signatureImporter.finalized);
  }

  confirmOwnership = (value) => {
    this.setState({addressFinalized: true, confirmOwnership: value});
  }

}

function mapStateToProps(state) {
  return state.spend;
}

export default connect(mapStateToProps)(Spend);
