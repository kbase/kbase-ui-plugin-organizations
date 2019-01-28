import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import { StoreState, AppError, EditableOrganization, ValidationState, EditState, ValidationErrorType, SyncState } from '../../types'
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
    error: ValidationState
}

// Updating logo url field

export interface EditOrgUpdateLogoUrl extends Action {
    type: ActionFlag.EDIT_ORG_UPDATE_LOGO_URL,
    name: string | null
}

export interface EditOrgUpdateLogoUrlSuccess {
    type: ActionFlag.EDIT_ORG_UPDATE_LOGO_URL_SUCCESS,
    logoUrl: string | null
}

export interface EditOrgUpdateLogoUrlError extends Action {
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

export function editOrgUpdateLogoUrlSuccess(logoUrl: string | null): EditOrgUpdateLogoUrlSuccess {
    return {
        type: ActionFlag.EDIT_ORG_UPDATE_LOGO_URL_SUCCESS,
        logoUrl: logoUrl
    }
}

export function editOrgUpdateLogoUrlError(logoUrl: string | null, error: ValidationState): EditOrgUpdateLogoUrlError {
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
            groupsServiceURL: config.services.Groups.url
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

export function updateLogoUrl(logoUrl: string | null) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedLogoUrl, error] = Validation.validateOrgLogoUrl(logoUrl)

        if (error.type !== ValidationErrorType.OK) {
            dispatch(editOrgUpdateLogoUrlError(validatedLogoUrl, error))
        } else {
            dispatch(editOrgUpdateLogoUrlSuccess(validatedLogoUrl))
        }
        dispatch(editOrgEvaluate())
    }
}

export function updateHomeUrl(homeUrl: string | null) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedHomeUrl, error] = Validation.validateOrgHomeUrl(homeUrl)

        if (error.type !== ValidationErrorType.OK) {
            dispatch({
                type: ActionFlag.EDIT_ORG_UPDATE_HOME_URL_ERROR,
                homeUrl: validatedHomeUrl,
                error: error
            } as UpdateHomeUrlError)
        } else {
            dispatch({
                type: ActionFlag.EDIT_ORG_UPDATE_HOME_URL_SUCCESS,
                homeUrl: validatedHomeUrl
            } as UpdateHomeUrlSuccess)
        }
        dispatch(editOrgEvaluate())
    }
}

export function updateResearchInterests(researchInterests: string | null) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
        const [validatedResearchInterests, error] = Validation.validateOrgHomeUrl(researchInterests)

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

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })
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