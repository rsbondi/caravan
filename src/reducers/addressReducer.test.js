import reducer, { initialState } from './addressReducer';
import {
  SET_NETWORK,
  SET_ADDRESS_TYPE,
  SET_TOTAL_SIGNERS,
} from '../actions/settingsActions';
import {
  SET_PUBLIC_KEY_IMPORTER_NAME,
  RESET_PUBLIC_KEY_IMPORTER_BIP32_PATH,
  SET_PUBLIC_KEY_IMPORTER_BIP32_PATH,
  SET_PUBLIC_KEY_IMPORTER_METHOD,
  SET_PUBLIC_KEY_IMPORTER_PUBLIC_KEY,
  SET_PUBLIC_KEY_IMPORTER_FINALIZED,
  MOVE_PUBLIC_KEY_IMPORTER_UP,
  MOVE_PUBLIC_KEY_IMPORTER_DOWN,
  SORT_PUBLIC_KEY_IMPORTERS,

} from '../actions/publicKeyImporterActions';
import {
  MAINNET,
  TESTNET,
  P2SH,
  P2SH_P2WSH,
  P2WSH,
  multisigBIP32Path,
} from "unchained-bitcoin";
import { createStore } from 'redux';

describe('Test addressReducer', () => {
  describe('Test SET_NETWORK action', () => {
    it('should properly set the defaultBIP32Path and network for the Action SET_NETWORK for P2SH address on mainnet', () => {
      const r = reducer(
        getInitialState({ network: TESTNET, defaultBIP32Path: "m/45'/1'/0'/0" }),
        {
          type: SET_NETWORK,
          value: MAINNET
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2SH, MAINNET)
      expect(r.network).toEqual(MAINNET);
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });

    it('should properly set the defaultBIP32Path and network for the Action SET_NETWORK for P2WSH address on mainnet', () => {
      const r = reducer(
        getInitialState({ network: TESTNET, addressType: P2WSH }),
        {
          type: SET_NETWORK,
          value: MAINNET
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2WSH, MAINNET)
      expect(r.network).toEqual(MAINNET);
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });

    it('should properly set the defaultBIP32Path and network for the Action SET_NETWORK for P2SH-P2WSH address on mainnet', () => {
      const r = reducer(
        getInitialState({ network: TESTNET, addressType: P2SH_P2WSH }),
        {
          type: SET_NETWORK,
          value: MAINNET
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2SH_P2WSH, MAINNET)
      expect(r.network).toEqual(MAINNET);
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });

    it('should properly set the defaultBIP32Path and network for the Action SET_NETWORK for P2SH address on testnet', () => {
      const r = reducer(
        getInitialState(),
        {
          type: SET_NETWORK,
          value: TESTNET
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2SH, TESTNET)
      expect(r.network).toEqual(TESTNET);
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });

    it('should properly set the defaultBIP32Path and network for the Action SET_NETWORK for P2WSH address on testnet', () => {
      const r = reducer(
        getInitialState({ addressType: P2WSH }),
        {
          type: SET_NETWORK,
          value: TESTNET
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2WSH, TESTNET)
      expect(r.network).toEqual(TESTNET);
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });

    it('should properly set the defaultBIP32Path and network for the Action SET_NETWORK for P2SH-P2WSH address on mainnet', () => {
      const r = reducer(
        getInitialState({ addressType: P2SH_P2WSH }),
        {
          type: SET_NETWORK,
          value: TESTNET
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2SH_P2WSH, TESTNET)
      expect(r.network).toEqual(TESTNET);
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });
  });

  describe('Test SET_ADDRESS_TYPE action', () => {
    it('should properly set the defaultBIP32Path and network for the Action SET_ADDRESS_TYPE for P2SH address on mainnet', () => {
      const r = reducer(
        getInitialState({ addressType: P2WSH }),
        {
          type: SET_ADDRESS_TYPE,
          value: P2SH
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2SH, MAINNET)
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      expect(r.addressType).toEqual(P2SH)
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });

    it('should properly set the defaultBIP32Path and network for the Action SET_ADDRESS_TYPE for P2WSH address on mainnet', () => {
      const r = reducer(
        getInitialState(),
        {
          type: SET_ADDRESS_TYPE,
          value: P2WSH
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2WSH, MAINNET)
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      expect(r.addressType).toEqual(P2WSH)
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });

    it('should properly set the defaultBIP32Path and network for the Action SET_ADDRESS_TYPE for P2SH-P2WSH address on mainnet', () => {
      const r = reducer(
        getInitialState(),
        {
          type: SET_ADDRESS_TYPE,
          value: P2SH_P2WSH
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2SH_P2WSH, MAINNET)
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      expect(r.addressType).toEqual(P2SH_P2WSH)
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });

    it('should properly set the defaultBIP32Path and network for the Action SET_ADDRESS_TYPE for P2SH address on testnet', () => {
      const r = reducer(
        getInitialState({ network: TESTNET, addressType: P2WSH }),
        {
          type: SET_ADDRESS_TYPE,
          value: P2SH
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2SH, TESTNET)
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      expect(r.addressType).toEqual(P2SH)
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });

    it('should properly set the defaultBIP32Path and network for the Action SET_ADDRESS_TYPE for P2WSH address on testnet', () => {
      const r = reducer(
        getInitialState({ network: TESTNET }),
        {
          type: SET_ADDRESS_TYPE,
          value: P2WSH
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2WSH, TESTNET)
      expect(r.addressType).toEqual(P2WSH)
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });

    it('should properly set the defaultBIP32Path and network for the Action SET_ADDRESS_TYPE for P2SH-P2WSH address on testnet', () => {
      const r = reducer(
        getInitialState({ network: TESTNET }),
        {
          type: SET_ADDRESS_TYPE,
          value: P2SH_P2WSH
        },
      )
      const expectedBip32Path = multisigBIP32Path(P2SH_P2WSH, TESTNET)
      expect(r.addressType).toEqual(P2SH_P2WSH)
      expect(r.defaultBIP32Path).toEqual(expectedBip32Path);
      checkImporterDefaultBip32Paths(r, expectedBip32Path)
    });
  });

  describe('Test SET_TOTAL_SIGNERS action', () => {
    it('should properly set the totalSigners for the Action SET_TOTAL_SIGNERS ', () => {
      [2, 3, 4, 5, 6, 7].forEach(n => {
        const r = reducer(
          getInitialState(),
          {
            type: SET_TOTAL_SIGNERS,
            value: n
          },
        )
        expect(Object.keys(r.publicKeyImporters).length).toEqual(n)
      })
    });
  });

  describe('Test SET_PUBLIC_KEY_IMPORTER_NAME action', () => {
    it('should properly set the public key importer name for the Action SET_PUBLIC_KEY_IMPORTER_NAME ', () => {
      const r = reducer(
        getInitialState(),
        {
          type: SET_PUBLIC_KEY_IMPORTER_NAME,
          number: 1,
          value: "Test Public Key Importer One"
        },
      )
      expect(r.publicKeyImporters[1].name).toEqual("Test Public Key Importer One")
      expect(r.publicKeyImporters[2].name).toEqual(getInitialState().publicKeyImporters[2].name)
      expect(r.publicKeyImporters[3].name).toEqual(getInitialState().publicKeyImporters[3].name)
    });
  });

  describe('Test RESET_PUBLIC_KEY_IMPORTER_BIP32_PATH action', () => {
    it('should properly reset the public key importer BIP32Path for the Action RESET_PUBLIC_KEY_IMPORTER_BIP32_PATH ', () => {
      const r = reducer(
        getInitialState({publicKeyImporters: {1: {bip32PathModified: true, bip32Path: "m/1'/2'/3"}}}),
        {
          type: RESET_PUBLIC_KEY_IMPORTER_BIP32_PATH,
          number: 1,
        },
      )
      expect(r.publicKeyImporters[1].bip32PathModified).toEqual(false)
      expect(r.publicKeyImporters[1].bip32Path).toEqual(multisigBIP32Path(P2SH, MAINNET))

    });
  });

  describe('Test SET_PUBLIC_KEY_IMPORTER_BIP32_PATH action', () => {
    it('should properly set the public key importer BIP32Path for the Action SET_PUBLIC_KEY_IMPORTER_BIP32_PATH ', () => {
      const testPath = "m/99'/88'/77"
      const r = reducer(
        getInitialState(),
        {
          type: SET_PUBLIC_KEY_IMPORTER_BIP32_PATH,
          number: 1,
          value: testPath
        },
      )
      expect(r.publicKeyImporters[1].bip32PathModified).toEqual(true)
      expect(r.publicKeyImporters[1].bip32Path).toEqual(testPath)

    });
  });

  describe('Test SET_PUBLIC_KEY_IMPORTER_METHOD action', () => {
    it('should properly set the public key importer method for the Action SET_PUBLIC_KEY_IMPORTER_METHOD ', () => {
      const testMethod = "trezor"
      const r = reducer(
        getInitialState(),
        {
          type: SET_PUBLIC_KEY_IMPORTER_METHOD,
          number: 1,
          value: testMethod
        },
      )
      expect(r.publicKeyImporters[1].method).toEqual(testMethod)

    });
  });

  describe('Test SET_PUBLIC_KEY_IMPORTER_PUBLIC_KEY action', () => {
    it('should properly set the public key importer method for the Action SET_PUBLIC_KEY_IMPORTER_PUBLIC_KEY ', () => {
      const testPublicKey = "000000000000000000000000000000000000000000000000000000000000000000"
      const r = reducer(
        getInitialState(),
        {
          type: SET_PUBLIC_KEY_IMPORTER_PUBLIC_KEY,
          number: 1,
          value: testPublicKey
        },
      )
      expect(r.publicKeyImporters[1].publicKey).toEqual(testPublicKey)

    });
  });

  describe('Test SET_PUBLIC_KEY_IMPORTER_FINALIZED action', () => {
    it('should properly set the public key importer finalized for the Action SET_PUBLIC_KEY_IMPORTER_FINALIZED ', () => {
      const r = reducer(
        getInitialState(),
        {
          type: SET_PUBLIC_KEY_IMPORTER_FINALIZED,
          number: 1,
          value: true
        },
      )
      expect(r.publicKeyImporters[1].finalized).toEqual(true)
      expect(r.finalizedNetwork).toEqual(MAINNET)
      expect(r.finalizedAddressType).toEqual(P2SH)
    });

    it('should properly set the public key importer finalized for the Action SET_PUBLIC_KEY_IMPORTER_FINALIZED ', () => {
      const store = createStore(reducer)
      const r = reducer(
        getInitialState(),
        {
          type: SET_PUBLIC_KEY_IMPORTER_METHOD,
          number: 1,
          value: "trezor"
        },
      )
      store.dispatch({type: SET_PUBLIC_KEY_IMPORTER_FINALIZED, number: 1, value: true})
      store.dispatch({type: SET_PUBLIC_KEY_IMPORTER_FINALIZED, number: 1, value: false})
      expect(r.publicKeyImporters[1].finalized).toEqual(false)
      expect(r.finalizedNetwork).toEqual("")
      expect(r.finalizedAddressType).toEqual("")
    });
  });

  describe('Test MOVE_PUBLIC_KEY_IMPORTER_UP action', () => {
    it('should properly set the public key importer position for the Action MOVE_PUBLIC_KEY_IMPORTER_UP ', () => {
      const pubkey2 = getInitialState().publicKeyImporters[2].name
      const r = reducer(
        getInitialState(),
        {
          type: MOVE_PUBLIC_KEY_IMPORTER_UP,
          number: 2,
        },
      )
      expect(r.publicKeyImporters[1].name).toEqual(pubkey2)

    });
  });

  describe('Test MOVE_PUBLIC_KEY_IMPORTER_DOWN action', () => {
    it('should properly set the public key importer position for the Action MOVE_PUBLIC_KEY_IMPORTER_DOWN ', () => {
      const pubkey1 = getInitialState().publicKeyImporters[1].name
      const r = reducer(
        getInitialState(),
        {
          type: MOVE_PUBLIC_KEY_IMPORTER_DOWN,
          number: 1,
        },
      )
      expect(r.publicKeyImporters[2].name).toEqual(pubkey1)

    });
  });

  describe('Test SORT_PUBLIC_KEY_IMPORTERS action', () => {
    it('should properly set the public key importer positions for the Action SORT_PUBLIC_KEY_IMPORTERS ', () => {
      const pubkey1 = getInitialState().publicKeyImporters[1].name
      const pubkey2 = getInitialState().publicKeyImporters[2].name
      const pubkey3 = getInitialState().publicKeyImporters[3].name
      const smKey = "000000000000000000000000000000000000000000000000000000000000000000"
      const mdKey = "110000000000000000000000000000000000000000000000000000000000000000"
      const lgKey = "220000000000000000000000000000000000000000000000000000000000000000"
      const r = reducer(
        getInitialState({
          publicKeyImporters: {
            "1": {publicKey: mdKey, name: pubkey1},
            "2": {publicKey: lgKey, name: pubkey2},
            "3": {publicKey: smKey, name: pubkey3},
          }
        }),
        {
          type: SORT_PUBLIC_KEY_IMPORTERS,
        },
      )
      expect(r.publicKeyImporters[1].name).toEqual(pubkey3)
      expect(r.publicKeyImporters[1].publicKey).toEqual(smKey)

      expect(r.publicKeyImporters[2].name).toEqual(pubkey1)
      expect(r.publicKeyImporters[2].publicKey).toEqual(mdKey)

      expect(r.publicKeyImporters[3].name).toEqual(pubkey2)
      expect(r.publicKeyImporters[3].publicKey).toEqual(lgKey)

    });
  });

  // SORT_PUBLIC_KEY_IMPORTERS,


});

function checkImporterDefaultBip32Paths(r, expectedBip32Path) {
  Object.values(r.publicKeyImporters).forEach(importer => {
    expect(importer.bip32Path).toEqual(expectedBip32Path);
  })
}

function getInitialState(changes) {
  return { ...initialState, ...changes }
}