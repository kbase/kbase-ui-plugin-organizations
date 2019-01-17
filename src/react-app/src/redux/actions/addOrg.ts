import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import { StoreState, AppError, UIError, UIErrorType, EditableOrganization, EditState, ValidationState, SyncState, ValidationErrorType } from '../../types'

import * as orgModel from '../../data/models/organization/model'
import Validation from '../../data/models/organization/validation'

// ACTIONS

export interface Save extends Action<ActionFlag.ADD_ORG_SAVE> {
    type: ActionFlag.ADD_ORG_SAVE
}

export interface SaveStart extends Action<ActionFlag.ADD_ORG_SAVE_START> {
    type: ActionFlag.ADD_ORG_SAVE_START
}

export interface SaveSuccess extends Action<ActionFlag.ADD_ORG_SAVE_SUCCESS> {
    type: ActionFlag.ADD_ORG_SAVE_SUCCESS,
    organization: orgModel.Organization
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
    type: ActionFlag.ADD_ORG_UPDATE_NAME
    name: string
}

export interface UpdateNameSuccess {
    type: ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS
    name: string
}

export interface UpdateNameError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_NAME_ERROR
    name: string,
    error: ValidationState
}

// Updating logo url field

export interface UpdateLogoUrl extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL
    name: string
}

export interface UpdateLogoUrlSuccess {
    type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL_SUCCESS
    logoUrl: string | null
}

export interface UpdateLogoUrlError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL_ERROR
    logoUrl: string | null,
    error: ValidationState
}

// Updating home url field
export interface UpdateHomeUrl extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_HOME_URL
    homeUrl: string | null
}

export interface UpdateHomeUrlSuccess extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_HOME_URL_SUCCESS
    homeUrl: string | null
}

export interface UpdateHomeUrlError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_HOME_URL_ERROR
    homeUrl: string | null
    error: ValidationState
}

// Updating research interests field
export interface UpdateResearchInterests extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS
    researchInterests: string
}

export interface UpdateResearchInterestsSuccess extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS
    researchInterests: string
}

export interface UpdateResearchInterestsError extends Action {
    type: ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_ERROR
    researchInterests: string
    error: ValidationState
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
    error: ValidationState
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
    error: ValidationState
}

// Update is private field

export interface UpdateIsPrivate extends Action<ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE> {
    type: ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE
    isPrivate: boolean
}

export interface UpdateIsPrivateSuccess extends Action<ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_SUCCESS> {
    type: ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_SUCCESS,
    isPrivate: boolean
}

export interface UpdateIsPrivateError extends Action<ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_ERROR> {
    type: ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_ERROR,
    error: ValidationState
}


// ACTION CREATORS

export function saveStart(): SaveStart {
    return {
        type: ActionFlag.ADD_ORG_SAVE_START
    }
}

export function saveSuccess(org: orgModel.Organization): SaveSuccess {
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

// Editing

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

export function updateNameError(name: string, error: ValidationState): UpdateNameError {
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

export function updateLogoUrlSuccess(logoUrl: string | null): UpdateLogoUrlSuccess {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL_SUCCESS,
        logoUrl: logoUrl
    }
}

export function updateLogoUrlError(logoUrl: string | null, error: ValidationState): UpdateLogoUrlError {
    return {
        type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL_ERROR,
        logoUrl: logoUrl,
        error: error
    }
}


// Update Id

export function updateIdError(id: string, error: ValidationState): UpdateIdError {
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

export function updateDescriptionError(description: string, error: ValidationState): UpdateDescriptionError {
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
                remoteValue: null,
                syncState: SyncState.CLEAN,
                validationState: Validation.validateOrgId('')[1]
            },
            name: {
                value: '',
                remoteValue: null,
                syncState: SyncState.CLEAN,
                validationState: Validation.validateOrgName('')[1]
            },
            logoUrl: {
                value: '',
                remoteValue: null,
                syncState: SyncState.CLEAN,
                validationState: Validation.validateOrgLogoUrl('')[1]
            },
            homeUrl: {
                value: '',
                remoteValue: null,
                syncState: SyncState.CLEAN,
                validationState: Validation.validateOrgHomeUrl('')[1]
            },
            researchInterests: {
                value: '',
                remoteValue: null,
                syncState: SyncState.CLEAN,
                validationState: Validation.validateOrgResearchInterests('')[1]
            },
            description: {
                value: '',
                remoteValue: null,
                syncState: SyncState.CLEAN,
                validationState: Validation.validateOrgDescription('')[1]
            },
            isPrivate: {
                value: false,
                remoteValue: null,
                syncState: SyncState.CLEAN,
                validationState: {
                    type: ValidationErrorType.OK,
                    validatedAt: new Date()
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
        if (!state.views.addOrgView.viewModel) {
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
            views: {
                addOrgView: { viewModel: { newOrganization } },
            },
            app: { config }
        } = state

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        if (!newOrganization) {
            dispatch(saveError({
                code: 'app',
                message: 'The new organization data does not yet exist'
            }))
            return;
        }

        orgClient.addOrg(newOrganization, username)
            .then((org: orgModel.Organization) => {
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
        if (!state.views.addOrgView.viewModel) {
            dispatch(saveError({
                code: 'invalid',
                message: 'Unexpected condition: no view model'
            }))
            return
        }

        const {
            views: {
                addOrgView: {
                    viewModel: { editState, newOrganization } }
            }
        } = state

        if (!newOrganization) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.name.validationState.type !== ValidationErrorType.OK) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.id.validationState.type !== ValidationErrorType.OK) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        // TODO: quick hack to allow unmodified fields to evaluate to true.

        if (newOrganization.logoUrl.validationState.type !== ValidationErrorType.OK) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.homeUrl.validationState.type !== ValidationErrorType.OK) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.researchInterests.validationState.type !== ValidationErrorType.OK) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        if (newOrganization.description.validationState.type !== ValidationErrorType.OK) {
            dispatch(AddOrgEvaluateErrors())
            return
        }

        dispatch(addOrgEvaluateOk())
    }
}

function orgModelFromState(state: StoreState) {
    const {
        auth: { authorization: { token, username } },
        app: { config } } = state
    return new orgModel.OrganizationModel({
        token, username,
        groupsServiceURL: config.services.Groups.url
    })
}

export function updateName(name: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedName, error] = Validation.validateOrgName(name)

        if (error.type !== ValidationErrorType.OK) {
            dispatch(updateNameError(validatedName, error))
        } else {
            dispatch(updateNameSuccess(validatedName))
        }
        dispatch(addOrgEvaluate())
    }
}

export function updateLogoUrl(name: string | null) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedLogoUrl, error] = Validation.validateOrgLogoUrl(name)

        if (error.type !== ValidationErrorType.OK) {
            dispatch(updateLogoUrlError(validatedLogoUrl, error))
        } else {
            dispatch(updateLogoUrlSuccess(validatedLogoUrl))
        }
        dispatch(addOrgEvaluate())
    }
}

export function updateHomeUrl(homeUrl: string | null) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedHomeUrl, error] = Validation.validateOrgHomeUrl(homeUrl)

        if (error.type !== ValidationErrorType.OK) {
            dispatch({
                type: ActionFlag.ADD_ORG_UPDATE_HOME_URL_ERROR,
                homeUrl: homeUrl,
                error: error
            } as UpdateHomeUrlError)
        } else {
            dispatch({
                type: ActionFlag.ADD_ORG_UPDATE_HOME_URL_SUCCESS,
                homeUrl: validatedHomeUrl
            })
        }
    }
}

export function updateResearchInterests(researchInterests: string | null) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedResearchInterests, error] = Validation.validateOrgHomeUrl(researchInterests)

        if (error.type !== ValidationErrorType.OK) {
            dispatch({
                type: ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_ERROR,
                researchInterests: validatedResearchInterests,
                error: error
            } as UpdateResearchInterestsError)
        } else {
            dispatch({
                type: ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS,
                researchInterests: validatedResearchInterests
            }) as UpdateResearchInterestsSuccess
        }
    }
}

export function updateIsPrivate(isPrivate: boolean) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        // no validation for now ... what is there to validate?

        dispatch({
            type: ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_SUCCESS,
            isPrivate
        })
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
        dispatch(updateIdPass(id))
        const [validatedId, error] = Validation.validateOrgId(id)
        if (error.type !== ValidationErrorType.OK) {
            dispatch(updateIdError(validatedId, error))
            dispatch(addOrgEvaluate())
            return
        }

        const {
            views: {
                addOrgView: { viewModel }
            }
        } = getState()

        if (!viewModel) {
            // do nothing
            return
        }

        const lastValidatedAt = viewModel.newOrganization.id.validationState.validatedAt
        const now = new Date().getTime()
        const debounce = 500 // ms
        if (lastValidatedAt) {
            const elapsed = now - lastValidatedAt.getTime()
            if (elapsed < debounce) {
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

        const model = orgModelFromState(getState())
        model.orgExists(validatedId)
            .then((exists) => {
                if (exists) {
                    dispatch(updateIdError(validatedId, {
                        type: ValidationErrorType.ERROR,
                        validatedAt: new Date(),
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

        const {
            views: {
                addOrgView: { viewModel }
            }
        } = getState()
        if (!viewModel) {
            // do nothing
            return
        }

        const id = viewModel.newOrganization.id

        const [validatedId, error] = Validation.validateOrgId(id.value)
        if (error.type !== ValidationErrorType.OK) {
            dispatch(updateIdError(validatedId, error))
            dispatch(addOrgEvaluate())
            return
        }

        const model = orgModelFromState(getState())
        model.orgExists(validatedId)
            .then((exists) => {
                if (exists) {
                    dispatch(updateIdError(validatedId, {
                        type: ValidationErrorType.ERROR,
                        message: 'This org id is already in use',
                        validatedAt: new Date()
                    }))
                } else {
                    dispatch(updateIdSuccess(validatedId))
                }

                dispatch(addOrgEvaluate())
            })
    }
}

export function updateDescription(description: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const model = orgModelFromState(getState())

        const [validatedDescription, error] = Validation.validateOrgDescription(description)

        if (error.type !== ValidationErrorType.OK) {
            dispatch(updateDescriptionError(validatedDescription, error))
        } else {
            dispatch(updateDescriptionSuccess(validatedDescription))
        }
        dispatch(addOrgEvaluate())
    }
}