import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'

import { AppError, StoreState, Organization, BriefUser, User, InviteUserValue, ComponentLoadingState, RequestType, RequestResourceType, UserInvitation, UserRequest } from '../../types'
import { Model, UserQuery } from '../../data/model'
import * as userProfile from '../../data/userProfile'

// View Loading

export interface InviteUserLoad extends Action {
    type: ActionFlag.INVITE_USER_LOAD
}

export interface InviteUserLoadStart extends Action {
    type: ActionFlag.INVITE_USER_LOAD_START
}

export interface InviteUserLoadReady extends Action {
    type: ActionFlag.INVITE_USER_LOAD_READY,
    organization: Organization,
    // users: Array<User>
}

export interface InviteUserLoadError extends Action {
    type: ActionFlag.INVITE_USER_LOAD_ERROR,
    error: AppError
}



export function inviteUserLoadStart(): InviteUserLoadStart {
    return {
        type: ActionFlag.INVITE_USER_LOAD_START
    }
}

export function inviteUserLoadReady(organization: Organization): InviteUserLoadReady {
    return {
        type: ActionFlag.INVITE_USER_LOAD_READY,
        organization: organization,
        // users: users
    }
}

export function inviteUserLoadError(error: AppError): InviteUserLoadError {
    return {
        type: ActionFlag.INVITE_USER_LOAD_ERROR,
        error: error
    }
}

export function inviteUserLoad(organizationId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(inviteUserLoadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        Promise.all([
            model.getOrg(organizationId),
            // userProfileClient.getAllUsers()
        ])
            .then(([org, users]) => {
                dispatch(inviteUserLoadReady(org))
            })
            .catch((err) => {
                dispatch(inviteUserLoadError({
                    code: err.name,
                    message: err.message
                }))
            })

    }
}

// User Selection



export interface InviteUserSearchUsers extends Action {
    type: ActionFlag.INVITE_USER_SEARCH_USERS,
    query: UserQuery
}

interface SearchUsersStart extends Action {
    type: ActionFlag.INVITE_USER_SEARCH_USERS_START
}

export interface SearchUsersSuccess extends Action {
    type: ActionFlag.INVITE_USER_SEARCH_USERS_SUCCESS,
    users: Array<BriefUser>
}

interface SearchUsersError extends Action {
    type: ActionFlag.INVITE_USER_SEARCH_USERS_ERROR,
    error: AppError
}

function searchUsersStart(): SearchUsersStart {
    return {
        type: ActionFlag.INVITE_USER_SEARCH_USERS_START
    }
}

function searchUsersSuccess(users: Array<BriefUser>): SearchUsersSuccess {
    return {
        type: ActionFlag.INVITE_USER_SEARCH_USERS_SUCCESS,
        users: users
    }
}

function searchUsersError(error: AppError): SearchUsersError {
    return {
        type: ActionFlag.INVITE_USER_SEARCH_USERS_ERROR,
        error: error
    }
}

export function inviteUserSearchUsers(query: UserQuery) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(searchUsersStart())

        const {
            inviteUserView: { value },
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        // TODO: better form of type narrowing? 
        if (value === null) {
            return
        }
        const org = value.organization

        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        let excludedUsers: Array<string> = []

        excludedUsers.push(org.owner.user.username)
        excludedUsers = excludedUsers.concat(org.members.map((member) => {
            return member.user.username
        }))

        org.adminRequests.forEach((request) => {
            if (request.resourceType === RequestResourceType.USER) {
                switch (request.type) {
                    case RequestType.INVITATION:
                        excludedUsers.push((<UserInvitation>request).user.username)
                    case RequestType.REQUEST:
                        excludedUsers.push((<UserRequest>request).requester.username)
                }
            }
        })

        Promise.all([
            model.searchUsers(query)
        ])
            .then(([users]) => {
                const filteredUsers = users.filter((user) => {
                    return (excludedUsers.indexOf(user.username) === -1)
                })
                dispatch(searchUsersSuccess(filteredUsers))
            })
            .catch((err) => {
                dispatch(searchUsersError({
                    code: err.name,
                    message: err.message
                }))
            })
    }

}

// Select a user

export interface SelectUser extends Action {
    type: ActionFlag.INVITE_USER_SELECT_USER,
    username: string
}

export interface SelectUserStart extends Action {
    type: ActionFlag.INVITE_USER_SELECT_USER_START
}

export interface SelectUserSuccess extends Action {
    type: ActionFlag.INVITE_USER_SELECT_USER_SUCCESS,
    user: User
}

export interface SelectUserError extends Action {
    type: ActionFlag.INVITE_USER_SELECT_USER_ERROR,
    error: AppError
}


function selectUserStart(): SelectUserStart {
    return {
        type: ActionFlag.INVITE_USER_SELECT_USER_START
    }
}

function selectUserSuccess(user: User): SelectUserSuccess {
    return {
        type: ActionFlag.INVITE_USER_SELECT_USER_SUCCESS,
        user: user
    }
}

function selectUserError(error: AppError): SelectUserError {
    return {
        type: ActionFlag.INVITE_USER_SELECT_USER_ERROR,
        error: error
    }
}

export function selectUser(selectedUsername: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(selectUserStart())

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        model.getUser(selectedUsername)
            .then((user) => {
                dispatch(selectUserSuccess(user))
            })
            .catch((err) => {
                dispatch(selectUserError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

// Now send the invitation, whew!

export interface SendInvitation extends Action {
    type: ActionFlag.INVITE_USER_SEND_INVITATION
}

export interface SendInvitationStart extends Action {
    type: ActionFlag.INVITE_USER_SEND_INVITATION_START
}

export interface SendInvitationSuccess extends Action {
    type: ActionFlag.INVITE_USER_SEND_INVITATION_SUCCESS
}

export interface SendInvitationError extends Action {
    type: ActionFlag.INVITE_USER_SEND_INVITATION_ERROR,
    error: AppError
}


export function sendInvitationStart(): SendInvitationStart {
    return {
        type: ActionFlag.INVITE_USER_SEND_INVITATION_START
    }
}

export function sendInvitationSuccess(): SendInvitationSuccess {
    return {
        type: ActionFlag.INVITE_USER_SEND_INVITATION_SUCCESS
    }
}

export function sendInvitationError(error: AppError): SendInvitationError {
    return {
        type: ActionFlag.INVITE_USER_SEND_INVITATION_ERROR,
        error: error
    }
}

export function sendInvitation() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(sendInvitationStart())

        const {
            auth: { authorization: { token, username } },
            app: { config },
            inviteUserView: { loadingState, value, error } } = getState()

        if (loadingState !== ComponentLoadingState.SUCCESS) {
            return
        }

        if (value === null) {
            return
        }

        const { selectedUser, organization: { id } } = value as InviteUserValue

        if (!selectedUser) {
            return
        }

        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        model.requestJoinGroup(id, selectedUser.username)
            .then((groupRequest) => {
                dispatch(sendInvitationSuccess())
            })
            .catch((err) => {
                dispatch(sendInvitationError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}