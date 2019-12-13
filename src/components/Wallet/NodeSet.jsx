import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BigNumber from "bignumber.js";
import {
  fetchAddressUTXOs,
  getAddressStatus,
} from "../../blockchain";

// Components
import {
  Button,
  Grid,
  Table, TableHead, TableBody,
  TableRow, TableCell, TablePagination,
} from '@material-ui/core';
import Node from "./Node";
import BitcoindAddressImporter from '../BitcoindAddressImporter';

class NodeSet extends React.Component {

  static propTypes = {
    depositNodes: PropTypes.object.isRequired,
    changeNodes: PropTypes.object.isRequired,
    canLoad: PropTypes.bool,
    addNode: PropTypes.func.isRequired,
    updateNode: PropTypes.func.isRequired,
  };

  state = {
    page: 0,
    nodesPerPage: 10,
    change: false,
    spend: false,
  };

  addresses = [];

  render() {
    const {page, nodesPerPage, change} = this.state;
    const {spending, canLoad, client} = this.props
    const useAddressImporter = !spending && client.type === "private";

    if (useAddressImporter) {
      this.addresses = this.getUnknownAddressNodes()
        .map(node => node.multisig.address) ;
    }
    return (
      <Grid item md={12}>
        { useAddressImporter &&
          <BitcoindAddressImporter
            addresses={this.addresses}
            importCallback={this.addressesImported}
            />
        }
      <Table style={{tableLayout: "fixed"}}>
            <TableHead>
              <TableRow>
                {spending && <TableCell width={62}>Spend?</TableCell>}
                <TableCell width={106}>BIP32 Path</TableCell>
                <TableCell width={68}>UTXOs</TableCell>
                <TableCell width={82}>Balance</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.renderNodes()}
            </TableBody>
          </Table>
          <Grid container>
            <Grid item md={6}>
              <TablePagination
                component="div"
                count={this.rowCount()}
                rowsPerPage={nodesPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'next page',
                }}
                onChangePage={this.handlePageChange}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Grid>
            <Grid item md={2}>
              {canLoad && page === this.pageCount() - 1 && <Button type="button" variant="contained" color="secondary" onClick={this.generateAnotherPage}>More</Button>}
            </Grid>
            <Grid item md={4}>
              <Button type="button" variant="contained" color="primary" onClick={this.toggleChange}>{change ? "View Deposits" : "View Change"}</Button>
            </Grid>
          </Grid>

        </Grid>
    );
  }

  getUnknownAddressNodes = () => {
    const {changeNodes, depositNodes} = this.props
    return Object.values(depositNodes).concat(Object.values(changeNodes))
    .filter(node => !node.addressKnown);
  }


  addressesImported = async result => {
    // this will give me an array [{success: true/false}...]
    // need to loop through and mark nodes as addressKnown
    const { updateNode, client, network } = this.props;
    const nodes = []
    const unknown = this.getUnknownAddressNodes();
    result.forEach((addr, i) => {
      if (addr.success) nodes.push(unknown[i]); // can now set to known and refresh status
    });

    nodes.forEach(async node => {
      const utxos = await fetchAddressUTXOs(node.multisig.address, network, client);
      const addressStatus = await getAddressStatus(node.multisig.address, network, client);
      let updates;
      if (utxos) {
        const balanceSats = utxos
              .map((utxo) => utxo.amountSats)
              .reduce(
                (accumulator, currentValue) => accumulator.plus(currentValue),
                new BigNumber(0));
        updates = {balanceSats, utxos, fetchedUTXOs: true, fetchUTXOsError: ''}
      }


      updateNode(node.change, {
        bip32Path: node.bip32Path,
        addressKnown: true,
        ...updates,
        addressStatus,
      });
    });
  }

  getNodeSet = () => {
    const {spending, changeNodes, depositNodes} = this.props;
    const {change} = this.state;

    const nodes = change ? changeNodes : depositNodes
    const nodeSet = spending ? Object.values(nodes)
      .filter(node => node.balanceSats.isGreaterThan(0))
      .reduce((nodesObject, currentNode) => {
        nodesObject[currentNode.bip32Path] = currentNode;
        return nodesObject;
      },{})
      : nodes;
    return nodeSet
  }

  renderNodes = () => {
    const {page, nodesPerPage, change, spend} = this.state;
    const {addNode, updateNode} = this.props;
    const startingIndex = (page) * nodesPerPage;
    const nodesRows = [];
    const nodeSet = this.getNodeSet();
    for (let index=0; index < nodesPerPage; index++) {
      const whichOne = startingIndex + index;
      if(whichOne > Object.keys(nodeSet).length -1) break;
      const bip32Path = Object.values(nodeSet)[whichOne].bip32Path;
      const nodeRow = <Node
        key={bip32Path}
        bip32Path={bip32Path}
        addNode={addNode}
        updateNode={updateNode}
        change={change}
        spend={spend}
        />;
      nodesRows.push(nodeRow);
    }
    return nodesRows;
  }

  handlePageChange = (e, selected) => {
    const page = selected // + 1;
    this.setState({page});
  }

  handleChangeRowsPerPage = (e) => {
    this.setState({nodesPerPage: e.target.value, page: 0});
  }

  bip32Path = (index) => {
    const {change} = this.state;
    const changePath = (change ? "1" : "0");
    return `m/${changePath}/${index}`;
  }

  pageCount = () => {
    const {nodesPerPage} = this.state;
    return Math.ceil(this.rowCount() / nodesPerPage);
  }

  rowCount = () => {
    const nodeSet = this.getNodeSet();
    return Object.keys(nodeSet).length;
  }

  generateAnotherPage = async () => {
    const {addNode, depositNodes, changeNodes} = this.props;
    const {change, nodesPerPage, page} = this.state;
    const startingIndex = Object.keys(change ? changeNodes : depositNodes).length;
    for (let index=0; index < nodesPerPage + (nodesPerPage - (startingIndex % nodesPerPage)); index++) {
      const bip32path = this.bip32Path(startingIndex + index);
      await addNode(change, bip32path);
    }
    if (startingIndex % nodesPerPage === 0) // otherwise we will be filling this page first
      this.setState({page: page + 1});
  }

  toggleChange = () => {
    const {change} = this.state;
    this.setState({change: (!change), page: 0});
  }

}

function mapStateToProps(state) {
  return {
    changeNodes: state.wallet.change.nodes,
    depositNodes: state.wallet.deposits.nodes,
    spending: state.wallet.info.spending,
    client: state.client,
    ...state.settings,

  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeSet);
