import React from 'react';
import { connect } from 'react-redux';

// Components
import {
  Grid,
  Menu, MenuItem, Button,
  ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
  Box,
  Table, TableBody, TableRow, TableCell,
  Typography,
} from '@material-ui/core';
import UTXOSet from "../Spend/UTXOSet";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MultisigDetails from "../MultisigDetails";
import BitcoindAddressImporter from "../BitcoindAddressImporter";
import Copyable from "../Copyable";
import InteractionMessages from "../InteractionMessages";
import ExtendedPublicKeySelector from './ExtendedPublicKeySelector'
import {
  ThumbUp as SuccessIcon,
  Error as ErrorIcon,
} from '@material-ui/icons';

import styles from '../Spend//styles.module.scss';
import {
  blockExplorerAddressURL,
  multisigAddressType
} from 'unchained-bitcoin';

import {
  PENDING,
  ACTIVE,
  ConfirmMultisigAddress,
} from "unchained-wallets";

import {
  externalLink,
} from "../../utils";
import LaunchIcon from '@material-ui/icons/Launch';

const MODE_UTXO = 0;
const MODE_REDEEM = 1;
const MODE_CONFIRM = 2;
const MODE_WATCH = 3;
let anchor;

class AddressExpander extends React.Component {

  state = {
    expandMode: null,
    showMenu: false,
    showMenuIcon: false,
    hasInteraction: false,
    interactionState: PENDING,
    interactionError: "",
    interactionMessage: ""
  }

  componentDidMount = () => {
    this.defaultMode();
  }

  addressContent = () => {
      const {multisig, addressUsed, balanceSats} = this.props.node;
      const {network, client} = this.props;
      const {expandMode, showMenuIcon} = this.state;
      return (
        <div style={{width: '100%'}}>
            <code className={addressUsed && balanceSats.isEqualTo(0) ? styles.spent : ""}>{multisig.address}</code>
          &nbsp;
          <Copyable text={multisig.address}>
            <FileCopyIcon></FileCopyIcon>
          </Copyable>
          {externalLink(blockExplorerAddressURL(multisig.address, network), <LaunchIcon onClick={e => e.stopPropagation()} />)}
          <MoreVertIcon  onClick={this.handleMenu} style={{float:'right', display: showMenuIcon && this.hasAdditionalOptions() ? 'block' : 'none'}}  aria-controls="address-menu" aria-haspopup="true"></MoreVertIcon>
          <Menu
            id="address-menu"
            anchorEl={anchor}
            keepMounted
            open={this.state.showMenu}
            onClose={this.handleClose}
          >
            {balanceSats.isGreaterThan(0) && <MenuItem selected={expandMode === MODE_UTXO} onClick={e => {this.setState({expandMode: MODE_UTXO});this.handleClose(e)}}>UTXOs</MenuItem>}
            <MenuItem selected={expandMode === MODE_REDEEM} onClick={e => {this.setState({expandMode: MODE_REDEEM});this.handleClose(e)}}>Scripts</MenuItem>
            {this.canConfirm() && <MenuItem selected={expandMode === MODE_CONFIRM} onClick={e => {this.setState({expandMode: MODE_CONFIRM});this.handleClose(e)}}>Confirm on Device</MenuItem>}
            {client.type === 'private' && <MenuItem selected={expandMode === MODE_WATCH} onClick={e => {this.setState({expandMode: MODE_WATCH});this.handleClose(e)}}>Watch with bitcoind Node</MenuItem>}
          </Menu>
        </div>
      )
    }

    canConfirm = () => {
      const {extendedPublicKeyImporters} = this.props;
      return Object.values(extendedPublicKeyImporters).filter(importer => importer.method === 'trezor').length > 0;
    }

    hasAdditionalOptions = () => {
      const {balanceSats} = this.props.node;
      const {client} = this.props;
      return balanceSats.isGreaterThan(0) || client.type === 'private' || this.canConfirm()
    } 

    handleClose = (event) => {
      event.stopPropagation();
      this.setState({showMenu: false})
    }

    handleMenu = (event) => {
      event.stopPropagation();
      anchor = event.target;
      this.setState({showMenu: true})
    }

    panelExpand = (event, expanded) => {
      this.setState({showMenuIcon: expanded})
    }

    render = () => {
      const {bip32Path} = this.props.node;
        return (
          <ExpansionPanel onChange={this.panelExpand}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id={'address-header'+bip32Path}
            >
              {this.addressContent()}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container>
                {this.expandContent()}
              </Grid>
            </ExpansionPanelDetails>

          </ExpansionPanel>  
        )
    }

    defaultMode = () => {
      const {balanceSats} = this.props.node;
      this.setState({expandMode: balanceSats.isGreaterThan(0) ? MODE_UTXO : MODE_REDEEM});
    }

    expandContent = () => {
      const {utxos,  balanceSats, multisig} = this.props.node;
      const {client} = this.props;
      const {expandMode} = this.state;

      if (client.type === 'public' && expandMode === MODE_WATCH)
        this.defaultMode();
      if (balanceSats.isEqualTo(0) && expandMode === MODE_UTXO)
        this.defaultMode();
      
      switch (this.state.expandMode) {
        case MODE_UTXO:
          return (
            <Grid item md={12}>
              <UTXOSet
                inputs={utxos}
                inputsTotalSats={balanceSats}
              />
            </Grid>
          )
        case MODE_REDEEM:
          return (
            <Grid item md={12}>
              <MultisigDetails multisig={multisig} showAddress={false} />
            </Grid>            
          )
        case MODE_CONFIRM:
          return this.renderAddressConfirmation();
        case MODE_WATCH:
          return (
            <Grid item md={12}>
              <BitcoindAddressImporter addresses={[multisig.address]}/>
            </Grid>    
          )        
        default:
          return ""
      }
    }

    renderAddressConfirmation = () => {
      const {interactionState, interactionMessage, interactionError, hasInteraction} = this.state;
      return (
        <Grid item md={12}>
          <ExtendedPublicKeySelector number={0} onChange={this.keySelected} />
          {hasInteraction && (
            <>
              {this.confirmAddressDescription()}
              {
                interactionMessage !== "" && 
                <Box mt={2} align="center">
                  <Typography variant="h5" style={{color: "green"}}>
                    <SuccessIcon />&nbsp; {interactionMessage}
                  </Typography>
                </Box>                  
              }
              {
                interactionError !== "" && 
                <Box mt={2} align="center" style={{color: "red"}}>
                  <Typography variant="h5">
                    <ErrorIcon />&nbsp; Confirmation Error
                  </Typography>
                  <Typography variant="caption">{interactionError}</Typography>
                </Box>                  
              }
              {
                interactionMessage === "" && interactionError === "" &&
                <InteractionMessages
                messages={this.interaction.messagesFor({state: interactionState})} />
              }
              <Button variant="contained" size="large" onClick={this.confirmOnDevice} disabled={interactionState === ACTIVE}>Confirm</Button>
              {
              (interactionMessage !== "" || interactionError !== "") &&
              <Button size="large" onClick={this.resetInteractionState}>Reset</Button>
              }
            </>
          )}
        </Grid>            
      )

    }

    resetInteractionState = () => {
      this.setState({interactionError:"", interactionMessage:"", interactionState: PENDING})
    }

    confirmOnDevice = async () => {
      this.setState({interactionState: ACTIVE});
      const {multisig} = this.props.node;
      try {
        const confirmed = await this.interaction.run()
        if (confirmed.address === multisig.address && confirmed.serializedPath === this.interaction.bip32Path) {
          this.setState({interactionState: ACTIVE, interactionMessage: "Success", interactionError:""});
        } else {
          this.setState({interactionState: ACTIVE, interactionError: "An unknow error occured", interactionMessage: ""});
        }
      } catch (error) {
        this.setState({interactionState: ACTIVE, interactionError: error.message, interactionMessage: ""});
      }
    }

    interaction = null

    keySelected = (event, extendedPublicKeyImporter) => {
      const {multisig, bip32Path} = this.props.node;
      const network = this.props.network;

      
      this.interaction = ConfirmMultisigAddress({
        keystore: extendedPublicKeyImporter.method,
        network,
        bip32Path: `${extendedPublicKeyImporter.bip32Path}${bip32Path.slice(1)}`,
        multisig,
      });
      this.setState({hasInteraction: true});
      this.resetInteractionState();
    }

    // TODO: DRY out with test
    confirmAddressDescription() {
      const {network, requiredSigners, totalSigners} = this.props;
      const {multisig} = this.props.node;
      const addressType = multisigAddressType(multisig);

      return (
        <Box>
          <p>Confirm the following {network} {addressType} {requiredSigners}-of-{totalSigners} multisig address on your device:</p>
  
          <Table>
            <TableBody>
  
              <TableRow>
                <TableCell>
                  Address:
                </TableCell>
                <TableCell>
                  <code>{multisig.address}</code>
                </TableCell>
              </TableRow>
  
  
              <TableRow>
                <TableCell>
                  BIP32 Path:
                </TableCell>
                <TableCell>
                  <code>{this.interaction.bip32Path}</code>
                </TableCell>
              </TableRow>
  
            </TableBody>
          </Table>
  
        </Box>
      );
    }
}


function mapStateToProps(state, ownProps) {
  return {
    network: state.settings.network,
    requiredSigners: state.settings.requiredSigners,
    totalSigners: state.settings.totalSigners,
    client: state.client,
    extendedPublicKeyImporters: state.quorum.extendedPublicKeyImporters
  }
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddressExpander);