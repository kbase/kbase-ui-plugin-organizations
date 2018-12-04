import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import { StoreState, Organization, AppError, UIError, UIErrorType, FieldState, EditableOrganization, EditState, ValidationState } from '../../types'
import { Model, Validation } from '../../data/model'

// ACTIONS

export interface Save extends Action<ActionFlag.ADD_ORG_SAVE> {
    type: ActionFlag.ADD_ORG_SAVE
}

export interface SaveStart extends Action<ActionFlag.ADD_ORG_SAVE_START> {
    type: ActionFlag.ADD_ORG_SAVE_START
}

export interface SaveSuccess extends Action<ActionFlag.ADD_ORG_SAVE_SUCCESS> {
    type: ActionFlag.ADD_ORG_SAVE_SUCCESS,
    organization: Organization
}

export interface SaveError extends Action<ActionFlag.ADD_ORG_SAVE_ERROR> {
    type: ActionFlag.ADD_ORG_SAVE_ERROR,
    error: AppError
}

// Editing

export interface Load extends Action<ActionFlag.ADD_ORG_LOAD> {
    type: ActionFlag.ADD_ORG_LOAD;
}

export interface LoadStart {
    type: ActionFlag.ADD_ORG_LOAD_START
}

export interface LoadSuccess {
    type: ActionFlag.ADD_ORG_LOAD_SUCCESS,
    newOrganization: EditableOrganization
}

export interface LoadError {
    type: ActionFlag.ADD_ORG_LOAD_ERROR,
    error: AppError
}

export interface Unload {
    type: ActionFlag.ADD_ORG_UNLOAD
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

export interface UpdateName extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_NAME,
    name: string
}

export interface UpdateNameSuccess {
    type: ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS,
    name: string
}

export interface UpdateNameError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_NAME_ERROR,
    name: string,
    error: UIError
}

// Updating gravatar hash field

export interface UpdateGravatarHash extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH,
    name: string
}

export interface UpdateGravatarHashSuccess {
    type: ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_SUCCESS,
    gravatarHash: string
}

export interface UpdateGravatarHashError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_ERROR,
    gravatarHash: string,
    error: UIError
}

// Updating id Field

export interface UpdateId extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_ID,
    id: string
}

export interface UpdateIdSuccess {
    type: ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS,
    id: string
}

export interface UpdateIdError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_ID_ERROR,
    id: string,
    error: UIError
}

export interface UpdateIdPass extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_ID_PASS,
    id: string
}

// Updating description field

export interface UpdateDescription extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION,
    description: string
}

export interface UpdateDescriptionSuccess {
    type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS,
    description: string
}

export interface UpdateDescriptionError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR,
    description: string,
    error: UIError
}


// ACTION CREATORS

export function saveStart(): SaveStart {
    return {
        type: ActionFlag.ADD_ORG_SAVE_START
    }
}

export function saveSuccess(org: Organization): SaveSuccess {
    return {
        type: ActionFlag.ADD_ORG_SAVE_SUCCESS,
        organization: org
    }
}

export function saveError(error: AppError): SaveError {
    return {
        type: ActionFlag.ADD_ORG_SAVE_ERROR,
        error: error
    }
}

// Eiditing

function loadStart() {
    return {
        type: ActionFlag.ADD_ORG_LOAD_START
    }
}

function loadSuccess(newOrganization: EditableOrganization) {
    return {
        type: ActionFlag.ADD_ORG_LOAD_SUCCESS,
        newOrganization: newOrganization
    }
}

function loadError(error: AppError) {
    return {
        type: ActionFlag.ADD_ORG_LOAD_ERROR,
        error: error
    }
}

export function unload() {
    return {
        type: ActionFlag.ADD_ORG_UNLOAD
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

export function updateNameSuccess(name: string): UpdateNameSuccess {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS,
        name: name
    }
}

export function updateNameError(name: string, error: UIError): UpdateNameError {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_NAME_ERROR,
        name: name,
        error: error
    }
}

export function updateIdSuccess(id: string): UpdateIdSuccess {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS,
        id: id
    }
}

export function updateIdPass(id: string): UpdateIdPass {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_ID_PASS,
        id: id
    }
}

// Update Gravatar Hash

export function updateGravatarHashSuccess(gravatarHash: string): UpdateGravatarHashSuccess {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_SUCCESS,
        gravatarHash: gravatarHash
    }
}

export function updateGravatarHashError(gravatarHash: string, error: UIError): UpdateGravatarHashError {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_ERROR,
        gravatarHash: gravatarHash,
        error: error
    }
}


// Update Id

export function updateIdError(id: string, error: UIError): UpdateIdError {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_ID_ERROR,
        id: id,
        error: error
    }
}

export function updateDescriptionSuccess(description: string): UpdateDescriptionSuccess {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS,
        description: description
    }
}

export function updateDescriptionError(description: string, error: UIError): UpdateDescriptionError {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR,
        description: description,
        error: error
    }
}

// ACTION THUNKS

export function load() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

        const newOrg: EditableOrganization = {
            id: {
                value: '',
                editState: EditState.NONE,
                validationState: ValidationState.NONE,
                validatedAt: null,
                error: {
                    type: UIErrorType.NONE
                }
            },
            name: {
                value: '',
                editState: EditState.NONE,
                validationState: ValidationState.NONE,
                validatedAt: null,
                error: {
                    type: UIErrorType.NONE
                }
            },
            gravatarHash: {
                value: '',
                editState: EditState.NONE,
                validationState: ValidationState.NONE,
                validatedAt: null,
                error: {
                    type: UIErrorType.NONE
                }
            },
            description: {
                value: '',
                editState: EditState.NONE,
                validationState: ValidationState.NONE,
                validatedAt: null,
                error: {
                    type: UIErrorType.NONE
                }
            }
        }
        dispatch(loadSuccess(newOrg))
        dispatch(addOrgEvaluate())
    }
}

export function addOrg() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const state = getState()

        // This check is to satisfy TS. Since viewModel is nullable, it has no way 
        // of knowing that our app flow ensures that it is populated.
        // In terms of generalized usage of the redux store, though, there is no
        // way to ensure this! So we really should perform our state checks before 
        // handling any event
        if (!state.addOrgView.viewModel) {
            dispatch(saveError({
                code: 'invalid',
                message: 'Unexpected condition: no view model'
            }))
            return
        }

        // TODO: other validations!!!

        dispatch(saveStart())

        const {
            auth: { authorization: { token, username } },
            addOrgView: { viewModel: { newOrganization } },
            app: { config }
        } = state
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        if (!newOrganization) {
            dispatch(saveError({
                code: 'app',
                message: 'The new organization data does not yet exist'
            }))
            return;
        }

        model.addOrg(newOrganization, username)
            .then((org: Organization) => {
                dispatch(saveSuccess(org))
            })
            .catch((error) => {
                console.error('error adding', newOrganization, error)

                // note that we dispatch an AppError compliant object,
                // which wraps the original exception object.
                dispatch(saveError({
                    code: error.code || error.name,
                    message: error.message,
                    exception: error
                }))
            })
    }
}

export function addOrgEvaluate() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const state = getState()
        if (!state.addOrgView.viewModel) {
            dispatch(saveError({
                code: 'invalid',
                message: 'Unexpected condition: no view model'
            }))
            return
        }


        const { addOrgView: { viewModel: { editState, newOrganization } } } = state

        if (!newOrganization) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.name.validationState !== ValidationState.VALID) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.id.validationState !== ValidationState.VALID) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.gravatarHash.validationState !== ValidationState.VALID) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.description.validationState !== ValidationState.VALID) {
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

export function updateName(name: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedName, error] = Validation.validateOrgName(name)

        if (error.type === UIErrorType.ERROR) {
            dispatch(updateNameError(validatedName, error))
        } else {
            dispatch(updateNameSuccess(validatedName))
        }
        dispatch(addOrgEvaluate())
    }
}

export function updateGravatarHash(name: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validateGravatarHash, error] = Validation.validateOrgGravatarHash(name)

        if (error.type === UIErrorType.ERROR) {
            dispatch(updateGravatarHashError(validateGravatarHash, error))
        } else {
            dispatch(updateGravatarHashSuccess(validateGravatarHash))
        }
        dispatch(addOrgEvaluate())
    }
}

class Debouncer {

    delay: number
    fun: () => void
    canceled: boolean
    timer: number | null

    constructor(delay: number, fun: () => void) {
        this.delay = delay
        this.fun = fun
        this.canceled = false
        this.timer = null
        this.startWaiting()
    }

    startWaiting() {
        if (this.timer) {
            window.clearTimeout(this.timer)
        }
        this.timer = window.setTimeout(() => {
            this.fun()
        }, this.delay)
    }

    cancel() {
        this.canceled = true
    }
}

let activeDebouncer: Debouncer | null = null

export function updateId(id: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const [validatedId, error] = Validation.validateOrgId(id)
        if (error.type === UIErrorType.ERROR) {
            dispatch(updateIdError(validatedId, error))
            dispatch(addOrgEvaluate())
            return
        }

        const { addOrgView: { viewModel } } = getState()
        if (!viewModel) {
            // do nothing
            return
        }

        const lastValidatedAt = viewModel.newOrganization.id.validatedAt
        const now = new Date().getTime()
        const debounce = 500 // ms
        if (lastValidatedAt) {

            const elapsed = now - lastValidatedAt.getTime()
            if (elapsed < debounce) {
                dispatch(updateIdPass(validatedId))
                if (!activeDebouncer) {
                    activeDebouncer = new Debouncer(500, () => {
                        dispatch(evaluateId())
                    })
                }
                return
            }
        }

        if (activeDebouncer) {
            activeDebouncer.cancel()
        }
        activeDebouncer = null


        const model = newModelFromState(getState())
        model.groupExists(validatedId)
            .then((exists) => {
                if (exists) {
                    dispatch(updateIdError(validatedId, {
                        type: UIErrorType.ERROR,
                        message: 'This org id is already in use'
                    }))
                } else {
                    dispatch(updateIdSuccess(validatedId))
                }

                dispatch(addOrgEvaluate())
            })
    }
}

export function evaluateId() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {

        const { addOrgView: { viewModel } } = getState()
        if (!viewModel) {
            // do nothing
            return
        }

        const id = viewModel.newOrganization.id

        const [validatedId, error] = Validation.validateOrgId(id.value)
        if (error.type === UIErrorType.ERROR) {
            dispatch(updateIdError(validatedId, error))
            dispatch(addOrgEvaluate())
            return
        }

        const model = newModelFromState(getState())
        model.groupExists(validatedId)
            .then((exists) => {
                if (exists) {
                    dispatch(updateIdError(validatedId, {
                        type: UIErrorType.ERROR,
                        message: 'This org id is already in use'
                    }))
                } else {
                    dispatch(updateIdSuccess(validatedId))
                }

                dispatch(addOrgEvaluate())
            })
    }
}

export function updateDescription(description: string) {
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
            dispatch(updateDescriptionError(validatedDescription, error))
        } else {
            dispatch(updateDescriptionSuccess(validatedDescription))
        }
        dispatch(addOrgEvaluate())
    }
}