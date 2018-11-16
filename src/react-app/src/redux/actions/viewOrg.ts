import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import {
    StoreState, Organization,
    AppError, SortDirection, UIError, UIErrorType
} from '../../types'
import { Model } from '../../data/model'


// Action Types

export interface ViewOrgStart extends Action {
    type: ActionFlag.VIEW_ORG_FETCH_START
}

export interface ViewOrgStop extends Action {
    type: ActionFlag.VIEW_ORG_STOP
}

export interface ViewOrgSuccess extends Action {
    type: ActionFlag.VIEW_ORG_FETCH_SUCCESS,
    organization: Organization
}

export interface ViewOrgError extends Action {
    type: ActionFlag.VIEW_ORG_FETCH_ERROR,
    error: AppError
}

export interface ViewOrgFetch extends Action {
    type: ActionFlag.VIEW_ORG_FETCH,
    id: string
}

// Join Requests

export interface ViewOrgJoinRequest extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST,
    requestId: string
}

export interface ViewOrgJoinRequestStart extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST_START
}

export interface ViewOrgJoinRequestSuccess extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST_SUCCESS
}

export interface ViewOrgJoinRequestError extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST_ERROR,
    error: UIError
}

// Join Request cancellation

export interface ViewOrgCancelJoinRequest extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST
}

export interface ViewOrgCancelJoinRequestStart extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_START
}

export interface ViewOrgCancelJoinRequestSuccess extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_SUCCESS
}

export interface ViewOrgCancelJoinRequestError extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_ERROR,
    error: UIError
}


// Generators

export function viewOrgStart() {
    return {
        type: ActionFlag.VIEW_ORG_FETCH_START
    }
}

export function viewOrgStop(): ViewOrgStop {
    return {
        type: ActionFlag.VIEW_ORG_STOP
    }
}

export function viewOrgSuccess(org: Organization): ViewOrgSuccess {
    return {
        type: ActionFlag.VIEW_ORG_FETCH_SUCCESS,
        organization: org
    }
}


export function viewOrgError(error: AppError): ViewOrgError {
    return {
        type: ActionFlag.VIEW_ORG_FETCH_ERROR,
        error: error
    }
}

// Join requests

export function viewOrgJoinRequestStart(): ViewOrgJoinRequestStart {
    return {
        type: ActionFlag.VIEW_ORG_JOIN_REQUEST_START
    }
}

export function viewOrgJoinRequestSuccess(): ViewOrgJoinRequestSuccess {
    return {
        type: ActionFlag.VIEW_ORG_JOIN_REQUEST_SUCCESS
    }
}

export function viewOrgJoinRequestError(error: UIError): ViewOrgJoinRequestError {
    return {
        type: ActionFlag.VIEW_ORG_JOIN_REQUEST_ERROR,
        error: error
    }
}

// Join Request Cancellation

export function viewOrgCancelJoinRequestStart(): ViewOrgCancelJoinRequestStart {
    return {
        type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_START
    }
}

export function viewOrgCancelJoinRequestSuccess(): ViewOrgCancelJoinRequestSuccess {
    return {
        type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_SUCCESS
    }
}

export function viewOrgCancelJoinRequestError(error: UIError): ViewOrgCancelJoinRequestError {
    return {
        type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_ERROR,
        error: error
    }
}

// Thunks

export function viewOrgFetch(id: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(viewOrgStart())

        const { auth: { authorization: { token, username } },
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        model.getOrg(id)
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

export function viewOrgJoinRequest() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        //TODO: could do a start here...

        const { auth: { authorization: { token, username } },
            app: { config },
            viewOrg: { organization } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        if (typeof organization === 'undefined') {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: 'Org not currently defined'
            }))
            return
        }

        model.requestMembershipToGroup(organization.id)
            .then(() => {
                dispatch(viewOrgJoinRequestSuccess())
                // quick 'n easy
                dispatch(viewOrgFetch((organization.id)))
            })
            .catch((err) => {
                dispatch(viewOrgJoinRequestError({
                    type: UIErrorType.ERROR,
                    message: err.message
                }))
            })
    }
}

export function viewOrgCancelJoinRequest(requestId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(viewOrgJoinRequestStart())

        const { auth: { authorization: { token, username } },
            app: { config },
            viewOrg: { organization } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })
        if (typeof organization === 'undefined') {
            dispatch(viewOrgCancelJoinRequestError({
                type: UIErrorType.ERROR,
                message: 'Org not currently defined'
            }))
            return
        }

        model.cancelRequest(requestId)
            .then((newRequest) => {
                dispatch(viewOrgCancelJoinRequestSuccess())
                // quick 'n easy
                dispatch(viewOrgFetch(newRequest.groupId))
            })
            .catch((err) => {
                dispatch(viewOrgCancelJoinRequestError({
                    type: UIErrorType.ERROR,
                    message: err.message
                }))
            })

    }
}
