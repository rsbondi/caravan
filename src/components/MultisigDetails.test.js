import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MultisigDetails from './MultisigDetails';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { TestUtil, testMultisigs } from './testCommon'
import { MAINNET, TESTNET } from 'unchained-bitcoin/lib/networks';
import { P2SH, P2SH_P2WSH, P2WSH } from 'unchained-bitcoin/lib/multisig';

const util = new TestUtil(createComponentForStore, getStore)
const mockStore = configureStore([]);

let container = null;

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

function runTest(network, addressType) {
  const networkName = network.slice(0,1).toUpperCase() + network.slice(1).toLowerCase();
  testMultisigs.forEach(testObject => {
    const multisig = testObject[network][addressType]
    util.createTestComponent(
      { network: network, addressType: addressType },
      { multisig: multisig }
    )
    const labels = container.querySelectorAll('.MuiChip-label');
    const elements = [...labels]
    expect(elements.some(label => label.textContent === networkName)).toBe(true);
    expect(elements.some(label => label.textContent === addressType)).toBe(true);
    expect(elements.some(label => label.textContent === testObject.quorum)).toBe(true);
    const codes = container.querySelectorAll('code');
    expect([...codes].some(code => code.textContent === multisig.address)).toBe(true);
  });

}

describe('Test MultisigDetails component', () => {
  describe('Test mainnet', () => {
    it('should properly render for state of P2SH', () => {
      runTest(MAINNET, P2SH);
    });
    it('should properly render for state of P2SH', () => {
      runTest(MAINNET, P2SH_P2WSH);
    });
    it('should properly render for state of P2WSH', () => {
      runTest(MAINNET, P2WSH);
    });
  });

  describe('Test testnet', () => {
    it('should properly render for state of P2SH', () => {
      runTest(TESTNET, P2SH);
    });
    it('should properly render for state of P2SH', () => {
      runTest(TESTNET, P2SH_P2WSH);
    });
    it('should properly render for state of P2WSH', () => {
      runTest(TESTNET, P2WSH);
    });
  });
});

function createComponentForStore(store, props) {
  if (container) {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  }
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    render((
      <Provider store={store}>
        <MultisigDetails multisig={props.multisig} />
      </Provider>
    ), container);
  });

}

function getStore(opts) {
  opts = opts || {}
  return mockStore({
    settings: {
      ...opts,
    }
  });
}