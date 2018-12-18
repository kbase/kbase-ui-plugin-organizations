import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import { StoreState, AppError, UIError, UIErrorType, EditableOrganization, ValidationState, EditState } from '../../types'
import Validation from '../../data/models/organization/validation'
import * as orgModel from '../../data/models/organization/model'

// ACTIONS

// Loading the editor
export interface Load extends Action {
    type: ActionFlag.EDIT_ORG_LOAD,
    organizationId: string
}

export interface LoadStart extends Action {
    type: ActionFlag.EDIT_ORG_LOAD_START
}

export interface LoadSuccess extends Action {
    type: ActionFlag.EDIT_ORG_LOAD_SUCCESS,
    editedOrganization: EditableOrganization,
    organization: orgModel.Organization
}

export interface LoadError extends Action<ActionFlag.EDIT_ORG_LOAD_ERROR> {
    type: ActionFlag.EDIT_ORG_LOAD_ERROR,
    error: AppError
}

export interface Unload extends Action<ActionFlag.EDIT_ORG_UNLOAD> {
    type: ActionFlag.EDIT_ORG_UNLOAD
}

// Evaluating state of form 

export interface EditOrgEvaluate extends Action<ActionFlag.EDIT_ORG_EVALUATE> {
    type: ActionFlag.EDIT_ORG_EVALUATE
}

export interface EditOrgEvaluateOK extends Action<ActionFlag.EDIT_ORG_EVALUATE_OK> {
    type: ActionFlag.EDIT_ORG_EVALUATE_OK
}

export interface EditOrgEvaluateErrors extends Action<ActionFlag.EDIT_ORG_EVALUATE_ERRORS> {
    type: ActionFlag.EDIT_ORG_EVALUATE_ERRORS
}

// Saving

export interface EditOrgSave extends Action<ActionFlag.EDIT_ORG_SAVE> {
    type: ActionFlag.EDIT_ORG_SAVE
}

export interface EditOrgSaveStart extends Action<ActionFlag.EDIT_ORG_SAVE_START> {
    type: ActionFlag.EDIT_ORG_SAVE_START
}

export interface EditOrgSaveSuccess extends Action<ActionFlag.EDIT_ORG_SAVE_SUCCESS> {
    type: ActionFlag.EDIT_ORG_SAVE_SUCCESS
}

export interface EditOrgSaveError extends Action<ActionFlag.EDIT_ORG_SAVE_ERROR> {
    type: ActionFlag.EDIT_ORG_SAVE_ERROR,
    error: AppError
}

// Updating name field

export interface EditOrgUpdateName extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_NAME,
    name: string
}

export interface EditOrgUpdateNameSuccess {
    type: ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS,
    name: string
}

export interface EditOrgUpdateNameError extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_NAME_ERROR,
    name: string,
    error: UIError
}

// Updating gravatar hash field

export interface EditOrgUpdateGravatarHash extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_GRAVATAR_HASH,
    name: string | null
}

export interface EditOrgUpdateGravatarHashSuccess {
    type: ActionFlag.EDIT_ORG_UPDATE_GRAVATAR_HASH_SUCCESS,
    gravatarHash: string | null
}

export interface EditOrgUpdateGravatarHashError extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_GRAVATAR_HASH_ERROR,
    gravatarHash: string | null,
    error: UIError
}

// Updating id Field

// export interface EditOrgUpdateId extends Action {
//     type: ActionFlag.EDIT_ORG_UPDATE_ID,
//     id: string
// }

// export interface EditOrgUpdateIdSuccess {
//     type: ActionFlag.EDIT_ORG_UPDATE_ID_SUCCESS,
//     id: string
// }

// export interface EditOrgUpdateIdError extends Action {
//     type: ActionFlag.EDIT_ORG_UPDATE_ID_ERROR,
//     id: string,
//     error: UIError
// }

// Updating description field

export interface EditOrgUpdateDescription extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION,
    description: string
}

export interface EditOrgUpdateDescriptionSuccess {
    type: ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_SUCCESS,
    description: string
}

export interface EditOrgUpdateDescriptionError extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_ERROR,
    description: string,
    error: UIError
}

export interface UpdateIsPrivate extends Action<ActionFlag.EDIT_ORG_UPDATE_IS_PRIVATE> {
    type: ActionFlag.EDIT_ORG_UPDATE_IS_PRIVATE
    isPrivate: boolean
}

export interface UpdateIsPrivateSuccess extends Action<ActionFlag.EDIT_ORG_UPDATE_IS_PRIVATE_SUCCESS> {
    type: ActionFlag.EDIT_ORG_UPDATE_IS_PRIVATE_SUCCESS,
    isPrivate: boolean
}

export interface UpdateIsPrivateError extends Action<ActionFlag.EDIT_ORG_UPDATE_IS_PRIVATE_ERROR> {
    type: ActionFlag.EDIT_ORG_UPDATE_IS_PRIVATE_ERROR,
    erro: UIError
}


// ACTION CREATORS

// export function editOrgStart(id: string): LoadStart {
//     return {
//         type: ActionFlag.EDIT_ORG_LOAD_START,
//         id: id
//     }
// }

export function loadStart(): LoadStart {
    return {
        type: ActionFlag.EDIT_ORG_LOAD_START
    }
}

export function loadSuccess(editedOrganization: EditableOrganization, organization: orgModel.Organization): LoadSuccess {
    return {
        type: ActionFlag.EDIT_ORG_LOAD_SUCCESS,
        editedOrganization: editedOrganization,
        organization: organization
    }
}

export function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.EDIT_ORG_LOAD_ERROR,
        error: error
    }
}

export function unload(): Unload {
    return {
        type: ActionFlag.EDIT_ORG_UNLOAD
    }
}

// Evaluate

export function editOrgEvaluateOk(): EditOrgEvaluateOK {
    return {
        type: ActionFlag.EDIT_ORG_EVALUATE_OK
    }
}

export function editOrgEvaluateErrors(): EditOrgEvaluateErrors {
    return {
        type: ActionFlag.EDIT_ORG_EVALUATE_ERRORS
    }
}

// Save

// export function editOrgSave(): EditOrgSave {
//     return {
//         type: ActionFlag.EDIT_ORG_SAVE
//     }
// }

export function editOrgSaveStart(): EditOrgSaveStart {
    return {
        type: ActionFlag.EDIT_ORG_SAVE_START
    }
}

export function editOrgSaveSuccess(): EditOrgSaveSuccess {
    return {
        type: ActionFlag.EDIT_ORG_SAVE_SUCCESS
    }
}

export function editOrgSaveError(error: AppError): EditOrgSaveError {
    return {
        type: ActionFlag.EDIT_ORG_SAVE_ERROR,
        error: error
    }
}

// Update Name

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

// export function editOrgUpdateIdSuccess(id: string): EditOrgUpdateIdSuccess {
//     return {
//         type: ActionFlag.EDIT_ORG_UPDATE_ID_SUCCESS,
//         id: id
//     }
// }

// Update Gravatar Hash

export function editOrgUpdateGravatarHashSuccess(gravatarHash: string | null): EditOrgUpdateGravatarHashSuccess {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_GRAVATAR_HASH_SUCCESS,
        gravatarHash: gravatarHash
    }
}

export function editOrgUpdateGravatarHashError(gravatarHash: string | null, error: UIError): EditOrgUpdateGravatarHashError {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_GRAVATAR_HASH_ERROR,
        gravatarHash: gravatarHash,
        error: error
    }
}


// Update Id

// export function editOrgUpdateIdError(id: string, error: UIError): EditOrgUpdateIdError {
//     return {
//         type: ActionFlag.EDIT_ORG_UPDATE_ID_ERROR,
//         id: id,
//         error: error
//     }
// }

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

export function load(organizationId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = getState()

        // const model = new Model({
        //     token, username,
        //     groupsServiceURL: config.services.Groups.url,
        //     userProfileServiceURL: config.services.UserProfile.url,
        //     workspaceServiceURL: config.services.Workspace.url,
        //     serviceWizardURL: config.services.ServiceWizard.url
        // })

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        return orgClient.getOrg(organizationId)
            .then((org) => {
                const editableOrg: EditableOrganization = {
                    id: {
                        value: org.id,
                        validationState: ValidationState.VALID,
                        editState: EditState.NONE,
                        validatedAt: null,
                        error: {
                            type: UIErrorType.NONE,
                            message: ''
                        }
                    },
                    name: {
                        value: org.name,
                        validationState: ValidationState.VALID,
                        editState: EditState.NONE,
                        validatedAt: null,
                        error: {
                            type: UIErrorType.NONE,
                            message: ''
                        }
                    },
                    gravatarHash: {
                        value: org.gravatarHash,
                        validationState: ValidationState.VALID,
                        editState: EditState.NONE,
                        validatedAt: null,
                        error: {
                            type: UIErrorType.NONE,
                            message: ''
                        }
                    },
                    description: {
                        value: org.description,
                        validationState: ValidationState.VALID,
                        editState: EditState.NONE,
                        validatedAt: null,
                        error: {
                            type: UIErrorType.NONE,
                            message: ''
                        }
                    },
                    isPrivate: {
                        value: org.isPrivate,
                        validationState: ValidationState.VALID,
                        editState: EditState.NONE,
                        validatedAt: null,
                        error: {
                            type: UIErrorType.NONE,
                            message: ''
                        }
                    }
                }
                dispatch(loadSuccess(editableOrg, org))
            })
            .catch((err) => {
                console.error('load org error', err)
                dispatch(loadError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}


export function editOrgSave() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(editOrgSaveStart())

        const state = getState()
        if (!state.views.editOrgView.viewModel) {
            throw new Error('Argh, no view model')
        }

        const {
            auth: { authorization: { token, username } },
            views: {
                editOrgView: {
                    viewModel: { organization, editedOrganization }
                }
            },
            app: { config } } = state

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        if (!editedOrganization) {
            dispatch(editOrgSaveError({
                code: 'app',
                message: 'The new organization data does not yet exist'
            }))
            return;
        }

        const update = {
            name: editedOrganization.name.value,
            gravatarHash: editedOrganization.gravatarHash.value,
            description: editedOrganization.description.value,
            isPrivate: editedOrganization.isPrivate.value
        }

        orgClient.updateOrg(organization.id, update)
            .then(() => {
                dispatch(editOrgSaveSuccess())
            })
            .catch((error) => {
                console.error('error adding', editedOrganization, error)
                dispatch(editOrgSaveError({
                    code: 'invalid',
                    message: error.message
                }))
            })
    }
}

export function editOrgEvaluate() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const state = getState()
        if (!state.views.editOrgView.viewModel) {
            throw new Error('Argh, no view model')
        }

        const {
            views: {
                editOrgView: {
                    viewModel: {
                        editedOrganization
                    }
                }
            }
        } = state

        if (!editedOrganization) {
            dispatch(editOrgEvaluateErrors())
            return
        }

        if (editedOrganization.name.validationState !== ValidationState.VALID) {
            dispatch(editOrgEvaluateErrors())
            return
        }

        // if (editedOrganization.id.status !== FieldState.EDITED_OK) {
        //     dispatch(EditOrgEvaluateErrors())
        //     return
        // }

        if (editedOrganization.gravatarHash.validationState !== ValidationState.VALID) {
            dispatch(editOrgEvaluateErrors())
            return
        }

        if (editedOrganization.description.validationState !== ValidationState.VALID) {
            dispatch(editOrgEvaluateErrors())
            return
        }

        dispatch(editOrgEvaluateOk())
    }
}

export function editOrgUpdateName(name: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedName, error] = Validation.validateOrgName(name)

        if (error.type === UIErrorType.ERROR) {
            dispatch(editOrgUpdateNameError(validatedName, error))
        } else {
            dispatch(editOrgUpdateNameSuccess(validatedName))
        }
        dispatch(editOrgEvaluate())
    }
}

export function editOrgUpdateGravatarHash(name: string | null) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validateGravatarHash, error] = Validation.validateOrgGravatarHash(name)

        if (error.type === UIErrorType.ERROR) {
            dispatch(editOrgUpdateGravatarHashError(validateGravatarHash, error))
        } else {
            dispatch(editOrgUpdateGravatarHashSuccess(validateGravatarHash))
        }
        dispatch(editOrgEvaluate())
    }
}

export function editOrgUpdateDescription(description: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>,
        getState: () => StoreState) => {
        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })
        const [validatedDescription, error] = orgClient.validateOrgDescription(description)

        if (error.type === UIErrorType.ERROR) {
            dispatch(editOrgUpdateDescriptionError(validatedDescription, error))
        } else {
            dispatch(editOrgUpdateDescriptionSuccess(validatedDescription))
        }
        dispatch(editOrgEvaluate())
    }
}

export function updateIsPrivate(isPrivate: boolean) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        // No validation for now.
        dispatch({
            type: ActionFlag.EDIT_ORG_UPDATE_IS_PRIVATE_SUCCESS,
            isPrivate: isPrivate
        })
        dispatch(editOrgEvaluate())
    }
} 