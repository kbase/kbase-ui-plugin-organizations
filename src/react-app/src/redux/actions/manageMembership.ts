import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import * as orgModel from '../../data/models/organization/model'
import { StoreState, SyncState, ValidationErrorType } from '../../types'
import { AnError, makeError } from '../../lib/error'
import Validation from '../../data/models/organization/validation'
import { ActionFlag } from '.'
import * as viewOrgActions from './viewOrg'

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
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
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

            let thisMember = org.members.find((member) => {
                return member.username === username
            })

            if (!thisMember) {
                if (org.owner.username === username) {
                    thisMember = org.owner
                }
            }

            if (!thisMember) {
                dispatch(loadError(makeError({
                    code: 'notfound',
                    message: 'The user "' + username + '" was not found in the members list'
                })))
                return
            }

            const editableProfile: orgModel.EditableMemberProfile = {
                title: {
                    value: thisMember.title || '',
                    remoteValue: thisMember.title,
                    syncState: SyncState.NEW,
                    validationState: {
                        type: ValidationErrorType.OK,
                        validatedAt: new Date()
                    }
                }
            }
            dispatch(loadSuccess(org, editableProfile))
            // dispatch(evaluate())
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
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        })

        try {
            orgClient.removeMember(organizationId, username)
            dispatch({
                type: ActionFlag.MANAGE_MEMBERSHIP_LEAVE_ORG_SUCCESS
            })
            dispatch(viewOrgActions.reload(organizationId))
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

export interface UpdateTitle {
    type: ActionFlag.MANAGE_MEMBERSHIP_UPDATE_TITLE,
    title: string
}

export interface UpdateTitleStart {
    type: ActionFlag.MANAGE_MEMBERSHIP_UPDATE_TITLE_START
}

export interface UpdateTitleSuccess {
    type: ActionFlag.MANAGE_MEMBERSHIP_UPDATE_TITLE_SUCCESS,
    title: string
}

export interface UpdateTitleError {
    type: ActionFlag.MANAGE_MEMBERSHIP_UPDATE_TITLE_ERROR,
    error: AnError
}

export interface Save {
    type: ActionFlag.MANAGE_MEMBERSHIP_SAVE,
    memberProfile: orgModel.EditableMemberProfile
}

export interface SaveStart {
    type: ActionFlag.MANAGE_MEMBERSHIP_SAVE_START
}

export interface SaveSuccess {
    type: ActionFlag.MANAGE_MEMBERSHIP_SAVE_SUCCESS
}

export interface SaveError {
    type: ActionFlag.MANAGE_MEMBERSHIP_SAVE_ERROR,
    error: AnError
}

export function updateTitle(title: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedTitle, error] = Validation.validateMemberTitle(title)

        if (error.type !== ValidationErrorType.OK) {
            dispatch({
                type: ActionFlag.MANAGE_MEMBERSHIP_UPDATE_TITLE_ERROR,
                error: makeError({
                    code: 'invalid',
                    message: error.message
                })
            })
        } else {
            dispatch({
                type: ActionFlag.MANAGE_MEMBERSHIP_UPDATE_TITLE_SUCCESS,
                title: validatedTitle
            })
        }
        dispatch(evaluate())
    }
}

export interface Evaluate extends Action<ActionFlag.MANAGE_MEMBERSHIP_EVALUATE> {
    type: ActionFlag.MANAGE_MEMBERSHIP_EVALUATE
}

export interface EvaluateSuccess extends Action<ActionFlag.MANAGE_MEMBERSHIP_EVALUATE_SUCCESS> {
    type: ActionFlag.MANAGE_MEMBERSHIP_EVALUATE_SUCCESS,
}

export interface EvaluateError extends Action<ActionFlag.MANAGE_MEMBERSHIP_EVALUATE_ERROR> {
    type: ActionFlag.MANAGE_MEMBERSHIP_EVALUATE_ERROR
}

export function evaluate() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const state = getState()
        if (!state.views.manageMembershipView.viewModel) {
            throw new Error('Argh, no view model')
        }

        const {
            views: {
                manageMembershipView: {
                    viewModel: {
                        editableMemberProfile
                    }
                }
            }
        } = state

        if (editableMemberProfile.title.validationState.type !== ValidationErrorType.OK) {
            dispatch({
                type: ActionFlag.MANAGE_MEMBERSHIP_EVALUATE_ERROR
            })
            return
        }

        dispatch({
            type: ActionFlag.MANAGE_MEMBERSHIP_EVALUATE_SUCCESS
        })
    }
}

export interface Save extends Action<ActionFlag.MANAGE_MEMBERSHIP_SAVE> {
    type: ActionFlag.MANAGE_MEMBERSHIP_SAVE
}

export interface SaveStart extends Action<ActionFlag.MANAGE_MEMBERSHIP_SAVE_START> {
    type: ActionFlag.MANAGE_MEMBERSHIP_SAVE_START
}

export interface SaveSuccess extends Action<ActionFlag.MANAGE_MEMBERSHIP_SAVE_SUCCESS> {
    type: ActionFlag.MANAGE_MEMBERSHIP_SAVE_SUCCESS
}

export interface SaveError extends Action<ActionFlag.MANAGE_MEMBERSHIP_SAVE_ERROR> {
    type: ActionFlag.MANAGE_MEMBERSHIP_SAVE_ERROR
}

export function save() {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.MANAGE_MEMBERSHIP_SAVE_START
        })

        const state = getState()
        if (!state.views.manageMembershipView.viewModel) {
            throw new Error('Argh, no view model?!?')
        }

        const {
            auth: { authorization: { token, username } },
            views: {
                manageMembershipView: {
                    viewModel: { organization, editableMemberProfile }
                }
            },
            app: { config }
        } = state

        const update = {
            title: editableMemberProfile.title.value
        }

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        })

        try {
            await orgClient.updateMember(organization.id, username, update)
            dispatch({
                type: ActionFlag.MANAGE_MEMBERSHIP_SAVE_SUCCESS
            })
        } catch (ex) {
            console.error('error saving member profile', ex)
            dispatch({
                type: ActionFlag.MANAGE_MEMBERSHIP_SAVE_ERROR,
                error: makeError({
                    code: 'error',
                    message: ex.message
                })
            })
        }
        dispatch(evaluate())
    }
}
