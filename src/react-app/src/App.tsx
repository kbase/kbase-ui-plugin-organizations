import React, { Component } from 'react'
import { Route } from 'react-router'
import { BrowserRouter, Redirect, HashRouter } from 'react-router-dom'

// redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import theReducer from './redux/reducers'

// the app and subcomponents
import './App.css';

// fontawesome setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faSearch } from '@fortawesome/free-solid-svg-icons'
library.add(faSpinner, faSearch)

import OrganizationsBrowser from './containers/OrganizationsBrowser'
import NewOrganization from './containers/NewOrganization'
import ViewOrganization from './containers/ViewOrganization'
import EditOrganization from './containers/EditOrganization'
import Auth from './containers/Auth'
import KBaseIntegration from './containers/KBaseIntegration'
import { StateInstances } from './redux/state';

// Put the redux store together
// Just for prototyping --- This is super naive and will change!
// import {organizations} from './data/temp';

// TODO: determine the environment

const hosted = window.frameElement ? true : false

// Set up initial state 
// TODO: move to own file
const initialState = StateInstances.makeInitialState()


// TODO: remove the cast of reducer to any...
// const middleware = [thunk]
// const store = createStore<StoreState, SortOrgs, null, null>(theReducer as any, initialState, applyMiddleware(thunk));
const store = createStore(theReducer as any, initialState as any, compose(applyMiddleware(thunk)))

class App extends Component {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <Auth hosted={hosted}>
          <KBaseIntegration>
            <HashRouter basename="/orgs/">
              <div className="App">
                <div className="App-body">
                  <Route path="/organizations" component={OrganizationsBrowser} />
                  <Route path="/newOrganization" component={NewOrganization} />
                  {/* The destructuring below is ugly, but effective */}
                  <Route path="/viewOrganization/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => <ViewOrganization id={id} />} />
                  <Route path="/editOrganization/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => <EditOrganization id={id} />} />
                  <Redirect from="/" to="/organizations" exact={true} />
                </div>
              </div>
            </HashRouter>
          </KBaseIntegration>
        </Auth>
      </Provider>
    )
  }
}

export default App
