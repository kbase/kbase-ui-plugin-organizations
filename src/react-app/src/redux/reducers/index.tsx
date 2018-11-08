import { Action } from 'redux'
import * as actions from '../actions'
import * as types from '../../types'
import { ActionFlag } from '../actions'
import { Organizations, Organization } from '../../types'
import { Model } from '../../data/model'
import addOrgReducer from './addOrg'
import editOrgReducer from './editOrg'
import viewOrgReducer from './viewOrg'
import searchOrgsReducer from './searchOrgs'
import authReducer from './auth'
import appReducer from './app'


export function reducer(state: types.StoreState, action: Action): types.StoreState {
    return addOrgReducer(state, action) ||
        editOrgReducer(state, action) ||
        searchOrgsReducer(state, action) ||
        viewOrgReducer(state, action) ||
        authReducer(state, action) ||
        appReducer(state, action) ||
        state;
}

export default reducer