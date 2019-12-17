
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

