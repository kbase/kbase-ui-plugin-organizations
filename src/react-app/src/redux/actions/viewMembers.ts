import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'

import { Organization, AppError, StoreState, MemberType } from '../../types'
import { Model } from '../../data/model'

// LOADING

export interface ViewMembersLoad extends Action {
    type: ActionFlag.VIEW_MEMBERS_LOAD,
    organizationId: string
}

export interface ViewMembersLoadStart extends Action {
    type: ActionFlag.VIEW_MEMBERS_LOAD_START
}

export interface ViewMembersUnload extends Action {
    type: ActionFlag.VIEW_MEMBERS_UNLOAD
}

export interface ViewMembersLoadSuccess extends Action {
    type: ActionFlag.VIEW_MEMBERS_LOAD_SUCCESS,
    organization: Organization
}

export interface ViewMembersLoadError extends Action {
    type: ActionFlag.VIEW_MEMBERS_LOAD_ERROR,
    error: AppError
}


export function viewMembersLoadStart(): ViewMembersLoadStart {
    return {
        type: ActionFlag.VIEW_MEMBERS_LOAD_START
    }
}

export function viewMembersLoadSuccess(organization: Organization): ViewMembersLoadSuccess {
    return {
        type: ActionFlag.VIEW_MEMBERS_LOAD_SUCCESS,
        organization: organization
    }
}

export function viewMembersLoadError(error: AppError): ViewMembersLoadError {
    return {
        type: ActionFlag.VIEW_MEMBERS_LOAD_ERROR,
        error: error
    }
}

export function viewMembersUnload(): ViewMembersUnload {
    return {
        type: ActionFlag.VIEW_MEMBERS_UNLOAD
    }
}

export function viewMembersLoad(organizationId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(viewMembersLoadStart())

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

        model.getOrg(organizationId)
            .then((org) => {
                dispatch(viewMembersLoadSuccess(org))
            })
            .catch((err) => {
                dispatch(viewMembersLoadError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

// Promoting member to admin

export interface ViewMembersPromoteToAdmin extends Action {
    type: ActionFlag.VIEW_MEMBERS_PROMOTE_TO_ADMIN,
    memberUsername: string
}

export interface ViewMembersPromoteToAdminStart extends Action {
    type: ActionFlag.VIEW_MEMBERS_PROMOTE_TO_ADMIN_START
}

export interface ViewMembersPromoteToAdminSuccess extends Action {
    type: ActionFlag.VIEW_MEMBERS_PROMOTE_TO_ADMIN_SUCCESS,
    memberUsername: string
}

export interface ViewMembersPromoteToAdminError extends Action {
    type: ActionFlag.VIEW_MEMBERS_PROMOTE_TO_ADMIN_ERROR,
    error: AppError
}


export function viewMembersPromoteToAdminStart(): ViewMembersPromoteToAdminStart {
    return {
        type: ActionFlag.VIEW_MEMBERS_PROMOTE_TO_ADMIN_START
    }
}

export function viewMembersPromoteToAdminSuccess(memberUsername: string): ViewMembersPromoteToAdminSuccess {
    return {
        type: ActionFlag.VIEW_MEMBERS_PROMOTE_TO_ADMIN_SUCCESS,
        memberUsername
    }
}

export function viewMembersPromoteToAdminError(error: AppError): ViewMembersPromoteToAdminError {
    return {
        type: ActionFlag.VIEW_MEMBERS_PROMOTE_TO_ADMIN_ERROR,
        error: error
    }
}

export function viewMembersPromoteToAdmin(memberUsername: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(viewMembersPromoteToAdminStart())

        const {
            auth: { authorization: { token, username } },
            app: { config },
            viewMembersView: { view } } = getState()
        if (view === null) {
            throw new Error('view is not populated')
        }
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        model.memberToAdmin(view.organization.id, memberUsername)
            .then((org) => {
                dispatch(viewMembersPromoteToAdminSuccess(memberUsername))

                // Brute force, update the in-store organization
                // const { viewMembersView: { view } } = getState()

                // if (!view) {
                //     dispatch(viewMembersPromoteToAdminError({
                //         code: 'NoView',
                //         message: 'No view for viewMembers'
                //     }))
                //     return
                // }


                // dispatch(viewMembersLoad(view.organization.id))
            })
            .catch((err: Error) => {
                dispatch(viewMembersPromoteToAdminError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

// Demote admin to member

export interface ViewMembersDemoteToMember extends Action {
    type: ActionFlag.VIEW_MEMBERS_DEMOTE_TO_MEMBER,
    memberUsername: string
}

export interface ViewMembersDemoteToMemberStart extends Action {
    type: ActionFlag.VIEW_MEMBERS_DEMOTE_TO_MEMBER_START
}

export interface ViewMembersDemoteToMemberSuccess extends Action {
    type: ActionFlag.VIEW_MEMBERS_DEMOTE_TO_MEMBER_SUCCESS,
    memberUsername: string
}

export interface ViewMembersDemoteToMemberError extends Action {
    type: ActionFlag.VIEW_MEMBERS_DEMOTE_TO_MEMBER_ERROR,
    error: AppError
}


export function viewMembersDemoteToMemberStart(): ViewMembersDemoteToMemberStart {
    return {
        type: ActionFlag.VIEW_MEMBERS_DEMOTE_TO_MEMBER_START
    }
}

export function viewMembersDemoteToMemberSuccess(memberUsername: string): ViewMembersDemoteToMemberSuccess {
    return {
        type: ActionFlag.VIEW_MEMBERS_DEMOTE_TO_MEMBER_SUCCESS,
        memberUsername: memberUsername
    }
}

export function viewMembersDemoteToMemberError(error: AppError): ViewMembersDemoteToMemberError {
    return {
        type: ActionFlag.VIEW_MEMBERS_DEMOTE_TO_MEMBER_ERROR,
        error: error
    }
}

export function viewMembersDemoteToMember(memberUsername: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(viewMembersDemoteToMemberStart())

        const {
            auth: { authorization: { token, username } },
            app: { config },
            viewMembersView: { view } } = getState()
        if (view === null) {
            throw new Error('view is not populated')
        }
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        model.adminToMember(view.organization.id, memberUsername)
            .then((org) => {
                dispatch(viewMembersDemoteToMemberSuccess(memberUsername))
                // dispatch(viewMembersLoad(view.organization.id))
            })
            .catch((err: Error) => {
                dispatch(viewMembersDemoteToMemberError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

// Remove a member

export interface ViewMembersRemoveMember extends Action {
    type: ActionFlag.VIEW_MEMBERS_REMOVE_MEMBER,
    memberUsername: string
}

interface RemoveMemberStart extends Action {
    type: ActionFlag.VIEW_MEMBERS_REMOVE_MEMBER_START
}

interface RemoveMemberSuccess extends Action {
    type: ActionFlag.VIEW_MEMBERS_REMOVE_MEMBER_SUCCESS
}

interface RemoveMemberError extends Action {
    type: ActionFlag.VIEW_MEMBERS_REMOVE_MEMBER_ERROR,
    error: AppError
}

function removeMemberStart(): RemoveMemberStart {
    return {
        type: ActionFlag.VIEW_MEMBERS_REMOVE_MEMBER_START
    }
}

function removeMemberSuccess(): RemoveMemberSuccess {
    return {
        type: ActionFlag.VIEW_MEMBERS_REMOVE_MEMBER_SUCCESS
    }
}

function removeMemberError(error: AppError): RemoveMemberError {
    return {
        type: ActionFlag.VIEW_MEMBERS_REMOVE_MEMBER_ERROR,
        error: error
    }
}

export function viewMembersRemoveMember(memberUsername: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(removeMemberStart())

        const {
            auth: { authorization: { token, username } },
            app: { config },
            viewMembersView: { view } } = getState()
        if (view === null) {
            throw new Error('view is not populated')
        }
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        model.removeMember(view.organization.id, memberUsername)
            .then(() => {
                dispatch(removeMemberSuccess())
                dispatch(viewMembersLoad(view.organization.id))
            })
            .catch((err: Error) => {
                dispatch(removeMemberError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}