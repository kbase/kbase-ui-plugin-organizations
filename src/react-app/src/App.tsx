import React, { Component } from 'react';
import { Route } from 'react-router';
import { BrowserRouter, Redirect, HashRouter } from 'react-router-dom';

// redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'

import * as types from './types';
import { SortOrgs } from './redux/actions/viewOrg';
import theReducer from './redux/reducers';

// the app and subcomponents
import './App.css';

// fontawesome setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faSearch } from '@fortawesome/free-solid-svg-icons'
library.add(faSpinner, faSearch)

import Header from './components/Header';
import OrganizationsBrowser from './containers/OrganizationsBrowser';
import NewOrganization from './containers/NewOrganization';
import ViewOrganization from './containers/ViewOrganization';
import EditOrganization from './containers/EditOrganization'
import Auth from './containers/Auth'
import KBaseIntegration from './containers/KBaseIntegration'
// import { types } from 'util';

// Put the redux store together
// Just for prototyping --- This is super naive and will change!
// import {organizations} from './data/temp';

// TODO: determine the environment

const inIframe = false
const deployEnvironment = 'dev'


function makeEmptyNewOrganization(): types.NewOrganization {
  return {
    id: {
      value: '',
      status: types.FieldState.NONE,
      error: {
        type: types.UIErrorType.NONE
      }
    },
    name: {
      value: '',
      status: types.FieldState.NONE,
      error: {
        type: types.UIErrorType.NONE
      }
    },
    description: {
      value: '',
      status: types.FieldState.NONE,
      error: {
        type: types.UIErrorType.NONE
      }
    }
  }
}

// Set up initial state 
// TODO: move to own file
const initialState: types.StoreState = {
  rawOrganizations: [],
  organizations: [],
  totalCount: 0,
  filteredCount: 0,
  sortBy: 'name',
  sortDirection: types.SortDirection.ASCENDING,
  filter: 'all',
  searchTerms: [],
  selectedOrganizationId: null,
  auth: {
    status: types.AuthState.NONE,
    authorization: {
      token: '',
      username: '',
      realname: '',
      roles: []
    }
  },
  error: null,
  searching: false,
  app: {
    status: types.AppState.NONE,
    config: {
      baseUrl: '',
      services: {
        Groups: {
          url: ''
        },
        UserProfile: {
          url: ''
        },
        Workspace: {
          url: ''
        }
      }
    }
  },
  addOrg: {
    editState: types.EditState.NONE,
    saveState: types.SaveState.NONE,
    validationState: types.ValidationState.NONE,
    newOrganization: makeEmptyNewOrganization()
  },
  updateOrg: {
    pending: false
  },
  viewOrg: {
    state: types.ViewOrgState.NONE
  },
  editOrg: {
    state: types.EditOrgState.NONE
  }
}

// TODO: remove the cast of reducer to any...
// const middleware = [thunk]
// const store = createStore<StoreState, SortOrgs, null, null>(theReducer as any, initialState, applyMiddleware(thunk));
const store = createStore(theReducer as any, initialState as any, compose(applyMiddleware(thunk)))

class App extends Component {

  constructor(props: any) {
    super(props)

  }

  buildInner() {

  }

  buildDev() {

  }

  buildProd() {

  }

  render() {
    return (
      <Provider store={store}>
        <Auth env={deployEnvironment}>
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

export default App;
