import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import AddressTypePicker from './AddressTypePicker';
const act = renderer.act;

import {
  P2SH,
  P2SH_P2WSH,
  P2WSH,
} from "unchained-bitcoin";
import {
  setAddressType,
} from '../actions/settingsActions';

const mockStore = configureStore([]);
describe('Test AddressTypePicker component', () => {
  let store;
  let component;

  describe('Test rendering of component for a given state value', () => {

    it('should properly render for state of address type of P2SH', () => {
      store = getStore(P2SH, false);
      component = createComponentForStore(store);
      const input = findInputForType(component, P2SH);
      expect(input.checked).toEqual(true);
    });

    it('should properly render for state of address type of P2SH-P2WSH', () => {
      store = getStore(P2SH_P2WSH, false);
      component = createComponentForStore(store);
      const input = findInputForType(component, P2SH_P2WSH);
      expect(input.checked).toEqual(true);
    });

    it('should properly render for state of address type of P2WSH', () => {
      store = getStore(P2WSH, false);
      component = createComponentForStore(store);
      const input = findInputForType(component, P2WSH);
      expect(input.checked).toEqual(true);
    });

    it('should properly render disabled for a state of frozen equal to true', () => {
      store = getStore(P2SH, true);
      component = createComponentForStore(store);

      let input = findInputForType(component, P2SH);
      expect(input.disabled).toEqual(true);

      input = findInputForType(component, P2SH_P2WSH);
      expect(input.disabled).toEqual(true);

      input = findInputForType(component, P2WSH);
      expect(input.disabled).toEqual(true);
    });

    it('should properly render enabled for a state of frozen equal to false', () => {
      store = getStore(P2SH, false);
      component = createComponentForStore(store);

      let input = findInputForType(component, P2SH);
      expect(input.disabled).toEqual(false);

      input = findInputForType(component, P2SH_P2WSH);
      expect(input.disabled).toEqual(false);

      input = findInputForType(component, P2WSH);
      expect(input.disabled).toEqual(false);
    });
  });

  describe('Test proper dispatch of component actions', () => {

    it('should properly dispatch message for selecting address type of P2SH', () => {
      store = getStore(P2SH, false);
      store.dispatch = jest.fn();
      component = createComponentForStore(store);
      const input = findInputForType(component, P2SH);
      act(() => {
        input.onChange({ target: { value: P2SH } })
      });

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      act(() => {
        expect(store.dispatch).toHaveBeenCalledWith(setAddressType(P2SH))
      });
    });

    it('should properly dispatch message for selecting address type of P2SH-P2WSH', () => {
      store = getStore(P2SH_P2WSH, false);
      store.dispatch = jest.fn();
      component = createComponentForStore(store);
      const input = findInputForType(component, P2SH_P2WSH);
      act(() => {
        input.onChange({ target: { value: P2SH_P2WSH } })
      });

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      act(() => {
        expect(store.dispatch).toHaveBeenCalledWith(setAddressType(P2SH_P2WSH))
      });
    });

    it('should properly dispatch message for selecting address type of P2WSH', () => {
      store = getStore(P2WSH, false);
      store.dispatch = jest.fn();
      component = createComponentForStore(store);
      const input = findInputForType(component, P2WSH);
      act(() => {
        input.onChange({ target: { value: P2WSH } })
      });

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      act(() => {
        expect(store.dispatch).toHaveBeenCalledWith(setAddressType(P2WSH))
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

function findInputForType(component, addressType) {
  return component.root.findAllByType('input')
    .map(inp => inp.props)
    .filter(inp => inp.value === addressType)[0];
}

function getStore(addressType, frozen) {
  return mockStore({
    settings: {
      addressType: addressType,
      frozen: frozen,
    }
  });
}