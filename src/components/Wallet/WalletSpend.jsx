import React from 'react';
import PropTypes, { node } from 'prop-types';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js'

import { updateAutoSpendAction, updateDepositNodeAction, updateChangeNodeAction } from "../../actions/walletActions";
import { setInputs } from "../../actions/transactionActions";

// Components
import NodeSet from "./NodeSet";
import {
    Box, Card, CardHeader,
    CardContent, Grid, Switch,
  } from '@material-ui/core';

import OutputsForm from '../Spend/OutputsForm';
import { bitcoinsToSatoshis } from 'unchained-bitcoin/lib/utils';

let coinSelectTimer;

class WalletSpend extends React.Component {

  static propTypes = {
    addNode: PropTypes.func.isRequired,
    updateNode: PropTypes.func.isRequired,
  };

  state = {
    outputsAmount: new BigNumber(0),
    feeAmount: new BigNumber(0)
  }

  componentWillReceiveProps(nextProps) {
    console.log('new props', nextProps)
    if (nextProps.autoSpend) {
      if (coinSelectTimer) clearTimeout(coinSelectTimer)
      coinSelectTimer = setTimeout(this.selectCoins, 1000);
    }
  }

  componentWillUnmount() {
    if (coinSelectTimer) clearTimeout(coinSelectTimer)
  }

  render() {
    const { addNode, updateNode, autoSpend } = this.props;
    return (
      <Box>
        <Grid container>
          <Grid item md={12}>
            <OutputsForm/>
          </Grid>
          <Grid item md={12}>
            <Card>
              <CardHeader title="Spend"/>
              <CardContent>
                <Grid item md={12}>
                  <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>Manual</Grid>
                    <Grid item>
                      <Switch
                        checked={autoSpend}
                        onChange={this.handleSpendMode}
                    />
                    </Grid>
                    <Grid item>Auto</Grid>
                  </Grid>
                </Grid>
                <NodeSet addNode={addNode} updateNode={updateNode} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      )
    }

    handleSpendMode = (event) => {
      const { updateAutoSpend } = this.props;
      if (event.target.checked) {
        // select inputs for transaction
        // select change address???,
        // how to identify???
        // calculate change???

      }

      updateAutoSpend(event.target.checked)
    }

    selectCoins = () => {
      const { outputs, setInputs, fee, depositNodes, changeNodes, updateChangeNode, updateDepositNode } = this.props;
      const outputsAmount = outputs.reduce((sum, output) => sum.plus(output.amountSats), new BigNumber(0));
      if (outputsAmount.isNaN()) return;
      const feeAmount = bitcoinsToSatoshis(new BigNumber(fee));
      if (outputsAmount.isEqualTo(this.state.outputsAmount) && feeAmount.isEqualTo(this.state.feeAmount)) return;
      const outputTotal = outputsAmount.plus(feeAmount);
      const spendableInputs = Object.values(depositNodes).concat(Object.values(changeNodes));
      let selectedUtxos = [];
      let inputTotal = new BigNumber(0);
      for (let i=0; i < spendableInputs.length; i++) {
        const spendableInput = spendableInputs[i];
        spendableInput.utxos.forEach(utxo => {
          selectedUtxos.push({...utxo, multisig: spendableInput.multisig});
        })
        inputTotal = inputTotal.plus(spendableInput.balanceSats);
        (node.change ? updateChangeNode : updateDepositNode)({bip32Path: spendableInput.bip32Path, spend: true})
        if (inputTotal.isGreaterThanOrEqualTo(outputTotal)) {
          break;
        }
      }
      this.setState({ outputsAmount, feeAmount })
      setInputs(selectedUtxos);
    }
}

function mapStateToProps(state) {
  return {
    ...state.spend.transaction,
    changeNodes: state.wallet.change.nodes,
    depositNodes: state.wallet.deposits.nodes,
    autoSpend: state.wallet.info.autoSpend,
  };
}

const mapDispatchToProps = {
  updateAutoSpend: updateAutoSpendAction,
  setInputs,
  updateChangeNode: updateChangeNodeAction,
  updateDepositNode: updateDepositNodeAction
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletSpend);
