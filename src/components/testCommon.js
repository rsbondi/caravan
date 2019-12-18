
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