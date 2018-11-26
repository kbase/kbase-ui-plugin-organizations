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

// Join Invitation Acceptance

export interface AcceptJoinInvitation extends Action {
    type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION
}

export interface AcceptJoinInvitationStart extends Action {
    type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_START
}

export interface AcceptJoinInvitationSuccess extends Action {
    type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_SUCCESS
}

export interface AcceptJoinInvitationError extends Action {
    type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_ERROR,
    error: AppError
}

// Join Invitation Denial

export interface RejectJoinInvitation extends Action {
    type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION
}

export interface RejectJoinInvitationStart extends Action {
    type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_START
}

export interface RejectJoinInvitationSuccess extends Action {
    type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_SUCCESS
}

export interface RejectJoinInvitationError extends Action {
    type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_ERROR,
    error: AppError
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

// Invitation Acceptance

export function acceptJoinInvitationStart(): AcceptJoinInvitationStart {
    return {
        type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_START
    }
}

export function acceptJoinInvitationSuccess(): AcceptJoinInvitationSuccess {
    return {
        type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_SUCCESS
    }
}

export function acceptJoinInvitationError(error: AppError): AcceptJoinInvitationError {
    return {
        type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_ERROR,
        error: error
    }
}

// Invitation Rejection 

export function rejectJoinInvitationStart(): RejectJoinInvitationStart {
    return {
        type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_START
    }
}

export function rejectJoinInvitationSuccess(): RejectJoinInvitationSuccess {
    return {
        type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_SUCCESS
    }
}

export function rejectJoinInvitationError(error: AppError): RejectJoinInvitationError {
    return {
        type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_ERROR,
        error: error
    }
}


// Join invitation acceptance

// TODO

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

export function acceptJoinInvitation(requestId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(acceptJoinInvitationStart())

        const {
            auth: { authorization: { token, username } },
            app: { config },
            viewOrg: { organization } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })
        if (typeof organization === 'undefined') {
            dispatch(acceptJoinInvitationError({
                code: 'undefined',
                message: 'Org not currently defined'
            }))
            return
        }

        model.acceptJoinInvitation(requestId)
            .then((newRequest) => {
                dispatch(acceptJoinInvitationSuccess())
                // quick 'n easy
                dispatch(viewOrgFetch(newRequest.groupId))
            })
            .catch((err) => {
                dispatch(acceptJoinInvitationError(err))
            })

    }
}


export function rejectJoinInvitation(requestId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(acceptJoinInvitationStart())

        const {
            auth: { authorization: { token, username } },
            app: { config },
            viewOrg: { organization } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })
        if (typeof organization === 'undefined') {
            dispatch(acceptJoinInvitationError({
                code: 'undefined',
                message: 'Org not currently defined'
            }))
            return
        }

        model.rejectJoinInvitation(requestId)
            .then((newRequest) => {
                dispatch(rejectJoinInvitationSuccess())
                // quick 'n easy
                dispatch(viewOrgFetch(newRequest.groupId))
            })
            .catch((err) => {
                dispatch(rejectJoinInvitationError(err))
            })

    }
}
