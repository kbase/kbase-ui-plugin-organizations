import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import { AppError, StoreState, MemberType } from '../../types'
import * as userModel from '../../data/models/user'
import * as requestModel from '../../data/models/requests'
import * as uberModel from '../../data/models/uber'

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
    organizations: Array<uberModel.UberOrganization>
    // users: Map<userModel.Username, userModel.User>
    requestInbox: Array<requestModel.Request>
    requestOutbox: Array<requestModel.Request>
    pendingGroupRequests: Array<requestModel.Request>
}

export interface LoadError extends DashboardAction<ActionFlag.DASHBOARD_LOAD_ERROR> {
    type: ActionFlag.DASHBOARD_LOAD_ERROR
    error: AppError
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
    organizations: Array<uberModel.UberOrganization>,
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

export function loadError(error: AppError): LoadError {
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
            views: {
                dashboardView
            },
            entities,
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        // if (dashboardView === null) {
        //     dispatch(searchOrgsError({
        //         code: 'invalid-state',
        //         message: 'Search orgs may not be called without a defined view'
        //     }))
        //     return
        // }

        const uberClient = new uberModel.UberModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        // const orgModel = new organizationsModel.OrganizationModel({
        //     token, username,
        //     groupsServiceURL: config.services.Groups.url
        // })

        // const userModelClient = new userModel.UserModel({
        //     token,
        //     userProfileServiceURL: config.services.UserProfile.url
        // })

        const requestModelClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        // TODO:

        // get the projection, or view:
        // - orgs of current user
        // - requests created by or targeting current user
        try {
            const orgs = await uberClient.getOrganizationsForUser()
            // const orgs = await orgModel.getOwnOrgs()

            const allUsers: Map<userModel.Username, boolean> = new Map()

            // orgs.forEach((org) => {
            //     allUsers.set(org.owner.username, true)
            //     org.members.forEach((member) => {
            //         allUsers.set(member.username, true)
            //     })
            // })

            // const users = await userModelClient.getUsers(Array.from(allUsers.keys()))

            const requestOutbox = await requestModelClient.getOutboundRequests()

            const requestInbox = await requestModelClient.getInboundRequests()

            const adminOrgIds = orgs
                .filter(({ organization }) => {
                    // TODO: why not have relation on org, again?   
                    if (organization.owner.username === username) {
                        return true
                    }
                    if (organization.members.find((member) => {
                        return (member.username === username && member.type === MemberType.ADMIN)
                    })) {
                        return true
                    }
                    return false
                })
                .map(({ organization }) => {
                    return organization.id
                })

            const pendingGroupRequests = await requestModelClient.getPendingOrganizationRequests(adminOrgIds)

            dispatch(loadSuccess(orgs, requestInbox, requestOutbox, pendingGroupRequests))
        } catch (ex) {
            dispatch(loadError({
                code: 'error',
                message: ex.message
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
    organizations: Array<uberModel.UberOrganization>
    requestInbox: Array<requestModel.Request>
    requestOutbox: Array<requestModel.Request>
    pendingGroupRequests: Array<requestModel.Request>
}

export interface RefreshError extends DashboardAction<ActionFlag.DASHBOARD_REFRESH_ERROR> {
    type: ActionFlag.DASHBOARD_REFRESH_ERROR
    error: AppError
}

// Generators

export function refreshStart(): RefreshStart {
    return {
        type: ActionFlag.DASHBOARD_REFRESH_START
    }
}

export function refreshSuccess(
    organizations: Array<uberModel.UberOrganization>,
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

export function refreshError(error: AppError): RefreshError {
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

        const uberClient = new uberModel.UberModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
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
            const orgs = await uberClient.getOrganizationsForUser()

            const requestOutbox = await requestModelClient.getOutboundRequests()

            const requestInbox = await requestModelClient.getInboundRequests()

            const adminOrgIds = orgs
                .filter(({ organization }) => {
                    // TODO: why not have relation on org, again?   
                    if (organization.owner.username === username) {
                        return true
                    }
                    if (organization.members.find((member) => {
                        return (member.username === username && member.type === MemberType.ADMIN)
                    })) {
                        return true
                    }
                    return false
                })
                .map(({ organization }) => {
                    return organization.id
                })

            const pendingGroupRequests = await requestModelClient.getPendingOrganizationRequests(adminOrgIds)

            dispatch(refreshSuccess(orgs, requestInbox, requestOutbox, pendingGroupRequests))
        } catch (ex) {
            dispatch(refreshError({
                code: 'error',
                message: ex.message
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
    organizations: Array<uberModel.UberOrganization>
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

        const uberClient = new uberModel.UberModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })


        try {
            const newRequest = await requestClient.acceptRequest(request.id)

            // refetch the inbox
            const outbox = await requestClient.getInboundRequests()

            const orgs = await uberClient.getOrganizationsForUser()

            dispatch({
                type: ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_SUCCESS,
                requests: outbox,
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