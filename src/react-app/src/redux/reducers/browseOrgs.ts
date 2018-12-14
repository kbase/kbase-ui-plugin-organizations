import { Action } from 'redux'
import * as actions from '../actions/browseOrgs'
import * as types from '../../types'
import { ActionFlag } from '../actions'
import * as orgModel from '../../data/models/organization/model'

export function applyOrgSearch(orgs: Array<orgModel.Organization>, searchTerms: Array<string>) {
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
export function searchOrgs(state: types.StoreState, action: actions.SearchOrgs): types.StoreState {
    if (state.views.browseOrgsView === null || state.views.browseOrgsView.viewModel === null) {
        console.warn('Cannot start browseOrgs view')
        return state
    }

    const { views: { browseOrgsView: { viewModel: { filter, sortBy, sortDirection } } } } = state

    // const query: Query = {
    //     searchTerms: action.searchTerms,
    //     filter: filter,
    //     sortBy: sortBy,
    //     sortDirection: sortDirection,
    //     username: state.auth.authorization.username
    // }
    // const result = queryOrgs(state.rawOrganizations, query)
    // rawOrganizations: Array<Organization>
    // organizations: Array<Organization>
    // totalCount: number
    // filteredCount: number
    // sortBy: string
    // sortDirection: SortDirection
    // filter: string
    // searchTerms: Array<string>
    // selectedOrganizationId: string | null
    return {
        ...state,
        // organizations: result.organizations, 
        // totalCount: result.total, 
        // filteredCount: result.organizations.length,
        views: {
            ...state.views,
            browseOrgsView: {
                ...state.views.browseOrgsView,
                error: null,
                viewModel: {
                    ...state.views.browseOrgsView.viewModel,
                    selectedOrganizationId: null,
                    searchTerms: action.searchTerms,
                    searching: true
                }
            }
        }
    }
}

export function searchOrgsStart(state: types.StoreState, action: actions.SearchOrgsStart): types.StoreState {
    if (state.views.browseOrgsView === null || state.views.browseOrgsView.viewModel === null) {
        console.warn('Cannot start browseOrgs view')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            browseOrgsView: {
                ...state.views.browseOrgsView,
                viewModel: {
                    ...state.views.browseOrgsView.viewModel,
                    searching: true
                }
            }
        }
    }
}

export function searchOrgsSuccess(state: types.StoreState, action: actions.SearchOrgsSuccess): types.StoreState {
    if (state.views.browseOrgsView === null || state.views.browseOrgsView.viewModel === null) {
        console.warn('Cannot start browseOrgs view')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            browseOrgsView: {
                ...state.views.browseOrgsView,
                viewModel: {
                    ...state.views.browseOrgsView.viewModel,
                    organizations: action.organizations,
                    totalCount: action.totalCount,
                    filteredCount: action.organizations.length,
                    searching: false
                }
            }
        }
    }
}

// TODO: hmm, uses the global error -- this was early in the development of this (a whole two weeks ago!)
// and this should now go in the "browseOrgs" (or better named "searchOrgs") branch.
export function searchOrgsError(state: types.StoreState, action: actions.SearchOrgsError): types.StoreState {
    if (state.views.browseOrgsView === null || state.views.browseOrgsView.viewModel === null) {
        console.warn('Cannot start browseOrgs view')
        return state
    }

    return {
        ...state,
        views: {
            ...state.views,
            browseOrgsView: {
                ...state.views.browseOrgsView,
                viewModel: {
                    ...state.views.browseOrgsView.viewModel,
                    searching: false,
                    error: action.error
                }
            }
        }
    }

    // if (state.browseOrgs.view) {
    //     return {
    //         ...state,
    //         browseOrgs: {
    //             ...state.browseOrgs,
    //             error: action.error,
    //             state: types.BrowseOrgsState.ERROR,
    //             view: {
    //                 ...state.browseOrgs.view,
    //                 searching: false
    //             }
    //         }
    //     }
    // } else {
    //     return {
    //         ...state,
    //         browseOrgs: {
    //             ...state.browseOrgs,
    //             error: action.error
    //         }
    //     }
    // }
}


export function sortOrgsStart(state: types.StoreState, action: actions.SortOrgsStart): types.StoreState {
    if (state.views.browseOrgsView === null || state.views.browseOrgsView.viewModel === null) {
        console.warn('Cannot start browseOrgs view')
        return state
    }
    const {
        views: { browseOrgsView: { viewModel: { searchTerms, filter } } },
        auth: { authorization: { username } }
    } = state

    // const query: Query = {
    //     searchTerms: searchTerms,
    //     filter: filter,
    //     sortBy: action.sortBy,
    //     sortDirection: action.sortDirection,
    //     username: username
    // }

    return {
        ...state,
        views: {
            ...state.views,
            browseOrgsView: {
                ...state.views.browseOrgsView,
                viewModel: {
                    ...state.views.browseOrgsView.viewModel,
                    sortBy: action.sortBy,
                    sortDirection: action.sortDirection,
                    searching: true
                }
            }
        }
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
    organizations: Array<orgModel.Organization>,
    total: number
}

function filterOrgsStart(state: types.StoreState, action: actions.FilterOrgsStart): types.StoreState {
    if (state.views.browseOrgsView === null || state.views.browseOrgsView.viewModel === null) {
        console.warn('Cannot start browseOrgs view')
        return state
    }

    const { filter } = action

    return {
        ...state,
        views: {
            ...state.views,
            browseOrgsView: {
                ...state.views.browseOrgsView,
                viewModel: {
                    ...state.views.browseOrgsView.viewModel,
                    filter,
                    searching: true
                }
            }
        }
    }
}

function loadSuccess(state: types.StoreState, action: actions.LoadSuccess): types.StoreState {
    const { defaultViewModel: {
        rawOrganizations, organizations, searchTerms, sortBy, sortDirection, filter,
        totalCount, filteredCount, selectedOrganizationId, error, searching
    } } = action

    return {
        ...state,
        views: {
            ...state.views,
            browseOrgsView: {
                loadingState: types.ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    rawOrganizations, organizations, searchTerms, sortBy, sortDirection, filter,
                    totalCount, filteredCount, selectedOrganizationId, error, searching
                }
            }
        }
    }
}

function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.BROWSE_ORGS_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.BROWSE_ORGS_SEARCH:
            return searchOrgs(state, action as actions.SearchOrgs)
        case ActionFlag.BROWSE_ORGS_SEARCH_START:
            return searchOrgsStart(state, action as actions.SearchOrgsStart)
        case ActionFlag.BROWSE_ORGS_SEARCH_SUCCESS:
            return searchOrgsSuccess(state, action as actions.SearchOrgsSuccess)
        case ActionFlag.BROWSE_ORGS_SEARCH_ERROR:
            return searchOrgsError(state, action as actions.SearchOrgsError)
        // case ActionFlag.SORT_ORGS_STAR:
        //     return sortOrgs(state, action as actions.SortOrgs)
        case ActionFlag.BROWSE_ORGS_SORT_START:
            return sortOrgsStart(state, action as actions.SortOrgsStart)
        case ActionFlag.BROWSE_ORGS_FILTER_START:
            return filterOrgsStart(state, action as actions.FilterOrgsStart)
        default:
            return null
    }
}

export default reducer