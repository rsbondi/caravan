export const UPDATE_DEPOSIT_NODE = "UPDATE_DEPOSIT_NODE";
export const UPDATE_CHANGE_NODE = "UPDATE_CHANGE_NODE";
export const RESET_NODES_SPEND = "RESET_NODES_SPEND";
export const UPDATE_AUTO_SPEND = "UPDATE_AUTO_SPEND";
export const UPDATE_WALLET_NAME = "UPDATE_WALLET_NAME";
export const UPDATE_WALLET_MODE = "UPDATE_WALLET_MODE";
export const RESET_WALLET_VIEW = "RESET_WALLET_VIEW";
export const SPEND_NODES = "SPEND_NODES";

export const WALLET_MODES = {
  VIEW: 0,
  DEPOSIT: 1,
  SPEND: 2,
}


export function updateDepositNodeAction(value) {
  return {
    type: UPDATE_DEPOSIT_NODE,
    value: {
      ...value,
      ...{change: false}
    },
  };
}

export function updateChangeNodeAction(value) {
  return {
    type: UPDATE_CHANGE_NODE,
    value: {
      ...value,
      ...{change: true}
    },
  };
}

export function resetNodesSpend() {
  return {
    type: RESET_NODES_SPEND
  }
}

export function spendNodes() {
  return {
    type: SPEND_NODES
  }
}

export function updateAutoSpendAction(value) {
  return {
    type: UPDATE_AUTO_SPEND,
    value: value
  };
}

export function setWalletModeAction(value) {
  return  {
    type: UPDATE_WALLET_MODE,
    value: value
  }
}

export function updateWalletNameAction(number, value) {
  return {
    type: UPDATE_WALLET_NAME,
    value: value
  };
}

export function resetWalletView() {
  return {
    type: RESET_WALLET_VIEW
  }
}

