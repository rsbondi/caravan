import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import NetworkPicker from './NetworkPicker';
const act = renderer.act;

import {
  TESTNET,
  MAINNET,
} from "unchained-bitcoin";
import {
  setNetwork,
} from '../actions/settingsActions';

const mockStore = configureStore([]);
describe('Test NetworkPicker component', () => {
  let store;
  let component;

  describe('Test rendering of component for a given state value', () => {

    it('should properly render for state of network type of mainnet', () => {
      store = getStore(MAINNET, false);
      component = createComponentForStore(store);
      const input = findInputForType(component, MAINNET);
      expect(input.checked).toEqual(true);
    });

    it('should properly render for state of network type of testnet', () => {
      store = getStore(TESTNET, false);
      component = createComponentForStore(store);
      const input = findInputForType(component, TESTNET);
      expect(input.checked).toEqual(true);
    });


    it('should properly render enabled for a state of frozen equal to false', () => {
      store = getStore(MAINNET, false);
      component = createComponentForStore(store);

      let input = findInputForType(component, MAINNET);
      expect(input.disabled).toEqual(false);

      input = findInputForType(component, TESTNET);
      expect(input.disabled).toEqual(false);
    });

    it('should properly render disabled for a state of frozen equal to true', () => {
      store = getStore(MAINNET, true);
      component = createComponentForStore(store);

      let input = findInputForType(component, MAINNET);
      expect(input.disabled).toEqual(true);

      input = findInputForType(component, TESTNET);
      expect(input.disabled).toEqual(true);
    });

  });

  describe('Test proper dispatch of component actions', () => {

    it('should properly dispatch message for selecting network type of mainnet', () => {
      store = getStore(MAINNET, false);
      store.dispatch = jest.fn();
      component = createComponentForStore(store);
      const input = findInputForType(component, MAINNET);
      act(() => {
        input.onChange({ target: { value: MAINNET } })
      });

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      act(() => {
        expect(store.dispatch).toHaveBeenCalledWith(setNetwork(MAINNET))
      });
    });

    it('should properly dispatch message for selecting network type of testnet', () => {
      store = getStore(TESTNET, false);
      store.dispatch = jest.fn();
      component = createComponentForStore(store);
      const input = findInputForType(component, TESTNET);
      act(() => {
        input.onChange({ target: { value: TESTNET } })
      });

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      act(() => {
        expect(store.dispatch).toHaveBeenCalledWith(setNetwork(TESTNET))
      });
    });

  });
});


function createComponentForStore(store) {
  return renderer.create(
    <Provider store={store}>
      <NetworkPicker />
    </Provider>
  );
}

function findInputForType(component, network) {
  return component.root.findAllByType('input')
    .map(inp => inp.props)
    .filter(inp => inp.value === network)[0];
}

function getStore(network, frozen) {
  return mockStore({
    settings: {
      network: network,
      frozen: frozen,
    }
  });
}