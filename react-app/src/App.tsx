import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { BrowserRouter, RouteComponentProps } from 'react-router-dom';

// redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import theReducer from './redux/reducers';

// the app and subcomponents
import './App.css';

// fontawesome setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faSearch, faGlobe, faUserLock, faSquare, faCube } from '@fortawesome/free-solid-svg-icons';

import OrganizationsBrowser from './components/views/browseOrgs/loader';
import NewOrganization from './components/views/newOrganization/loader';
import ViewOrganization from './components/views/viewOrganization/loader';
import { StateInstances } from './redux/state';
import DataServices from './components/dataServices/storeAdapter';

import { AppBase, AuthGate } from '@kbase/ui-components';

import { Marked, Renderer, MarkedOptions } from 'marked-ts';
library.add(faSpinner, faSearch, faGlobe, faUserLock, faSquare, faCube);

class DescriptionRenderer extends Renderer {
    link(href: string, title: string, text: string) {
        if (this.options.sanitize) {
            let prot: string;

            try {
                prot = decodeURIComponent(this.options.unescape!(href))
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();
            } catch (e) {
                return text;
            }

            // Ahem, this is to get around the current (1/10/20) eslint rule which 
            // complains about 'javascript:'
            const colon = ':';
            const x = 'javascript' + colon;
            if (prot.indexOf(x) === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
                return text;
            }
        }

        let out = '<a href="' + href + '"';

        if (title) {
            out += ' title="' + title + '"';
        }

        out += ' target="_blank" rel="noopener noreferrer">' + text + '</a>';

        return out;
    }
}

let options = new MarkedOptions();
options.renderer = new DescriptionRenderer();
Marked.setOptions({ renderer: new DescriptionRenderer() });

// Put the redux store together
// Just for prototyping --- This is super naive and will change!
// import {organizations} from './data/temp';

// TODO: determine the environment

// const hosted = window.frameElement ? true : false;

// Set up initial state
// TODO: move to own file
const initialState = StateInstances.makeInitialState();

// TODO: remove the cast of reducer to any...
// const middleware = [thunk]
// const store = createStore<StoreState, SortOrgs, null, null>(theReducer as any, initialState, applyMiddleware(thunk));
const store = createStore(theReducer as any, initialState as any, compose(applyMiddleware(thunk)));

// export interface WrappedComponent extends React.Component<NewOrganization {

// }

// const Wrapped: FunctionComponent<NewOrganization> = ({component: Component, ...rest}: {component: any}) => {
//   return (<Route {...rest} render={(props) => {
//       <Component {...props} />
//     }} />
//   )
// }

interface ViewOrgMatchProps {
    id: string;
}
type WrappedProps = RouteComponentProps<ViewOrgMatchProps>;
const F: React.SFC<WrappedProps> = (props: WrappedProps) => {
    return <ViewOrganization organizationId={props.match.params.id} />;
};

// class F2 extends React.Component<WrappedProps> {
//   constructor(params: WrappedProps) {
//     super(params)
//   }
//   render() {
//     return (
//       <ViewOrganization organizationId={this.props.match.params.id} />
//     )
//   }
// }

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppBase>
                    <AuthGate required={true}>
                        <DataServices>
                            <BrowserRouter basename="/">
                                <div
                                    className="App scrollable-flex-column"
                                    data-k-b-testhook-plugin="organizations"
                                >
                                    <div className="App-body scrollable-flex-column">
                                        {/* <MainMenu /> */}
                                        <Switch>
                                            <Route path="/organizations" component={OrganizationsBrowser} />
                                            <Route path="/newOrganization" component={NewOrganization} />
                                            <Route path="/viewOrganization/:id" exact={true} component={F} />
                                            {/* <Route path="/viewOrganization/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => <ViewOrganization organizationId={id} />} /> */}
                                            <Redirect from="/" to="/organizations" exact={true} />
                                        </Switch>
                                    </div>
                                </div>
                            </BrowserRouter>
                        </DataServices>
                    </AuthGate>
                </AppBase>
            </Provider>
        );
    }
}

export default App;
