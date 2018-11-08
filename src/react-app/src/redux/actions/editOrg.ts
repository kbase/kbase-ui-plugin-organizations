import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import {
    StoreState, Organization, EditedOrganization,
    AppError, UIError
} from '../../types'
import { Model } from '../../data/model'

// ACTIONS

// Top level action which triggers an edit org session (load org)
export interface EditOrg extends Action {
    type: ActionFlag.EDIT_ORG,
    id: string
}

export interface EditOrgStart extends Action {
    type: ActionFlag.EDIT_ORG_START
}

export interface EditOrgSuccess extends Action {
    type: ActionFlag.EDIT_ORG_SUCCESS,
    organization: EditedOrganization
}

export interface EditOrgError extends Action {
    type: ActionFlag.EDIT_ORG_ERROR,
    error: AppError
}

// Saving an edited org
export interface EditOrgSave extends Action {
    type: ActionFlag.EDIT_ORG_SAVE
}

export interface EditOrgSaveStart extends Action {
    type: ActionFlag.EDIT_ORG_SAVE_START
}

export interface EditOrgSaveSuccess extends Action {
    type: ActionFlag.EDIT_ORG_SAVE_SUCCESS,
    organization: Organization
}

export interface EditOrgSaveError extends Action {
    type: ActionFlag.EDIT_ORG_SAVE_ERROR,
    error: AppError
}

// Editing fields

// Edit name
export interface EditOrgUpdateName extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_NAME,
    name: string
}

export interface EditOrgUpdateNameSuccess extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS,
    name: string
}

export interface EditOrgUpdateNameError extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_NAME_ERROR,
    name: string,
    error: UIError
}

// Edit description
export interface EditOrgUpdateDescription extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION,
    name: string
}

export interface EditOrgUpdateDescriptionSuccess extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_SUCCESS,
    description: string
}

export interface EditOrgUpdateDescriptionError extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_ERROR,
    description: string,
    error: UIError
}

// Edit description

// ACTION CREATORS

// Setting up editor

export function editOrgStart(): EditOrgStart {
    return {
        type: ActionFlag.EDIT_ORG_START
    }
}

export function editOrgSuccess(org: EditedOrganization): EditOrgSuccess {
    return {
        type: ActionFlag.EDIT_ORG_SUCCESS,
        organization: org
    }
}

export function editOrgError(error: AppError) {
    return {
        type: ActionFlag.EDIT_ORG_ERROR,
        error: error
    }
}

// Saving modified org

export function editOrgSaveStart(): EditOrgSaveStart {
    return {
        type: ActionFlag.EDIT_ORG_SAVE_START
    }
}

export function editOrgSaveSuccess(organization: Organization): EditOrgSaveSuccess {
    return {
        type: ActionFlag.EDIT_ORG_SAVE_SUCCESS,
        organization: organization
    }
}

export function editOrgSaveError(error: AppError): EditOrgSaveError {
    return {
        type: ActionFlag.EDIT_ORG_SAVE_ERROR,
        error: error
    }
}


// Editing fields

// Edit name

export function editOrgUpdateNameSuccess(name: string): EditOrgUpdateNameSuccess {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS,
        name: name
    }
}

export function editOrgUpdateNameError(name: string, error: UIError): EditOrgUpdateNameError {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_NAME_ERROR,
        name: name,
        error: error
    }
}

// Edit name

export function editOrgUpdateDescriptionSuccess(description: string): EditOrgUpdateDescriptionSuccess {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_SUCCESS,
        description: description
    }
}

export function editOrgUpdateDescriptionError(description: string, error: UIError): EditOrgUpdateDescriptionError {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_ERROR,
        description: description,
        error: error
    }
}

// ACTION THUNKS

export function editOrg(id: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(editOrgStart())

        const { auth: { authorization: { token } },
            app: { config } } = getState()
        const model = new Model({
            token,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        return model.getOrg(id)
            .then((org) => {
                const editableOrg: EditedOrganization = {
                    id: {
                        value: org.id
                    },
                    name: {
                        value: org.name
                    },
                    description: {
                        value: org.description
                    }
                }
                dispatch(editOrgSuccess(editableOrg))
            })
            .catch((err) => {
                dispatch(editOrgError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}

export function editOrgUpdateName(name: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const { auth: { authorization: { token } },
            app: { config } } = getState()
        const model = new Model({
            token,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        const [orgName, error] = model.validateOrgName(name)
        // TODO: a better of satisfying TS
        if (orgName !== null) {
            dispatch(editOrgUpdateNameSuccess(orgName))
        }
        if (error !== null) {
            dispatch(editOrgUpdateNameError(orgName, error))
        }
    }
}

export function editOrgUpdateDescription(description: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const { auth: { authorization: { token } },
            app: { config } } = getState()
        const model = new Model({
            token,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        const [orgDescription, error] = model.validateOrgDescription(description)
        // TODO: a better of satisfying TS
        if (orgDescription !== null) {
            dispatch(editOrgUpdateDescriptionSuccess(orgDescription))
        }
        if (error !== null) {
            dispatch(editOrgUpdateDescriptionError(orgDescription, error))
        }
    }
}

export function editOrgSave() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(editOrgSaveStart())

        const { editOrg: { editedOrganization },
            auth: { authorization: { token } },
            app: { config } } = getState()
        const model = new Model({
            token,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        if (!editedOrganization) {
            dispatch(editOrgSaveError({
                code: 'app',
                message: 'Missing edited organization!'
            }))
            return
        }

        if (editedOrganization.name.error || editedOrganization.description.error) {
            dispatch(editOrgSaveError({
                code: 'invalid',
                message: 'One or more of the edited fields have an error'
            }))
            return
        }

        const organizationUpdate = {
            name: editedOrganization.name.value,
            description: editedOrganization.description.value
        }

        model.updateOrg(editedOrganization.id.value, organizationUpdate)
            .then((organization) => {
                dispatch(editOrgSaveSuccess(organization))
            })
            .catch((err) => {
                dispatch(editOrgSaveError({
                    code: 'error-saving',
                    message: err.message
                }))
            })
    }
}