import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import {
    StoreState,
    AppError, UIError, UIErrorType, ViewOrgViewModelKind
} from '../../types'

import * as orgModel from '../../data/models/organization/model'
import * as requestModel from '../../data/models/requests'
import * as uberModel from '../../data/models/uber'
import * as feedsModel from '../../data/models/feeds'
import * as userProfileModel from '../../data/models/profile'
import { loadNarrative } from './entities'
import * as dataServices from './dataServices'
import { Narrative } from '../../data/models/narrative';
import { AnError } from '../../lib/error';

// Action Types

export interface Load extends Action {
    type: ActionFlag.VIEW_ORG_LOAD
    organizationId: string
}

export interface ReLoad extends Action {
    type: ActionFlag.VIEW_ORG_RELOAD
    organizationId: string
}

export interface LoadStart extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_START
}

// export interface LoadSuccess extends Action {
//     type: ActionFlag.VIEW_ORG_LOAD_SUCCESS
//     organization: orgModel.Organization
//     relation: orgModel.Relation
//     groupRequests: Array<requestModel.Request> | null
//     groupInvitations: Array<requestModel.Request> | null
//     requestInbox: Array<requestModel.Request>
//     requestOutbox: Array<requestModel.Request>
//     notifications: Array<feedsModel.OrganizationNotification>
// }

export interface LoadNormalSuccess extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_NORMAL_SUCCESS
    organization: orgModel.Organization
    relation: orgModel.Relation
    openRequest: orgModel.RequestStatus
    groupRequests: Array<requestModel.Request> | null
    groupInvitations: Array<requestModel.Request> | null
    requestInbox: Array<requestModel.Request>
    requestOutbox: Array<requestModel.Request>
    notifications: Array<feedsModel.OrganizationNotification>,
    narrativesSortBy: string
    narratives: Array<orgModel.NarrativeResource>
    sortMembersBy: string,
    members: Array<orgModel.Member>
}

export interface LoadInaccessiblePrivateSuccess extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_INACCESSIBLE_PRIVATE_SUCCESS
    organization: orgModel.InaccessiblePrivateOrganization
    relation: orgModel.Relation
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

        const viewModel = state.views.viewOrgView.viewModel
        if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
            dispatch(accessNarrativeError({
                code: 'error',
                message: 'Not NORMAL org'
            }))
            return
        }

        const { organization } = viewModel

        const {
            auth: { authorization: { token, username } },
            app: { config },
        } = state

        const groupId = organization.id
        const resourceId = String(narrative.workspaceId)

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            await orgClient.grantNarrativeAccess(groupId, resourceId)
            // Getting a fresh copy of the org will trigger the view org component and
            // all subcomponents with changed data to refresh. All we are intending here is that
            // the narrative in the list of narratives provided by the groups api is updated, but
            // there may be other elements of the group/org which have changed as well. So be it.
            const org = await orgClient.getOrg(groupId)

            if (org.kind !== orgModel.OrganizationKind.NORMAL) {
                dispatch(accessNarrativeError({
                    code: 'error',
                    message: 'Not a NORMAL org'
                }))
                return
            }

            dispatch(loadNarrative(narrative.workspaceId))
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

export function loadNormalSuccess(
    organization: orgModel.Organization,
    relation: orgModel.Relation,
    openRequest: orgModel.RequestStatus,
    groupRequests: Array<requestModel.Request> | null,
    groupInvitations: Array<requestModel.Request> | null,
    requestInbox: Array<requestModel.Request>,
    requestOutbox: Array<requestModel.Request>,
    notifications: Array<feedsModel.OrganizationNotification>,
    narrativesSortBy: string,
    narratives: Array<orgModel.NarrativeResource>,
    sortMembersBy: string,
    members: Array<orgModel.Member>): LoadNormalSuccess {
    return {
        type: ActionFlag.VIEW_ORG_LOAD_NORMAL_SUCCESS,
        organization, relation, openRequest,
        groupRequests, groupInvitations,
        requestInbox, requestOutbox, notifications,
        narrativesSortBy,
        narratives, sortMembersBy, members
    }
}

export function loadInaccessiblePrivateSuccess(
    organization: orgModel.InaccessiblePrivateOrganization,
    relation: orgModel.Relation,
    requestOutbox: Array<requestModel.Request>): LoadInaccessiblePrivateSuccess {
    return {
        type: ActionFlag.VIEW_ORG_LOAD_INACCESSIBLE_PRIVATE_SUCCESS,
        organization, relation,
        requestOutbox
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

export function unload() {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {

        const {
            auth: { authorization: { token, username } },
            app: { config },
            views: { viewOrgView: { viewModel } }
        } = getState()

        if (!viewModel) {
            throw new Error('view model not defined!?!')
        }

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        if (viewModel.organization.relation === orgModel.UserRelationToOrganization.MEMBER ||
            viewModel.organization.relation === orgModel.UserRelationToOrganization.ADMIN ||
            viewModel.organization.relation === orgModel.UserRelationToOrganization.OWNER) {
            await orgClient.visitOrg({ organizationId: viewModel.organization.id })
        }

        dispatch(dataServices.load())

        dispatch({
            type: ActionFlag.VIEW_ORG_UNLOAD
        })
    }
}

export function load(organizationId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config },
            db: { notifications: { all, byId } }
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

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            const { organization, relation } = await uberClient.getOrganizationForUser(organizationId)
            if (organization.kind !== orgModel.OrganizationKind.NORMAL) {
                const requestInbox = await requestClient.getRequestInboxForOrg(organizationId)
                dispatch(loadInaccessiblePrivateSuccess(organization, relation, requestInbox))
                return
            }

            let openRequest
            let orgRequests: Array<requestModel.Request> | null
            let orgInvitations: Array<requestModel.Request> | null
            if (relation.type === orgModel.UserRelationToOrganization.OWNER ||
                relation.type === orgModel.UserRelationToOrganization.ADMIN) {
                orgRequests = await requestClient.getPendingOrganizationRequestsForOrg(organizationId)
                orgInvitations = await requestClient.getOrganizationInvitationsForOrg(organizationId)
                openRequest = await orgClient.getOpenRequestStatus({ organizationId })
            } else {
                orgRequests = null
                orgInvitations = null
                openRequest = orgModel.RequestStatus.INAPPLICABLE
            }

            const requestInbox: Array<requestModel.Request> = await requestClient.getCombinedRequestInboxForOrg(organizationId)
            const requestOutbox: Array<requestModel.Request> = await requestClient.getRequestOutboxForOrg(organizationId)

            // default narrative sort?
            const narrativesSortBy = 'added'
            const narratives = orgModel.queryNarratives(organization.narratives, {
                sortBy: narrativesSortBy,
                searchBy: ''
            })

            const sortMembersBy = 'added'
            const members = orgModel.queryMembers(organization.members, {
                sortBy: sortMembersBy,
                searchBy: ''
            })

            dispatch(loadNormalSuccess(organization, relation, openRequest, orgRequests, orgInvitations,
                requestInbox, requestOutbox, [], narrativesSortBy, narratives, sortMembersBy, members))
        } catch (ex) {
            dispatch(loadError({
                code: ex.name,
                message: ex.message
            }))
        }
    }
}

export function reload(organizationId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
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

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            // existing org view.
            const state = getState()
            const viewModel = state.views.viewOrgView.viewModel

            if (!viewModel) {
                dispatch(loadError({
                    code: 'error',
                    message: 'No view model'
                }))
                return
            }

            if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
                dispatch(loadError({
                    code: 'error',
                    message: 'Wrong org view model kind!'
                }))
                return
            }

            const { organization, relation } = await uberClient.getOrganizationForUser(organizationId)
            if (organization.kind !== orgModel.OrganizationKind.NORMAL) {
                const requestInbox = await requestClient.getRequestInboxForOrg(organizationId)
                dispatch(loadInaccessiblePrivateSuccess(organization, relation, requestInbox))
                return
            }

            let openRequest
            let orgRequests: Array<requestModel.Request> | null
            let orgInvitations: Array<requestModel.Request> | null
            if (relation.type === orgModel.UserRelationToOrganization.OWNER ||
                relation.type === orgModel.UserRelationToOrganization.ADMIN) {
                orgRequests = await requestClient.getPendingOrganizationRequestsForOrg(organizationId)
                orgInvitations = await requestClient.getOrganizationInvitationsForOrg(organizationId)
                openRequest = await orgClient.getOpenRequestStatus({ organizationId })
            } else {
                orgRequests = null
                orgInvitations = null
                openRequest = orgModel.RequestStatus.INAPPLICABLE
            }

            const requestInbox: Array<requestModel.Request> = await requestClient.getCombinedRequestInboxForOrg(organizationId)
            const requestOutbox: Array<requestModel.Request> = await requestClient.getRequestOutboxForOrg(organizationId)

            // default narrative sort?
            const narrativesSortBy = 'added'
            const narratives = orgModel.queryNarratives(organization.narratives, {
                sortBy: viewModel.sortNarrativesBy,
                searchBy: viewModel.searchNarrativesBy
            })

            const sortMembersBy = 'added'
            const members = orgModel.queryMembers(organization.members, {
                sortBy: viewModel.sortMembersBy,
                searchBy: viewModel.searchMembersBy
            })

            dispatch(loadNormalSuccess(organization, relation, openRequest, orgRequests, orgInvitations,
                requestInbox, requestOutbox, [], narrativesSortBy, narratives, sortMembersBy, members))
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
            await orgClient.requestMembership(organization.id)
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

// SORT NARRATIVES
export interface SortNarratives {
    type: ActionFlag.VIEW_ORG_SORT_NARRATIVES,
    sortBy: string
}

export interface SortNarrativesStart {
    type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_START
}

export interface SortNarrativesSuccess {
    type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_SUCCESS
    narratives: Array<orgModel.NarrativeResource>
    sortBy: string
}

export interface SortNarrativesError {
    type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_ERROR
    error: AnError
}



export function sortNarratives(sortBy: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_START
        })

        const state = getState()

        const viewModel = state.views.viewOrgView.viewModel

        if (!viewModel) {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: 'Now view model!'
            }))
            return
        }

        if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: 'Wrong org view model kind!'
            }))
            return
        }

        const { narratives } = viewModel.organization as orgModel.Organization
        const searchBy = viewModel.searchNarrativesBy

        const sorted = orgModel.queryNarratives(narratives, {
            sortBy: sortBy,
            searchBy: searchBy
        })

        // const sorted = orgModel.sortNarratives(narratives.slice(), sortBy)
        // const sorted = narratives.slice().sort(sortByToComparator(sortBy))

        dispatch({
            type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_SUCCESS,
            narratives: sorted,
            sortBy
        })

    }
}


// SEARCH NARRATIVES

export interface SearchNarratives {
    type: ActionFlag.VIEW_ORG_SEARCH_NARRATIVES,
    searchBy: string
}

export interface SearchtNarrativesStart {
    type: ActionFlag.VIEW_ORG_SEARCH_NARRATIVES_START
}

export interface SearchNarrativesSuccess {
    type: ActionFlag.VIEW_ORG_SEARCH_NARRATIVES_SUCCESS
    narratives: Array<orgModel.NarrativeResource>
    searchBy: string
}

export interface SearchNarrativesError {
    type: ActionFlag.VIEW_ORG_SEARCH_NARRATIVES_ERROR
    error: AnError
}



export function searchNarratives(searchBy: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_START
        })

        const state = getState()

        const viewModel = state.views.viewOrgView.viewModel

        if (!viewModel) {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: 'Now view model!'
            }))
            return
        }

        if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: 'Wrong org view model kind!'
            }))
            return
        }

        const { narratives } = viewModel.organization as orgModel.Organization
        const sortBy = viewModel.sortNarrativesBy

        const sorted = orgModel.queryNarratives(narratives, {
            sortBy: sortBy,
            searchBy: searchBy
        })

        dispatch({
            type: ActionFlag.VIEW_ORG_SEARCH_NARRATIVES_SUCCESS,
            searchBy: searchBy,
            narratives: sorted
        })

    }
}



