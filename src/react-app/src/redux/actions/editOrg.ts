import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import { StoreState, Organization, AppError, UIError, UIErrorType, FieldState, EditableOrganization } from '../../types'
import { Model, Validation } from '../../data/model'

// ACTIONS

// Loading the editor
export interface EditOrgEdit extends Action {
    type: ActionFlag.EDIT_ORG_EDIT,
    id: string
}

export interface EditOrgEditStart extends Action {
    type: ActionFlag.EDIT_ORG_EDIT_START,
    id: string
}

export interface EditOrgEditSuccess extends Action {
    type: ActionFlag.EDIT_ORG_EDIT_SUCCESS,
    editedOrganization: EditableOrganization,
    organization: Organization
}

export interface EditOrgEditError extends Action<ActionFlag.EDIT_ORG_EDIT_ERROR> {
    type: ActionFlag.EDIT_ORG_EDIT_ERROR,
    error: AppError
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
    name: string
}

export interface EditOrgUpdateGravatarHashSuccess {
    type: ActionFlag.EDIT_ORG_UPDATE_GRAVATAR_HASH_SUCCESS,
    gravatarHash: string
}

export interface EditOrgUpdateGravatarHashError extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_GRAVATAR_HASH_ERROR,
    gravatarHash: string,
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


// ACTION CREATORS

export function editOrgStart(id: string): EditOrgEditStart {
    return {
        type: ActionFlag.EDIT_ORG_EDIT_START,
        id: id
    }
}

export function editOrgEditStart() {
    return {
        type: ActionFlag.EDIT_ORG_EDIT_START
    }
}

export function editOrgEditSuccess(editedOrganization: EditableOrganization, organization: Organization) {
    return {
        type: ActionFlag.EDIT_ORG_EDIT_SUCCESS,
        editedOrganization: editedOrganization,
        organization: organization
    }
}

export function editOrgEditError(error: AppError): EditOrgEditError {
    return {
        type: ActionFlag.EDIT_ORG_EDIT_ERROR,
        error: error
    }
}

// Evaluate

export function editOrgEvaluateOk(): EditOrgEvaluateOK {
    return {
        type: ActionFlag.EDIT_ORG_EVALUATE_OK
    }
}

export function EditOrgEvaluateErrors(): EditOrgEvaluateErrors {
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

export function editOrgUpdateGravatarHashSuccess(gravatarHash: string): EditOrgUpdateGravatarHashSuccess {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_GRAVATAR_HASH_SUCCESS,
        gravatarHash: gravatarHash
    }
}

export function editOrgUpdateGravatarHashError(gravatarHash: string, error: UIError): EditOrgUpdateGravatarHashError {
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

export function editOrgEdit(organizationId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(editOrgStart(organizationId))

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = getState()

        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        return model.getOrg(organizationId)
            .then((org) => {
                const editableOrg: EditableOrganization = {
                    id: {
                        value: org.id,
                        status: FieldState.UNEDITED_OK,
                        error: {
                            type: UIErrorType.NONE,
                            message: ''
                        }
                    },
                    name: {
                        value: org.name,
                        status: FieldState.UNEDITED_OK,
                        error: {
                            type: UIErrorType.NONE,
                            message: ''
                        }
                    },
                    gravatarHash: {
                        value: org.gravatarHash,
                        status: FieldState.UNEDITED_OK,
                        error: {
                            type: UIErrorType.NONE,
                            message: ''
                        }
                    },
                    description: {
                        value: org.description,
                        status: FieldState.UNEDITED_OK,
                        error: {
                            type: UIErrorType.NONE,
                            message: ''
                        }
                    }
                }
                dispatch(editOrgEditSuccess(editableOrg, org))
            })
            .catch((err) => {
                console.error('load org error', err)
                dispatch(editOrgEditError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}


export function editOrgSave() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(editOrgSaveStart())

        const { auth: { authorization: { token, username } },
            editOrg: { organizationId, editedOrganization },
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
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
            description: editedOrganization.description.value
        }

        model.updateOrg(organizationId, update)
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
        const { editOrg: { editedOrganization } } = getState()

        const { editOrg: editState } = getState()

        if (!editedOrganization) {
            dispatch(EditOrgEvaluateErrors())
            return
        }

        if (!(editedOrganization.name.status === FieldState.EDITED_OK ||
            editedOrganization.name.status === FieldState.UNEDITED_OK)) {
            dispatch(EditOrgEvaluateErrors())
            return
        }

        // if (editedOrganization.id.status !== FieldState.EDITED_OK) {
        //     dispatch(EditOrgEvaluateErrors())
        //     return
        // }

        if (!(editedOrganization.gravatarHash.status === FieldState.EDITED_OK ||
            editedOrganization.gravatarHash.status === FieldState.UNEDITED_OK)) {
            dispatch(EditOrgEvaluateErrors())
            return
        }

        if (!(editedOrganization.description.status === FieldState.EDITED_OK ||
            editedOrganization.description.status === FieldState.UNEDITED_OK)) {
            dispatch(EditOrgEvaluateErrors())
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

export function editOrgUpdateGravatarHash(name: string) {
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
        const { auth: { authorization: { token, username } },
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })
        const [validatedDescription, error] = model.validateOrgDescription(description)

        if (error.type === UIErrorType.ERROR) {
            dispatch(editOrgUpdateDescriptionError(validatedDescription, error))
        } else {
            dispatch(editOrgUpdateDescriptionSuccess(validatedDescription))
        }
        dispatch(editOrgEvaluate())
    }
}