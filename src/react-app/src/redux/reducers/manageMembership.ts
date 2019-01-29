import { Action } from 'redux'
import * as actions from '../actions/manageMembership'
import { StoreState, ComponentLoadingState, SyncState, ValidationStateOk, ValidationState, ValidationErrorType, SaveState, EditState, ManageMembershipViewModel } from '../../types'
import { ActionFlag } from '../actions'

export function loadStart(state: StoreState, action: actions.LoadStart): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            manageMembershipView: {
                loadingState: ComponentLoadingState.LOADING,
                error: null,
                viewModel: null
            }
        }
    }
}

export function loadSuccess(state: StoreState, action: actions.LoadSuccess): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            manageMembershipView: {
                loadingState: ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    organization: action.organization,
                    editableMemberProfile: action.editableMemberProfile,
                    editState: EditState.UNEDITED,
                    saveState: SaveState.NEW,
                    validationState: validationStateOk()
                }
            }
        }
    }
}

export function loadError(state: StoreState, action: actions.LoadError): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            manageMembershipView: {
                loadingState: ComponentLoadingState.ERROR,
                error: action.error,
                viewModel: null
            }
        }
    }
}

export function unload(state: StoreState, action: actions.Unload): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            manageMembershipView: {
                loadingState: ComponentLoadingState.NONE,
                error: null,
                viewModel: null
            }
        }
    }
}

function validationStateOk(): ValidationStateOk {
    const x: ValidationState = {
        type: ValidationErrorType.OK,
        validatedAt: new Date()
    }
    return x
}

export function updateTitleSuccess(state: StoreState, action: actions.UpdateTitleSuccess): StoreState {
    if (!state.views.manageMembershipView.viewModel) {
        return state
    }

    const editedMember = state.views.manageMembershipView.viewModel.editableMemberProfile
    let syncState
    if (action.title !== editedMember.title.remoteValue) {
        syncState = SyncState.DIRTY
    } else {
        syncState = SyncState.CLEAN
    }
    const newState = {
        ...state,
        views: {
            ...state.views,
            manageMembershipView: {
                ...state.views.manageMembershipView,
                viewModel: {
                    ...state.views.manageMembershipView.viewModel,
                    editableMemberProfile: {
                        ...state.views.manageMembershipView.viewModel.editableMemberProfile,
                        title: {
                            value: action.title,
                            remoteValue: action.title,
                            syncState: syncState,
                            validationState: validationStateOk()
                        }
                    }
                }
            }
        }
    }

    const editState = evaluateEditorState(newState.views.manageMembershipView.viewModel)

    return {
        ...newState,
        views: {
            ...state.views,
            manageMembershipView: {
                ...newState.views.manageMembershipView,
                viewModel: {
                    ...newState.views.manageMembershipView.viewModel,
                    editState: editState
                }
            }
        }
    }
}
function evaluateEditorState(viewModel: ManageMembershipViewModel): EditState {
    if (viewModel.editableMemberProfile.title.syncState === SyncState.DIRTY) {
        return EditState.EDITED
    }

    return EditState.UNEDITED
}

function evaluateSuccess(state: StoreState, action: actions.EvaluateSuccess): StoreState {
    if (!state.views.manageMembershipView.viewModel) {
        return state
    }

    const editState = evaluateEditorState(state.views.manageMembershipView.viewModel)

    return {
        ...state,
        views: {
            ...state.views,
            manageMembershipView: {
                ...state.views.manageMembershipView,
                viewModel: {
                    ...state.views.manageMembershipView.viewModel,
                    editState: editState,
                    validationState: {
                        type: ValidationErrorType.OK,
                        validatedAt: new Date()
                    }
                }
            }
        }
    }
}

function evaluateError(state: StoreState, action: actions.EvaluateError): StoreState {
    if (!state.views.manageMembershipView.viewModel) {
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            manageMembershipView: {
                ...state.views.manageMembershipView,
                viewModel: {
                    ...state.views.manageMembershipView.viewModel,
                    validationState: {
                        type: ValidationErrorType.ERROR,
                        message: 'Validation error(s)',
                        validatedAt: new Date()
                    }
                }
            }
        }
    }
}

export function saveSuccess(state: StoreState, action: actions.SaveSuccess): StoreState {
    if (!state.views.manageMembershipView.viewModel) {
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            manageMembershipView: {
                ...state.views.manageMembershipView,
                viewModel: {
                    ...state.views.manageMembershipView.viewModel,
                    editState: EditState.UNEDITED,
                    saveState: SaveState.SAVED,
                    editableMemberProfile: {
                        title: {
                            ...state.views.manageMembershipView.viewModel.editableMemberProfile.title,
                            syncState: SyncState.CLEAN
                        }
                    }
                }
            }
        }
    }
}

function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.MANAGE_MEMBERSHIP_LOAD_START:
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.MANAGE_MEMBERSHIP_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.MANAGE_MEMBERSHIP_LOAD_ERROR:
            return loadError(state, action as actions.LoadError)
        case ActionFlag.MANAGE_MEMBERSHIP_UNLOAD:
            return unload(state, action as actions.Unload)
        case ActionFlag.MANAGE_MEMBERSHIP_UPDATE_TITLE_SUCCESS:
            return updateTitleSuccess(state, action as actions.UpdateTitleSuccess)
        case ActionFlag.MANAGE_MEMBERSHIP_EVALUATE_SUCCESS:
            return evaluateSuccess(state, action as actions.EvaluateSuccess)
        case ActionFlag.MANAGE_MEMBERSHIP_EVALUATE_ERROR:
            return evaluateError(state, action as actions.EvaluateError)
        case ActionFlag.MANAGE_MEMBERSHIP_SAVE_SUCCESS:
            return saveSuccess(state, action as actions.SaveSuccess)
        default:
            return null
    }
}

export default reducer