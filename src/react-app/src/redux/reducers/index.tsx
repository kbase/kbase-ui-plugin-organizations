import {Action} from 'redux'
import {SortOrgs, SearchOrgs, AddOrg, UpdateOrg, FilterOrgs} from '../actions';
import {StoreState} from '../../types';
import {ActionFlag} from '../actions';
import {Organizations, Organization} from '../../types';


export function applyOrgSearch(orgs: Organizations, searchTerms: Array<string>) {
    const filteredOrgs = orgs.filter((org) => {
        if (searchTerms.length === 0) {
            return true;
        }
        return searchTerms.every((term) => {
            // todo : make more efficient!!!
            return  (new RegExp(term, 'i').test(org.name));
        })
    })

    return {
        organizations: filteredOrgs,
        totalCount: orgs.length,
        filteredCount: filteredOrgs.length
    }
}

export function searchOrgs(state: StoreState, action: SearchOrgs): StoreState {

    const query: Query = {
        searchTerms: action.searchTerms,
        filter: state.filter,
        sortBy: state.sortBy,
        sortDescending: state.sortDescending,
        username: state.auth.username
    }
    const result = queryOrgs(state.rawOrganizations, query)

    return {...state, 
            organizations: result.organizations, 
            totalCount: result.total, 
            filteredCount: result.organizations.length,
            searchTerms: action.searchTerms}
}

export function newOrg(state: StoreState, action: AddOrg): StoreState {
    const {organizations, auth:{username}} = state;
    const org: Organization = {
        ...action.newOrg,
        createdAt: new Date(),
        modifiedAt: new Date(),
        owner: username
    }
    organizations.push(org)
    return {...state, organizations}
}

export function updateOrg(state: StoreState, action: UpdateOrg): StoreState {
    const {organizations} = state;
    // TODO: probably should have org update without id, pass id separately.
    const orgId = action.orgUpdate.id;
    const org = organizations.filter((org) => (org.id === orgId))[0];
    // TODO: yes, crude just for now.
    org.name = action.orgUpdate.name;
    org.description = action.orgUpdate.description;
    return state;
}

function applySort(organizations: Organizations, sortBy:string, sortDescending: boolean) {
    const direction = sortDescending ? -1 : 1
    switch (sortBy) {
    case 'createdAt':
        return  organizations.slice().sort((a, b) => {
            return direction * (a.createdAt.getTime() - b.createdAt.getTime())
        })
    case 'modifiedAt':
        return organizations.slice().sort((a, b) => {
            return direction * (a.modifiedAt.getTime() - b.modifiedAt.getTime())
        })
    case 'name':
        return organizations.slice().sort((a, b) => {
            return direction * a.name.localeCompare(b.name)
        })
    case 'owner':
        return organizations.slice().sort((a, b) => {
            return direction * a.owner.localeCompare(b.owner)
        })
    default:
        console.warn('unimplemented sort field: ' + sortBy)
        return organizations;
    }
}


export function sortOrgs(state: StoreState, action: SortOrgs): StoreState {
    const query: Query = {
        searchTerms: state.searchTerms,
        filter: state.filter,
        sortBy: action.sortBy,
        sortDescending: action.sortDescending,
        username: state.auth.username
    }
    const result = queryOrgs(state.rawOrganizations, query)

    return {...state, 
            organizations: result.organizations, 
            totalCount: result.total, 
            filteredCount: result.organizations.length,
            sortBy: action.sortBy,
            sortDescending: action.sortDescending}
}


interface Query {
    searchTerms: Array<string>,
    username: string,
    sortBy: string,
    sortDescending: boolean,
    filter: string
}

interface QueryResults {
    organizations: Organizations,
    total: number
}


function applyFilter(organizations: Organizations, filter: string, username: string): Organizations {
    switch (filter) {
    case 'all':
        return organizations
        break
    case 'owned':
        return organizations.filter((org) => (org.owner === username))
    case 'notOwned':
        return organizations.filter((org) => (org.owner !== username))
    default:
        console.warn('unknown filter : ' + filter)
        return organizations
    }
}

function queryOrgs(orgs: Organizations, query: Query) : QueryResults {
    const filtered = applyFilter(orgs, query.filter, query.username)

    const searched = applyOrgSearch(filtered, query.searchTerms)

    const sorted = applySort(searched.organizations, query.sortBy, query.sortDescending)

    return {
        organizations: sorted,
        total: orgs.length
    }
}

export function filterOrgs(state: StoreState, 
                           action: FilterOrgs): StoreState {
    const {rawOrganizations, auth: {username}} = state
    const {filter} = action

    const query: Query = {
        searchTerms: state.searchTerms,
        filter: filter,
        sortBy: state.sortBy,
        sortDescending: state.sortDescending,
        username: state.auth.username
    }
    const result = queryOrgs(rawOrganizations, query)

    return {...state, 
            organizations: result.organizations, 
            totalCount: result.total, 
            filteredCount: result.organizations.length,
            filter}
}

export function theReducer(state: StoreState, action: Action): StoreState {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.
    
    switch (action.type) {
    case ActionFlag.ADD_ORG:
        return newOrg(state, action as AddOrg)
    case ActionFlag.UPDATE_ORG:
        return updateOrg(state, action as UpdateOrg)
    case ActionFlag.SEARCH_ORGS:
        return searchOrgs(state, action as SearchOrgs)
    case ActionFlag.SORT_ORGS:
        return sortOrgs(state, action as SortOrgs)
    case ActionFlag.FILTER_ORGS:
        return filterOrgs(state, action as FilterOrgs)
    default:
        return state
    }
}

export default theReducer