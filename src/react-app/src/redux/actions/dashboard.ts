import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import { AppError, StoreState, MemberType, ErrorCode, SomeError } from '../../types'
import * as orgModel from '../../data/models/organization/model'
import * as requestModel from '../../data/models/requests'
import * as uberModel from '../../data/models/uber'
import uuid from 'uuid/v4'

export interface DashboardAction<T> extends Action<T> {

}

export interface Load extends DashboardAction<ActionFlag.DASHBOARD_LOAD> {
    type: ActionFlag.DASHBOARD_LOAD
}

export interface LoadStart extends DashboardAction<ActionFlag.DASHBOARD_LOAD_START> {
    type: ActionFlag.DASHBOARD_LOAD_START
}

export interface LoadSuccess extends DashboardAction<ActionFlag.DASHBOARD_LOAD_SUCCESS> {
    type: ActionFlag.DASHBOARD_LOAD_SUCCESS
    organizations: Array<orgModel.BriefOrganization>
    // users: Map<userModel.Username, userModel.User>
    requestInbox: Array<requestModel.Request>
    requestOutbox: Array<requestModel.Request>
    pendingGroupRequests: Array<requestModel.Request>
}

export interface LoadError extends DashboardAction<ActionFlag.DASHBOARD_LOAD_ERROR> {
    type: ActionFlag.DASHBOARD_LOAD_ERROR
    error: SomeError
}

export interface Unload extends DashboardAction<ActionFlag.DASHBOARD_UNLOAD> {
    type: ActionFlag.DASHBOARD_UNLOAD
}

// Generators

export function loadStart(): LoadStart {
    return {
        type: ActionFlag.DASHBOARD_LOAD_START
    }
}

export function loadSuccess(
    organizations: Array<orgModel.BriefOrganization>,
    // users: Map<userModel.Username, userModel.User>,
    requestInbox: Array<requestModel.Request>,
    requestOutbox: Array<requestModel.Request>,
    pendingGroupRequests: Array<requestModel.Request>): LoadSuccess {
    return {
        type: ActionFlag.DASHBOARD_LOAD_SUCCESS,
        organizations: organizations,
        // users: users,
        requestInbox,
        requestOutbox,
        pendingGroupRequests: pendingGroupRequests
    }
}

export function loadError(error: SomeError): LoadError {
    return {
        type: ActionFlag.DASHBOARD_LOAD_ERROR,
        error: error
    }
}

export function unload(): Unload {
    return {
        type: ActionFlag.DASHBOARD_UNLOAD
    }
}

// Thunks

export function load() {
    return async (dispatch: ThunkDispatch<StoreState, void, DashboardAction<any>>, getState: () => StoreState) => {
        dispatch(loadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        const requestModelClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        // TODO:

        // get the projection, or view:
        // - orgs of current user
        // - requests created by or targeting current user
        try {
            const orgs = await orgClient.getOwnOrgs()

            const requestOutbox = await requestModelClient.getOutboundRequests()

            const requestInboxPersonal = await requestModelClient.getInboundRequests()

            // TODO: revive this?
            const adminOrgIds = orgs
                .filter((organization) => {
                    return (organization.relation === orgModel.UserRelationToOrganization.ADMIN ||
                        organization.relation === orgModel.UserRelationToOrganization.OWNER)
                })
                .map((organization) => {
                    return organization.id
                })

            // Note - now using combined personal + group inbox.
            const pendingGroupRequests = await requestModelClient.getPendingOrganizationRequests(adminOrgIds)

            const requestInbox = requestInboxPersonal.concat(pendingGroupRequests)
                .sort((a: requestModel.Request, b: requestModel.Request) => {
                    return (a.createdAt.getTime() - b.createdAt.getTime())
                })

            dispatch(loadSuccess(orgs, requestInbox, requestOutbox, pendingGroupRequests))
        } catch (ex) {
            dispatch(loadError({
                code: ErrorCode.ERROR,
                message: ex.message,
                detail: '',
                at: new Date(),
                id: uuid()
            }))
        }

        // resolve all data!
        // - orgs
        // - requests
        // - users (org members, owner, request requester, resource)

        // fetch current orgs for this user

        // const groupsInStore: Array<groups.Group> = []
        // const groupsNeeded: Array<string> = []
        // orgs.organizations forEach((groupId) => {
        //     const org = entities.orgs.byId.get(groupId)
        //     if (org) {
        //         groupsInStore.push(org.group)
        //     } else {
        //         groupsNeeded.push(groupId)
        //     }
        // })

        // for each org
        // look for org entity in store.
        // if don't have fetch
        // look for sub-entities
        // - users (members, admins, owner)
        //   - look for user entities
        //   - if don't find, fetch 
        // 
        // fetch all requests for user
        // do the lookup, fetch cycle
        // subentities:
        // - users
        // - orgs (should be covered by above... but some requests may 
        //         reference orgs this user does not have access to ... sigh ...)

        // try {
        //     const [orgs, requests, invitations] = await Promise.all([
        //         model.ownOrgs(username),
        //         model.getUserRequests(),
        //         model.getUserInvitations()
        //     ])

        //     // const orgs = await model.ownOrgs(username)
        //     dispatch(loadSuccess(orgs.organizations, requests, invitations))
        // } catch (ex) {
        //     dispatch(loadError({
        //         code: 'error',
        //         message: ex.message
        //     }))
        // }
    }
}

// Refresh
// Much like load

export interface Refresh extends DashboardAction<ActionFlag.DASHBOARD_REFRESH> {
    type: ActionFlag.DASHBOARD_REFRESH
}

export interface RefreshStart extends DashboardAction<ActionFlag.DASHBOARD_REFRESH_START> {
    type: ActionFlag.DASHBOARD_REFRESH_START
}

export interface RefreshSuccess extends DashboardAction<ActionFlag.DASHBOARD_REFRESH_SUCCESS> {
    type: ActionFlag.DASHBOARD_REFRESH_SUCCESS
    organizations: Array<orgModel.BriefOrganization>
    requestInbox: Array<requestModel.Request>
    requestOutbox: Array<requestModel.Request>
    pendingGroupRequests: Array<requestModel.Request>
}

export interface RefreshError extends DashboardAction<ActionFlag.DASHBOARD_REFRESH_ERROR> {
    type: ActionFlag.DASHBOARD_REFRESH_ERROR
    error: SomeError
}

// Generators

export function refreshStart(): RefreshStart {
    return {
        type: ActionFlag.DASHBOARD_REFRESH_START
    }
}

export function refreshSuccess(
    organizations: Array<orgModel.BriefOrganization>,
    requestInbox: Array<requestModel.Request>,
    requestOutbox: Array<requestModel.Request>,
    pendingGroupRequests: Array<requestModel.Request>): RefreshSuccess {
    return {
        type: ActionFlag.DASHBOARD_REFRESH_SUCCESS,
        organizations: organizations,
        // users: users,
        requestInbox,
        requestOutbox,
        pendingGroupRequests: pendingGroupRequests
    }
}

export function refreshError(error: SomeError): RefreshError {
    return {
        type: ActionFlag.DASHBOARD_REFRESH_ERROR,
        error: error
    }
}

// Thunks

export function refresh() {
    return async (dispatch: ThunkDispatch<StoreState, void, DashboardAction<any>>, getState: () => StoreState) => {
        dispatch(refreshStart())

        const {
            views: {
                dashboardView
            },
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        // const uberClient = new uberModel.UberModel({
        //     token, username,
        //     groupsServiceURL: config.services.Groups.url,
        //     userProfileServiceURL: config.services.UserProfile.url,
        //     workspaceServiceURL: config.services.Workspace.url,
        //     serviceWizardURL: config.services.ServiceWizard.url
        // })

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        const requestModelClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        // TODO:

        // get the projection, or view:
        // - orgs of current user
        // - requests created by or targeting current user
        try {
            // const orgs = await uberClient.getOrganizationsForUser()
            const orgs = await orgClient.getOwnOrgs()

            const requestOutbox = await requestModelClient.getOutboundRequests()

            const requestInbox = await requestModelClient.getInboundRequests()

            // const adminOrgIds = orgs
            //     .filter(({ organization }) => {
            //         // TODO: why not have relation on org, again?   
            //         if (organization.owner.username === username) {
            //             return true
            //         }
            //         if (organization.members.find((member) => {
            //             return (member.username === username && member.type === MemberType.ADMIN)
            //         })) {
            //             return true
            //         }
            //         return false
            //     })
            //     .map(({ organization }) => {
            //         return organization.id
            //     })

            // const pendingGroupRequests = await requestModelClient.getPendingOrganizationRequests(adminOrgIds)
            const pendingGroupRequests: Array<requestModel.Request> = []

            dispatch(refreshSuccess(orgs, requestInbox, requestOutbox, pendingGroupRequests))
        } catch (ex) {
            dispatch(refreshError({
                code: ErrorCode.ERROR,
                message: ex.message,
                detail: '',
                at: new Date(),
                id: uuid()
            }))
        }
    }
}


// Requests

// Cancel outbox request

export interface CancelOutboxRequest extends DashboardAction<ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST> {
    type: ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST
    request: requestModel.Request
}

interface CancelOutboxRequestStart extends DashboardAction<ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_START> {
    type: ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_START
}

export interface CancelOutboxRequestSuccess extends DashboardAction<ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_SUCCESS> {
    type: ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_SUCCESS,
    requests: Array<requestModel.Request>
}

interface CancelOutboxRequestError extends DashboardAction<ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_ERROR> {
    type: ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_ERROR,
    error: AppError
}

export function cancelOutboxRequest(request: requestModel.Request) {
    return async (dispatch: ThunkDispatch<StoreState, void, DashboardAction<any>>, getState: () => StoreState) => {
        const state = getState()

        if (!state.views.dashboardView.viewModel) {
            dispatch({
                type: ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_ERROR,
                error: {
                    code: 'error',
                    message: 'No dashboard view model'
                }
            })
        }

        dispatch({
            type: ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_START
        })

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = state

        // do the cancelation
        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })
        try {
            const newRequest = await requestClient.cancelRequest(request.id)

            // refetch the inbox
            const outbox = await requestClient.getOutboundRequests()

            dispatch({
                type: ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_SUCCESS,
                requests: outbox
            })

            // send the inbox in the success
        } catch (ex) {
            dispatch({
                type: ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_ERROR,
                error: {
                    code: ex.name,
                    message: ex.message
                }
            })
        }


        // or error
    }
}

// Accept inbound request

export interface AcceptInboxRequest extends DashboardAction<ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST> {
    type: ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST
    request: requestModel.Request
}

interface AcceptInboxRequestStart extends DashboardAction<ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_START> {
    type: ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_START
}

export interface AcceptInboxRequestSuccess extends DashboardAction<ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_SUCCESS> {
    type: ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_SUCCESS,
    requests: Array<requestModel.Request>
    organizations: Array<orgModel.BriefOrganization>
}

interface AcceptInboxRequestError extends DashboardAction<ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_ERROR> {
    type: ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_ERROR,
    error: AppError
}

export function acceptInboxRequest(request: requestModel.Request) {
    return async (dispatch: ThunkDispatch<StoreState, void, DashboardAction<any>>, getState: () => StoreState) => {
        const state = getState()

        if (!state.views.dashboardView.viewModel) {
            dispatch({
                type: ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_ERROR,
                error: {
                    code: 'error',
                    message: 'No dashboard view model'
                }
            })
        }

        dispatch({
            type: ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_START
        })

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = state

        // do the cancelation
        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        // const uberClient = new uberModel.UberModel({
        //     token, username,
        //     groupsServiceURL: config.services.Groups.url,
        //     userProfileServiceURL: config.services.UserProfile.url,
        //     workspaceServiceURL: config.services.Workspace.url,
        //     serviceWizardURL: config.services.ServiceWizard.url
        // })

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })


        try {
            const newRequest = await requestClient.acceptRequest(request.id)

            // refetch the inbox
            const inbox = await requestClient.getInboundRequests()

            const orgs = await orgClient.getOwnOrgs()

            dispatch({
                type: ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_SUCCESS,
                requests: inbox,
                organizations: orgs
            })

            // send the inbox in the success
        } catch (ex) {
            dispatch({
                type: ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_ERROR,
                error: {
                    code: ex.name,
                    message: ex.message
                }
            })
        }


        // or error
    }
}


// Reject inbound request

export interface RejectInboxRequest extends DashboardAction<ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST> {
    type: ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST
    request: requestModel.Request
}

interface RejectInboxRequestStart extends DashboardAction<ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_START> {
    type: ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_START
}

export interface RejectInboxRequestSuccess extends DashboardAction<ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_SUCCESS> {
    type: ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_SUCCESS
    requests: Array<requestModel.Request>
}

interface RejectInboxRequestError extends DashboardAction<ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_ERROR> {
    type: ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_ERROR,
    error: AppError
}

export function rejectInboxRequest(request: requestModel.Request) {
    return async (dispatch: ThunkDispatch<StoreState, void, DashboardAction<any>>, getState: () => StoreState) => {
        const state = getState()

        if (!state.views.dashboardView.viewModel) {
            dispatch({
                type: ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_ERROR,
                error: {
                    code: 'error',
                    message: 'No dashboard view model'
                }
            })
        }

        dispatch({
            type: ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_START
        })

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = state

        // do the cancelation
        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            const newRequest = await requestClient.denyRequest(request.id)

            // refetch the inbox
            const outbox = await requestClient.getInboundRequests()

            dispatch({
                type: ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_SUCCESS,
                requests: outbox
            })

            // send the inbox in the success
        } catch (ex) {
            dispatch({
                type: ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_ERROR,
                error: {
                    code: ex.name,
                    message: ex.message
                }
            })
        }

        // or error
    }
}