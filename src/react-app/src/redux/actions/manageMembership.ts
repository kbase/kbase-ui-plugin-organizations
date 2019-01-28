import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { ActionFlag } from './index'

import * as orgModel from '../../data/models/organization/model'
import { StoreState, SyncState, ValidationErrorType } from '../../types'
import { AnError, makeError } from '../../lib/error'

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
    error: AnError
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

export function loadError(error: AnError): LoadError {
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
            if (org.kind !== orgModel.OrganizationKind.NORMAL) {
                dispatch(loadError(makeError({
                    code: 'invalid state',
                    message: 'Organization must be of kind "NORMAL"'
                })))
                return
            }

            if (!org.isMember) {
                dispatch(loadError(makeError({
                    code: 'notfound',
                    message: 'The user "' + username + '" is not a member of this org'
                })))
                return
            }
            const thisMember = org.members.find((member) => {
                return member.username === username
            })
            if (!thisMember) {
                dispatch(loadError(makeError({
                    code: 'notfound',
                    message: 'The user "' + username + '" was not found in the members list'
                })))
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
            dispatch(loadError(makeError({
                code: ex.name,
                message: ex.message
            })))
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
    error: AnError
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
