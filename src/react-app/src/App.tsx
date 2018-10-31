import React, { Component } from 'react';
import {Route} from 'react-router';
import {BrowserRouter, Redirect} from 'react-router-dom';

// redux
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import {StoreState, Filter} from './types';
import {SortOrgs} from './redux/actions';
import theReducer from './redux/reducers';

// the app and subcomponents
import './App.css';

import Header from './components/Header';
import OrganizationsBrowser from './containers/OrganizationsBrowser';
import NewOrganization from './containers/NewOrganization';
import ViewOrganization from './containers/ViewOrganization';
import EditOrganization from './containers/EditOrganization';

// Put the redux store together
// Just for prototyping --- This is super naive and will change!
import {organizations} from './data/index';

const initialState : StoreState = {
  rawOrganizations: organizations,
  organizations: organizations,
  totalCount: organizations.length,
  filteredCount: organizations.length,
  sortBy: 'createdAt',
  sortDescending: true,
  filter: Filter.All,
  searchTerms: ["50"],
  selectedOrganizationId: null,
  auth: {
    username: 'eapearson',
    realname: 'Erik Pearson',
    roles: []
  }
}

// TODO: remove the cast of reducer to any...
const store = createStore<StoreState, SortOrgs, null, null>(theReducer as any, initialState);

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <div className="App">
            <div className="App-header">
              <Header title="Organizations" />
            </div>
            <div className="App-body">
              <Route path="/organizations" component={OrganizationsBrowser} />
              <Route path="/newOrganization" component={NewOrganization} />
              {/* The destructuring below is ugly, but effective */}
              <Route path="/viewOrganization/:id" component={({match: {params: {id}}}: {match: {params: {id: string}}}) => <ViewOrganization id={id} />} />
              <Route path="/editOrganization/:id" component={({match: {params: {id}}}: {match: {params: {id: string}}}) => <EditOrganization id={id} />} />
              <Redirect from="/" to="/organizations" exact={true}/>
            </div>
          </div>
        </Provider>
      </BrowserRouter>
    )
  }
}

export default App;
