import { Action } from 'redux';
import { StoreState } from '../../types';
import addOrgReducer from './addOrg';
import editOrgReducer from './editOrg';
import viewOrgReducer from './viewOrg';
import browseOrgsReducer from './browseOrgs';
// import authReducer from './auth'
import appReducer from './app';
import manageOrganizatiopRequests from './manageOrganizationRequests';
import viewMembers from './viewMembers';
import inviteUser from './viewOrganization/inviteUser';
import manageMembership from './viewOrganization/manageMembership';
import requestAddNarrative from './viewOrganization/requestAddNarrative';
import entities from './entities';
import dataServices from './dataServices';
import { baseReducer, BaseStoreState } from '@kbase/ui-components';


export function reducer(state: StoreState, action: Action): StoreState {

    const baseState = baseReducer(state as BaseStoreState, action);
    if (baseState) {
        return baseState as StoreState;
    }

    return addOrgReducer(state, action) ||
        editOrgReducer(state, action) ||
        browseOrgsReducer(state, action) ||
        viewOrgReducer(state, action) ||
        // authReducer(state, action) ||
        appReducer(state, action) ||
        manageOrganizatiopRequests(state, action) ||
        viewMembers(state, action) ||
        inviteUser(state, action) ||
        manageMembership(state, action) ||
        requestAddNarrative(state, action) ||
        entities(state, action) ||
        dataServices(state, action) ||
        state;
}

export default reducer;