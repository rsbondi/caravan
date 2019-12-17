import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import NetworkPicker from './NetworkPicker';
import { TestUtil } from './testCommon'


import {
  TESTNET,
  MAINNET,
} from "unchained-bitcoin";
import {
  setNetwork,
} from '../actions/settingsActions';

const act = renderer.act;
const mockStore = configureStore([]);
const util = new TestUtil(createComponentForStore, getStore)

describe('Test NetworkPicker component', () => {

  describe('Test rendering of component for a given state value', () => {

    it('should properly render for state of network type of mainnet', () => {
      const { component } = util.createTestComponent({network: MAINNET, frozen:false});
      const input = util.findInputByProps(component, {value: MAINNET});
      expect(input.checked).toEqual(true);
    });

    it('should properly render for state of network type of testnet', () => {
      const { component } = util.createTestComponent({network: TESTNET, frozen:false});
      const input = util.findInputByProps(component, {value: TESTNET});
      expect(input.checked).toEqual(true);
    });


    it('should properly render enabled for a state of frozen equal to false', () => {
      const { component } = util.createTestComponent({network: MAINNET, frozen:false});
      let input = util.findInputByProps(component, {value: MAINNET});
      expect(input.disabled).toEqual(false);

      input = util.findInputByProps(component, {value: TESTNET});
      expect(input.disabled).toEqual(false);
    });

    it('should properly render disabled for a state of frozen equal to true', () => {
      const { component } = util.createTestComponent({network: MAINNET, frozen:true});
      let input = util.findInputByProps(component, {value: MAINNET});
      expect(input.disabled).toEqual(true);

      input = util.findInputByProps(component, {value: TESTNET});
      expect(input.disabled).toEqual(true);
    });

  });

  describe('Test proper dispatch of component actions', () => {

    it('should properly dispatch message for selecting network type of mainnet', () => {
      const { component, store } = util.createTestComponent({network: MAINNET, frozen: false});
      const input = util.findInputByProps(component, {value: MAINNET});
      act(() => {
        input.onChange({ target: { value: input.value } })
      });

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      act(() => {
        expect(store.dispatch).toHaveBeenCalledWith(setNetwork(MAINNET))
      });
    });

    it('should properly dispatch message for selecting network type of testnet', () => {
      const { component, store } = util.createTestComponent({network: TESTNET, frozen: false});
      const input = util.findInputByProps(component, {value: TESTNET});
      act(() => {
        input.onChange({ target: { value: input.value } })
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

function getStore(opts) {
  return mockStore({
    settings: {
      network: opts.network,
      frozen: opts.frozen,
    }
  });
}