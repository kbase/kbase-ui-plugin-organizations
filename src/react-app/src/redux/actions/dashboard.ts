import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import { AppError, StoreState, MemberType } from '../../types'
import * as orgsModel from '../../data/models/organization/model'
import * as userModel from '../../data/models/user'
import * as requestModel from '../../data/models/requests'
import * as uberModel from '../../data/models/uber'
// temp
import { FeedsClient } from '../../data/models/feeds'

export interface DashboardAction extends Action {

}

export interface Load extends DashboardAction {
    type: ActionFlag.DASHBOARD_LOAD
}

export interface LoadStart extends DashboardAction {
    type: ActionFlag.DASHBOARD_LOAD_START
}

export interface LoadSuccess extends DashboardAction {
    type: ActionFlag.DASHBOARD_LOAD_SUCCESS
    organizations: Array<uberModel.UberOrganization>
    // users: Map<userModel.Username, userModel.User>
    requests: Array<requestModel.Request>
    invitations: Array<requestModel.Request>
    pendingGroupRequests: Array<requestModel.Request>
}

export interface LoadError extends DashboardAction {
    type: ActionFlag.DASHBOARD_LOAD_ERROR
    error: AppError
}

export interface Unload extends DashboardAction {
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
    requests: Array<requestModel.Request>,
    invitations: Array<requestModel.Request>,
    pendingGroupRequests: Array<requestModel.Request>): LoadSuccess {
    return {
        type: ActionFlag.DASHBOARD_LOAD_SUCCESS,
        organizations: organizations,
        // users: users,
        requests: requests,
        invitations: invitations,
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
    return async (dispatch: ThunkDispatch<StoreState, void, DashboardAction>, getState: () => StoreState) => {
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

            const requests = await requestModelClient.getUserRequests()

            const invitations = await requestModelClient.getUserInvitations()

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

            // now notifications???
            const feedsClient = new FeedsClient({
                token,
                feedsServiceURL: config.services.Feeds.url
            })
            const notifications = await feedsClient.getNotifications()

            dispatch(loadSuccess(orgs, requests, invitations, pendingGroupRequests))
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

