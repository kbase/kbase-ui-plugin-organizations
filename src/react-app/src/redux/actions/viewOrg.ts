import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import {
    StoreState,
    AppError, UIError, UIErrorType
} from '../../types'

import * as orgModel from '../../data/models/organization/model'
import * as requestModel from '../../data/models/requests'
import * as uberModel from '../../data/models/uber'


// Action Types

export interface Load extends Action {
    type: ActionFlag.VIEW_ORG_LOAD
    organizationId: string
}

export interface LoadStart extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_START
}

export interface LoadSuccess extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_SUCCESS
    organization: orgModel.Organization
    relation: orgModel.Relation
    groupRequests: Array<requestModel.Request> | null
    groupInvitations: Array<requestModel.Request> | null
    requestInbox: Array<requestModel.Request>
    requestOutbox: Array<requestModel.Request>
}

export interface LoadError extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_ERROR
    error: AppError
}

export interface Unload extends Action {
    type: ActionFlag.VIEW_ORG_UNLOAD
}

// Join Requests

export interface ViewOrgJoinRequest extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST
    requestId: string
}

export interface ViewOrgJoinRequestStart extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST_START
}

export interface ViewOrgJoinRequestSuccess extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST_SUCCESS
}

export interface ViewOrgJoinRequestError extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST_ERROR
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

// Delete Narrative

export interface RemoveNarrative extends Action {
    type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE
}

export interface RemoveNarrativeStart extends Action {
    type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_START
}

export interface RemoveNarrativeSuccess extends Action {
    type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_SUCCESS,
    narrative: orgModel.NarrativeResource
}

export interface RemoveNarrativeError extends Action {
    type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_ERROR,
    error: AppError
}

// Generators

export function removeNarrativeStart(): RemoveNarrativeStart {
    return {
        type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_START
    }
}

export function removeNarrativeSuccess(narrative: orgModel.NarrativeResource): RemoveNarrativeSuccess {
    return {
        type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_SUCCESS,
        narrative: narrative
    }
}

export function removeNarrativeError(error: AppError): RemoveNarrativeError {
    return {
        type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_ERROR,
        error: error
    }
}

// Thunk

export function removeNarrative(narrative: orgModel.NarrativeResource) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(removeNarrativeStart())

        // TODO: need to restructure this view -- this is crazy

        const state = getState()
        if (!state.views.viewOrgView.viewModel) {
            dispatch(removeNarrativeError({
                code: 'bad state',
                message: 'View orgs does not have an org'
            }))
            return
        }

        const {
            auth: { authorization: { token, username } },
            app: { config },
            views: {
                viewOrgView: {
                    viewModel: {
                        organization
                    }
                }
            }
        } = state

        if (!organization) {
            dispatch(removeNarrativeError({
                code: 'bad state',
                message: 'View orgs does not have an org'
            }))
            return
        }

        const groupId = organization.id

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })


        try {
            await orgClient.removeNarrativeFromOrg(groupId, narrative.workspaceId)
            dispatch(removeNarrativeSuccess(narrative))
        } catch (ex) {
            dispatch(removeNarrativeError({
                code: ex.name,
                message: ex.message
            }))
        }
    }
}

// Access narrative

export interface AccessNarrative extends Action {
    type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE,
    narrative: orgModel.NarrativeResource
}

export interface AccessNarrativeStart extends Action {
    type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_START
}

export interface AccessNarrativeSuccess extends Action {
    type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_SUCCESS,
    organization: orgModel.Organization
}

export interface AccessNarrativeError extends Action {
    type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_ERROR,
    error: AppError
}

// Generators
export function accessNarrativeStart(): AccessNarrativeStart {
    return {
        type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_START
    }
}

export function accessNarrativeSuccess(organization: orgModel.Organization): AccessNarrativeSuccess {
    return {
        type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_SUCCESS,
        organization: organization
    }
}

export function accessNarrativeError(error: AppError): AccessNarrativeError {
    return {
        type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_ERROR,
        error: error
    }
}

// Thunk

export function accessNarrative(narrative: orgModel.NarrativeResource) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(accessNarrativeStart())

        const state = getState()
        if (!state.views.viewOrgView.viewModel) {
            dispatch(accessNarrativeError({
                code: 'error',
                message: 'No view model'
            }))
            return
        }

        const {
            auth: { authorization: { token, username } },
            app: { config },
            views: {
                viewOrgView: {
                    viewModel: {
                        organization
                    }
                }
            }
        } = state

        if (!organization) {
            return
        }

        const groupId = organization.id
        const resourceId = String(narrative.workspaceId)

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            await orgClient.grantNarrativeAccess(groupId, resourceId)
            const org = await orgClient.getOrg(groupId)
            dispatch(accessNarrativeSuccess(org))
        } catch (ex) {
            dispatch(accessNarrativeError({
                code: 'error',
                message: ex.message
            }))
        }

    }
}

// Generators

export function loadStart(): LoadStart {
    return {
        type: ActionFlag.VIEW_ORG_LOAD_START
    }
}

export function unload(): Unload {
    return {
        type: ActionFlag.VIEW_ORG_UNLOAD
    }
}

export function loadSuccess(
    organization: orgModel.Organization,
    relation: orgModel.Relation,
    groupRequests: Array<requestModel.Request> | null,
    groupInvitations: Array<requestModel.Request> | null,
    requestInbox: Array<requestModel.Request>,
    requestOutbox: Array<requestModel.Request>): LoadSuccess {
    return {
        type: ActionFlag.VIEW_ORG_LOAD_SUCCESS,
        organization, relation, groupRequests, groupInvitations,
        requestInbox, requestOutbox
    }
}


export function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.VIEW_ORG_LOAD_ERROR,
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

export function load(organizationId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = getState()

        const uberClient = new uberModel.UberModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            serviceWizardURL: config.services.ServiceWizard.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
        })

        try {
            const { organization, relation } = await uberClient.getOrganizationForUser(organizationId)
            let orgRequests: Array<requestModel.Request> | null
            let orgInvitations: Array<requestModel.Request> | null
            if (relation.type === orgModel.UserRelationToOrganization.OWNER ||
                relation.type === orgModel.UserRelationToOrganization.ADMIN) {
                orgRequests = await requestClient.getPendingOrganizationRequestsForOrg(organizationId)
                orgInvitations = await requestClient.getOrganizationInvitationsForOrg(organizationId)
            } else {
                orgRequests = null
                orgInvitations = null
            }

            let requestInbox: Array<requestModel.Request>
            let requestOutbox: Array<requestModel.Request>
            // if (relation.type === orgModel.UserRelationToOrganization.OWNER ||
            //     relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            //     relation.type === orgModel.UserRelationToOrganization.MEMBER) {
            requestInbox = await requestClient.getCombinedRequestInboxForOrg(organizationId)
            requestOutbox = await requestClient.getRequestOutboxForOrg(organizationId)
            // }

            dispatch(loadSuccess(organization, relation, orgRequests, orgInvitations, requestInbox, requestOutbox))
        } catch (ex) {
            dispatch(loadError({
                code: ex.name,
                message: ex.message
            }))
        }
    }
}

export function viewOrgJoinRequest() {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        //TODO: could do a start here...
        const state = getState()
        if (!state.views.viewOrgView.viewModel) {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: 'Now view model!'
            }))
            return
        }

        const {
            auth: { authorization: { token, username } },
            app: { config },
            views: {
                viewOrgView: { viewModel: { organization } }
            }
        } = state

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            await orgClient.requestMembershipToGroup(organization.id)
            dispatch(viewOrgJoinRequestSuccess())
            dispatch(load((organization.id)))
        } catch (ex) {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: ex.message
            }))
        }
    }
}

export function viewOrgCancelJoinRequest(requestId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(viewOrgJoinRequestStart())

        const state = getState()
        if (!state.views.viewOrgView.viewModel) {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: 'Now view model!'
            }))
            return
        }

        const {
            auth: { authorization: { token, username } },
            app: { config },
            views: {
                viewOrgView: {
                    viewModel: { organization } } } } = state

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            const newRequest = await requestClient.cancelRequest(requestId)
            dispatch(viewOrgCancelJoinRequestSuccess())
            dispatch(load(newRequest.organizationId))
        } catch (ex) {
            dispatch(viewOrgCancelJoinRequestError({
                type: UIErrorType.ERROR,
                message: ex.message
            }))
        }
    }
}

export function acceptJoinInvitation(requestId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(acceptJoinInvitationStart())

        const state = getState()
        if (!state.views.viewOrgView.viewModel) {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: 'Now view model!'
            }))
            return
        }

        const {
            auth: { authorization: { token, username } },
            app: { config },
            views: {
                viewOrgView: {
                    viewModel: { organization } } } } = state

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            const newRequest = await requestClient.acceptJoinInvitation(requestId)
            dispatch(acceptJoinInvitationSuccess())
            // quick 'n easy
            dispatch(load(newRequest.organizationId))
        } catch (ex) {
            dispatch(acceptJoinInvitationError({
                code: ex.name,
                message: ex.message
            }))
        }

    }
}


export function rejectJoinInvitation(requestId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(acceptJoinInvitationStart())

        const state = getState()
        if (!state.views.viewOrgView.viewModel) {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: 'Now view model!'
            }))
            return
        }

        const {
            auth: { authorization: { token, username } },
            app: { config },
            views: {
                viewOrgView: {
                    viewModel: { organization } } } } = state

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            const newRequest = await requestClient.rejectJoinInvitation(requestId)
            dispatch(rejectJoinInvitationSuccess())
            dispatch(load(newRequest.organizationId))
        } catch (ex) {
            dispatch(rejectJoinInvitationError({
                code: ex.name,
                message: ex.message
            }))
        }

    }
}
