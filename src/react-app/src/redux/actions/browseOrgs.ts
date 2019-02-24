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
    sortField: string,
    sortDirection: SortDirection
}

export interface SortOrgsStart extends Action<ActionFlag.BROWSE_ORGS_SORT_START> {
    type: ActionFlag.BROWSE_ORGS_SORT_START,
    sortField: string,
    sortDirection: SortDirection
}

export interface SortOrgsSuccess extends Action<ActionFlag.BROWSE_ORGS_SORT_SUCCESS> {
    type: ActionFlag.BROWSE_ORGS_SORT_SUCCESS
}

export interface SortOrgsError extends Action<ActionFlag.BROWSE_ORGS_SORT_ERROR> {
    type: ActionFlag.BROWSE_ORGS_SORT_ERROR,
    error: AppError
}


export function sortOrgsStart(sortField: string, sortDirection: SortDirection): SortOrgsStart {
    return {
        type: ActionFlag.BROWSE_ORGS_SORT_START,
        sortField: sortField,
        sortDirection: sortDirection
    }
}

// SEARCHING

// Called upon the start of a search call
// Sets the ui state to enable a spinner
// and also search query data to be reflected in the ui
export interface SearchOrgs extends Action<ActionFlag.BROWSE_ORGS_SEARCH> {
    type: ActionFlag.BROWSE_ORGS_SEARCH,
    searchTerms: Array<string>
}

export interface SearchOrgsStart extends Action<ActionFlag.BROWSE_ORGS_SEARCH_START> {
    type: ActionFlag.BROWSE_ORGS_SEARCH_START,
    searchTerms: Array<string>
}

// Called upon successful completion of a search
// Sets the organizations found
export interface SearchOrgsSuccess extends Action<ActionFlag.BROWSE_ORGS_SEARCH_SUCCESS> {
    type: ActionFlag.BROWSE_ORGS_SEARCH_SUCCESS
    organizations: Array<orgModel.BriefOrganization>
    totalCount: number
    openRequests: Map<orgModel.OrganizationID, orgModel.RequestStatus>
}

// Called upon a search error
// Sets error state
export interface SearchOrgsError extends Action<ActionFlag.BROWSE_ORGS_SEARCH_ERROR> {
    type: ActionFlag.BROWSE_ORGS_SEARCH_ERROR
    error: AppError
}


// searchTerms: Array<string>
function searchOrgsStart(searchTerms: Array<string>): SearchOrgsStart {
    return {
        type: ActionFlag.BROWSE_ORGS_SEARCH_START,
        searchTerms
    }
}

function searchOrgsSuccess(organizations: Array<orgModel.BriefOrganization>, totalCount: number, openRequests: Map<orgModel.OrganizationID, orgModel.RequestStatus>): SearchOrgsSuccess {
    return {
        type: ActionFlag.BROWSE_ORGS_SEARCH_SUCCESS,
        organizations: organizations,
        totalCount: totalCount,
        openRequests: openRequests
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
    filter: orgModel.Filter
}


export function filterOrgsStart(filter: orgModel.Filter): FilterOrgsStart {
    return {
        type: ActionFlag.BROWSE_ORGS_FILTER_START,
        filter: filter
    }
}

export function load() {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        })

        const defaultSearchTerms: Array<string> = []
        // TODO: the sort field and direction are still set directly at this level;
        // in the ui narrativeCount is a single sortBy field, with the direction
        // fixed in the model's applySortComparison
        const defaultSortField = 'narrativeCount'
        const defaultSortDirection = SortDirection.DESCENDING
        const defaultFilter = { roleType: 'myorgs', roles: [], privacy: 'any' }

        try {
            const { organizations, total } = await orgClient.queryOrgs({
                searchTerms: defaultSearchTerms,
                sortField: defaultSortField,
                sortDirection: defaultSortDirection,
                filter: defaultFilter,
                username
            })

            const adminOrgs = organizations
                .filter((org) => {
                    return (
                        org.relation === orgModel.UserRelationToOrganization.ADMIN ||
                        org.relation === orgModel.UserRelationToOrganization.OWNER
                    )
                })
                .map((org) => {
                    return org.id
                })
            let openRequests
            if (adminOrgs.length > 0) {
                openRequests = await orgClient.getOpenRequestsStatus({ organizationIds: adminOrgs })
            } else {
                openRequests = new Map()
            }

            // dispatch(searchOrgsSuccess(organizations, total, openRequests))
            // populate default browse orgs props
            const defaultViewModel: BrowseOrgsViewModel = {
                rawOrganizations: organizations,
                organizations: organizations,
                openRequests: openRequests,
                totalCount: total,
                filteredCount: organizations.length,
                sortField: defaultSortField,
                sortDirection: defaultSortDirection,
                filter: defaultFilter,
                searchTerms: defaultSearchTerms,
                selectedOrganizationId: null,
                searching: false,
                error: null
            }
            // done!
            dispatch(loadSuccess(defaultViewModel))
        } catch (ex) {
            console.error('Error querying orgs', ex.name, ex.message)
            dispatch(searchOrgsError({
                code: ex.name,
                message: ex.message
            }))
        }

    }
}

// TODO: proper typing here 
export function searchOrgs(searchTerms: Array<string>) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(searchOrgsStart(searchTerms))

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

        const { viewModel: { sortField, sortDirection, filter } } = browseOrgsView
        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        })

        try {
            const { organizations, total } = await orgClient.queryOrgs({
                searchTerms: searchTerms,
                sortField, sortDirection, filter, username
            })

            // LEFT OFF HERE
            // NOW GET THE PENDING REQUESTS...
            const adminOrgs = organizations
                .filter((org) => {
                    return (
                        org.relation === orgModel.UserRelationToOrganization.ADMIN ||
                        org.relation === orgModel.UserRelationToOrganization.OWNER
                    )
                })
                .map((org) => {
                    return org.id
                })
            let openRequests
            if (adminOrgs.length > 0) {
                openRequests = await orgClient.getOpenRequestsStatus({ organizationIds: adminOrgs })
            } else {
                openRequests = new Map()
            }

            dispatch(searchOrgsSuccess(organizations, total, openRequests))
        } catch (ex) {
            console.error('Error querying orgs', ex.name, ex.message)
            dispatch(searchOrgsError({
                code: ex.name,
                message: ex.message
            }))
        }
    }
}

export function sortOrgs(sortField: string, sortDirection: SortDirection) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(sortOrgsStart(sortField, sortDirection))

        const {
            views: { browseOrgsView },
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        })

        if (browseOrgsView.viewModel === null) {
            dispatch(searchOrgsError({
                code: 'invalid-state',
                message: 'Search orgs may not be called without a defined view'
            }))
            return
        }

        const { viewModel: { searchTerms, filter } } = browseOrgsView

        try {
            const { organizations, total } = await orgClient.queryOrgs({
                searchTerms, filter, username,
                sortField, sortDirection,
            })

            // LEFT OFF HERE
            // NOW GET THE PENDING REQUESTS...
            const adminOrgs = organizations
                .filter((org) => {
                    return (
                        org.relation === orgModel.UserRelationToOrganization.ADMIN ||
                        org.relation === orgModel.UserRelationToOrganization.OWNER
                    )
                })
                .map((org) => {
                    return org.id
                })
            let openRequests
            if (adminOrgs.length > 0) {
                openRequests = await orgClient.getOpenRequestsStatus({ organizationIds: adminOrgs })
            } else {
                openRequests = new Map()
            }

            dispatch(searchOrgsSuccess(organizations, total, openRequests))
        } catch (ex) {
            console.error('Error querying orgs', ex.name, ex.message)
            dispatch(searchOrgsError({
                code: ex.name,
                message: ex.message
            }))
        }
    }
}

export function filterOrgs(filter: orgModel.Filter) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(filterOrgsStart(filter))

        const {
            views: { browseOrgsView },
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        })

        if (browseOrgsView.viewModel === null) {
            dispatch(searchOrgsError({
                code: 'invalid-state',
                message: 'Search orgs may not be called without a defined view'
            }))
            return
        }

        const { viewModel: { searchTerms, sortField, sortDirection } } = browseOrgsView

        try {
            const { organizations, total } = await orgClient.queryOrgs({
                searchTerms, filter, username,
                sortField, sortDirection,
            })

            // LEFT OFF HERE
            // NOW GET THE PENDING REQUESTS...
            const adminOrgs = organizations
                .filter((org) => {
                    return (
                        org.relation === orgModel.UserRelationToOrganization.ADMIN ||
                        org.relation === orgModel.UserRelationToOrganization.OWNER
                    )
                })
                .map((org) => {
                    return org.id
                })
            let openRequests
            if (adminOrgs.length > 0) {
                openRequests = await orgClient.getOpenRequestsStatus({ organizationIds: adminOrgs })
            } else {
                openRequests = new Map()
            }

            dispatch(searchOrgsSuccess(organizations, total, openRequests))
        } catch (ex) {
            console.error('Error querying orgs', ex.name, ex.message)
            dispatch(searchOrgsError({
                code: ex.name,
                message: ex.message
            }))
        }
    }
}
