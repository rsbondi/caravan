import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import AddressTypePicker from './AddressTypePicker';
import { TestUtil } from './testCommon'


import {
  P2SH,
  P2SH_P2WSH,
  P2WSH,
} from "unchained-bitcoin";
import {
  setAddressType,
} from '../actions/settingsActions';

const act = renderer.act;
const mockStore = configureStore([]);
const util = new TestUtil(createComponentForStore, getStore)

describe('Test AddressTypePicker component', () => {

  describe('Test rendering of component for a given state value', () => {

    it('should properly render for state of address type of P2SH', () => {
      const { component } = util.createTestComponent({addressType: P2SH, frozen:false});

      let input = util.findInputByProps(component, {value: P2SH});
      expect(input.checked).toEqual(true);

      input = util.findInputByProps(component, {value: P2SH_P2WSH});
      expect(input.checked).toEqual(false);

      input = util.findInputByProps(component, {value: P2SH_P2WSH});
      expect(input.checked).toEqual(false);
    });

    it('should properly render for state of address type of P2SH-P2WSH', () => {
      const { component } = util.createTestComponent({addressType: P2SH_P2WSH, frozen:false});

      let input = util.findInputByProps(component, {value: P2SH_P2WSH});
      expect(input.checked).toEqual(true);

      input = util.findInputByProps(component, {value: P2SH});
      expect(input.checked).toEqual(false);

      input = util.findInputByProps(component, {value: P2WSH});
      expect(input.checked).toEqual(false);
    });

    it('should properly render for state of address type of P2WSH', () => {
      const { component } = util.createTestComponent({addressType: P2WSH, frozen:false});

      let input = util.findInputByProps(component, {value: P2WSH});
      expect(input.checked).toEqual(true);

      input = util.findInputByProps(component, {value: P2SH});
      expect(input.checked).toEqual(false);

      input = util.findInputByProps(component, {value: P2SH_P2WSH});
      expect(input.checked).toEqual(false);
    });

    it('should properly render disabled for a state of frozen equal to true', () => {
      const { component } = util.createTestComponent({addressType: P2SH, frozen: true});

      let input = util.findInputByProps(component, {value: P2SH});
      expect(input.disabled).toEqual(true);

      input = util.findInputByProps(component, {value: P2SH_P2WSH});
      expect(input.disabled).toEqual(true);

      input = util.findInputByProps(component, {value: P2WSH});
      expect(input.disabled).toEqual(true);
    });

    it('should properly render enabled for a state of frozen equal to false', () => {
      const { component } = util.createTestComponent({addressType: P2SH, frozen: false});

      let input = util.findInputByProps(component, {value: P2SH});
      expect(input.disabled).toEqual(false);

      input = util.findInputByProps(component, {value: P2SH_P2WSH});
      expect(input.disabled).toEqual(false);

      input = util.findInputByProps(component, {value: P2WSH});
      expect(input.disabled).toEqual(false);
    });
  });

  describe('Test proper dispatch of component actions', () => {

    it('should properly dispatch message for selecting address type of P2SH', () => {
      const { component, store } = util.createTestComponent({addressType: P2SH, frozen: false});
      const input = util.findInputByProps(component, {value: P2SH});
      act(() => {
        input.onChange({ target: { value: input.value } });
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(setAddressType(P2SH));
      });

    });

    it('should properly dispatch message for selecting address type of P2SH-P2WSH', () => {
      const { component, store } = util.createTestComponent({addressType: P2SH_P2WSH, frozen:false});
      const input = util.findInputByProps(component, {value: P2SH_P2WSH});
      act(() => {
        input.onChange({ target: { value: input.value } });
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(setAddressType(P2SH_P2WSH));
      });

    });

    it('should properly dispatch message for selecting address type of P2WSH', () => {
      const { component, store } = util.createTestComponent({addressType: P2WSH, frozen:false});
      const input = util.findInputByProps(component, {value: P2WSH});
      act(() => {
        input.onChange({ target: { value: input.value } });
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(setAddressType(P2WSH));
      });

    });

  });
});


function createComponentForStore(store) {
  return renderer.create(
    <Provider store={store}>
      <AddressTypePicker />
    </Provider>
  );
}

function getStore(opts) {
  return mockStore({
    settings: {
      addressType: opts.addressType,
      frozen: opts.frozen,
    }
  });
}