import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'

import { AppError, StoreState, Organization, BriefUser, User, InviteUserValue, ComponentLoadingState, RequestType, RequestResourceType, UserInvitation, UserRequest, UserRelationToOrganization, MemberType, OrganizationUser, GroupRequest } from '../../types'
import { Model, UserQuery } from '../../data/model'
import Organizations from '../../components/browseOrgs/Organizations';

// View Loading

export interface Load extends Action {
    type: ActionFlag.INVITE_USER_LOAD
}

export interface LoadStart extends Action {
    type: ActionFlag.INVITE_USER_LOAD_START
}

export interface LoadReady extends Action {
    type: ActionFlag.INVITE_USER_LOAD_READY,
    organization: Organization,
    users: Array<OrganizationUser> | null
}

export interface LoadError extends Action {
    type: ActionFlag.INVITE_USER_LOAD_ERROR,
    error: AppError
}

export interface Unload extends Action {
    type: ActionFlag.INVITE_USER_UNLOAD
}


export function loadStart(): LoadStart {
    return {
        type: ActionFlag.INVITE_USER_LOAD_START
    }
}

export function loadReady(organization: Organization): LoadReady {
    return {
        type: ActionFlag.INVITE_USER_LOAD_READY,
        organization: organization,
        users: null
    }
}

export function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.INVITE_USER_LOAD_ERROR,
        error: error
    }
}

export function unload(): Unload {
    return {
        type: ActionFlag.INVITE_USER_UNLOAD
    }
}

export function inviteUserLoad(organizationId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

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
            null
            // model.searchUsers({
            //     query: '',
            //     excludedUsers: []
            // })
        ])
            .then(([org, users]) => {
                // users.sort((a, b) => {
                //     return a.username.localeCompare(b.username)
                // })
                dispatch(loadReady(org))
            })
            .catch((err) => {
                dispatch(loadError({
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
    users: Array<OrganizationUser> | null
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

function searchUsersSuccess(users: Array<OrganizationUser> | null): SearchUsersSuccess {
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

        if (query.query.length === 0) {
            dispatch(searchUsersSuccess(null))
            return
        }

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

        // excludedUsers.push(org.owner.user.username)

        let owner: string = org.owner.user.username
        let adminUsers: Array<string> = []
        let members: Array<string> = []
        let invited: Array<string> = []
        let requested: Array<string> = []

        org.members.forEach((member) => {
            switch (member.type) {
                case MemberType.MEMBER:
                    members.push(member.user.username)
                case MemberType.ADMIN:
                    adminUsers.push(member.user.username)
            }
        })

        // excludedUsers = excludedUsers.concat(org.members.map((member) => {
        //     return member.
        // }))

        org.adminRequests.forEach((request) => {
            if (request.resourceType === RequestResourceType.USER) {
                switch (request.type) {
                    case RequestType.INVITATION:
                        invited.push((<UserInvitation>request).user.username)
                        // excludedUsers.push((<UserInvitation>request).user.username)
                        break
                    case RequestType.REQUEST:
                        requested.push((<UserRequest>request).requester.username)
                    // excludedUsers.push((<UserRequest>request).requester.username)
                }
            }
        })

        Promise.all([
            model.searchUsers(query)
        ])
            .then(([users]) => {
                // const filteredUsers = users.filter((user) => {
                //     return (excludedUsers.indexOf(user.username) === -1)
                // })
                const orgUsers: Array<OrganizationUser> = users.map(({ username, realname }) => {
                    let relation: UserRelationToOrganization
                    if (username === owner) {
                        relation = UserRelationToOrganization.OWNER
                    } else if (adminUsers.indexOf(username) >= 0) {
                        relation = UserRelationToOrganization.ADMIN
                    } else if (invited.indexOf(username) >= 0) {
                        relation = UserRelationToOrganization.MEMBER_INVITATION_PENDING
                    } else if (requested.indexOf(username) >= 0) {
                        relation = UserRelationToOrganization.MEMBER_REQUEST_PENDING
                    } else if (members.indexOf(username) >= 0) {
                        relation = UserRelationToOrganization.MEMBER
                    } else {
                        relation = UserRelationToOrganization.NONE
                    }
                    return {
                        username, realname,
                        relation: relation
                    }
                })
                dispatch(searchUsersSuccess(orgUsers))
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
    user: User,
    relation: UserRelationToOrganization
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

function selectUserSuccess(user: User, relation: UserRelationToOrganization): SelectUserSuccess {
    return {
        type: ActionFlag.INVITE_USER_SELECT_USER_SUCCESS,
        user: user,
        relation: relation
    }
}

function selectUserError(error: AppError): SelectUserError {
    return {
        type: ActionFlag.INVITE_USER_SELECT_USER_ERROR,
        error: error
    }
}

function isUserRequest(request: GroupRequest, username: string): request is UserRequest {
    const req: UserRequest = <UserRequest>request
    if (req.resourceType === RequestResourceType.USER &&
        req.type === RequestType.REQUEST &&
        req.requester.username === username) {
        return true
    }
    return false
}

function isUserInvitation(request: GroupRequest, username: string): request is UserRequest {
    const req: UserInvitation = <UserInvitation>request
    if (req.resourceType === RequestResourceType.USER &&
        req.type === RequestType.INVITATION &&
        req.user &&
        req.user.username === username) {
        return true
    }
    return false
}

function getUserRelation(user: User, organization: Organization): UserRelationToOrganization {
    if (user.username === organization.owner.user.username) {
        return UserRelationToOrganization.OWNER
    }
    const member = organization.members.find((member) => {
        return member.user.username === user.username
    })
    if (member) {
        switch (member.type) {
            case MemberType.ADMIN:
                return UserRelationToOrganization.ADMIN
            case MemberType.OWNER:
                return UserRelationToOrganization.OWNER
            case MemberType.MEMBER:
                return UserRelationToOrganization.MEMBER
        }
    }

    for (const request of organization.adminRequests) {
        if (isUserInvitation(request, user.username)) {
            return UserRelationToOrganization.MEMBER_INVITATION_PENDING
        } else if (isUserRequest(request, user.username)) {
            return UserRelationToOrganization.MEMBER_REQUEST_PENDING
        }
    }

    return UserRelationToOrganization.VIEW
}

export function selectUser(selectedUsername: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(selectUserStart())

        const {
            inviteUserView: { value },
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        if (!value) {
            dispatch(selectUserError({
                code: 'invalid state',
                message: 'select user invalid state -- no view value'
            }))
            return
        }

        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        model.getUser(selectedUsername)
            .then((user) => {
                const relation = getUserRelation(user, value.organization)
                dispatch(selectUserSuccess(user, relation))
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

        model.requestJoinGroup(id, selectedUser.user.username)
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