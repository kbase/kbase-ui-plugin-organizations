import { Action, Reducer } from 'redux';
import { StoreState } from '../store/types';
import addOrgReducer from './addOrg';
import editOrgReducer from './viewOrganization/editOrg';
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
import mainReducer from './main';
import { baseReducer, BaseStoreState } from '@kbase/ui-components';

// export function reducer(state: StoreState, action: Action): StoreState {
//     const baseState = baseReducer(state as BaseStoreState, action);
//     if (baseState) {
//         return baseState as StoreState;
//     }

//     return (
//         mainReducer(state, action) ||
//         addOrgReducer(state, action) ||
//         editOrgReducer(state, action) ||
//         browseOrgsReducer(state, action) ||
//         viewOrgReducer(state, action) ||
//         appReducer(state, action) ||
//         manageOrganizatiopRequests(state, action) ||
//         viewMembers(state, action) ||
//         inviteUser(state, action) ||
//         manageMembership(state, action) ||
//         requestAddNarrative(state, action) ||
//         entities(state, action) ||
//         dataServices(state, action) ||
//         state
//     );
// }

const reducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
    const baseState = baseReducer(state as BaseStoreState, action);
    if (baseState) {
        return baseState as StoreState;
    }

    if (typeof state === 'undefined') {
        return state;
    }

    return (
        mainReducer(state, action) ||
        addOrgReducer(state, action) ||
        editOrgReducer(state, action) ||
        browseOrgsReducer(state, action) ||
        viewOrgReducer(state, action) ||
        appReducer(state, action) ||
        manageOrganizatiopRequests(state, action) ||
        viewMembers(state, action) ||
        inviteUser(state, action) ||
        manageMembership(state, action) ||
        requestAddNarrative(state, action) ||
        entities(state, action) ||
        dataServices(state, action) ||
        state
    );
};

export default reducer;