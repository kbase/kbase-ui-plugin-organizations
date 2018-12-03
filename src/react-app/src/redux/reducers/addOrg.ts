import { Action } from 'redux'
import { StoreState, EditState, SaveState, UIErrorType, FieldState, ValidationState, ComponentLoadingState } from '../../types';
import { ActionFlag } from '../actions';
import {
    LoadStart, Unload,
    SaveError, SaveStart, SaveSuccess, AddOrgEvaluateOK, AddOrgEvaluateErrors,
    LoadSuccess, UpdateNameSuccess, UpdateNameError, UpdateGravatarHashSuccess,
    UpdateGravatarHashError, UpdateIdSuccess, UpdateIdError, UpdateDescriptionSuccess,
    UpdateDescriptionError,
    LoadError
} from '../actions/addOrg'

// ADD ORG

export function saveStart(state: StoreState, action: SaveStart): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting saveStart without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                saveState: SaveState.SAVING
            }
        }
    }
}

export function saveSuccess(state: StoreState, action: SaveSuccess): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting saveSuccess without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                editState: EditState.UNEDITED,
                saveState: SaveState.SAVED
            }
        }
    }
}

export function saveError(state: StoreState, action: SaveError): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting saveSuccess without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                saveState: SaveState.SAVE_ERROR,
                error: action.error
            }
        }
    }
}

export function addOrgEvaluateOk(state: StoreState, action: AddOrgEvaluateOK): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting saveSuccess without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                validationState: ValidationState.VALID
            }
        }
    }
}

export function addOrgEvaluateErrors(state: StoreState, action: AddOrgEvaluateErrors): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting saveSuccess without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                validationState: ValidationState.INVALID
            }
        }
    }
}

export function loadStart(state: StoreState, action: LoadStart): StoreState {
    return {
        ...state,
        addOrgView: {
            loadingStatus: ComponentLoadingState.LOADING,
            error: null,
            viewModel: null
        }
    }
}

export function loadSuccess(state: StoreState, action: LoadSuccess): StoreState {
    return {
        ...state,
        addOrgView: {
            loadingStatus: ComponentLoadingState.SUCCESS,
            error: null,
            viewModel: {
                editState: EditState.UNEDITED,
                validationState: ValidationState.NONE,
                saveState: SaveState.NEW,
                error: null,
                newOrganization: action.newOrganization
            }
        }
    }
}
export function loadError(state: StoreState, action: LoadError): StoreState {
    return {
        ...state,
        addOrgView: {
            loadingStatus: ComponentLoadingState.SUCCESS,
            error: action.error,
            viewModel: null
        }
    }
}

export function unload(state: StoreState, action: Unload): StoreState {
    return {
        ...state,
        addOrgView: {
            loadingStatus: ComponentLoadingState.NONE,
            error: null,
            viewModel: null
        }
    }
}

// Name
export function updateNameSuccess(state: StoreState, action: UpdateNameSuccess): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting updateNameSuccess without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                editState: EditState.EDITED,
                newOrganization: {
                    ...state.addOrgView.viewModel.newOrganization,
                    name: {
                        value: action.name,
                        status: FieldState.EDITED_OK,
                        error: {
                            type: UIErrorType.NONE
                        }
                    }
                }
            }
        }
    }
}

export function updateNameError(state: StoreState, action: UpdateNameError): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting updateNameError without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                editState: EditState.EDITED,
                newOrganization: {
                    ...state.addOrgView.viewModel.newOrganization,
                    name: {
                        value: action.name,
                        status: FieldState.EDITED_ERROR,
                        error: action.error
                    }
                }
            }
        }
    }
}

// Gravatar hash
export function updateGravatarHashSuccess(state: StoreState, action: UpdateGravatarHashSuccess): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting updateGravatarHashSuccess without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                editState: EditState.EDITED,
                newOrganization: {
                    ...state.addOrgView.viewModel.newOrganization,
                    gravatarHash: {
                        value: action.gravatarHash,
                        status: FieldState.EDITED_OK,
                        error: {
                            type: UIErrorType.NONE
                        }
                    }
                }
            }
        }
    }
}

export function updateGravatarHashError(state: StoreState, action: UpdateGravatarHashError): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting updateGravatarHashError without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                editState: EditState.EDITED,
                newOrganization: {
                    ...state.addOrgView.viewModel.newOrganization,
                    gravatarHash: {
                        value: action.gravatarHash,
                        status: FieldState.EDITED_ERROR,
                        error: action.error
                    }
                }
            }
        }
    }
}

// Id

export function updateIdSuccess(state: StoreState, action: UpdateIdSuccess): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting updateIdSuccess without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                editState: EditState.EDITED,
                newOrganization: {
                    ...state.addOrgView.viewModel.newOrganization,
                    id: {
                        value: action.id,
                        status: FieldState.EDITED_OK,
                        error: {
                            type: UIErrorType.NONE
                        }
                    }
                }
            }
        }
    }
}

export function updateIdError(state: StoreState, action: UpdateIdError): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting updateIdError without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                editState: EditState.EDITED,
                newOrganization: {
                    ...state.addOrgView.viewModel.newOrganization,
                    id: {
                        value: action.id,
                        status: FieldState.EDITED_ERROR,
                        error: action.error
                    }
                }
            }
        }
    }
}

export function updateDescriptionSuccess(state: StoreState, action: UpdateDescriptionSuccess): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting updateDescriptionSuccess without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                editState: EditState.EDITED,
                newOrganization: {
                    ...state.addOrgView.viewModel.newOrganization,
                    description: {
                        value: action.description,
                        status: FieldState.EDITED_OK,
                        error: {
                            type: UIErrorType.NONE
                        }
                    }
                }
            }
        }
    }
}

export function updateDescriptionError(state: StoreState, action: UpdateDescriptionError): StoreState {
    if (!state.addOrgView.viewModel) {
        console.warn('attempting updateDescriptionError without view model')
        return state
    }
    return {
        ...state,
        addOrgView: {
            ...state.addOrgView,
            viewModel: {
                ...state.addOrgView.viewModel,
                editState: EditState.EDITED,
                newOrganization: {
                    ...state.addOrgView.viewModel.newOrganization,
                    description: {
                        value: action.description,
                        status: FieldState.EDITED_ERROR,
                        error: action.error
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

        case ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_SUCCESS:
            return updateGravatarHashSuccess(state, action as UpdateGravatarHashSuccess)
        case ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_ERROR:
            return updateGravatarHashError(state, action as UpdateGravatarHashError)

        case ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS:
            return updateIdSuccess(state, action as UpdateIdSuccess)
        case ActionFlag.ADD_ORG_UPDATE_ID_ERROR:
            return updateIdError(state, action as UpdateIdError)

        case ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS:
            return updateDescriptionSuccess(state, action as UpdateDescriptionSuccess)
        case ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR:
            return updateDescriptionError(state, action as UpdateDescriptionError)

        case ActionFlag.ADD_ORG_EVALUATE_OK:
            return addOrgEvaluateOk(state, action as AddOrgEvaluateOK)
        case ActionFlag.ADD_ORG_EVALUATE_ERRORS:
            return addOrgEvaluateErrors(state, action as AddOrgEvaluateErrors)
        default:
            return null
    }
}

export default reducer