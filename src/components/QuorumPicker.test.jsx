import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import QuorumPicker from './QuorumPicker';
import { TestUtil, quorums, QUORUM_BUTTONS } from './testCommon'

import {
  setTotalSigners,
  setRequiredSigners,
} from "../actions/settingsActions";


import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
const util = new TestUtil(createComponentForStore, getStore)
const mockStore = configureStore([]);

let container = null;

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('Test QuorumPicker component', () => {

  describe('Test rendering of component for a given state value', () => {
    it('should properly render for state of varying m of n quorums', () => {
      quorums.forEach(quorum => {
        util.createTestComponent({ totalSigners: quorum.n, requiredSigners: quorum.m });
        const h2s = container.querySelectorAll('h2');
        expect(parseInt(h2s[0].innerHTML, 10)).toEqual(quorum.m);
        expect(parseInt(h2s[1].innerHTML, 10)).toEqual(quorum.n);
      })
    });

    it('should properly render enabled for state of non frozen', () => {
      util.createTestComponent({ requiredSigners: 2, totalSigners: 3, frozen: false });
      const buttons = container.querySelectorAll('button');
      expect(buttons[QUORUM_BUTTONS.M_PLUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.M_MINUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.N_PLUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.N_MINUS].disabled).toEqual(false);
    });

    it('should properly render disabled for state of frozen', () => {
      util.createTestComponent({ requiredSigners: 2, totalSigners: 3, frozen: true });
      const buttons = container.querySelectorAll('button');
      expect(buttons[QUORUM_BUTTONS.M_PLUS].disabled).toEqual(true);
      expect(buttons[QUORUM_BUTTONS.M_MINUS].disabled).toEqual(true);
      expect(buttons[QUORUM_BUTTONS.N_PLUS].disabled).toEqual(true);
      expect(buttons[QUORUM_BUTTONS.N_MINUS].disabled).toEqual(true);
    });

    it('should properly render disabled for for required signers increment and total signers decrement when required and total signers are equal', () => {
      util.createTestComponent({ requiredSigners: 2, totalSigners: 2 });
      const buttons = container.querySelectorAll('button');
      expect(buttons[QUORUM_BUTTONS.M_PLUS].disabled).toEqual(true);
      expect(buttons[QUORUM_BUTTONS.M_MINUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.N_PLUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.N_MINUS].disabled).toEqual(true);
    });

    it('should properly render disabled decrementing for a 1 of 2 quorum', () => {
      util.createTestComponent({ requiredSigners: 1, totalSigners: 2 });
      const buttons = container.querySelectorAll('button');
      expect(buttons[QUORUM_BUTTONS.M_PLUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.M_MINUS].disabled).toEqual(true);
      expect(buttons[QUORUM_BUTTONS.N_PLUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.N_MINUS].disabled).toEqual(true);
    });

    it('should properly render disabled decrementing required signers when equal to 1', () => {
      util.createTestComponent({ requiredSigners: 1, totalSigners: 3 });
      const buttons = container.querySelectorAll('button');
      expect(buttons[QUORUM_BUTTONS.M_PLUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.M_MINUS].disabled).toEqual(true);
      expect(buttons[QUORUM_BUTTONS.N_PLUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.N_MINUS].disabled).toEqual(false);
    });

    it('should properly render disabled incrementing total signers when equal to 7', () => {
      util.createTestComponent({ requiredSigners: 3, totalSigners: 7 });
      const buttons = container.querySelectorAll('button');
      expect(buttons[QUORUM_BUTTONS.M_PLUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.M_MINUS].disabled).toEqual(false);
      expect(buttons[QUORUM_BUTTONS.N_PLUS].disabled).toEqual(true);
      expect(buttons[QUORUM_BUTTONS.N_MINUS].disabled).toEqual(false);
    });

  });

  describe('Test proper dispatch of component actions', () => {
    it('should properly dispatch actions for varying m of n quorums', () => {
      quorums.forEach(quorum => {
        const { store } = util.createTestComponent({ requiredSigners: quorum.m, totalSigners: quorum.n });
        const buttons = container.querySelectorAll('button');
        act(() => {
          if (quorum.n !== 7) {
            buttons[QUORUM_BUTTONS.N_PLUS].click();
            expect(store.dispatch).toHaveBeenCalledWith(setTotalSigners(quorum.n + 1));
          }

          if (quorum.n !== quorum.m) {
            buttons[QUORUM_BUTTONS.M_PLUS].click();
            expect(store.dispatch).toHaveBeenCalledWith(setRequiredSigners(quorum.m + 1));
          }

          if (quorum.n !== quorum.m) {
            buttons[QUORUM_BUTTONS.N_MINUS].click();
            expect(store.dispatch).toHaveBeenCalledWith(setTotalSigners(quorum.n - 1));
          }

          if (quorum.m !== 1 && quorum.n !== quorum.m) {
            buttons[QUORUM_BUTTONS.M_MINUS].click();
            expect(store.dispatch).toHaveBeenCalledWith(setRequiredSigners(quorum.m - 1));
          }

        });
      });

    });
  });
});

function createComponentForStore(store) {
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
        <QuorumPicker />
      </Provider>
    ), container);
  });

}

function getStore(opts) {
  opts = opts || {}
  return mockStore({
    settings: {
      ...opts,
      frozen: opts.frozen || false,
      setTotalSigners: opts.setTotalSigners || (() => { }),
      setRequiredSigners: opts.setRequiredSigners || (() => { }),
    }
  });
}