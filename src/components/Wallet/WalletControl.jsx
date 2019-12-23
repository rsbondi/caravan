import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  satoshisToBitcoins,
} from 'unchained-bitcoin';
import {
  setWalletModeAction,
  WALLET_MODES
} from "../../actions/walletActions";
import { setRequiredSigners } from "../../actions/transactionActions";
import {naiveCoinSelection} from "../../utils"
import {
  Tabs, Tab, Box,
} from '@material-ui/core';

import WalletDeposit from './WalletDeposit';
import WalletSpend from './WalletSpend';
import WalletView from './WalletView';

class WalletControl extends React.Component {
  scrollRef = React.createRef();

  static propTypes = {
    deposits: PropTypes.object.isRequired,
    change: PropTypes.object.isRequired,
    setMode: PropTypes.func.isRequired,
    setRequiredSigners: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    this.scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  render = () => {
    return (
      <div>
        <h3>Balance: {this.totalBalance()}</h3>
        <Tabs
          ref={this.scrollRef}
          value={this.props.walletMode}
          onChange={this.handleModeChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          >
            <Tab label="Addresses" value={WALLET_MODES.VIEW} />
            <Tab label="Receive" value={WALLET_MODES.DEPOSIT} />
            <Tab label="Send" value={WALLET_MODES.SPEND} />
        </Tabs>
        <Box mt={2}>
          {this.renderModeComponent()}
        </Box>
      </div>
    )
  }

  renderModeComponent = () => {
    const {walletMode, addNode, updateNode} = this.props;
    if (walletMode === WALLET_MODES.DEPOSIT) return <WalletDeposit/>
    else if (walletMode === WALLET_MODES.SPEND) return <WalletSpend addNode={addNode} updateNode={updateNode} coinSelection={naiveCoinSelection}/>
    else if (walletMode === WALLET_MODES.VIEW) return <WalletView  addNode={addNode} updateNode={updateNode}/>
    return "";
  }


  totalBalance() {
    const { deposits, change } = this.props;
    return satoshisToBitcoins(deposits.balanceSats.plus(change.balanceSats)).toFixed();
  }

  handleModeChange = (event, mode)  => {
    const { setMode,  requiredSigners, setRequiredSigners  } = this.props;
    if (mode === WALLET_MODES.SPEND) {
      setRequiredSigners(requiredSigners); // this will generate signature importers
    }
    setMode(mode);
  }
}

function mapStateToProps(state) {
  return {
    ...state.wallet,
    ...state.wallet.info,
    requiredSigners: state.spend.transaction.requiredSigners
  };
}

const mapDispatchToProps = {
  setMode: setWalletModeAction,
  setRequiredSigners,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletControl);
