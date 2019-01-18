import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { ActionFlag } from './index'

import * as orgModel from '../../data/models/organization/model'
import * as userModel from '../../data/models/user'
import { AppError, StoreState, EditState, ValidationState, UIErrorType, SyncState, ValidationErrorType } from '../../types'
import Validation from '../../data/models/organization/validation';

// Loading

export interface Load extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LOAD
}

export interface LoadStart extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_START
}

export interface LoadSuccess extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_SUCCESS
    organization: orgModel.Organization
    editableMemberProfile: orgModel.EditableMemberProfile
}

export interface LoadError extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_ERROR,
    error: AppError
}

export interface Unload extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_UNLOAD
}

export function loadStart(): LoadStart {
    return {
        type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_START
    }
}

export function loadSuccess(organization: orgModel.Organization, editableMemberProfile: orgModel.EditableMemberProfile): LoadSuccess {
    return {
        type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_SUCCESS,
        organization: organization,
        editableMemberProfile: editableMemberProfile
    }
}

export function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_ERROR,
        error: error
    }
}

export function unload() {
    return {
        type: ActionFlag.MANAGE_MEMBERSHIP_UNLOAD
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

        // TODO: here is where we would hook into the store state entities for groups
        try {
            const org = await orgClient.getOrg(organizationId)
            const thisMember = org.members.find((member) => {
                return member.username === username
            })
            if (!thisMember) {
                console.error('did not find member', username, org)
                dispatch(loadError({
                    code: 'notfound',
                    message: 'The member "' + username + '" was not found in this org'
                }))
                return
            }
            const editableProfile: orgModel.EditableMemberProfile = {
                title: {
                    value: thisMember.title,
                    remoteValue: thisMember.title,
                    syncState: SyncState.NEW,
                    validationState: {
                        type: ValidationErrorType.OK,
                        validatedAt: new Date()
                    }
                }
            }

            dispatch(loadSuccess(org, editableProfile))
        } catch (ex) {
            console.error('Error :(', ex)
            dispatch(loadError({
                code: ex.name,
                message: ex.message
            }))
        }
    }
}

// Leaving the Org

export interface LeaveOrg extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LEAVE_ORG
    organizationId: orgModel.OrganizationID
}

interface LeaveOrgSuccess extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LEAVE_ORG_SUCCESS
}

interface LeaveOrgError extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LEAVE_ORG_ERROR,
    error: AppError
}

export function leaveOrg(organizationId: orgModel.OrganizationID) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(({
            type: ActionFlag.MANAGE_MEMBERSHIP_LEAVE_ORG_START
        }))

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            orgClient.removeMember(organizationId, username)
            dispatch({
                type: ActionFlag.MANAGE_MEMBERSHIP_LEAVE_ORG_SUCCESS
            })
        } catch (ex) {
            console.error('ERROR leaving org', ex)
            dispatch({
                type: ActionFlag.MANAGE_MEMBERSHIP_LEAVE_ORG_ERROR,
                error: {
                    code: ex.name,
                    message: ex.message
                }
            })
        }


    }
}


// Updating Profile
