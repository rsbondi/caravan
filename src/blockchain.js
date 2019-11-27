import {
  blockExplorerGetAddresesUTXOs,
  blockExplorerGetFeeEstimate,
  blockExplorerBroadcastTransaction,
  blockExplorerGetAddressStatus,
} from "./block_explorer";
import {
  bitcoindListUnspent,
  bitcoindEstimateSmartFee,
  bitcoindSendRawTransaction,
  bitcoindGetAddtressStatus,
} from "./bitcoind";

export const BLOCK_EXPLORER = 'public';
export const BITCOIND = 'private';

function bitcoindParams(client) {
  const {url, username, password} = client;
  const auth = { username, password };
  return {url, auth};
}

export function fetchAddressUTXOs(address, network, client) {
  if (client.type === BLOCK_EXPLORER) {
    return blockExplorerGetAddresesUTXOs(address, network);
  } else {
    return bitcoindListUnspent({
      ...bitcoindParams(client),
      ...{address}
    });
  }
}

export function getAddressStatus(address, network, client) {
  if (client.type === BLOCK_EXPLORER) {
    return blockExplorerGetAddressStatus(address, network);
  } else {
    return bitcoindGetAddtressStatus({
      ...bitcoindParams(client),
      ...{address}
    });
  }
}

export function fetchFeeEstimate(network, client) {
  if (client.type === BLOCK_EXPLORER) {
    return blockExplorerGetFeeEstimate(network);
  } else {
    return bitcoindEstimateSmartFee({
      ...bitcoindParams(client),
      ...{numBlocks: 1}
    });
  }
}

export function broadcastTransaction(transactionHex, network, client) {
  if (client.type === BLOCK_EXPLORER) {
    return blockExplorerBroadcastTransaction(transactionHex, network);
  } else {
    return bitcoindSendRawTransaction({
      ...bitcoindParams(client),
      ...{hex: transactionHex}
    });
  }
}
