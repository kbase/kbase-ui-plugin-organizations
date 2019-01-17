import { Action } from 'redux'
import { StoreState, EditState, SaveState, UIErrorType, ValidationState, ComponentLoadingState, SyncState, ValidationErrorType } from '../../types';
import { ActionFlag } from '../actions';
import {
    LoadStart, Unload,
    SaveError, SaveStart, SaveSuccess, AddOrgEvaluateOK, AddOrgEvaluateErrors,
    LoadSuccess, UpdateNameSuccess, UpdateNameError,
    UpdateIdSuccess, UpdateIdError, UpdateDescriptionSuccess,
    UpdateDescriptionError,
    LoadError,
    UpdateIdPass,
    UpdateIsPrivateSuccess,
    UpdateLogoUrlSuccess,
    UpdateLogoUrlError,
    UpdateHomeUrlSuccess,
    UpdateHomeUrlError,
    UpdateResearchInterestsSuccess,
    UpdateResearchInterestsError
} from '../actions/addOrg'
import Validation from '../../data/models/organization/validation';

// ADD ORG

export function saveStart(state: StoreState, action: SaveStart): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting saveStart without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    saveState: SaveState.SAVING
                }
            }
        }
    }
}

export function saveSuccess(state: StoreState, action: SaveSuccess): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting saveSuccess without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.UNEDITED,
                    saveState: SaveState.SAVED
                }
            }
        }
    }
}

export function saveError(state: StoreState, action: SaveError): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting saveError without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,

            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    saveState: SaveState.SAVE_ERROR,
                    error: action.error
                }
            }
        }
    }
}

export function addOrgEvaluateOk(state: StoreState, action: AddOrgEvaluateOK): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting saveSuccess without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    validationState: {
                        type: ValidationErrorType.OK,
                        validatedAt: new Date()
                    }
                }
            }
        }
    }
}

export function addOrgEvaluateErrors(state: StoreState, action: AddOrgEvaluateErrors): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting saveSuccess without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    validationState: {
                        type: ValidationErrorType.ERROR,
                        message: 'TODO: form error',
                        validatedAt: new Date()
                    }
                }
            }
        }
    }
}

export function loadStart(state: StoreState, action: LoadStart): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                loadingState: ComponentLoadingState.LOADING,
                error: null,
                viewModel: null
            }
        }
    }
}

export function loadSuccess(state: StoreState, action: LoadSuccess): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                loadingState: ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    editState: EditState.UNEDITED,
                    validationState: {
                        type: ValidationErrorType.OK,
                        validatedAt: new Date()
                    },
                    saveState: SaveState.NEW,
                    error: null,
                    newOrganization: action.newOrganization
                }
            }
        }
    }
}
export function loadError(state: StoreState, action: LoadError): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                loadingState: ComponentLoadingState.SUCCESS,
                error: action.error,
                viewModel: null
            }
        }
    }
}

export function unload(state: StoreState, action: Unload): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                loadingState: ComponentLoadingState.NONE,
                error: null,
                viewModel: null
            }
        }
    }
}

// Name
export function updateNameSuccess(state: StoreState, action: UpdateNameSuccess): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting updateNameSuccess without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        name: {
                            ...state.views.addOrgView.viewModel.newOrganization.name,
                            value: action.name,
                            syncState: SyncState.DIRTY,
                            validationState: {
                                type: ValidationErrorType.OK,
                                validatedAt: new Date()
                            },
                            // editState: EditState.EDITED,
                            // validatedAt: new Date(),
                            // error: {
                            //     type: UIErrorType.NONE
                            // }
                        }
                    }
                }
            }
        }
    }
}

export function updateNameError(state: StoreState, action: UpdateNameError): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting updateNameError without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        name: {
                            ...state.views.addOrgView.viewModel.newOrganization.name,
                            value: action.name,
                            syncState: SyncState.DIRTY,
                            validationState: action.error
                            // editState: EditState.EDITED,
                            // validatedAt: new Date(),
                            // error: action.error
                        }
                    }
                }
            }
        }
    }
}

// Logo URL
export function updateLogoUrlSuccess(state: StoreState, action: UpdateLogoUrlSuccess): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting Logo URL without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        logoUrl: {
                            ...state.views.addOrgView.viewModel.newOrganization.logoUrl,
                            syncState: SyncState.DIRTY,
                            value: action.logoUrl,
                            validationState: {
                                type: ValidationErrorType.OK,
                                validatedAt: new Date()
                            }
                        }
                    }
                }
            }
        }
    }
}

export function updateLogoUrlError(state: StoreState, action: UpdateLogoUrlError): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting Logo URL error without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        logoUrl: {
                            ...state.views.addOrgView.viewModel.newOrganization.logoUrl,
                            syncState: SyncState.DIRTY,
                            value: action.logoUrl,
                            validationState: action.error
                        }
                    }
                }
            }
        }
    }
}

// Home URL
export function updateHomeUrlSuccess(state: StoreState, action: UpdateHomeUrlSuccess): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting Home URL (success) without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        homeUrl: {
                            ...state.views.addOrgView.viewModel.newOrganization.homeUrl,
                            syncState: SyncState.DIRTY,
                            value: action.homeUrl,
                            validationState: {
                                type: ValidationErrorType.OK,
                                validatedAt: new Date()
                            }
                        }
                    }
                }
            }
        }
    }
}

export function updateHomeUrlError(state: StoreState, action: UpdateHomeUrlError): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting update to home url without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        homeUrl: {
                            ...state.views.addOrgView.viewModel.newOrganization.homeUrl,
                            syncState: SyncState.DIRTY,
                            value: action.homeUrl,
                            validationState: action.error
                        }
                    }
                }
            }
        }
    }
}

// Research Interests
export function updateResearchInterestsSuccess(state: StoreState, action: UpdateResearchInterestsSuccess): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting Research Interests without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        researchInterests: {
                            ...state.views.addOrgView.viewModel.newOrganization.researchInterests,
                            syncState: SyncState.DIRTY,
                            value: action.researchInterests,
                            validationState: {
                                type: ValidationErrorType.OK,
                                validatedAt: new Date()
                            }
                        }
                    }
                }
            }
        }
    }
}

export function updateResearchInterestsError(state: StoreState, action: UpdateResearchInterestsError): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting update to research interests (error) without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        researchInterests: {
                            ...state.views.addOrgView.viewModel.newOrganization.researchInterests,
                            syncState: SyncState.DIRTY,
                            value: action.researchInterests,
                            validationState: action.error
                        }
                    }
                }
            }
        }
    }
}

// Id

export function updateIdSuccess(state: StoreState, action: UpdateIdSuccess): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting updateIdSuccess without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        id: {
                            ...state.views.addOrgView.viewModel.newOrganization.id,
                            // value: action.id,
                            syncState: SyncState.DIRTY,
                            validationState: {
                                type: ValidationErrorType.OK,
                                validatedAt: new Date()
                            }
                        }
                    }
                }
            }
        }
    }
}

export function updateIdError(state: StoreState, action: UpdateIdError): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting updateIdError without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        id: {
                            ...state.views.addOrgView.viewModel.newOrganization.id,
                            // value: action.id,
                            syncState: SyncState.DIRTY,
                            validationState: action.error
                        }
                    }
                }
            }
        }
    }
}

export function updateIdPass(state: StoreState, action: UpdateIdPass): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting updateIdSuccess without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        id: {
                            ...state.views.addOrgView.viewModel.newOrganization.id,
                            value: action.id,
                            syncState: SyncState.DIRTY
                            // validationState: {
                            //     type: ValidationErrorType.OK,
                            //     validatedAt: new Date()
                            // }
                        }
                    }
                }
            }
        }
    }
}

export function updateDescriptionSuccess(state: StoreState, action: UpdateDescriptionSuccess): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting updateDescriptionSuccess without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        description: {
                            ...state.views.addOrgView.viewModel.newOrganization.description,
                            value: action.description,
                            syncState: SyncState.DIRTY,
                            validationState: {
                                type: ValidationErrorType.OK,
                                validatedAt: new Date()
                            }
                        }
                    }
                }
            }
        }
    }
}

export function updateDescriptionError(state: StoreState, action: UpdateDescriptionError): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting updateDescriptionError without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        description: {
                            ...state.views.addOrgView.viewModel.newOrganization.description,
                            value: action.description,
                            syncState: SyncState.DIRTY,
                            validationState: action.error
                        }
                    }
                }
            }
        }
    }
}

export function updateIsPrivateSuccess(state: StoreState, action: UpdateIsPrivateSuccess): StoreState {
    if (!state.views.addOrgView.viewModel) {
        console.warn('attempting updateIdSuccess without view model')
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            addOrgView: {
                ...state.views.addOrgView,
                viewModel: {
                    ...state.views.addOrgView.viewModel,
                    editState: EditState.EDITED,
                    newOrganization: {
                        ...state.views.addOrgView.viewModel.newOrganization,
                        isPrivate: {
                            ...state.views.addOrgView.viewModel.newOrganization.isPrivate,
                            value: action.isPrivate,
                            syncState: SyncState.DIRTY,
                            validationState: {
                                type: ValidationErrorType.OK,
                                validatedAt: new Date()
                            }
                        }
                    }
                }
            }
        }
    }
}

export function reducer(state: StoreState, action: Action): StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.ADD_ORG_SAVE:
            return saveStart(state, action as SaveStart)
        case ActionFlag.ADD_ORG_SAVE_SUCCESS:
            return saveSuccess(state, action as SaveSuccess)
        case ActionFlag.ADD_ORG_SAVE_ERROR:
            return saveError(state, action as SaveError)

        case ActionFlag.ADD_ORG_LOAD_START:
            return loadStart(state, action as LoadStart)
        case ActionFlag.ADD_ORG_LOAD_SUCCESS:
            return loadSuccess(state, action as LoadSuccess)
        case ActionFlag.ADD_ORG_LOAD_ERROR:
            return loadError(state, action as LoadError)
        case ActionFlag.ADD_ORG_UNLOAD:
            return unload(state, action as Unload)

        case ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS:
            return updateNameSuccess(state, action as UpdateNameSuccess)
        case ActionFlag.ADD_ORG_UPDATE_NAME_ERROR:
            return updateNameError(state, action as UpdateNameError)

        case ActionFlag.ADD_ORG_UPDATE_LOGO_URL_SUCCESS:
            return updateLogoUrlSuccess(state, action as UpdateLogoUrlSuccess)
        case ActionFlag.ADD_ORG_UPDATE_LOGO_URL_ERROR:
            return updateLogoUrlError(state, action as UpdateLogoUrlError)

        case ActionFlag.ADD_ORG_UPDATE_HOME_URL_SUCCESS:
            return updateHomeUrlSuccess(state, action as UpdateHomeUrlSuccess)
        case ActionFlag.ADD_ORG_UPDATE_HOME_URL_ERROR:
            return updateHomeUrlError(state, action as UpdateHomeUrlError)

        case ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS:
            return updateResearchInterestsSuccess(state, action as UpdateResearchInterestsSuccess)
        case ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_ERROR:
            return updateResearchInterestsError(state, action as UpdateResearchInterestsError)

        case ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS:
            return updateIdSuccess(state, action as UpdateIdSuccess)
        case ActionFlag.ADD_ORG_UPDATE_ID_ERROR:
            return updateIdError(state, action as UpdateIdError)
        case ActionFlag.ADD_ORG_UPDATE_ID_PASS:
            return updateIdPass(state, action as UpdateIdPass)

        case ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS:
            return updateDescriptionSuccess(state, action as UpdateDescriptionSuccess)
        case ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR:
            return updateDescriptionError(state, action as UpdateDescriptionError)

        case ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_SUCCESS:
            return updateIsPrivateSuccess(state, action as UpdateIsPrivateSuccess)

        case ActionFlag.ADD_ORG_EVALUATE_OK:
            return addOrgEvaluateOk(state, action as AddOrgEvaluateOK)
        case ActionFlag.ADD_ORG_EVALUATE_ERRORS:
            return addOrgEvaluateErrors(state, action as AddOrgEvaluateErrors)
        default:
            return null
    }
}

export default reducer