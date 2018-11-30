import { ActionFlag } from './index'
import { Organization, GroupRequest, StoreState, AppError } from '../../types'
import { Model } from '../../data/model'
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

// Action types


// Start up requests manager

export interface Load extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD
}

export interface LoadStart extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_START
}

export interface LoadSuccess extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_SUCCESS,
    organization: Organization,
    requests: Array<GroupRequest>
}

export interface LoadError extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_ERROR,
    error: AppError
}

export interface Unload extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_UNLOAD
}

// Accept join requests

export interface AcceptJoinRequest extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST,
    requestId: string
}

export interface AcceptJoinRequestStart extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_START,
    requestId: string
}

export interface AcceptJoinRequestSuccess extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_SUCCESS,
    request: GroupRequest
}

export interface AcceptJoinRequestError extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_ERROR,
    error: AppError
}


export function acceptJoinRequestStart(requestId: string): AcceptJoinRequestStart {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_START,
        requestId: requestId
    }
}

export function acceptJoinRequestSuccess(request: GroupRequest): AcceptJoinRequestSuccess {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_SUCCESS,
        request: request
    }
}

export function acceptJoinRequestError(error: AppError): AcceptJoinRequestError {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_ERROR,
        error: error
    }
}

// Deny join requests

export interface DenyJoinRequest extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST,
    requestId: string
}

export interface DenyJoinRequestStart extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_START,
    requestId: string
}

export interface DenyJoinRequestSuccess extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_SUCCESS,
    request: GroupRequest
}

export interface DenyJoinRequestError extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_ERROR,
    error: AppError
}


export function denyJoinRequestStart(requestId: string): DenyJoinRequestStart {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_START,
        requestId: requestId
    }
}

export function denyJoinRequestSuccess(request: GroupRequest): DenyJoinRequestSuccess {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_SUCCESS,
        request: request
    }
}

export function denyJoinRequestError(error: AppError): DenyJoinRequestError {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_ERROR,
        error: error
    }
}

// Cancel join invitations

export interface CancelJoinInvitation extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION
    requestId: string
}

export interface CancelJoinInvitationStart extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_START
}

export interface CancelJoinInvitationSuccess extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_SUCCESS
    request: GroupRequest
}

export interface CancelJoinInvitationError extends Action {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_ERROR,
    error: AppError
}


export function cancelJoinInvitationStart(): CancelJoinInvitationStart {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_START
    }
}

export function cancelJoinInvitationSuccess(request: GroupRequest): CancelJoinInvitationSuccess {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_SUCCESS,
        request: request
    }
}

export function cancelJoinInvitationError(error: AppError): CancelJoinInvitationError {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_ERROR,
        error: error
    }
}

// Action generators



export function loadStart(): LoadStart {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_START
    }
}

export function loadSuccess(organization: Organization, requests: Array<GroupRequest>): LoadSuccess {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_SUCCESS,
        organization: organization,
        requests: requests
    }
}

export function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_ERROR,
        error: error
    }
}

export function unload(): Unload {
    return {
        type: ActionFlag.ADMIN_MANAGE_REQUESTS_UNLOAD
    }
}

// Action thunks

export function load(organizationId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const { auth: { authorization: { token, username } },
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        // get requests 
        Promise.all([
            model.getOrg(organizationId),
            model.getPendingOrganizationRequests(organizationId)
        ])
            .then(([organization, requests]) => {
                dispatch(loadSuccess(organization, requests))
            })
            .catch((err) => {
                dispatch(loadError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

export function acceptJoinRequest(requestId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const {
            auth: { authorization: { token, username } },
            manageOrganizationRequestsView,
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        if (!manageOrganizationRequestsView) {
            return
        }

        Promise.all([
            model.acceptRequest(requestId),
        ])
            .then(([request]) => {
                dispatch(acceptJoinRequestSuccess(request))
                if (manageOrganizationRequestsView.viewState) {
                    dispatch(load(manageOrganizationRequestsView.viewState.organization.id))
                }
            })
            .catch((err) => {
                dispatch(acceptJoinRequestError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

export function denyJoinRequest(requestId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const {
            auth: { authorization: { token, username } },
            manageOrganizationRequestsView,
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        if (!manageOrganizationRequestsView) {
            return
        }

        Promise.all([
            model.denyRequest(requestId),
        ])
            .then(([request]) => {
                dispatch(denyJoinRequestSuccess(request))
                if (manageOrganizationRequestsView.viewState) {
                    dispatch(load(manageOrganizationRequestsView.viewState.organization.id))
                }
            })
            .catch((err) => {
                dispatch(denyJoinRequestError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

export function cancelJoinInvitation(requestId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const {
            auth: { authorization: { token, username } },
            manageOrganizationRequestsView,
            app: { config } } = getState()

        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        if (!manageOrganizationRequestsView) {
            return
        }

        Promise.all([
            model.cancelRequest(requestId),
        ])
            .then(([request]) => {
                dispatch(cancelJoinInvitationSuccess(request))
                if (manageOrganizationRequestsView.viewState) {
                    dispatch(load(manageOrganizationRequestsView.viewState.organization.id))
                }
            })
            .catch((err) => {
                dispatch(cancelJoinInvitationError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}