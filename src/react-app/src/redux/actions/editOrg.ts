import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import {
    StoreState, AppError, EditableOrganization, ValidationState,
    ValidationErrorType, SyncState
} from '../../types'
import Validation from '../../data/models/organization/validation'
import * as orgModel from '../../data/models/organization/model'
import DebouncingProcess from '../../lib/DebouncingProcess'
import { UIServiceClient } from '../../data/apis/uiService'

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
    error: ValidationState
}

// Updating logo url field

export interface UpdateLogoUrl extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_LOGO_URL,
    name: string | null
}

export interface UpdateLogoUrlSuccess {
    type: ActionFlag.EDIT_ORG_UPDATE_LOGO_URL_SUCCESS,
    logoUrl: string | null
}

export interface UpdateLogoUrlError extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_LOGO_URL_ERROR,
    logoUrl: string | null,
    error: ValidationState
}

// Updating home url field
export interface UpdateHomeUrl extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_HOME_URL
    homeUrl: string | null
}

export interface UpdateHomeUrlSuccess extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_HOME_URL_SUCCESS
    homeUrl: string | null
}

export interface UpdateHomeUrlError extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_HOME_URL_ERROR
    homeUrl: string | null
    error: ValidationState
}

// Updating research interests field
export interface UpdateResearchInterests extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_RESEARCH_INTERESTS
    researchInterests: string
}

export interface UpdateResearchInterestsSuccess extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS
    researchInterests: string
}

export interface UpdateResearchInterestsError extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_RESEARCH_INTERESTS_ERROR
    researchInterests: string
    error: ValidationState
}

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
    error: ValidationState
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
    error: ValidationState
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

export function editOrgUpdateNameError(name: string, error: ValidationState): EditOrgUpdateNameError {
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

// Update Logo Url

export function updateLogoUrlSuccess(logoUrl: string | null): UpdateLogoUrlSuccess {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_LOGO_URL_SUCCESS,
        logoUrl: logoUrl
    }
}

export function updateLogoUrlError(logoUrl: string | null, error: ValidationState): UpdateLogoUrlError {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_LOGO_URL_ERROR,
        logoUrl: logoUrl,
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

export function editOrgUpdateDescriptionError(description: string, error: ValidationState): EditOrgUpdateDescriptionError {
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
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        })

        return orgClient.getOrg(organizationId)
            .then((org) => {
                if (org.kind !== orgModel.OrganizationKind.NORMAL) {
                    throw new Error('May not edit an inaccessible private org!')
                }
                const editableOrg: EditableOrganization = {
                    id: {
                        value: org.id,
                        remoteValue: org.id,
                        syncState: SyncState.NEW,
                        validationState: Validation.validateOrgId(org.id)[1]
                    },
                    name: {
                        value: org.name,
                        remoteValue: org.name,
                        syncState: SyncState.NEW,
                        validationState: Validation.validateOrgName(org.name)[1]
                    },
                    logoUrl: {
                        value: org.logoUrl,
                        remoteValue: org.logoUrl,
                        syncState: SyncState.NEW,
                        validationState: Validation.validateOrgLogoUrl(org.logoUrl)[1]
                    },
                    homeUrl: {
                        value: org.homeUrl,
                        remoteValue: org.homeUrl,
                        syncState: SyncState.NEW,
                        validationState: Validation.validateOrgHomeUrl(org.homeUrl)[1]
                    },
                    researchInterests: {
                        value: org.researchInterests,
                        remoteValue: org.researchInterests,
                        syncState: SyncState.NEW,
                        validationState: Validation.validateOrgResearchInterests(org.researchInterests)[1]
                    },
                    description: {
                        value: org.description,
                        remoteValue: org.description,
                        syncState: SyncState.NEW,
                        validationState: Validation.validateOrgDescription(org.description)[1]
                    },
                    isPrivate: {
                        value: org.isPrivate,
                        remoteValue: org.isPrivate,
                        syncState: SyncState.NEW,
                        validationState: {
                            type: ValidationErrorType.OK,
                            validatedAt: new Date()
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
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
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
            logoUrl: editedOrganization.logoUrl.value,
            description: editedOrganization.description.value,
            isPrivate: editedOrganization.isPrivate.value,
            homeUrl: editedOrganization.homeUrl.value,
            researchInterests: editedOrganization.researchInterests.value
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

        if (editedOrganization.name.validationState.type !== ValidationErrorType.OK) {
            dispatch(editOrgEvaluateErrors())
            return
        }

        if (editedOrganization.logoUrl.validationState.type !== ValidationErrorType.OK) {
            dispatch(editOrgEvaluateErrors())
            return
        }

        if (editedOrganization.homeUrl.validationState.type !== ValidationErrorType.OK) {
            dispatch(editOrgEvaluateErrors())
            return
        }

        if (editedOrganization.researchInterests.validationState.type !== ValidationErrorType.OK) {
            dispatch(editOrgEvaluateErrors())
            return
        }

        if (editedOrganization.description.validationState.type !== ValidationErrorType.OK) {
            dispatch(editOrgEvaluateErrors())
            return
        }

        dispatch(editOrgEvaluateOk())
    }
}

export function updateName(name: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedName, error] = Validation.validateOrgName(name)

        if (error.type !== ValidationErrorType.OK) {
            dispatch(editOrgUpdateNameError(validatedName, error))
        } else {
            dispatch(editOrgUpdateNameSuccess(validatedName))
        }
        dispatch(editOrgEvaluate())
    }
}

let checkLogoUrlProcess: DebouncingProcess

class CheckIfLogoUrlExistsProcess extends DebouncingProcess {
    dispatch: ThunkDispatch<StoreState, void, Action>
    url: string
    timeout: number
    serviceWizardURL: string
    token: string
    constructor({ delay, dispatch, url, timeout, serviceWizardURL, token }: { delay: number, dispatch: ThunkDispatch<StoreState, void, Action>, url: string, timeout: number, serviceWizardURL: string, token: string }) {
        super({ delay })

        this.dispatch = dispatch
        this.url = url
        this.serviceWizardURL = serviceWizardURL
        this.token = token
        this.timeout = timeout
    }

    async task(): Promise<void> {
        try {
            const client = new UIServiceClient({
                url: this.serviceWizardURL,
                token: this.token
            })
            const result = await client.checkImageURL({ url: this.url, timeout: this.timeout })

            if (this.canceled) {
                return
            }

            if (result.is_valid) {
                this.dispatch(updateLogoUrlSuccess(this.url))
            } else {
                switch (result.error.code) {
                    case 'not-found':
                        this.dispatch(updateLogoUrlError(this.url, {
                            type: ValidationErrorType.ERROR,
                            validatedAt: new Date(),
                            message: 'This logo url does not exist'
                        }))
                        break
                    case 'invalid-content-type':
                        this.dispatch(updateLogoUrlError(this.url, {
                            type: ValidationErrorType.ERROR,
                            validatedAt: new Date(),
                            message: 'Invalid content type: ' + result.error.info['content-type']
                        }))
                        break
                    case 'missing-content-type':
                        this.dispatch(updateLogoUrlError(this.url, {
                            type: ValidationErrorType.ERROR,
                            validatedAt: new Date(),
                            message: 'Missing content type'
                        }))
                        break
                    default:
                        this.dispatch(updateLogoUrlError(this.url, {
                            type: ValidationErrorType.ERROR,
                            validatedAt: new Date(),
                            message: 'unknown error'
                        }))
                        break
                }
            }
        } catch (ex) {
            if (this.canceled) {
                return
            }
            this.dispatch(updateLogoUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: 'Error checking logo url: ' + ex.message
            }))
        }
        this.dispatch(editOrgEvaluate())
    }
}

export function updateLogoUrl(logoUrl: string | null) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        if (checkLogoUrlProcess) {
            checkLogoUrlProcess.cancel()
        }
        const [validatedLogoUrl, error] = Validation.validateOrgLogoUrl(logoUrl)

        if (error.type !== ValidationErrorType.OK) {
            dispatch(updateLogoUrlError(validatedLogoUrl, error))
            dispatch(editOrgEvaluate())
            return
        }

        dispatch(updateLogoUrlSuccess(validatedLogoUrl))

        dispatch(editOrgEvaluate())

        if (validatedLogoUrl !== null) {
            const {
                auth: { authorization: { token } },
                app: { config: { services: { ServiceWizard: { url: serviceWizardURL } } } }
            } = getState()

            checkLogoUrlProcess = new CheckIfLogoUrlExistsProcess({
                delay: 100,
                url: validatedLogoUrl,
                timeout: 1000,
                dispatch, serviceWizardURL, token
            })

            checkLogoUrlProcess.start()
        }
    }
}

// Home Url

let checkHomeUrlProcess: DebouncingProcess

class CheckIfHomeUrlExistsProcess extends DebouncingProcess {
    dispatch: ThunkDispatch<StoreState, void, Action>
    url: string
    timeout: number
    serviceWizardURL: string
    token: string
    constructor({ delay, dispatch, url, timeout, serviceWizardURL, token }: { delay: number, dispatch: ThunkDispatch<StoreState, void, Action>, url: string, timeout: number, serviceWizardURL: string, token: string }) {
        super({ delay })

        this.dispatch = dispatch
        this.url = url
        this.serviceWizardURL = serviceWizardURL
        this.token = token
        this.timeout = timeout
    }

    async task(): Promise<void> {
        try {
            const client = new UIServiceClient({
                url: this.serviceWizardURL,
                token: this.token
            })
            const result = await client.checkHTMLURL({ url: this.url, timeout: this.timeout })

            if (this.canceled) {
                return
            }

            if (result.is_valid) {
                this.dispatch(updateHomeUrlSuccess(this.url))
            } else {
                switch (result.error.code) {
                    case 'not-found':
                        this.dispatch(updateHomeUrlError(this.url, {
                            type: ValidationErrorType.ERROR,
                            validatedAt: new Date(),
                            message: 'This home url does not exist'
                        }))
                        break
                    case 'invalid-content-type':
                        this.dispatch(updateHomeUrlError(this.url, {
                            type: ValidationErrorType.ERROR,
                            validatedAt: new Date(),
                            message: 'Invalid content type: ' + result.error.info['content-type']
                        }))
                        break
                    case 'missing-content-type':
                        this.dispatch(updateHomeUrlError(this.url, {
                            type: ValidationErrorType.ERROR,
                            validatedAt: new Date(),
                            message: 'Missing content type'
                        }))
                        break
                    default:
                        this.dispatch(updateHomeUrlError(this.url, {
                            type: ValidationErrorType.ERROR,
                            validatedAt: new Date(),
                            message: 'unknown error'
                        }))
                        break
                }
            }
        } catch (ex) {
            if (this.canceled) {
                return
            }
            this.dispatch(updateHomeUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: 'Error checking home url: ' + ex.message
            }))
        }
        this.dispatch(editOrgEvaluate())
    }
}

function updateHomeUrlSuccess(homeUrl: string): UpdateHomeUrlSuccess {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_HOME_URL_SUCCESS,
        homeUrl
    }
}

function updateHomeUrlError(homeUrl: string, error: ValidationState): UpdateHomeUrlError {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_HOME_URL_ERROR,
        homeUrl, error
    }
}

export function updateHomeUrl(homeUrl: string | null) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        if (checkHomeUrlProcess) {
            checkHomeUrlProcess.cancel()
        }

        const [validatedHomeUrl, error] = Validation.validateOrgHomeUrl(homeUrl)

        if (error.type !== ValidationErrorType.OK) {
            dispatch({
                type: ActionFlag.EDIT_ORG_UPDATE_HOME_URL_ERROR,
                homeUrl: validatedHomeUrl,
                error: error
            } as UpdateHomeUrlError)
            dispatch(editOrgEvaluate())
            return
        }
        dispatch({
            type: ActionFlag.EDIT_ORG_UPDATE_HOME_URL_SUCCESS,
            homeUrl: validatedHomeUrl
        } as UpdateHomeUrlSuccess)

        dispatch(editOrgEvaluate())

        if (validatedHomeUrl !== null) {
            const {
                auth: { authorization: { token } },
                app: { config: { services: { ServiceWizard: { url: serviceWizardURL } } } }
            } = getState()

            checkHomeUrlProcess = new CheckIfHomeUrlExistsProcess({
                delay: 100,
                url: validatedHomeUrl,
                timeout: 1000,
                dispatch, serviceWizardURL, token
            })

            checkHomeUrlProcess.start()
        }
    }
}

export function updateResearchInterests(researchInterests: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedResearchInterests, error] = Validation.validateOrgResearchInterests(researchInterests)

        if (error.type !== ValidationErrorType.OK) {
            dispatch({
                type: ActionFlag.EDIT_ORG_UPDATE_RESEARCH_INTERESTS_ERROR,
                researchInterests: validatedResearchInterests,
                error: error
            } as UpdateResearchInterestsError)
        } else {
            dispatch({
                type: ActionFlag.EDIT_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS,
                researchInterests: validatedResearchInterests
            } as UpdateResearchInterestsSuccess)
        }
        dispatch(editOrgEvaluate())
    }
}

export function updateDescription(description: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>,
        getState: () => StoreState) => {
        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = getState()

        const [validatedDescription, error] = Validation.validateOrgDescription(description)

        if (error.type !== ValidationErrorType.OK) {
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