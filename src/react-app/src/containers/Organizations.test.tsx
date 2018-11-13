import React, { Component } from 'react'
import { configure, shallow, ShallowWrapper, mount, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { createStore, compose, applyMiddleware, Store, Action } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { StateInstances } from '../redux/state';
import theReducer from '../redux/reducers';
import Organizations from './Organizations'
import Auth from './Auth';
import KBaseIntegration from './KBaseIntegration';
import { StoreState } from '../types';

configure({ adapter: new Adapter() })


let initialState: StoreState
let store: Store<{}, Action<any>> & {
    dispatch: {};
}
// let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>
let wrapper: ReactWrapper<any, Readonly<{}>, Component<{}, {}, any>>

beforeEach(() => {
    initialState = StateInstances.makeInitialState()
    store = createStore(
        theReducer as any,
        initialState as any,
        compose(applyMiddleware(thunk))
    )
    const hosted = false
    wrapper = mount(
        <Provider store={store}>
            <Auth hosted={hosted}>
                <KBaseIntegration>
                    <Organizations />
                </KBaseIntegration>
            </Auth>
        </Provider>
    )
})

it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1)

});
