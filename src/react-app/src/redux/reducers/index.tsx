import {Action} from 'redux'
import {SortOrgs, SearchOrgs, AddOrg, UpdateOrg} from '../actions';
import {StoreState} from '../../types';
import {ActionFlag} from '../actions';
import {Organizations, Organization} from '../../types';

export function filterOrgs(orgs: Organizations, searchTerms: Array<string>) {
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
    const {organizations, totalCount, filteredCount} = filterOrgs(state.rawOrganizations, action.searchTerms);
    return {...state, organizations: organizations, totalCount: totalCount, filteredCount: filteredCount}
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

export function sortOrgs(state: StoreState, action: SortOrgs): StoreState {
    const {organizations} = state
    const {sortBy, sortDescending} = action
    const direction = sortDescending ? -1 : 1
    let sorted;
    switch (sortBy) {
    case 'createdAt':
        sorted = organizations.slice().sort((a, b) => {
            return direction * (a.createdAt.getTime() - b.createdAt.getTime())
        })
        break
    case 'modifiedAt':
        sorted = organizations.slice().sort((a, b) => {
            return direction * (a.modifiedAt.getTime() - b.modifiedAt.getTime())
        })
        break
    case 'name':
        sorted = organizations.slice().sort((a, b) => {
            return direction * a.name.localeCompare(b.name)
        })
        break
    case 'owner':
        sorted = organizations.slice().sort((a, b) => {
            return direction * a.owner.localeCompare(b.owner)
        })
        break;
    default:
        console.warn('unimplemented sort field: ' + action.sortBy)
        return state;
    }
    return {...state, organizations:sorted, sortBy, sortDescending}
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
    default:
        return state
    }
}

export default theReducer;