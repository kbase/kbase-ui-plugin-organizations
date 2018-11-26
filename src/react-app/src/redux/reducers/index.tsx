import { Action } from 'redux'
import { StoreState } from '../../types'
import addOrgReducer from './addOrg'
import editOrgReducer from './editOrg'
import viewOrgReducer from './viewOrg'
import searchOrgsReducer from './searchOrgs'
import authReducer from './auth'
import appReducer from './app'
import manageOrganizatiopRequests from './manageOrganizationRequests';
import viewMembers from './viewMembers';
import inviteUser from './inviteUser';
import manageMembership from './manageMembership'


export function reducer(state: StoreState, action: Action): StoreState {
    return addOrgReducer(state, action) ||
        editOrgReducer(state, action) ||
        searchOrgsReducer(state, action) ||
        viewOrgReducer(state, action) ||
        authReducer(state, action) ||
        appReducer(state, action) ||
        manageOrganizatiopRequests(state, action) ||
        viewMembers(state, action) ||
        inviteUser(state, action) ||
        manageMembership(state, action) ||
        state;
}

export default reducer