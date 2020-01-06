import {
  MAINNET,
  TESTNET,
  P2SH,
  P2SH_P2WSH,
  P2WSH,
} from "unchained-bitcoin";

import {
  SET_NETWORK,
  SET_TOTAL_SIGNERS,
  SET_REQUIRED_SIGNERS,
  SET_ADDRESS_TYPE,
  SET_FROZEN,
} from '../actions/settingsActions';
import reducer from './settingsReducer';


describe('Test settingsReducer', () => {
  describe('Test SET_NETWORK action', () => {
    it('should properly set the network for to MAINNET', () => {
      const r = reducer(
        { network: "" },
        {
          type: SET_NETWORK,
          value: MAINNET
        },
      )
      expect(r.network).toEqual(MAINNET);
    });
    it('should properly set the network for to TESTNET', () => {
      const r = reducer(
        { network: "" },
        {
          type: SET_NETWORK,
          value: TESTNET
        },
      )
      expect(r.network).toEqual(TESTNET);
    });
  });

  describe('Test SET_TOTAL_SIGNERS action', () => {
    it('should properly set the total signers', () => {
      [2, 3, 4, 5, 6, 7].forEach(signers => {
        const r = reducer(
          { totalSigners: 3 },
          {
            type: SET_TOTAL_SIGNERS,
            value: signers
          },
        )
        expect(r.totalSigners).toEqual(signers);
      })
    });
  });

  describe('Test SET_REQUIRED_SIGNERS action', () => {
    it('should properly set the required signers', () => {
      [1, 2, 3, 4, 5, 6, 7].forEach(signers => {
        const r = reducer(
          { requiredSigners: 2 },
          {
            type: SET_REQUIRED_SIGNERS,
            value: signers
          },
        )
        expect(r.requiredSigners).toEqual(signers);
      })
    });
  });

  describe('Test SET_ADDRESS_TYPE action', () => {
    it('should properly set the address type for P2SH', () => {
      const r = reducer(
        { addressType: "" },
        {
          type: SET_ADDRESS_TYPE,
          value: P2SH
        },
      )
      expect(r.addressType).toEqual(P2SH);
    });

    it('should properly set the address type for P2SH_P2WSH', () => {
      const r = reducer(
        { addressType: P2SH },
        {
          type: SET_ADDRESS_TYPE,
          value: P2SH_P2WSH
        },
      )
      expect(r.addressType).toEqual(P2SH_P2WSH);
    });

    it('should properly set the address type for P2WSH', () => {
      const r = reducer(
        { addressType: P2SH },
        {
          type: SET_ADDRESS_TYPE,
          value: P2WSH
        },
      )
      expect(r.addressType).toEqual(P2WSH);
    });
  });

  describe('Test FROZEN action', () => {
    it('should properly set frozen', () => {
      const r = reducer(
        { frozen: false },
        {
          type: SET_FROZEN,
          value: true
        },
      )
      expect(r.frozen).toBe(true);
    })
  });

  it('should properly unset frozen', () => {
    const r = reducer(
      { frozen: true },
      {
        type: SET_FROZEN,
        value: false
      },
    )
    expect(r.frozen).toBe(false);
  });
});


