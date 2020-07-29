import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { ActionFlag } from '../index';

import {
    StoreState,
    RequestResourceType
} from '../../store/types';
import { UserQuery } from '../../../data/model';
import * as orgModel from '../../../data/models/organization/model';
import * as userModel from '../../../data/models/user';
import * as requestModel from '../../../data/models/requests';
import { AnError } from '../../../combo/error/api';
import { makeError } from '../../../lib/error';
import * as viewOrgActions from '../viewOrg';
import { OrganizationUser, AsyncModelState } from '../../store/types/common';
import { SubViewKind, ViewAccessibleOrgViewModel } from '../../store/types/views/Main/views/ViewOrg';
import { extractViewOrgModelPlus, extractViewOrgSubView } from '../../../lib/stateExtraction';
// View Loading

export interface Load extends Action {
    type: ActionFlag.INVITE_USER_LOAD;
}

export interface LoadStart extends Action {
    type: ActionFlag.INVITE_USER_LOAD_START;
}

export interface LoadSuccess extends Action {
    type: ActionFlag.INVITE_USER_LOAD_SUCCESS,
    organization: orgModel.Organization,
    users: Array<OrganizationUser> | null;
}

export interface LoadError extends Action {
    type: ActionFlag.INVITE_USER_LOAD_ERROR,
    error: AnError;
}

export interface Unload extends Action {
    type: ActionFlag.INVITE_USER_UNLOAD;
}


export function loadStart(): LoadStart {
    return {
        type: ActionFlag.INVITE_USER_LOAD_START
    };
}

export function loadSuccess(organization: orgModel.Organization): LoadSuccess {
    return {
        type: ActionFlag.INVITE_USER_LOAD_SUCCESS,
        organization: organization,
        users: null
    };
}

export function loadError(error: AnError): LoadError {
    return {
        type: ActionFlag.INVITE_USER_LOAD_ERROR,
        error: error
    };
}

export function unload(): Unload {
    return {
        type: ActionFlag.INVITE_USER_UNLOAD
    };
}

export function load(organizationId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart());

        const { username, token, config } = extractViewOrgModelPlus(getState());

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            const org = await orgClient.getOrg(organizationId);
            if (org.kind !== orgModel.OrganizationKind.NORMAL) {
                dispatch(loadError(makeError({
                    code: 'invalid state',
                    message: 'Organization kind must be "NORMAL"'
                })));
                return;
            }
            dispatch(loadSuccess(org));
        } catch (ex) {
            dispatch(loadError(makeError({
                code: ex.name,
                message: ex.message
            })));
        }
    };
}

// User Selection



export interface InviteUserSearchUsers extends Action {
    type: ActionFlag.INVITE_USER_SEARCH_USERS,
    query: UserQuery;
}

interface SearchUsersStart extends Action {
    type: ActionFlag.INVITE_USER_SEARCH_USERS_START;
}

export interface SearchUsersSuccess extends Action {
    type: ActionFlag.INVITE_USER_SEARCH_USERS_SUCCESS,
    users: Array<OrganizationUser> | null;
}

interface SearchUsersError extends Action {
    type: ActionFlag.INVITE_USER_SEARCH_USERS_ERROR,
    error: AnError;
}

function searchUsersStart(): SearchUsersStart {
    return {
        type: ActionFlag.INVITE_USER_SEARCH_USERS_START
    };
}

function searchUsersSuccess(users: Array<OrganizationUser> | null): SearchUsersSuccess {
    return {
        type: ActionFlag.INVITE_USER_SEARCH_USERS_SUCCESS,
        users: users
    };
}

function searchUsersError(error: AnError): SearchUsersError {
    return {
        type: ActionFlag.INVITE_USER_SEARCH_USERS_ERROR,
        error: error
    };
}

export function inviteUserSearchUsers(query: UserQuery) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(searchUsersStart());

        if (query.query.length === 0) {
            dispatch(searchUsersSuccess(null));
            return;
        }

        const { viewModel, token, config } = extractViewOrgModelPlus(getState());

        const org = viewModel.organization;

        const userClient = new userModel.UserModel({
            token,
            userProfileServiceURL: config.services.UserProfile.url
        });

        let owner: string = org.owner.username;
        let adminUsers: Array<string> = [];
        let members: Array<string> = [];
        let invited: Array<string> = [];
        let requested: Array<string> = [];

        org.members.forEach((member) => {
            switch (member.type) {
                case orgModel.MemberType.MEMBER:
                    members.push(member.username);
                    break;
                case orgModel.MemberType.ADMIN:
                    adminUsers.push(member.username);
            }
        });

        const inboxRequests = viewModel.requestInbox;
        const outboxRequests = viewModel.requestOutbox;

        inboxRequests.forEach((request) => {
            if (request.resourceType === RequestResourceType.USER) {
                requested.push(request.requester);
            }
        });

        outboxRequests.forEach((request) => {
            if (request.resourceType === RequestResourceType.USER) {
                invited.push(request.user);
            }
        });

        try {
            const users = await userClient.searchUsers(query);

            const orgUsers: Array<OrganizationUser> = users.map(({ username, realname }) => {
                let relation: orgModel.UserRelationToOrganization;
                if (username === owner) {
                    relation = orgModel.UserRelationToOrganization.OWNER;
                } else if (adminUsers.indexOf(username) >= 0) {
                    relation = orgModel.UserRelationToOrganization.ADMIN;
                } else if (invited.indexOf(username) >= 0) {
                    relation = orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING;
                } else if (requested.indexOf(username) >= 0) {
                    relation = orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING;
                } else if (members.indexOf(username) >= 0) {
                    relation = orgModel.UserRelationToOrganization.MEMBER;
                } else {
                    relation = orgModel.UserRelationToOrganization.NONE;
                }
                return {
                    username, realname,
                    relation: relation
                };
            });
            dispatch(searchUsersSuccess(orgUsers));
        } catch (ex) {
            dispatch(searchUsersError(makeError({
                code: ex.name,
                message: ex.message
            })));
        }

    };
}

// Select a user

export interface SelectUser extends Action {
    type: ActionFlag.INVITE_USER_SELECT_USER,
    username: string;
}

export interface SelectUserStart extends Action {
    type: ActionFlag.INVITE_USER_SELECT_USER_START;
}

export interface SelectUserSuccess extends Action {
    type: ActionFlag.INVITE_USER_SELECT_USER_SUCCESS,
    user: userModel.User,
    relation: orgModel.UserRelationToOrganization;
}

export interface SelectUserError extends Action {
    type: ActionFlag.INVITE_USER_SELECT_USER_ERROR,
    error: AnError;
}


function selectUserStart(): SelectUserStart {
    return {
        type: ActionFlag.INVITE_USER_SELECT_USER_START
    };
}

function selectUserSuccess(user: userModel.User, relation: orgModel.UserRelationToOrganization): SelectUserSuccess {
    return {
        type: ActionFlag.INVITE_USER_SELECT_USER_SUCCESS,
        user: user,
        relation: relation
    };
}

function selectUserError(error: AnError): SelectUserError {
    return {
        type: ActionFlag.INVITE_USER_SELECT_USER_ERROR,
        error: error
    };
}

// function isUserRequest(request: requestModel.Request, username: string): request is requestModel.UserRequest {
//     const req: requestModel.UserRequest = <requestModel.UserRequest>request;
//     if (req.resourceType === RequestResourceType.USER &&
//         req.type === requestModel.RequestType.REQUEST &&
//         req.requester === username) {
//         return true;
//     }
//     return false;
// }

// function isUserInvitation(request: requestModel.Request, username: string): request is requestModel.UserRequest {
//     const req: requestModel.UserInvitation = <requestModel.UserInvitation>request;
//     if (req.resourceType === RequestResourceType.USER &&
//         req.type === requestModel.RequestType.INVITATION &&
//         req.user &&
//         req.user === username) {
//         return true;
//     }
//     return false;
// }

function getUserRelation(user: userModel.User, viewModel: ViewAccessibleOrgViewModel): orgModel.UserRelationToOrganization {

    const organization = viewModel.organization;
    if (user.username === organization.owner.username) {
        return orgModel.UserRelationToOrganization.OWNER;
    }
    const member = organization.members.find((member) => {
        return member.username === user.username;
    });
    if (member) {
        switch (member.type) {
            case orgModel.MemberType.ADMIN:
                return orgModel.UserRelationToOrganization.ADMIN;
            case orgModel.MemberType.OWNER:
                return orgModel.UserRelationToOrganization.OWNER;
            case orgModel.MemberType.MEMBER:
                return orgModel.UserRelationToOrganization.MEMBER;
        }
    }

    const inboxRequests = viewModel.requestInbox;
    const outboxRequests = viewModel.requestOutbox;

    if (inboxRequests.some((request) => {
        return (request.resourceType === RequestResourceType.USER &&
            request.requester === user.username);
    })) {
        return orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING;
    }

    if (outboxRequests.some((request) => {
        return (request.resourceType === RequestResourceType.USER &&
            request.user === user.username);
    })) {
        return orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING;
    }


    // outboxRequests.forEach((request) => {
    //     if (request.resourceType === RequestResourceType.USER) {
    //         invited.push(request.user)
    //     }
    // })

    // TODO revive
    // for (const request of organization.adminRequests) {
    //     if (isUserInvitation(request, user.username)) {
    //         return UserRelationToOrganization.MEMBER_INVITATION_PENDING
    //     } else if (isUserRequest(request, user.username)) {
    //         return UserRelationToOrganization.MEMBER_REQUEST_PENDING
    //     }
    // }

    return orgModel.UserRelationToOrganization.VIEW;
}

function ensureViewModel(state: StoreState) {
    const subView = extractViewOrgSubView(state);

    if (subView.kind !== SubViewKind.INVITE_USER) {
        throw new Error('Wrong subview');
    }

    if (subView.model.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Wrong async state');
    }

    return subView.model.value;
}

export function selectUser(selectedUsername: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(selectUserStart());

        const { viewModel: viewOrgViewModel, token, config } = extractViewOrgModelPlus(getState());

        // let orgViewModel: ViewOrgViewModel;
        // let view: InviteUserViewModel;

        const userClient = new userModel.UserModel({
            token,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            const user = await userClient.getUser(selectedUsername);
            const relation = getUserRelation(user, viewOrgViewModel);
            dispatch(selectUserSuccess(user, relation));
        } catch (ex) {
            dispatch(selectUserError(makeError({
                code: ex.name,
                message: ex.message
            })));
        }
    };
}

// Now send the invitation, whew!

export interface SendInvitation extends Action {
    type: ActionFlag.INVITE_USER_SEND_INVITATION;
}

export interface SendInvitationStart extends Action {
    type: ActionFlag.INVITE_USER_SEND_INVITATION_START;
}

export interface SendInvitationSuccess extends Action {
    type: ActionFlag.INVITE_USER_SEND_INVITATION_SUCCESS;
}

export interface SendInvitationError extends Action {
    type: ActionFlag.INVITE_USER_SEND_INVITATION_ERROR,
    error: AnError;
}

export function sendInvitationStart(): SendInvitationStart {
    return {
        type: ActionFlag.INVITE_USER_SEND_INVITATION_START
    };
}

export function sendInvitationSuccess(): SendInvitationSuccess {
    return {
        type: ActionFlag.INVITE_USER_SEND_INVITATION_SUCCESS
    };
}

export function sendInvitationError(error: AnError): SendInvitationError {
    return {
        type: ActionFlag.INVITE_USER_SEND_INVITATION_ERROR,
        error: error
    };
}

export function sendInvitation() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(sendInvitationStart());

        const { username, token, config } = extractViewOrgModelPlus(getState());
        const { selectedUser, organization: { id } } = ensureViewModel(getState());

        // const { selectedUser, organization: { id } } = view.viewModel;

        if (!selectedUser) {
            return;
        }

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        });

        requestClient.inviteUserToJoinOrg(id, selectedUser.user.username)
            .then(() => {
                dispatch(sendInvitationSuccess());
                dispatch(viewOrgActions.reload(id));
            })
            .catch((err) => {
                dispatch(sendInvitationError(makeError({
                    code: err.name,
                    message: err.message
                })));
            });
    };
}
