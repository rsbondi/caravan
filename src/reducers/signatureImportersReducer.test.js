import {
  RESET_SIGNATURES,

  SET_SIGNATURE_IMPORTER_NAME,
  SET_SIGNATURE_IMPORTER_METHOD,
  SET_SIGNATURE_IMPORTER_BIP32_PATH,
  SET_SIGNATURE_IMPORTER_SIGNATURE,
  SET_SIGNATURE_IMPORTER_PUBLIC_KEYS,
  SET_SIGNATURE_IMPORTER_FINALIZED,
  SET_SIGNATURE_IMPORTER_COMPLETE,
} from '../actions/signatureImporterActions';
import {
  SET_REQUIRED_SIGNERS,
} from "../actions/transactionActions";
import reducer, { initialSignatureImporterState } from './signatureImportersReducer';

describe('Test signatureImportersReducer', () => {
  describe('Test RESET_SIGNATURES action', () => {
    it('should properly reset to initial state', () => {
      const r = reducer(
        {
          1: {
            name: '',
            method: '',
            publicKeys: ["aabbcc", "ddeeff"],
            signature: ["304502..."],
            bip32Path: '',
            finalized: false,
          }
        },
        {
          type: RESET_SIGNATURES,
        },
      )
      expect(r).toEqual({});
    });
  });

  describe('Test SET_SIGNATURE_IMPORTER_NAME action', () => {
    it('should properly set name', () => {
      const r = reducer(
        {
          1: {
            name: '',
          }
        },
        {
          type: SET_SIGNATURE_IMPORTER_NAME,
          number: 1,
          value: "Fred"
        },
      )
      expect(r[1].name).toEqual("Fred");
    });
  });

  describe('Test SET_REQUIRED_SIGNERS action', () => {
    it('should properly set name', () => {
      const r = reducer(
        {
          1: {
            name: '',
          }
        },
        {
          type: SET_REQUIRED_SIGNERS,
          value: 2
        },
      )
      expect(Object.keys(r).length).toEqual(2);
      const expectedState1 = {
        ...initialSignatureImporterState,
        ...{name: `Signature 1`}
      }
      expect(r[1]).toEqual(expectedState1);
    });
  });

  describe('Test SET_SIGNATURE_IMPORTER_METHOD action', () => {
    it('should properly set method', () => {
      const r = reducer(
        {
          1: {
            method: '',
          }
        },
        {
          type: SET_SIGNATURE_IMPORTER_METHOD,
          number: 1,
          value: "trezor"
        },
      )
      expect(r[1].method).toEqual("trezor");
    });
  });

  describe('Test SET_SIGNATURE_IMPORTER_BIP32_PATH action', () => {
    it('should properly set BIP32 Path', () => {
      const bip32Path = "m/45'/1'/2'/3";
      const r = reducer(
        {
          2: {
            bip32Path: '',
          }
        },
        {
          type: SET_SIGNATURE_IMPORTER_BIP32_PATH,
          number: 2,
          value: bip32Path
        },
      )
      expect(r[2].bip32Path).toEqual(bip32Path);
    });
  });

  describe('Test SET_SIGNATURE_IMPORTER_SIGNATURE action', () => {
    it('should properly set signature', () => {
      const signature = ["00000000000000000000000000000000000000"]
      const r = reducer(
        {
          2: {
            signature: [],
          }
        },
        {
          type: SET_SIGNATURE_IMPORTER_SIGNATURE,
          number: 2,
          value: signature
        },
      )
      expect(r[2].signature).toEqual(signature);
    });
  });

  describe('Test SET_SIGNATURE_IMPORTER_PUBLIC_KEYS action', () => {
    it('should properly set signature', () => {
      const publicKey = ["00000000000000000000000000000000000000"]
      const r = reducer(
        {
          2: {
            bip32Path: '',
          }
        },
        {
          type: SET_SIGNATURE_IMPORTER_PUBLIC_KEYS,
          number: 2,
          value: publicKey
        },
      )
      expect(r[2].publicKeys).toEqual(publicKey);
    });
  });

  describe('Test SET_SIGNATURE_IMPORTER_FINALIZED action', () => {
    it('should properly set signature', () => {
      const r = reducer(
        {
          2: {
            finalized: false,
          }
        },
        {
          type: SET_SIGNATURE_IMPORTER_FINALIZED,
          number: 2,
          value: true
        },
      )
      expect(r[2].finalized).toBe(true);
    });
  });

  describe('Test SET_SIGNATURE_IMPORTER_COMPLETE action', () => {
    it('should properly set signature', () => {
      const publicKey = ["00000000000000000000000000000000000000"];
      const signature = ["11111111111111111111111111111111111111"];
      const expected = {
        signature: signature,
        publicKeys: publicKey,
        finalized: true
      }

      const r = reducer(
        {
          2: {
            signature: [],
            publicKeys: [],
            finalized: false,
          }
        },
        {
          type: SET_SIGNATURE_IMPORTER_COMPLETE,
          number: 2,
          value: expected
        },
      )
      expect(r[2]).toStrictEqual(expected);
    });
  });
});
