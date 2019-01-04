import { Action } from 'redux'
import { StoreState, EditState, SaveState, ComponentLoadingState, ValidationErrorType, SyncState, ValidationState, ValidationStateOk, EditOrgViewModel } from '../../types';
import { ActionFlag } from '../actions';
import {
    LoadStart, LoadSuccess, LoadError,
    EditOrgEvaluateOK, EditOrgEvaluateErrors,
    EditOrgSave, EditOrgSaveStart, EditOrgSaveError, EditOrgSaveSuccess,
    EditOrgUpdateNameSuccess, EditOrgUpdateNameError,
    // EditOrgUpdateIdSuccess, EditOrgUpdateIdError,
    EditOrgUpdateDescriptionSuccess, EditOrgUpdateDescriptionError,
    EditOrgUpdateGravatarHashError, EditOrgUpdateGravatarHashSuccess, UpdateIsPrivateSuccess
} from '../actions/editOrg'
import { StateInstances } from '../state';



// EDIT ORG

// Edit session loading

export function loadStart(state: StoreState, action: LoadStart) {
    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                loadingState: ComponentLoadingState.LOADING,
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

export function loadSuccess(state: StoreState, action: LoadSuccess) {
    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                loadingState: ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    editState: EditState.UNEDITED,
                    validationState: validationStateOk(),
                    // validationState: {
                    //     type: ValidationErrorType.OK,
                    //     validatedAt: new Date()
                    // },
                    saveState: SaveState.NEW,
                    // TODO: get rid of this...
                    // organizationId: action.id,
                    organization: action.organization,
                    saveError: null,
                    editedOrganization: action.editedOrganization
                }
            }
        }
    }
}

export function loadError(state: StoreState, action: LoadError) {
    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                loadingState: ComponentLoadingState.ERROR,
                error: action.error,
                viewModel: null

            }
        }
    }
}

// save

export function editOrgSaveStart(state: StoreState, action: EditOrgSaveStart): StoreState {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    saveState: SaveState.SAVING
                }
            }
        }
    }
}

export function editOrgSaveSuccess(state: StoreState, action: EditOrgSaveSuccess): StoreState {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    editState: EditState.UNEDITED,
                    saveState: SaveState.SAVED,
                    editedOrganization: {
                        id: {
                            ...state.views.editOrgView.viewModel.editedOrganization.id,
                            syncState: SyncState.CLEAN
                        },
                        name: {
                            ...state.views.editOrgView.viewModel.editedOrganization.name,
                            syncState: SyncState.CLEAN
                        },
                        gravatarHash: {
                            ...state.views.editOrgView.viewModel.editedOrganization.gravatarHash,
                            syncState: SyncState.CLEAN
                        },
                        isPrivate: {
                            ...state.views.editOrgView.viewModel.editedOrganization.isPrivate,
                            syncState: SyncState.CLEAN
                        },
                        description: {
                            ...state.views.editOrgView.viewModel.editedOrganization.description,
                            syncState: SyncState.CLEAN
                        }
                    }
                }
            }
        }
    }
}

export function editOrgSaveError(state: StoreState, action: EditOrgSaveError): StoreState {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    saveState: SaveState.SAVE_ERROR,
                    saveError: action.error
                }
            }
        }
    }
}

// Evaluate edit session

export function editOrgEvaluateOk(state: StoreState, action: EditOrgEvaluateOK): StoreState {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    validationState: {
                        type: ValidationErrorType.OK,
                        validatedAt: new Date()
                    }
                }
            }
        }
    }
}

export function editOrgEvaluateErrors(state: StoreState, action: EditOrgEvaluateErrors): StoreState {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    validationState: {
                        type: ValidationErrorType.ERROR,
                        message: 'Validation errors',
                        validatedAt: new Date()
                    }
                }
            }
        }
    }
}

function evaluateEditorState(viewModel: EditOrgViewModel): EditState {
    if (viewModel.editedOrganization.name.syncState === SyncState.DIRTY) {
        return EditState.EDITED
    }

    if (viewModel.editedOrganization.id.syncState === SyncState.DIRTY) {
        return EditState.EDITED
    }

    if (viewModel.editedOrganization.gravatarHash.syncState === SyncState.DIRTY) {
        return EditState.EDITED
    }

    if (viewModel.editedOrganization.isPrivate.syncState === SyncState.DIRTY) {
        return EditState.EDITED
    }

    if (viewModel.editedOrganization.description.syncState === SyncState.DIRTY) {
        return EditState.EDITED
    }

    return EditState.UNEDITED
}



// Name
export function editOrgUpdateNameSuccess(state: StoreState, action: EditOrgUpdateNameSuccess) {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    const editedOrg = state.views.editOrgView.viewModel.editedOrganization
    let syncState
    if (action.name !== editedOrg.name.remoteValue) {
        syncState = SyncState.DIRTY
    } else {
        syncState = SyncState.CLEAN
    }

    const newState = {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    // editState: editState,
                    editedOrganization: {
                        ...state.views.editOrgView.viewModel.editedOrganization,
                        name: {
                            ...state.views.editOrgView.viewModel.editedOrganization.name,
                            value: action.name,
                            syncState: syncState,
                            validationState: validationStateOk()
                        }
                    }
                }
            }
        }
    }

    // This bit is just to ensure that the overall edit state (used for controlling, e.g., the 
    // enablement of a save button).
    const editState = evaluateEditorState(newState.views.editOrgView.viewModel)

    return {
        ...newState,
        views: {
            ...state.views,
            editOrgView: {
                ...newState.views.editOrgView,
                viewModel: {
                    ...newState.views.editOrgView.viewModel,
                    editState: editState
                }
            }
        }
    }
}

export function editOrgUpdateNameError(state: StoreState, action: EditOrgUpdateNameError) {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    editState: EditState.EDITED,
                    editedOrganization: {
                        ...state.views.editOrgView.viewModel.editedOrganization,
                        name: {
                            ...state.views.editOrgView.viewModel.editedOrganization.name,
                            value: action.name,
                            syncState: SyncState.DIRTY,
                            validationState: action.error
                        }
                    }
                }
            }
        }
    }
}

// Gravatar hash
export function editOrgUpdateGravatarHashSuccess(state: StoreState, action: EditOrgUpdateGravatarHashSuccess) {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    const newState = {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    editState: EditState.EDITED,
                    editedOrganization: {
                        ...state.views.editOrgView.viewModel.editedOrganization,
                        gravatarHash: {
                            ...state.views.editOrgView.viewModel.editedOrganization.gravatarHash,
                            value: action.gravatarHash,
                            syncState: SyncState.DIRTY,
                            validationState: validationStateOk()
                        }
                    }
                }
            }
        }
    }

    // This bit is just to ensure that the overall edit state (used for controlling, e.g., the 
    // enablement of a save button).
    const editState = evaluateEditorState(newState.views.editOrgView.viewModel)

    return {
        ...newState,
        views: {
            ...state.views,
            editOrgView: {
                ...newState.views.editOrgView,
                viewModel: {
                    ...newState.views.editOrgView.viewModel,
                    editState: editState
                }
            }
        }
    }
}

export function editOrgUpdateGravatarHashError(state: StoreState, action: EditOrgUpdateGravatarHashError) {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    editState: EditState.EDITED,
                    editedOrganization: {
                        ...state.views.editOrgView.viewModel.editedOrganization,
                        gravatarHash: {
                            ...state.views.editOrgView.viewModel.editedOrganization.gravatarHash,
                            value: action.gravatarHash,
                            syncState: SyncState.DIRTY,
                            validationState: action.error
                        }
                    }
                }
            }
        }
    }
}

// Id

// export function editOrgUpdateIdSuccess(state: StoreState, action: EditOrgUpdateIdSuccess) {
//     return {
//         ...state, editOrg: {
//             ...state.editOrg,
//             editState: EditState.EDITED,
//             editedOrganization: {
//                 ...state.editOrg.editedOrganization!,
//                 id: {
//                     value: action.id,
//                     status: FieldState.EDITED_OK,
//                     error: {
//                         type: UIErrorType.NONE
//                     }
//                 }
//             }
//         }
//     }
// }

// export function editOrgUpdateIdError(state: StoreState, action: EditOrgUpdateIdError) {
//     return {
//         ...state, editOrg: {
//             ...state.editOrg,
//             editState: EditState.EDITED,
//             editedOrganization: {
//                 ...state.editOrg.editedOrganization!,
//                 id: {
//                     value: action.id,
//                     status: FieldState.EDITED_ERROR,
//                     error: action.error
//                 }
//             }
//         }
//     }
// }

export function updateDescriptionSuccess(state: StoreState, action: EditOrgUpdateDescriptionSuccess) {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    const editedOrg = state.views.editOrgView.viewModel.editedOrganization
    let syncState
    if (action.description !== editedOrg.description.remoteValue) {
        syncState = SyncState.DIRTY
    } else {
        syncState = SyncState.CLEAN
    }

    const newState = {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    editState: EditState.EDITED,
                    editedOrganization: {
                        ...state.views.editOrgView.viewModel.editedOrganization,
                        description: {
                            ...state.views.editOrgView.viewModel.editedOrganization.description,
                            value: action.description,
                            syncState: syncState,
                            validationState: validationStateOk()
                        }
                    }
                }
            }
        }
    }

    // This bit is just to ensure that the overall edit state (used for controlling, e.g., the 
    // enablement of a save button).
    const editState = evaluateEditorState(newState.views.editOrgView.viewModel)

    return {
        ...newState,
        views: {
            ...state.views,
            editOrgView: {
                ...newState.views.editOrgView,
                viewModel: {
                    ...newState.views.editOrgView.viewModel,
                    editState: editState
                }
            }
        }
    }
}

export function editOrgUpdateDescriptionError(state: StoreState, action: EditOrgUpdateDescriptionError) {
    if (!state.views.editOrgView.viewModel) {
        return state
    }

    return {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    editState: EditState.EDITED,
                    editedOrganization: {
                        ...state.views.editOrgView.viewModel.editedOrganization,
                        description: {
                            ...state.views.editOrgView.viewModel.editedOrganization.description,
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

export function updateIsPrivateSuccess(state: StoreState, action: UpdateIsPrivateSuccess) {
    if (!state.views.editOrgView.viewModel) {
        return state
    }


    const editedOrg = state.views.editOrgView.viewModel.editedOrganization
    let syncState
    if (action.isPrivate !== editedOrg.isPrivate.remoteValue) {
        syncState = SyncState.DIRTY
    } else {
        syncState = SyncState.CLEAN
    }

    const newState = {
        ...state,
        views: {
            ...state.views,
            editOrgView: {
                ...state.views.editOrgView,
                viewModel: {
                    ...state.views.editOrgView.viewModel,
                    editState: EditState.EDITED,
                    editedOrganization: {
                        ...state.views.editOrgView.viewModel.editedOrganization,
                        isPrivate: {
                            ...state.views.editOrgView.viewModel.editedOrganization.isPrivate,
                            value: action.isPrivate,
                            syncState: syncState,
                            validationState: validationStateOk()
                        }
                    }
                }
            }
        }
    }

    // This bit is just to ensure that the overall edit state (used for controlling, e.g., the 
    // enablement of a save button).
    const editState = evaluateEditorState(newState.views.editOrgView.viewModel)

    return {
        ...newState,
        views: {
            ...state.views,
            editOrgView: {
                ...newState.views.editOrgView,
                viewModel: {
                    ...newState.views.editOrgView.viewModel,
                    editState: editState
                }
            }
        }
    }
}

export function reducer(state: StoreState, action: Action): StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.EDIT_ORG_LOAD_START:
            return loadStart(state, action as LoadStart)
        case ActionFlag.EDIT_ORG_LOAD_SUCCESS:
            return loadSuccess(state, action as LoadSuccess)
        case ActionFlag.EDIT_ORG_LOAD_ERROR:
            return loadError(state, action as LoadError)
        case ActionFlag.EDIT_ORG_SAVE_START:
            return editOrgSaveStart(state, action as EditOrgSaveStart)
        case ActionFlag.EDIT_ORG_SAVE_SUCCESS:
            return editOrgSaveSuccess(state, action as EditOrgSaveSuccess)
        case ActionFlag.EDIT_ORG_SAVE_ERROR:
            return editOrgSaveError(state, action as EditOrgSaveError)

        case ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS:
            return editOrgUpdateNameSuccess(state, action as EditOrgUpdateNameSuccess)
        case ActionFlag.EDIT_ORG_UPDATE_NAME_ERROR:
            return editOrgUpdateNameError(state, action as EditOrgUpdateNameError)

        case ActionFlag.EDIT_ORG_UPDATE_GRAVATAR_HASH_SUCCESS:
            return editOrgUpdateGravatarHashSuccess(state, action as EditOrgUpdateGravatarHashSuccess)
        case ActionFlag.EDIT_ORG_UPDATE_GRAVATAR_HASH_ERROR:
            return editOrgUpdateGravatarHashError(state, action as EditOrgUpdateGravatarHashError)

        case ActionFlag.EDIT_ORG_UPDATE_IS_PRIVATE_SUCCESS:
            return updateIsPrivateSuccess(state, action as UpdateIsPrivateSuccess)

        // case ActionFlag.EDIT_ORG_UPDATE_ID_SUCCESS:
        //     return editOrgUpdateIdSuccess(state, action as EditOrgUpdateIdSuccess)
        // case ActionFlag.EDIT_ORG_UPDATE_ID_ERROR:
        //     return editOrgUpdateIdError(state, action as EditOrgUpdateIdError)
        case ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_SUCCESS:
            return updateDescriptionSuccess(state, action as EditOrgUpdateDescriptionSuccess)
        case ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_ERROR:
            return editOrgUpdateDescriptionError(state, action as EditOrgUpdateDescriptionError)
        case ActionFlag.EDIT_ORG_EVALUATE_OK:
            return editOrgEvaluateOk(state, action as EditOrgEvaluateOK)
        case ActionFlag.EDIT_ORG_EVALUATE_ERRORS:
            return editOrgEvaluateErrors(state, action as EditOrgEvaluateErrors)
        default:
            return null
    }
}

export default reducer