import { ActionFlag } from './index'
import { Organization, GroupRequest, StoreState, AppError } from '../../types'
import { Model } from '../../data/model'
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

// Action types


// Start up requests manager

export interface ManageOrganizationRequests extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS
}

export interface ManageOrganizationRequestsStart extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_START
}

export interface ManageOrganizationRequestsSuccess extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_SUCCESS,
    organization: Organization,
    requests: Array<GroupRequest>
}

export interface ManageOrganizationRequestsError extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ERROR,
    error: AppError
}

// Accept join requests

export interface ManageOrganizationRequestsAcceptJoinRequest extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST,
    requestId: string
}

export interface ManageOrganizationRequestsAcceptJoinRequestStart extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_START,
    requestId: string
}

export interface ManageOrganizationRequestsAcceptJoinRequestSuccess extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_SUCCESS,
    request: GroupRequest
}

export interface ManageOrganizationRequestsAcceptJoinRequestError extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_ERROR,
    error: AppError
}


export function manageOrganizationRequestsAcceptJoinRequestStart(requestId: string): ManageOrganizationRequestsAcceptJoinRequestStart {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_START,
        requestId: requestId
    }
}

export function manageOrganizationRequestsAcceptJoinRequestSuccess(request: GroupRequest): ManageOrganizationRequestsAcceptJoinRequestSuccess {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_SUCCESS,
        request: request
    }
}

export function manageOrganizationRequestsAcceptJoinRequestError(error: AppError): ManageOrganizationRequestsAcceptJoinRequestError {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_ERROR,
        error: error
    }
}

// Deny join requests

export interface ManageOrganizationRequestsDenyJoinRequest extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST,
    requestId: string
}

export interface ManageOrganizationRequestsDenyJoinRequestStart extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_START,
    requestId: string
}

export interface ManageOrganizationRequestsDenyJoinRequestSuccess extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_SUCCESS,
    request: GroupRequest
}

export interface ManageOrganizationRequestsDenyJoinRequestError extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_ERROR,
    error: AppError
}


export function manageOrganizationRequestsDenyJoinRequestStart(requestId: string): ManageOrganizationRequestsDenyJoinRequestStart {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_START,
        requestId: requestId
    }
}

export function manageOrganizationRequestsDenyJoinRequestSuccess(request: GroupRequest): ManageOrganizationRequestsDenyJoinRequestSuccess {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_SUCCESS,
        request: request
    }
}

export function manageOrganizationRequestsDenyJoinRequestError(error: AppError): ManageOrganizationRequestsDenyJoinRequestError {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_ERROR,
        error: error
    }
}



// Action generators



export function manageOrganizationRequestsStart(): ManageOrganizationRequestsStart {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_START
    }
}

export function manageOrganizationRequestsSuccess(organization: Organization, requests: Array<GroupRequest>): ManageOrganizationRequestsSuccess {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_SUCCESS,
        organization: organization,
        requests: requests
    }
}

export function manageOrganizationRequestsError(error: AppError): ManageOrganizationRequestsError {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ERROR,
        error: error
    }
}

// Action thunks

export function manageOrganizationRequests(organizationId: string) {
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
            model.getOrg(organizationId),
            model.getPendingOrganizationRequests(organizationId)
        ])
            .then(([organization, requests]) => {
                dispatch(manageOrganizationRequestsSuccess(organization, requests))
            })
            .catch((err) => {
                dispatch(manageOrganizationRequestsError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

export function manageOrganizationRequestsAcceptJoinRequest(requestId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const {
            auth: { authorization: { token, username } },
            manageOrganizationRequestsView,
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        if (!manageOrganizationRequestsView) {
            return
        }

        Promise.all([
            model.acceptRequest(requestId),
        ])
            .then(([request]) => {
                dispatch(manageOrganizationRequestsAcceptJoinRequestSuccess(request))
                if (manageOrganizationRequestsView.viewState) {
                    dispatch(manageOrganizationRequests(manageOrganizationRequestsView.viewState.organization.id))
                }
            })
            .catch((err) => {
                dispatch(manageOrganizationRequestsAcceptJoinRequestError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

export function manageOrganizationRequestsDenyJoinRequest(requestId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const {
            auth: { authorization: { token, username } },
            manageOrganizationRequestsView,
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        if (!manageOrganizationRequestsView) {
            return
        }

        Promise.all([
            model.denyRequest(requestId),
        ])
            .then(([request]) => {
                dispatch(manageOrganizationRequestsDenyJoinRequestSuccess(request))
                if (manageOrganizationRequestsView.viewState) {
                    dispatch(manageOrganizationRequests(manageOrganizationRequestsView.viewState.organization.id))
                }
            })
            .catch((err) => {
                dispatch(manageOrganizationRequestsDenyJoinRequestError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}