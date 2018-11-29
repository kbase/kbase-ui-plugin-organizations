import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import { StoreState, Organization, AppError, UIError, UIErrorType, FieldState } from '../../types'
import { Model, Validation } from '../../data/model'

// ACTIONS

export interface AddOrg extends Action {
    type: ActionFlag.ADD_ORG
}

export interface AddOrgStart extends Action {
    type: ActionFlag.ADD_ORG_START
}

export interface AddOrgSuccess extends Action {
    type: ActionFlag.ADD_ORG_SUCCESS,
    organization: Organization
}

export interface AddOrgError extends Action<ActionFlag.ADD_ORG_ERROR> {
    type: ActionFlag.ADD_ORG_ERROR,
    error: AppError
}

// Editing

export interface AddOrgEdit extends Action<ActionFlag.ADD_ORG_EDIT> {
    type: ActionFlag.ADD_ORG_EDIT;
}

export interface AddOrgEditStart {
    type: ActionFlag.ADD_ORG_EDIT_START
}

export interface AddOrgEditFinish {
    type: ActionFlag.ADD_ORG_EDIT_FINISH
}

// Evaluating state of form 

export interface AddOrgEvaluate extends Action<ActionFlag.ADD_ORG_EVALUATE> {
    type: ActionFlag.ADD_ORG_EVALUATE
}

export interface AddOrgEvaluateOK extends Action<ActionFlag.ADD_ORG_EVALUATE_OK> {
    type: ActionFlag.ADD_ORG_EVALUATE_OK
}

export interface AddOrgEvaluateErrors extends Action<ActionFlag.ADD_ORG_EVALUATE_ERRORS> {
    type: ActionFlag.ADD_ORG_EVALUATE_ERRORS
}

// Updating name field

export interface AddOrgUpdateName extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_NAME,
    name: string
}

export interface AddOrgUpdateNameSuccess {
    type: ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS,
    name: string
}

export interface AddOrgUpdateNameError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_NAME_ERROR,
    name: string,
    error: UIError
}

// Updating gravatar hash field

export interface AddOrgUpdateGravatarHash extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH,
    name: string
}

export interface AddOrgUpdateGravatarHashSuccess {
    type: ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_SUCCESS,
    gravatarHash: string
}

export interface AddOrgUpdateGravatarHashError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_ERROR,
    gravatarHash: string,
    error: UIError
}

// Updating id Field

export interface AddOrgUpdateId extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_ID,
    id: string
}

export interface AddOrgUpdateIdSuccess {
    type: ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS,
    id: string
}

export interface AddOrgUpdateIdError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_ID_ERROR,
    id: string,
    error: UIError
}

// Updating description field

export interface AddOrgUpdateDescription extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION,
    description: string
}

export interface AddOrgUpdateDescriptionSuccess {
    type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS,
    description: string
}

export interface AddOrgUpdateDescriptionError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR,
    description: string,
    error: UIError
}


// ACTION CREATORS

export function addOrgStart(): AddOrgStart {
    return {
        type: ActionFlag.ADD_ORG_START
    }
}

export function addOrgSuccess(org: Organization): AddOrgSuccess {
    return {
        type: ActionFlag.ADD_ORG_SUCCESS,
        organization: org
    }
}

export function addOrgError(error: AppError): AddOrgError {
    return {
        type: ActionFlag.ADD_ORG_ERROR,
        error: error
    }
}

export function addOrgEditStart() {
    return {
        type: ActionFlag.ADD_ORG_EDIT_START
    }
}

export function addOrgEditFinish() {
    return {
        type: ActionFlag.ADD_ORG_EDIT_FINISH
    }
}

// Evaluate

export function addOrgEvaluateOk(): AddOrgEvaluateOK {
    return {
        type: ActionFlag.ADD_ORG_EVALUATE_OK
    }
}

export function AddOrgEvaluateErrors(): AddOrgEvaluateErrors {
    return {
        type: ActionFlag.ADD_ORG_EVALUATE_ERRORS
    }
}

// Update Name

export function addOrgUpdateNameSuccess(name: string): AddOrgUpdateNameSuccess {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS,
        name: name
    }
}

export function addOrgUpdateNameError(name: string, error: UIError): AddOrgUpdateNameError {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_NAME_ERROR,
        name: name,
        error: error
    }
}

export function addOrgUpdateIdSuccess(id: string): AddOrgUpdateIdSuccess {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS,
        id: id
    }
}

// Update Gravatar Hash

export function addOrgUpdateGravatarHashSuccess(gravatarHash: string): AddOrgUpdateGravatarHashSuccess {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_SUCCESS,
        gravatarHash: gravatarHash
    }
}

export function addOrgUpdateGravatarHashError(gravatarHash: string, error: UIError): AddOrgUpdateGravatarHashError {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_ERROR,
        gravatarHash: gravatarHash,
        error: error
    }
}


// Update Id

export function addOrgUpdateIdError(id: string, error: UIError): AddOrgUpdateIdError {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_ID_ERROR,
        id: id,
        error: error
    }
}

export function addOrgUpdateDescriptionSuccess(description: string): AddOrgUpdateDescriptionSuccess {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS,
        description: description
    }
}

export function addOrgUpdateDescriptionError(description: string, error: UIError): AddOrgUpdateDescriptionError {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR,
        description: description,
        error: error
    }
}

// ACTION THUNKS

export function addOrgEdit() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(addOrgEditStart())
        dispatch(addOrgEvaluate())
    }
}

export function addOrg() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(addOrgStart())

        const { auth: { authorization: { token, username } },
            addOrg: { newOrganization },
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        if (!newOrganization) {
            dispatch(addOrgError({
                code: 'app',
                message: 'The new organization data does not yet exist'
            }))
            return;
        }

        model.addOrg(newOrganization, username)
            .then((org: Organization) => {
                dispatch(addOrgSuccess(org))
            })
            .catch((error) => {
                console.error('error adding', newOrganization, error)
                dispatch(addOrgError({
                    code: 'invalid',
                    message: error.message
                }))
            })
    }
}

export function addOrgEvaluate() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const { addOrg: { newOrganization } } = getState()

        const { addOrg: editState } = getState()

        if (!newOrganization) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.name.status !== FieldState.EDITED_OK) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.id.status !== FieldState.EDITED_OK) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.gravatarHash.status !== FieldState.EDITED_OK) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.description.status !== FieldState.EDITED_OK) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        dispatch(addOrgEvaluateOk())
    }
}

function newModelFromState(state: StoreState) {
    const { auth: { authorization: { token, username } },
        app: { config } } = state
    return new Model({
        token, username,
        groupsServiceURL: config.services.Groups.url,
        userProfileServiceURL: config.services.UserProfile.url,
        workspaceServiceURL: config.services.Workspace.url,
        serviceWizardURL: config.services.ServiceWizard.url
    })
}

export function addOrgUpdateName(name: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedName, error] = Validation.validateOrgName(name)

        if (error.type === UIErrorType.ERROR) {
            dispatch(addOrgUpdateNameError(validatedName, error))
        } else {
            dispatch(addOrgUpdateNameSuccess(validatedName))
        }
        dispatch(addOrgEvaluate())
    }
}

export function addOrgUpdateGravatarHash(name: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validateGravatarHash, error] = Validation.validateOrgGravatarHash(name)

        if (error.type === UIErrorType.ERROR) {
            dispatch(addOrgUpdateGravatarHashError(validateGravatarHash, error))
        } else {
            dispatch(addOrgUpdateGravatarHashSuccess(validateGravatarHash))
        }
        dispatch(addOrgEvaluate())
    }
}

export function addOrgUpdateId(id: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const [validatedId, error] = Validation.validateOrgId(id)
        if (error.type === UIErrorType.ERROR) {
            dispatch(addOrgUpdateIdError(validatedId, error))
            dispatch(addOrgEvaluate())
            return
        }
        const model = newModelFromState(getState())
        model.groupExists(validatedId)
            .then((exists) => {
                if (exists) {
                    dispatch(addOrgUpdateIdError(validatedId, {
                        type: UIErrorType.ERROR,
                        message: 'This org id is already in use'
                    }))
                } else {
                    dispatch(addOrgUpdateIdSuccess(validatedId))
                }

                dispatch(addOrgEvaluate())
            })
    }
}

export function addOrgUpdateDescription(description: string) {
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
            dispatch(addOrgUpdateDescriptionError(validatedDescription, error))
        } else {
            dispatch(addOrgUpdateDescriptionSuccess(validatedDescription))
        }
        dispatch(addOrgEvaluate())
    }
}