import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

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

import OrganizationsBrowser from './components/views/browseOrgs/loader'
import NewOrganization from './components/views/newOrganization/loader'
import ViewOrganization from './components/views/viewOrganization/loader'
import EditOrganization from './components/views/editOrganization/loader'
import Auth from './containers/Auth'
import KBaseIntegration from './containers/KBaseIntegration'
import InviteUser from './components/views/inviteUser/loader'
import ManageMembership from './components/views/manageMembership/loader'
import RequestAddNarrative from './components/views/requestAddNarrative/loader'
import { StateInstances } from './redux/state';
import DataServices from './components/dataServices/storeAdapter'
import { AppContextProvider } from './AppContext'
import { Marked, Renderer, MarkedOptions } from 'marked-ts'

class DescriptionRenderer extends Renderer {
  constructor(options?: MarkedOptions) {
    super(options)
  }
  link(href: string, title: string, text: string) {
    if (this.options.sanitize) {
      let prot: string;

      try {
        prot = decodeURIComponent(this.options.unescape!(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase()
      }
      catch (e) {
        return text
      }

      if
        (
        prot.indexOf('javascript:') === 0
        || prot.indexOf('vbscript:') === 0
        || prot.indexOf('data:') === 0
      ) {
        return text
      }
    }

    let out = '<a href="' + href + '"';

    if (title) {
      out += ' title="' + title + '"';
    }

    out += ' target="_blank">' + text + '</a>';

    return out;
  }
}

let options = new MarkedOptions()
options.renderer = new DescriptionRenderer()
Marked.setOptions({ renderer: new DescriptionRenderer() })

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
      <AppContextProvider value={{ test: 'ok' }}>
        <Provider store={store}>
          <KBaseIntegration>
            <Auth hosted={hosted}>
              <DataServices>
                <BrowserRouter basename="/" >
                  <div className="App scrollable-flex-column">
                    <div className="App-body scrollable-flex-column">
                      {/* <MainMenu /> */}
                      <Switch>
                        <Route path="/organizations" component={OrganizationsBrowser} />
                        <Route path="/newOrganization" component={NewOrganization} />
                        {/* The destructuring below is ugly, but effective */}
                        <Route path="/viewOrganization/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => <ViewOrganization organizationId={id} />} />
                        <Route path="/editOrganization/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => <EditOrganization organizationId={id} />} />
                        <Route path="/inviteUser/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => (<InviteUser organizationId={id} />)} />
                        <Route path="/membership/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => (<ManageMembership organizationId={id} />)} />
                        <Route path="/requestAddNarrative/:id" component={({ match: { params: { id } } }: { match: { params: { id: string } } }) => (<RequestAddNarrative organizationId={id} />)} />
                        <Redirect from="/" to="/organizations" exact={true} />
                      </Switch>
                    </div>
                  </div>
                </BrowserRouter>
              </DataServices>
            </Auth>
          </KBaseIntegration>
        </Provider>
      </AppContextProvider>
    )
  }
}

export default App
