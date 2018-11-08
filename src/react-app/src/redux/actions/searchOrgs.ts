import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import {
    StoreState, Organization, EditedOrganization,
    AppError, UIError, BriefOrganization, SortDirection
} from '../../types'
import { Model } from '../../data/model'
import { viewOrgStop } from './viewOrg'


export interface SortOrgs extends Action<ActionFlag.SORT_ORGS> {
    type: ActionFlag.SORT_ORGS,
    sortBy: string,
    sortDirection: SortDirection
}

export interface SortOrgsStart extends Action<ActionFlag.SORT_ORGS_START> {
    type: ActionFlag.SORT_ORGS_START,
    sortBy: string,
    sortDirection: SortDirection
}

export function sortOrgsStart(sortBy: string, sortDirection: SortDirection): SortOrgsStart {
    return {
        type: ActionFlag.SORT_ORGS_START,
        sortBy: sortBy,
        sortDirection: sortDirection
    }
}

// SEARCH (FETCH) ORGS



// Called upon the start of a search call
// Sets the ui state to enable a spinner
// and also search query data to be reflected in the ui
export interface SearchOrgsStart extends Action<ActionFlag.SEARCH_ORGS_START> {
    type: ActionFlag.SEARCH_ORGS_START,
    searchTerms: Array<string>
}

export function searchOrgsStart(searchTerms: Array<string>): SearchOrgsStart {
    return {
        type: ActionFlag.SEARCH_ORGS_START,
        searchTerms: searchTerms
    }
}

// Called upon successful completion of a search
// Sets the organizations found
export interface SearchOrgsSuccess extends Action<ActionFlag.SEARCH_ORGS_SUCCESS> {
    type: ActionFlag.SEARCH_ORGS_SUCCESS,
    organizations: Array<BriefOrganization>,
    totalCount: number
}

export function searchOrgsSuccess(organizations: Array<BriefOrganization>, totalCount: number): SearchOrgsSuccess {
    return {
        type: ActionFlag.SEARCH_ORGS_SUCCESS,
        organizations: organizations,
        totalCount: totalCount
    }
}

// Called upon a search error
// Sets error state
export interface SearchOrgsError extends Action<ActionFlag.SEARCH_ORGS_ERROR> {
    type: ActionFlag.SEARCH_ORGS_ERROR,
    error: AppError
}

export function searchOrgsError(error: AppError): SearchOrgsError {
    return {
        type: ActionFlag.SEARCH_ORGS_ERROR,
        error: error
    }
}


export interface SearchOrgs extends Action<ActionFlag.SEARCH_ORGS> {
    type: ActionFlag.SEARCH_ORGS,
    searchTerms: Array<string>
}

// TODO: proper typing here 
export function searchOrgs(searchTerms: Array<string>) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(searchOrgsStart(searchTerms))
        dispatch(viewOrgStop())

        const { sortBy, sortDirection, filter,
            auth: { authorization: { token, username } },
            app: { config } } = getState()
        const model = new Model({
            token,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        return model.queryOrgs({
            searchTerms: searchTerms,
            sortBy, sortDirection, filter, username
        })
            .then(({ organizations, total }) => {
                // TODO: also total.
                dispatch(searchOrgsSuccess(organizations, total))
            })
            .catch((error) => {
                dispatch(searchOrgsError({
                    code: error.name,
                    message: error.message
                }))
            })
    }
}

export function sortOrgs(sortBy: string, sortDirection: SortDirection) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(sortOrgsStart(sortBy, sortDirection))

        const { searchTerms, filter,
            auth: { authorization: { token, username } },
            app: { config } } = getState()
        const model = new Model({
            token,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        return model.queryOrgs({
            searchTerms,
            sortBy, sortDirection, filter, username
        })
            .then(({ organizations, total }) => {
                // TODO: also total.
                dispatch(searchOrgsSuccess(organizations, total))
            })
            .catch((error) => {
                dispatch(searchOrgsError({
                    code: error.name,
                    message: error.message
                }))
            })
    }
}

export function filterOrgs(filter: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(filterOrgsStart(filter))

        const { searchTerms, sortBy, sortDirection,
            auth: { authorization: { token, username } },
            app: { config } } = getState()
        const model = new Model({
            token,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        return model.queryOrgs({
            searchTerms,
            sortBy, sortDirection, filter, username
        })
            .then(({ organizations, total }) => {
                // TODO: also total.
                dispatch(searchOrgsSuccess(organizations, total))
            })
            .catch((error) => {
                dispatch(searchOrgsError({
                    code: error.name,
                    message: error.message
                }))
            })
    }
}




// Filter orgs
export interface FilterOrgs extends Action<ActionFlag.FILTER_ORGS> {
    type: ActionFlag.FILTER_ORGS,
    filter: string
}

export interface FilterOrgsStart extends Action<ActionFlag.FILTER_ORGS_START> {
    type: ActionFlag.FILTER_ORGS_START,
    filter: string
}

export function filterOrgsStart(filter: string): FilterOrgsStart {
    return {
        type: ActionFlag.FILTER_ORGS_START,
        filter: filter
    }
}

