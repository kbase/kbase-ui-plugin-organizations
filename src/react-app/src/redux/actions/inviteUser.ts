import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'

import { AppError, StoreState, User, InviteUserViewModel, ComponentLoadingState, RequestType, RequestResourceType, MemberType, OrganizationUser } from '../../types'
import { Model, UserQuery } from '../../data/model'
import * as orgModel from '../../data/models/organization/model'
import * as userModel from '../../data/models/user'
import * as requestModel from '../../data/models/requests'

// View Loading

export interface Load extends Action {
    type: ActionFlag.INVITE_USER_LOAD
}

export interface LoadStart extends Action {
    type: ActionFlag.INVITE_USER_LOAD_START
}

export interface LoadSuccess extends Action {
    type: ActionFlag.INVITE_USER_LOAD_SUCCESS,
    organization: orgModel.Organization,
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

export function loadSuccess(organization: orgModel.Organization): LoadSuccess {
    return {
        type: ActionFlag.INVITE_USER_LOAD_SUCCESS,
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

export function load(organizationId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            const org = await orgClient.getOrg(organizationId)
            if (org.kind !== orgModel.OrganizationKind.NORMAL) {
                dispatch(loadError({
                    code: 'invalid state',
                    message: 'Organization kind must be "NORMAL"'
                }))
                return
            }
            dispatch(loadSuccess(org))
        } catch (ex) {
            dispatch(loadError({
                code: ex.name,
                message: ex.message
            }))
        }
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
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(searchUsersStart())

        if (query.query.length === 0) {
            dispatch(searchUsersSuccess(null))
            return
        }

        const {
            views: {
                inviteUserView: { viewModel }
            },
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        // TODO: better form of type narrowing? 
        if (viewModel === null) {
            return
        }
        const org = viewModel.organization

        const userClient = new userModel.UserModel({
            token,
            userProfileServiceURL: config.services.UserProfile.url
        })

        let excludedUsers: Array<string> = []

        // excludedUsers.push(org.owner.user.username)

        let owner: string = org.owner.username
        let adminUsers: Array<string> = []
        let members: Array<string> = []
        let invited: Array<string> = []
        let requested: Array<string> = []

        org.members.forEach((member) => {
            switch (member.type) {
                case MemberType.MEMBER:
                    members.push(member.username)
                case MemberType.ADMIN:
                    adminUsers.push(member.username)
            }
        })

        // excludedUsers = excludedUsers.concat(org.members.map((member) => {
        //     return member.
        // }))

        // TODO revive
        // org.adminRequests.forEach((request) => {
        //     if (request.resourceType === RequestResourceType.USER) {
        //         switch (request.type) {
        //             case RequestType.INVITATION:
        //                 invited.push((<UserInvitation>request).user.username)
        //                 // excludedUsers.push((<UserInvitation>request).user.username)
        //                 break
        //             case RequestType.REQUEST:
        //                 requested.push((<UserRequest>request).requester.username)
        //             // excludedUsers.push((<UserRequest>request).requester.username)
        //         }
        //     }
        // })

        try {
            const users = await userClient.searchUsers(query)


            // const filteredUsers = users.filter((user) => {
            //     return (excludedUsers.indexOf(user.username) === -1)
            // })
            const orgUsers: Array<OrganizationUser> = users.map(({ username, realname }) => {
                let relation: orgModel.UserRelationToOrganization
                if (username === owner) {
                    relation = orgModel.UserRelationToOrganization.OWNER
                } else if (adminUsers.indexOf(username) >= 0) {
                    relation = orgModel.UserRelationToOrganization.ADMIN
                } else if (invited.indexOf(username) >= 0) {
                    relation = orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING
                } else if (requested.indexOf(username) >= 0) {
                    relation = orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING
                } else if (members.indexOf(username) >= 0) {
                    relation = orgModel.UserRelationToOrganization.MEMBER
                } else {
                    relation = orgModel.UserRelationToOrganization.NONE
                }
                return {
                    username, realname,
                    relation: relation
                }
            })
            dispatch(searchUsersSuccess(orgUsers))
        } catch (ex) {
            dispatch(searchUsersError({
                code: ex.name,
                message: ex.message
            }))
        }

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
    relation: orgModel.UserRelationToOrganization
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

function selectUserSuccess(user: User, relation: orgModel.UserRelationToOrganization): SelectUserSuccess {
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

function isUserRequest(request: requestModel.Request, username: string): request is requestModel.UserRequest {
    const req: requestModel.UserRequest = <requestModel.UserRequest>request
    if (req.resourceType === RequestResourceType.USER &&
        req.type === RequestType.REQUEST &&
        req.requester === username) {
        return true
    }
    return false
}

function isUserInvitation(request: requestModel.Request, username: string): request is requestModel.UserRequest {
    const req: requestModel.UserInvitation = <requestModel.UserInvitation>request
    if (req.resourceType === RequestResourceType.USER &&
        req.type === RequestType.INVITATION &&
        req.user &&
        req.user === username) {
        return true
    }
    return false
}

function getUserRelation(user: User, organization: orgModel.Organization): orgModel.UserRelationToOrganization {
    if (user.username === organization.owner.username) {
        return orgModel.UserRelationToOrganization.OWNER
    }
    const member = organization.members.find((member) => {
        return member.username === user.username
    })
    if (member) {
        switch (member.type) {
            case MemberType.ADMIN:
                return orgModel.UserRelationToOrganization.ADMIN
            case MemberType.OWNER:
                return orgModel.UserRelationToOrganization.OWNER
            case MemberType.MEMBER:
                return orgModel.UserRelationToOrganization.MEMBER
        }
    }

    // TODO revive
    // for (const request of organization.adminRequests) {
    //     if (isUserInvitation(request, user.username)) {
    //         return UserRelationToOrganization.MEMBER_INVITATION_PENDING
    //     } else if (isUserRequest(request, user.username)) {
    //         return UserRelationToOrganization.MEMBER_REQUEST_PENDING
    //     }
    // }

    return orgModel.UserRelationToOrganization.VIEW
}

export function selectUser(selectedUsername: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(selectUserStart())

        const {
            views: {
                inviteUserView: { viewModel }
            },
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        if (!viewModel) {
            dispatch(selectUserError({
                code: 'invalid state',
                message: 'select user invalid state -- no view value'
            }))
            return
        }

        const userClient = new userModel.UserModel({
            token,
            userProfileServiceURL: config.services.UserProfile.url
        })

        userClient.getUser(selectedUsername)
            .then((user) => {
                // TODO: use the new model getUserRelation, or even getUserWithRelation
                const relation = getUserRelation(user, viewModel.organization)
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
            views: {
                inviteUserView: { loadingState, viewModel, error }
            }
        } = getState()

        if (loadingState !== ComponentLoadingState.SUCCESS) {
            return
        }

        if (viewModel === null) {
            return
        }

        const { selectedUser, organization: { id } } = viewModel as InviteUserViewModel

        if (!selectedUser) {
            return
        }

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        requestClient.inviteUserToJoinOrg(id, selectedUser.user.username)
            .then((request) => {
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