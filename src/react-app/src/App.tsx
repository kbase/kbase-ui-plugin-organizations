import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { Redirect, HashRouter } from 'react-router-dom'

// redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import theReducer from './redux/reducers'

// the app and subcomponents
import './App.css';

// fontawesome setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faSearch, faGlobe, faUserLock } from '@fortawesome/free-solid-svg-icons'
library.add(faSpinner, faSearch, faGlobe, faUserLock)

import OrganizationsBrowser from './components/browseOrgs/OrganizationsBrowserContainer'
import NewOrganization from './components/newOrganization/container'
import ViewOrganization from './components/viewOrganization/ViewOrganizationContainer'
import EditOrganization from './components/editOrganization/container'
import Auth from './containers/Auth'
import KBaseIntegration from './containers/KBaseIntegration'
import ManageOrganizationRequests from './components/manageOrganizationRequests/loader'
import ViewMembers from './components/viewMembers/loader'
import InviteUser from './components/inviteUser/InviteUserLoader'
import ManageMembership from './components/manageMembership/loader'
import RequestAddNarrative from './components/requestAddNarrative/loader'
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
              <div className="App scrollable-flex-column">
                <div className="App-body scrollable-flex-column">
                  <Switch>
                    <Route path="/organizations" component={OrganizationsBrowser} />
                    <Route path="/newOrganization" component={NewOrganization} />
                    {/* The destructuring below is ugly, but effective */}
                    <Route path="/viewOrganization/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => <ViewOrganization id={id} />} />
                    <Route path="/editOrganization/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => <EditOrganization id={id} />} />
                    <Route path="/manageOrganizationRequests/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => <ManageOrganizationRequests organizationId={id} />} />
                    <Route path="/viewMembers/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => <ViewMembers organizationId={id} />} />
                    <Route path="/inviteUser/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => (<InviteUser organizationId={id} />)} />
                    <Route path="/membership/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => (<ManageMembership organizationId={id} />)} />
                    <Route path="/requestAddNarrative/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => (<RequestAddNarrative organizationId={id} />)} />

                    <Redirect from="/" to="/organizations" exact={true} />
                  </Switch>
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
