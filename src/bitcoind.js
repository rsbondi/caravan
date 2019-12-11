import axios from 'axios';
import BigNumber from 'bignumber.js';
import {bitcoinsToSatoshis} from "unchained-bitcoin";

async function callBitcoind(url, auth, method, params = []) {
  return new Promise(async (resolve, reject) => {
    axios(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      auth,
      data: {
        jsonrpc: '2.0',
        id: 0,
        method: `${method}`,
        params,
      },
    }).then(resp => resolve(resp.data)).catch(reject);
  });
}

/**
 * check if error from bitcoind is address not found in wallet
 * this allows client side interpretation of the error
 * @param {Error} e - the error object to check
 * @returns {boolean} true if the desired error
 */
export function isWalletAddressNotFoundError(e) {
  return e.response &&
  e.response.data &&
  e.response.data.error &&
  e.response.data.error.code === -4;
}

export function bitcoindParams(client) {
  const {url, username, password} = client;
  const auth = { username, password };
  return {url, auth};
}

/**
 * Fetch information for signing transactions from bitcoind RPC
 * @param {Object} options - what is needed to communicate with the RPC
 * @param {string} options.url - where to connect
 * @param {AxiosBasicCredentials} options.auth - username and password
 * @param {string} options.address - The address from which to obtain the information
 * @returns {UTXO} object for signing transaction inputs
 */
export async function bitcoindListUnspent({url, auth, address, addresses}) {
  return new Promise(async (resolve) => {
    try {
      const addressParam = addresses || [address]
      const resp = await callBitcoind(url, auth, 'listunspent', [0, 9999999, addressParam], );
      const promises = [];
      resp.result.forEach(utxo => {
        promises.push(callBitcoind(url, auth, 'getrawtransaction', [utxo.txid]))
      })
      const previousTransactions = await Promise.all(promises)
      resolve(resp.result.map((utxo, mapindex) => {
        const amount = new BigNumber(utxo.amount);
        return {
          confirmed: (utxo.confirmations || 0) > 0,
          txid: utxo.txid,
          index: utxo.vout,
          amount: amount.toFixed(8),
          amountSats: bitcoinsToSatoshis(amount),
          transactionHex: previousTransactions[mapindex].result
        };
      }));

    } catch(e) {throw(e)}
  });
}

export async function bitcoindGetAddressStatus({url, auth, address}) {
  try {
    const resp = await callBitcoind(url, auth, 'getreceivedbyaddress', [address] );
    if (typeof resp.result === 'undefined') {
      throw(new Error("Error: invalid response from "+url))
    }
    return {
      used: resp.result > 0
    }
  } catch(e) {
    throw(e);
  }
}

export async function bitcoindEstimateSmartFee({url, auth, numBlocks = 2}) {
  const resp = await callBitcoind(url, auth, 'estimatesmartfee', [numBlocks]);
  const feeRate = resp.result.feerate;
  return Math.ceil(feeRate * 100000);
}

export async function bitcoindSendRawTransaction({url, auth, hex}) {
  try {
    const resp = await callBitcoind(url, auth, 'sendrawtransaction', [hex]);
    return resp.result;
    } catch(e) {
      console.log('send tx error', e)
      throw((e.response && e.response.data.error.message) || e);
  }

}

export function bitcoindImportMulti({url, auth, addresses, label, rescan}) {
  const imports = addresses.map(address => {
    return {
      scriptPubKey: {
        address: address
      },
      label: label,
      timestamp: 0 // TODO: better option to ensure address history is picked up?
    }
  });
  if (rescan) {
    callBitcoind(url, auth, 'importmulti', [imports, {rescan: rescan}]); // TODO: what to do on catch?
    return new Promise(resolve => resolve({result:[]}));
  } else {
    return callBitcoind(url, auth, 'importmulti', [imports, {rescan: rescan}]);
  }
}