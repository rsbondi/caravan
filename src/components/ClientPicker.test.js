import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import ClientPicker from './ClientPicker';
import { MAINNET } from 'unchained-bitcoin/lib/networks';
import { TestUtil } from './testCommon'

import {
  SET_CLIENT_TYPE,
  SET_CLIENT_URL,
  SET_CLIENT_USERNAME,
  SET_CLIENT_PASSWORD,

  SET_CLIENT_URL_ERROR,
  SET_CLIENT_USERNAME_ERROR,
  SET_CLIENT_PASSWORD_ERROR,
} from '../actions/clientActions';

const act = renderer.act;
const util = new TestUtil(createComponentForStore, getStore)
const mockStore = configureStore([]);

describe('Test ClientPicker component', () => {

  describe('Test rendering of component for a given state value', () => {

    it('should properly render slider for state of client type of public', () => {
      const { component } = util.createTestComponent({type: 'public'});
      const input = util.findInputByProps(component, {value: 'private'})
      expect(input.checked).toEqual(false);
    });

    it('should properly render slider for state of client type of private', () => {
      const { component } = util.createTestComponent({type: 'private'});
      const input = util.findInputByProps(component, {value: 'private'})
      expect(input.checked).toEqual(true);
    });

    it('should properly render username value based on value set in state', () => {
      const { component } = util.createTestComponent({type: 'private', username: "bitcoinrpc" });
      const user = util.findInputByProps(component,{ label: 'Username' })
      expect(user.value).toEqual('bitcoinrpc');
    });

    it('should properly render username value based on value set in state', () => {
      const { component } = util.createTestComponent({type: 'private', password: "bitcoinpass" });
      const pass = util.findInputByProps(component, { label: 'Password' })
      expect(pass.value).toEqual('bitcoinpass');
    });

    it('should properly set error for an invalid url', () => {
      const { store, component } = util.createTestComponent({type: 'private'});
      const url = util.findInputByProps(component, { label: 'URL' })
      act(() => {
        url.onChange({ target: { value: 'localhost:8332' } })
        expect(store.dispatch).toHaveBeenCalledWith({ type: "SET_CLIENT_URL_ERROR", value: "Must be a valid URL." })
      });
    });

    it('should not render private input fields when client type of public is selected', () => {
      const { component } = util.createTestComponent({type: 'public'});

      const url = component.root.findAllByProps({ label: 'URL' })
      expect(url.length).toEqual(0);
      const user = component.root.findAllByProps({ label: 'Username' })
      expect(user.length).toEqual(0);
      const pass = component.root.findAllByProps({ label: 'Password' })
      expect(pass.length).toEqual(0);
    });

  });

  describe('Test proper dispatch of component actions', () => {

    describe('Test proper dispatch of valid actions', () => {
      it('should properly dispatch value for an valid url with no errors', () => {
        const { store, component } = util.createTestComponent({type: 'private'});
        const url = util.findInputByProps(component, { label: 'URL' })
        act(() => {
          url.onChange({ target: { value: 'http://localhost:8332' } })
          expect(store.dispatch).toHaveBeenCalledWith({ type: SET_CLIENT_URL, value: "http://localhost:8332" })
          expect(store.dispatch).toHaveBeenCalledWith({ type: SET_CLIENT_URL_ERROR, value: "" })
        });
      });

      it('should properly dispatch value for an valid username with no errors', () => {
        const { store, component } = util.createTestComponent({type: 'private'});
        const url = util.findInputByProps(component, { label: 'Username' })
        act(() => {
          url.onChange({ target: { value: 'bitcoinrpc' } })
          expect(store.dispatch).toHaveBeenCalledWith({ type: SET_CLIENT_USERNAME, value: "bitcoinrpc" })
          expect(store.dispatch).toHaveBeenCalledWith({ type: SET_CLIENT_USERNAME_ERROR, value: "" })
        });
      });

      it('should properly dispatch value for an valid password with no errors', () => {
        const { store, component } = util.createTestComponent({type: 'private'});
        const url = util.findInputByProps(component, { label: 'Password' })
        act(() => {
          url.onChange({ target: { value: 'bitcoinrpcpass' } })
          expect(store.dispatch).toHaveBeenCalledWith({ type: SET_CLIENT_PASSWORD, value: "bitcoinrpcpass" })
          expect(store.dispatch).toHaveBeenCalledWith({ type: SET_CLIENT_PASSWORD_ERROR, value: "" })
        });
      });

      it('should properly dispatch value for private and public selection', () => {
        const { store, component } = util.createTestComponent({type: 'public'});
        const input = util.findInputByProps(component, {value: 'private'})
        act(() => {
          input.onChange({ target: { checked: true } })
          expect(store.dispatch).toHaveBeenCalledWith({ type: SET_CLIENT_TYPE, value: "private" })

          input.onChange({ target: { checked: false } })
          expect(store.dispatch).toHaveBeenCalledWith({ type: SET_CLIENT_TYPE, value: "public" })
        });
      });

    });

    describe('Test proper dispatch of invalid actions', () => {
      it('should properly dispatch error for an invalid url', () => {
        const { store, component } = util.createTestComponent({type: 'private'});
        const url = util.findInputByProps(component, { label: 'URL' })
        act(() => {
          url.onChange({ target: { value: 'localhost:8332' } })
          expect(store.dispatch).toHaveBeenCalledWith({ type: SET_CLIENT_URL, value: "localhost:8332" })
          expect(store.dispatch).toHaveBeenCalledWith({ type: SET_CLIENT_URL_ERROR, value: "Must be a valid URL." })
        });
      });
    });
  });

});

function createComponentForStore(store) {
  return renderer.create(
    <Provider store={store}>
      <ClientPicker />
    </Provider>
  );
}

function getStore(opts) {
  opts = opts || {}
  return mockStore({
    settings: {
      network: opts.network || MAINNET,
    },
    client: {
      type: opts.type,
      url: opts.url || '',
      username: opts.username || '',
      password: opts.password || '',
      url_error: opts.url_error || '',
      username_error: opts.username_error || '',
      password_error: opts.password_error || '',
      status: 'unknown',
    }
  });
}