import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import {
    StoreState, Organization, EditedOrganization,
    AppError, UIError, BriefOrganization, SortDirection
} from '../../types'
import { Model } from '../../data/model'


// VIEW ORG

export interface ViewOrgStart extends Action {
    type: ActionFlag.VIEW_ORG_FETCH_START
}

export function viewOrgStart() {
    return {
        type: ActionFlag.VIEW_ORG_FETCH_START
    }
}

export interface ViewOrgStop extends Action {
    type: ActionFlag.VIEW_ORG_STOP
}

export function viewOrgStop(): ViewOrgStop {
    return {
        type: ActionFlag.VIEW_ORG_STOP
    }
}

export interface ViewOrgSuccess extends Action {
    type: ActionFlag.VIEW_ORG_FETCH_SUCCESS,
    organization: Organization
}

export function viewOrgSuccess(org: Organization): ViewOrgSuccess {
    return {
        type: ActionFlag.VIEW_ORG_FETCH_SUCCESS,
        organization: org
    }
}

export interface ViewOrgError extends Action {
    type: ActionFlag.VIEW_ORG_FETCH_ERROR,
    error: AppError
}
export function viewOrgError(error: AppError): ViewOrgError {
    return {
        type: ActionFlag.VIEW_ORG_FETCH_ERROR,
        error: error
    }
}

export interface ViewOrgFetch extends Action {
    type: ActionFlag.VIEW_ORG_FETCH,
    id: string
}

export function viewOrgFetch(id: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(viewOrgStart())

        const { auth: { authorization: { token } },
            app: { config } } = getState()
        const model = new Model({
            token,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        return model.getOrg(id)
            .then((org) => {
                dispatch(viewOrgSuccess(org))
            })
            .catch((err) => {
                dispatch(viewOrgError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}



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
