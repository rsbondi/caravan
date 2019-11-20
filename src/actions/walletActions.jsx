export const UPDATE_DEPOSIT_NODE = "UPDATE_DEPOSIT_NODE";
export const UPDATE_CHANGE_NODE = "UPDATE_CHANGE_NODE";
export const UPDATE_AUTO_SPEND = "UPDATE_AUTO_SPEND";
export const UPDATE_VIEW_ADDRESSES = "UPDATE_VIEW_ADDRESSES";
export const UPDATE_DEPOSITING = "UPDATE_DEPOSITING";
export const UPDATE_SPENDING = "UPDATE_SPENDING";

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

export function updateAutoSpendAction(value) {
  return {
    type: UPDATE_AUTO_SPEND,
    value: value
  };
}

export function updateViewAdderssesAction(value) {
  return {
    type: UPDATE_VIEW_ADDRESSES,
    value: value
  };
}

export function updateDepositingAction(value) {
  return {
    type: UPDATE_DEPOSITING,
    value: value
  };
}

export function updateSpendingAction(value) {
  return {
    type: UPDATE_SPENDING,
    value: value
  };
}
