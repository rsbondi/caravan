import {
    P2SH,
    P2SH_P2WSH,
    P2WSH,
    TESTNET,
    MAINNET,
    generateMultisigFromHex,
} from "unchained-bitcoin"
export class TestUtil {
    constructor(createComponent, getStore) {
        this.createComponent = createComponent;
        this.getStore = getStore;
    }

    findInputByProps(component, props) {
        return component.root.findByProps(props)
            .findByType('input').props
    }

    createTestComponent(opts, props) {
        let store = this.getStore(opts);
        store.dispatch = jest.fn();
        const component = this.createComponent(store, props);
        return { store, component }
    }
}

export const quorums = [
    {m: 2, n: 3},
    {m: 2, n: 2},
    {m: 1, n: 3},
    {m: 3, n: 5},
    {m: 5, n: 7},
    {m: 3, n: 3},
    {m: 3, n: 4},
    {m: 2, n: 6},
]

export const QUORUM_BUTTONS = {
    M_PLUS: 0,
    M_MINUS: 1,
    N_PLUS: 2,
    N_MINUS: 3
}

const redeemScripts = [
    {
        redeem: "5221023428cec6d82a73fcab42890a76bf02d7500cfaf15ce6370e992427641fda99c32102a9968c3695beb14de3bfa7f93a32448c30b88ed0921529e469639957676cd3162102cbd13b50304e4ab520a5e5759af8bbd09b55d9c2c9c9742c52ff125cbe37066d53ae",
        quorum: "2-of-3"
    },
    {
        redeem: "5121022f9e3a3183c0714d524fe246c4da57df6b16a245942284b0f75edb2a2ab9efd7210252adaf3805b7c13f9c15126aaa335bffcf53657a0f4849186b8adfe701d2f51b52ae",
        quorum: "1-of-2"
    },
    {
        redeem: "55210270dd3e386a7d4b85b7609af98b8cfe06f895f667b601769265c2d45d0809c713210280a8f925f31edbc139ee896b4521c7c9deb73a38c9a3ef0264ec186b839769ee2102ad49845f4c6cde24f18422f712ab03145327108784b4a11ae8aec4a83e2561ad21036d1ebc6676b3a53cc2cf7f722440d6d442e134dc20dba15473c125f161de48ef21038699ced547d68cfbe7500e3ac7017ab06940a877c2edac27b6d83352e0426da42103bc579333f4b9cdb86b228671beea2fb46ea51f69a21d07ef461cf2a64db5b8ae2103c106f85730117e6bfac97486eb0b69c97a2c692c1e88d6de108cd24bbb8a192057ae",
        quorum: "5-of-7"
    },

]
export const testMultisigs = []
redeemScripts.forEach(redeemScript => {
    testMultisigs.push(
        {
            quorum: redeemScript.quorum,
            [MAINNET]: {
                [P2SH]: generateMultisigFromHex(MAINNET, P2SH, redeemScript.redeem),
                [P2SH_P2WSH]: generateMultisigFromHex(MAINNET, P2SH_P2WSH, redeemScript.redeem),
                [P2WSH]: generateMultisigFromHex(MAINNET, P2WSH, redeemScript.redeem)
            },
            [TESTNET]: {
                [P2SH]: generateMultisigFromHex(TESTNET, P2SH, redeemScript.redeem),
                [P2SH_P2WSH]: generateMultisigFromHex(TESTNET, P2SH_P2WSH, redeemScript.redeem),
                [P2WSH]: generateMultisigFromHex(TESTNET, P2WSH, redeemScript.redeem)
            }
        }
    )
})
