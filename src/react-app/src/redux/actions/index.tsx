import {Action} from 'redux'
import * as types from '../../types';

export enum ActionFlag {
    SORT_ORGS = 1,
    SEARCH_ORGS,
    ADD_ORG,
    UPDATE_ORG,
    FILTER_ORGS
}

export interface SortOrgs  extends Action<ActionFlag.SORT_ORGS> {
    type: ActionFlag.SORT_ORGS,
    sortBy: string,
    sortDescending: boolean
}

export function sortOrgs(sortBy: string, sortDescending: boolean) : SortOrgs {
    return {
        type: ActionFlag.SORT_ORGS,
        sortBy: sortBy,
        sortDescending: sortDescending
    }
}



export interface SearchOrgs  extends Action<ActionFlag.SEARCH_ORGS> {
    type: ActionFlag.SEARCH_ORGS,
    searchTerms: Array<string>
}

export function searchOrgs(searchTerms: Array<string>) : SearchOrgs {
    return {
        type: ActionFlag.SEARCH_ORGS,
        searchTerms: searchTerms
    }
}

// Filter orgs
export interface FilterOrgs extends Action<ActionFlag.FILTER_ORGS> {
    type: ActionFlag.FILTER_ORGS,
    filter: string
}

export function filterOrgs(filter: string) : FilterOrgs {
    return {
        type: ActionFlag.FILTER_ORGS,
        filter: filter
    }
}


// Add a new org

export interface AddOrg extends Action {
    type: ActionFlag.ADD_ORG,
    newOrg: types.NewOrganization
}

export function addOrg(newOrg: types.NewOrganization) : AddOrg {
    return {
        type: ActionFlag.ADD_ORG,
        newOrg: newOrg
    }
}

// Update an org

export interface UpdateOrg  extends Action {
    type: ActionFlag.UPDATE_ORG,
    orgUpdate: types.OrganizationUpdate
}

export function updateOrg(orgUpdate: types.OrganizationUpdate) : UpdateOrg {
    return {
        type: ActionFlag.UPDATE_ORG,
        orgUpdate: orgUpdate
    }
}