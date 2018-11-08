import { Action } from 'redux'
import * as actions from '../actions/searchOrgs'
import * as types from '../../types'
import { ActionFlag } from '../actions'
import { Organizations, Organization } from '../../types'
import { Model } from '../../data/model'

export function applyOrgSearch(orgs: Organizations, searchTerms: Array<string>) {
    const filteredOrgs = orgs.filter((org) => {
        if (searchTerms.length === 0) {
            return true;
        }
        return searchTerms.every((term) => {
            // todo : make more efficient!!!
            return (new RegExp(term, 'i').test(org.name));
        })
    })

    return {
        organizations: filteredOrgs,
        totalCount: orgs.length,
        filteredCount: filteredOrgs.length
    }
}

// TODO:
// dispatch the start of the request
// do the request
// dispatch the success (will be same for all queries?)
// dispatch the error
// FOR NOW:
// do it here...
export function searchOrgsStart(state: types.StoreState, action: actions.SearchOrgsStart): types.StoreState {

    const query: Query = {
        searchTerms: action.searchTerms,
        filter: state.filter,
        sortBy: state.sortBy,
        sortDirection: state.sortDirection,
        username: state.auth.authorization.username
    }
    // const result = queryOrgs(state.rawOrganizations, query)

    return {
        ...state,
        // organizations: result.organizations, 
        // totalCount: result.total, 
        // filteredCount: result.organizations.length,
        searching: true,
        searchTerms: action.searchTerms
    }
}

export function searchOrgsSuccess(state: types.StoreState, action: actions.SearchOrgsSuccess): types.StoreState {
    return {
        ...state,
        searching: false,
        organizations: action.organizations,
        totalCount: action.totalCount,
        filteredCount: action.organizations.length
    }
}

export function searchOrgsError(state: types.StoreState, action: actions.SearchOrgsError): types.StoreState {
    return { ...state, error: action.error }
}


export function sortOrgsStart(state: types.StoreState, action: actions.SortOrgsStart): types.StoreState {
    const query: Query = {
        searchTerms: state.searchTerms,
        filter: state.filter,
        sortBy: action.sortBy,
        sortDirection: action.sortDirection,
        username: state.auth.authorization.username
    }
    // const result = queryOrgs(state.rawOrganizations, query)

    return {
        ...state,
        // organizations: result.organizations, 
        // totalCount: result.total, 
        // filteredCount: result.organizations.length,
        searching: true,
        sortBy: action.sortBy,
        sortDirection: action.sortDirection
    }
}


interface Query {
    searchTerms: Array<string>,
    username: string,
    sortBy: string,
    sortDirection: types.SortDirection,
    filter: string
}

interface QueryResults {
    organizations: Organizations,
    total: number
}

export function filterOrgsStart(state: types.StoreState,
    action: actions.FilterOrgsStart): types.StoreState {
    const { filter } = action

    return {
        ...state,
        searching: true,
        filter
    }
}


function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.SEARCH_ORGS_START:
            return searchOrgsStart(state, action as actions.SearchOrgsStart)
        case ActionFlag.SEARCH_ORGS_SUCCESS:
            return searchOrgsSuccess(state, action as actions.SearchOrgsSuccess)
        case ActionFlag.SEARCH_ORGS_ERROR:
            return searchOrgsError(state, action as actions.SearchOrgsError)
        // case ActionFlag.SORT_ORGS_STAR:
        //     return sortOrgs(state, action as actions.SortOrgs)
        case ActionFlag.SORT_ORGS_START:
            return sortOrgsStart(state, action as actions.SortOrgsStart)
        case ActionFlag.FILTER_ORGS_START:
            return filterOrgsStart(state, action as actions.FilterOrgsStart)
        default:
            return null
    }
}

export default reducer