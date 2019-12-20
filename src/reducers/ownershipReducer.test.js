import reducer from './ownershipReducer';

import {
  SET_NETWORK,
} from "../actions/settingsActions";
import {
  CHOOSE_CONFIRM_OWNERSHIP,
  SET_OWNERSHIP_MULTISIG,
  RESET_PUBLIC_KEY_IMPORTER,
  RESET_PUBLIC_KEY_IMPORTER_BIP32_PATH,
  SET_PUBLIC_KEY_IMPORTER_BIP32_PATH,
  SET_PUBLIC_KEY_IMPORTER_METHOD,
  SET_PUBLIC_KEY_IMPORTER_PUBLIC_KEY,
} from '../actions/ownershipActions';
import {
  TESTNET,
  MAINNET,
  multisigAddressType,
  multisigBIP32Path,
  multisigPublicKeys,
} from "unchained-bitcoin";
import { P2SH, generateMultisigFromHex, P2WSH } from 'unchained-bitcoin/lib/multisig';

describe('Test ownershipReducer', () => {
  describe('Test CHOOSE_CONFIRM_OWNERSHIP action', () => {
    it('should properly set the chosen for the action CHOOSE_CONFIRM_OWNERSHIP', () => {
      const r = reducer(
        { chosen: false },
        {
          type: CHOOSE_CONFIRM_OWNERSHIP,
        },
      )
      expect(r.chosen).toEqual(true);
    });
  });

  describe('Test SET_NETWORK action', () => {
    it('should properly set the network to testnet for the action SET_NETWORK', () => {
      const r = reducer(
        { network: MAINNET },
        {
          type: SET_NETWORK,
          value: TESTNET
        },
      )
      expect(r.network).toEqual(TESTNET);
    });

    it('should properly set the network to mainnet for the action SET_NETWORK', () => {
      const r = reducer(
        { network: TESTNET },
        {
          type: SET_NETWORK,
          value: MAINNET
        },
      )
      expect(r.network).toEqual(MAINNET);
    });
  });

  describe('Test SET_OWNERSHIP_MULTISIG action', () => {
    it('should properly set the address type, address, default BIP32 path, network for the action SET_OWNERSHIP_MULTISIG', () => {
      const multisig = generateMultisigFromHex(TESTNET, P2WSH, "512103a90d10bf3794352bb1fa533dbd4ea75a0ffc98e0d05124938fcc3e10cdbe1a4321030d60e8d497fa8ce59a2b3203f0e597cd0182e1fe0cc3688f73497f2e99fbf64b52ae")
      const r = reducer(
        {
          addressType: P2SH,
          address: '',
          defaultBIP32Path: '',
          network: TESTNET,
          publicKeys: [],
         },
        {
          type: SET_OWNERSHIP_MULTISIG,
          value: multisig
        },
      )
      expect(r.addressType).toEqual(P2WSH);
      expect(r.address).toEqual(multisig.address);
      expect(r.defaultBIP32Path).toEqual(multisigBIP32Path(r.addressType, r.network));
      expect(r.publicKeys).toEqual(multisigPublicKeys(multisig))

    });
  });

  describe('Test RESET_PUBLIC_KEY_IMPORTER action', () => {
    it('should properly set the chosen for the action RESET_PUBLIC_KEY_IMPORTER', () => {
      const r = reducer(
        {
          publicKeyImporter: {
            bip32Path: "m/0'/0'/0'",
            publicKey: '0000000000000000'
          },
          defaultBIP32Path: multisigBIP32Path(P2SH, TESTNET)
        },
        {
          type: RESET_PUBLIC_KEY_IMPORTER,
        },
      )
      expect(r.publicKeyImporter.bip32Path).toEqual(multisigBIP32Path(P2SH, TESTNET));
      expect(r.publicKeyImporter.publicKey).toEqual('');
    });
  });

  describe('Test RESET_PUBLIC_KEY_IMPORTER_BIP32_PATH action', () => {
    it('should properly set the chosen for the action RESET_PUBLIC_KEY_IMPORTER_BIP32_PATH', () => {
      const publicKey = '0000000000000000';
      const r = reducer(
        {
          publicKeyImporter: {
            bip32Path: "m/0'/0'/0'",
            publicKey: publicKey
          },
          defaultBIP32Path: multisigBIP32Path(P2SH, TESTNET)
        },
        {
          type: RESET_PUBLIC_KEY_IMPORTER_BIP32_PATH,
        },
      )
      expect(r.publicKeyImporter.bip32Path).toEqual(multisigBIP32Path(P2SH, TESTNET));
      expect(r.publicKeyImporter.publicKey).toEqual(publicKey);
    });
  });

  describe('Test SET_PUBLIC_KEY_IMPORTER_BIP32_PATH action', () => {
    it('should properly set the chosen for the action SET_PUBLIC_KEY_IMPORTER_BIP32_PATH', () => {
      const expectedBIP32Path = "m/99'/88'/77";
      const r = reducer(
        {
          publicKeyImporter: {
            bip32Path: multisigBIP32Path(P2SH, TESTNET),
          },
        },
        {
          type: SET_PUBLIC_KEY_IMPORTER_BIP32_PATH,
          value: expectedBIP32Path
        },
      )
      expect(r.publicKeyImporter.bip32Path).toEqual(expectedBIP32Path);
    });
  });

  describe('Test SET_PUBLIC_KEY_IMPORTER_METHOD action', () => {
    it('should properly set the chosen for the action SET_PUBLIC_KEY_IMPORTER_METHOD', () => {
      const method = "ledger";
      const r = reducer(
        {
          publicKeyImporter: {
            method: '',
          },
        },
        {
          type: SET_PUBLIC_KEY_IMPORTER_METHOD,
          value: method
        },
      )
      expect(r.publicKeyImporter.method).toEqual(method);
    });
  });

  describe('Test SET_PUBLIC_KEY_IMPORTER_PUBLIC_KEY action', () => {
    it('should properly set the chosen for the action SET_PUBLIC_KEY_IMPORTER_PUBLIC_KEY', () => {
      const publicKey = "00aabbccdd";
      const r = reducer(
        {
          publicKeyImporter: {
            publicKey: '',
          },
        },
        {
          type: SET_PUBLIC_KEY_IMPORTER_PUBLIC_KEY,
          value: publicKey
        },
      )
      expect(r.publicKeyImporter.publicKey).toEqual(publicKey);
    });
  });

  describe('Test unknown action', () => {
    it('should properly set the chosen for the an unknown action', () => {
      const state = {
        chosen: false,
        network: MAINNET,
        addressType: P2SH,
        publicKeys: [],
        address: '',
        defaultBIP32Path: multisigBIP32Path(P2SH, MAINNET),
        publicKeyImporter: {
          publicKey: '',
        },
      }

      const r = reducer(
        state,
        {
          type: 'I_DONT_EXIST',
        },
      )
      expect(r).toEqual(state);
    });
  });

});
