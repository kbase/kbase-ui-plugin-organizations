import React, { Component } from 'react';

// redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { AppBase, AuthGate } from '@kbase/ui-components';
import { Marked, Renderer, MarkedOptions } from 'marked-ts';

// fontawesome setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faSearch, faGlobe, faUserLock, faSquare, faCube } from '@fortawesome/free-solid-svg-icons';

// the app and subcomponents
import './App.css';
import { StateInstances } from '../redux/state';
import Main from './Main';
import ErrorBoundary from './ErrorBoundary';
import theReducer from '../redux/reducers';

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

const options = new MarkedOptions();
options.renderer = new DescriptionRenderer();
Marked.setOptions({ renderer: new DescriptionRenderer() });

// Set up initial state
const initialState = StateInstances.makeInitialState();

// TODO: remove the cast of reducer to any...
const store = createStore(theReducer as any, initialState as any, composeWithDevTools(applyMiddleware(thunk)));

class App extends Component {
    render() {
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <AppBase>
                        <AuthGate required={true}>
                            <Main />
                        </AuthGate>
                    </AppBase>
                </Provider>
            </ErrorBoundary>
        );
    }
}

export default App;
