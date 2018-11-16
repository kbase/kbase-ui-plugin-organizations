import { ActionFlag } from './index'
import { Organization, GroupRequest, UIError, StoreState, UIErrorType, AppError } from '../../types'
import { Model } from '../../data/model'
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

// Action types


// Start up requests manager

export interface ManageGroupRequests extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS
}

export interface ManageGroupRequestsStart extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_START
}

export interface ManageGroupRequestsSuccess extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_SUCCESS,
    organization: Organization,
    requests: Array<GroupRequest>
}

export interface ManageGroupRequestsError extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ERROR,
    error: AppError
}

// Accept join requests

export interface ManageGroupRequestsAcceptJoinRequest extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST,
    requestId: string
}

export interface ManageGroupRequestsAcceptJoinRequestStart extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_START,
    requestId: string
}

export interface ManageGroupRequestsAcceptJoinRequestSuccess extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_SUCCESS,
    request: GroupRequest
}

export interface ManageGroupRequestsAcceptJoinRequestError extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_ERROR,
    error: AppError
}


export function manageGroupRequestsAcceptJoinRequestStart(requestId: string): ManageGroupRequestsAcceptJoinRequestStart {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_START,
        requestId: requestId
    }
}

export function manageGroupRequestsAcceptJoinRequestSuccess(request: GroupRequest): ManageGroupRequestsAcceptJoinRequestSuccess {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_SUCCESS,
        request: request
    }
}

export function manageGroupRequestsAcceptJoinRequestError(error: AppError): ManageGroupRequestsAcceptJoinRequestError {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_ERROR,
        error: error
    }
}

// Deny join requests

export interface ManageGroupRequestsDenyJoinRequest extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST,
    requestId: string
}

export interface ManageGroupRequestsDenyJoinRequestStart extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_START,
    requestId: string
}

export interface ManageGroupRequestsDenyJoinRequestSuccess extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_SUCCESS,
    request: GroupRequest
}

export interface ManageGroupRequestsDenyJoinRequestError extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_ERROR,
    error: AppError
}


export function manageGroupRequestsDenyJoinRequestStart(requestId: string): ManageGroupRequestsDenyJoinRequestStart {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_START,
        requestId: requestId
    }
}

export function manageGroupRequestsDenyJoinRequestSuccess(request: GroupRequest): ManageGroupRequestsDenyJoinRequestSuccess {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_SUCCESS,
        request: request
    }
}

export function manageGroupRequestsDenyJoinRequestError(error: AppError): ManageGroupRequestsDenyJoinRequestError {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_ERROR,
        error: error
    }
}



// Action generators



export function manageGroupRequestsStart(): ManageGroupRequestsStart {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_START
    }
}

export function manageGroupRequestsSuccess(organization: Organization, requests: Array<GroupRequest>): ManageGroupRequestsSuccess {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_SUCCESS,
        organization: organization,
        requests: requests
    }
}

export function manageGroupRequestsError(error: AppError): ManageGroupRequestsError {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ERROR,
        error: error
    }
}

// Action thunks

export function manageGroupRequests(groupId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const { auth: { authorization: { token, username } },
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        // get requests 
        Promise.all([
            model.getOrg(groupId),
            model.getPendingGroupRequests(groupId)
        ])
            .then(([organization, requests]) => {
                console.log('got requests?', requests)
                dispatch(manageGroupRequestsSuccess(organization, requests))
            })
            .catch((err) => {
                dispatch(manageGroupRequestsError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

export function manageGroupRequestsAcceptJoinRequest(requestId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const {
            auth: { authorization: { token, username } },
            manageGroupRequestsView,
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        if (!manageGroupRequestsView) {
            return
        }

        Promise.all([
            model.acceptRequest(requestId),
        ])
            .then(([request]) => {
                dispatch(manageGroupRequestsAcceptJoinRequestSuccess(request))
                if (manageGroupRequestsView.view) {
                    dispatch(manageGroupRequests(manageGroupRequestsView.view.organization.id))
                }
            })
            .catch((err) => {
                dispatch(manageGroupRequestsAcceptJoinRequestError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

export function manageGroupRequestsDenyJoinRequest(requestId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const {
            auth: { authorization: { token, username } },
            manageGroupRequestsView,
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        if (!manageGroupRequestsView) {
            return
        }

        Promise.all([
            model.denyRequest(requestId),
        ])
            .then(([request]) => {
                dispatch(manageGroupRequestsDenyJoinRequestSuccess(request))
                if (manageGroupRequestsView.view) {
                    dispatch(manageGroupRequests(manageGroupRequestsView.view.organization.id))
                }
            })
            .catch((err) => {
                dispatch(manageGroupRequestsDenyJoinRequestError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}