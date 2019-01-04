import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import {
    StoreState,
    AppError, SortDirection, BrowseOrgsViewModel
} from '../../types'

import * as orgModel from '../../data/models/organization/model'

export interface Load extends Action<ActionFlag.BROWSE_ORGS_LOAD> {
    type: ActionFlag.BROWSE_ORGS_LOAD
}

export interface LoadStart extends Action<ActionFlag.BROWSE_ORGS_LOAD_START> {
    type: ActionFlag.BROWSE_ORGS_LOAD_START
}

export interface LoadSuccess extends Action<ActionFlag.BROWSE_ORGS_LOAD_SUCCESS> {
    type: ActionFlag.BROWSE_ORGS_LOAD_SUCCESS
    defaultViewModel: BrowseOrgsViewModel
}

export interface LoadError extends Action<ActionFlag.BROWSE_ORGS_LOAD_ERROR> {
    type: ActionFlag.BROWSE_ORGS_LOAD_ERROR
    error: AppError
}

export interface Unload extends Action<ActionFlag.BROWSE_ORGS_UNLOAD> {
    type: ActionFlag.BROWSE_ORGS_UNLOAD
}

function loadStart(): LoadStart {
    return {
        type: ActionFlag.BROWSE_ORGS_LOAD_START
    }
}

function loadSuccess(defaultViewModel: BrowseOrgsViewModel): LoadSuccess {
    return {
        type: ActionFlag.BROWSE_ORGS_LOAD_SUCCESS,
        defaultViewModel: defaultViewModel
    }
}

function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.BROWSE_ORGS_LOAD_ERROR,
        error: error
    }
}

export function unload(): Unload {
    return {
        type: ActionFlag.BROWSE_ORGS_UNLOAD
    }
}

// SORTING

export interface SortOrgs extends Action<ActionFlag.BROWSE_ORGS_SORT> {
    type: ActionFlag.BROWSE_ORGS_SORT,
    sortBy: string,
    sortDirection: SortDirection
}

export interface SortOrgsStart extends Action<ActionFlag.BROWSE_ORGS_SORT_START> {
    type: ActionFlag.BROWSE_ORGS_SORT_START,
    sortBy: string,
    sortDirection: SortDirection
}

export interface SortOrgsSuccess extends Action<ActionFlag.BROWSE_ORGS_SORT_SUCCESS> {
    type: ActionFlag.BROWSE_ORGS_SORT_SUCCESS
}

export interface SortOrgsError extends Action<ActionFlag.BROWSE_ORGS_SORT_ERROR> {
    type: ActionFlag.BROWSE_ORGS_SORT_ERROR,
    error: AppError
}


export function sortOrgsStart(sortBy: string, sortDirection: SortDirection): SortOrgsStart {
    return {
        type: ActionFlag.BROWSE_ORGS_SORT_START,
        sortBy: sortBy,
        sortDirection: sortDirection
    }
}

// SEARCHING

export interface SearchOrgs extends Action<ActionFlag.BROWSE_ORGS_SEARCH> {
    type: ActionFlag.BROWSE_ORGS_SEARCH,
    searchTerms: Array<string>
}

// Called upon the start of a search call
// Sets the ui state to enable a spinner
// and also search query data to be reflected in the ui
export interface SearchOrgs extends Action<ActionFlag.BROWSE_ORGS_SEARCH> {
    type: ActionFlag.BROWSE_ORGS_SEARCH,
    searchTerms: Array<string>
}

export interface SearchOrgsStart extends Action<ActionFlag.BROWSE_ORGS_SEARCH_START> {
    type: ActionFlag.BROWSE_ORGS_SEARCH_START
}

// Called upon successful completion of a search
// Sets the organizations found
export interface SearchOrgsSuccess extends Action<ActionFlag.BROWSE_ORGS_SEARCH_SUCCESS> {
    type: ActionFlag.BROWSE_ORGS_SEARCH_SUCCESS,
    organizations: Array<orgModel.Organization>,
    totalCount: number
}

// Called upon a search error
// Sets error state
export interface SearchOrgsError extends Action<ActionFlag.BROWSE_ORGS_SEARCH_ERROR> {
    type: ActionFlag.BROWSE_ORGS_SEARCH_ERROR,
    error: AppError
}


// searchTerms: Array<string>
function searchOrgsStart(): SearchOrgsStart {
    return {
        type: ActionFlag.BROWSE_ORGS_SEARCH_START
    }
}

function searchOrgsSuccess(organizations: Array<orgModel.Organization>, totalCount: number): SearchOrgsSuccess {
    return {
        type: ActionFlag.BROWSE_ORGS_SEARCH_SUCCESS,
        organizations: organizations,
        totalCount: totalCount
    }
}

function searchOrgsError(error: AppError): SearchOrgsError {
    return {
        type: ActionFlag.BROWSE_ORGS_SEARCH_ERROR,
        error: error
    }
}

// FILTER 

// Filter orgs
export interface FilterOrgs extends Action<ActionFlag.BROWSE_ORGS_FILTER> {
    type: ActionFlag.BROWSE_ORGS_FILTER,
    filter: string
}

export interface FilterOrgsStart extends Action<ActionFlag.BROWSE_ORGS_FILTER_START> {
    type: ActionFlag.BROWSE_ORGS_FILTER_START,
    filter: string
}


export function filterOrgsStart(filter: string): FilterOrgsStart {
    return {
        type: ActionFlag.BROWSE_ORGS_FILTER_START,
        filter: filter
    }
}

export function load() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

        // populate default browse orgs props
        const defaultViewModel: BrowseOrgsViewModel = {
            rawOrganizations: [],
            organizations: [],
            totalCount: 0,
            filteredCount: 0,
            sortBy: 'name',
            sortDirection: SortDirection.ASCENDING,
            filter: 'all',
            searchTerms: [],
            selectedOrganizationId: null,
            searching: false,
            error: null
        }
        // done!
        dispatch(loadSuccess(defaultViewModel))
    }
}

// TODO: proper typing here 
export function searchOrgs(searchTerms: Array<string>) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(searchOrgsStart())

        const {
            views: { browseOrgsView },
            auth: { authorization: { token, username } },
            app: { config }
        } = getState()

        if (browseOrgsView.viewModel === null) {
            dispatch(searchOrgsError({
                code: 'invalid-state',
                message: 'Search orgs may not be called without a defined view'
            }))
            return
        }

        const { viewModel: { sortBy, sortDirection, filter } } = browseOrgsView
        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        return orgClient.queryOrgs({
            searchTerms: searchTerms,
            sortBy, sortDirection, filter, username
        })
            .then(({ organizations, total }) => {
                // TODO: also total.
                dispatch(searchOrgsSuccess(organizations, total))
            })
            .catch((error) => {
                console.error('Error querying orgs', error.name, error.message)
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

        const {
            views: { browseOrgsView },
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        if (browseOrgsView.viewModel === null) {
            dispatch(searchOrgsError({
                code: 'invalid-state',
                message: 'Search orgs may not be called without a defined view'
            }))
            return
        }

        const { viewModel: { searchTerms, filter } } = browseOrgsView

        return orgClient.queryOrgs({
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

        const {
            views: { browseOrgsView },
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        if (browseOrgsView.viewModel === null) {
            dispatch(searchOrgsError({
                code: 'invalid-state',
                message: 'Search orgs may not be called without a defined view'
            }))
            return
        }

        const { viewModel: { searchTerms, sortBy, sortDirection } } = browseOrgsView

        return orgClient.queryOrgs({
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
