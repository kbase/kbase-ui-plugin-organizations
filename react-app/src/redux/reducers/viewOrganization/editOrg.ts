import { Action } from 'redux';
import {
    StoreState
} from '../../../types';
import { ActionFlag } from '../../actions';
import {
    LoadStart, LoadSuccess, LoadError,
    EditOrgEvaluateOK, EditOrgEvaluateErrors,
    EditOrgSaveStart, EditOrgSaveError, EditOrgSaveSuccess,
    EditOrgUpdateNameSuccess, EditOrgUpdateNameError,
    EditOrgUpdateDescriptionSuccess, EditOrgUpdateDescriptionError,
    UpdateIsPrivateSuccess, UpdateLogoUrlSuccess, UpdateLogoUrlError,
    UpdateHomeUrlSuccess, UpdateHomeUrlError, UpdateResearchInterestsError,
    UpdateResearchInterestsSuccess, Unload
} from '../../actions/viewOrganization/editOrg';
import {
    AsyncModelState, SyncState, EditState, EditableOrganization, ValidationErrorType,
    SaveState, ValidationStateOk, AsyncModel
} from '../../../types/common';
import { SubViewKind, ViewOrgViewModelKind } from '../../../types/views/Main/views/ViewOrg';
import { EditOrgViewModel } from '../../../types/views/Main/views/ViewOrg/views/EditOrg';

// EDIT ORG

// Edit session loading

export function loadStart(state: AsyncModel<EditOrgViewModel>, action: LoadStart): AsyncModel<EditOrgViewModel> {
    return {
        loadingState: AsyncModelState.LOADING
    };
}

function validationStateOk(): ValidationStateOk {
    return {
        type: ValidationErrorType.OK,
        validatedAt: new Date()
    };
}

export function loadSuccess(state: AsyncModel<EditOrgViewModel>, action: LoadSuccess): AsyncModel<EditOrgViewModel> {
    return {
        loadingState: AsyncModelState.SUCCESS,
        value: {
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
    };
}

export function loadError(state: AsyncModel<EditOrgViewModel>, action: LoadError): AsyncModel<EditOrgViewModel> {
    return {
        loadingState: AsyncModelState.ERROR,
        error: action.error
    };
}

export function unload(state: AsyncModel<EditOrgViewModel>, action: Unload): AsyncModel<EditOrgViewModel> {
    return {
        loadingState: AsyncModelState.NONE
    };
}

// save

export function editOrgSaveStart(state: AsyncModel<EditOrgViewModel>, action: EditOrgSaveStart): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    return {
        ...state,
        value: {
            ...state.value,
            saveState: SaveState.SAVING
        }
    };
}

export function editOrgSaveSuccess(state: AsyncModel<EditOrgViewModel>, action: EditOrgSaveSuccess): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    return {
        ...state,
        value: {
            ...state.value,
            editState: EditState.UNEDITED,
            saveState: SaveState.SAVED,
            editedOrganization: {
                id: {
                    ...state.value.editedOrganization.id,
                    syncState: SyncState.CLEAN
                },
                name: {
                    ...state.value.editedOrganization.name,
                    syncState: SyncState.CLEAN
                },
                logoUrl: {
                    ...state.value.editedOrganization.logoUrl,
                    syncState: SyncState.CLEAN
                },
                homeUrl: {
                    ...state.value.editedOrganization.homeUrl,
                    syncState: SyncState.CLEAN
                },
                researchInterests: {
                    ...state.value.editedOrganization.researchInterests,
                    syncState: SyncState.CLEAN
                },
                isPrivate: {
                    ...state.value.editedOrganization.isPrivate,
                    syncState: SyncState.CLEAN
                },
                description: {
                    ...state.value.editedOrganization.description,
                    syncState: SyncState.CLEAN
                }
            }
        }
    };
}

export function editOrgSaveError(state: AsyncModel<EditOrgViewModel>, action: EditOrgSaveError): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    return {
        ...state,
        value: {
            ...state.value,
            saveState: SaveState.SAVE_ERROR,
            saveError: action.error
        }
    };
}

// Evaluate edit session

export function editOrgEvaluateOk(state: AsyncModel<EditOrgViewModel>, action: EditOrgEvaluateOK): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    return {
        ...state,
        value: {
            ...state.value,
            validationState: {
                type: ValidationErrorType.OK,
                validatedAt: new Date()
            }
        }
    };
}

export function editOrgEvaluateErrors(state: AsyncModel<EditOrgViewModel>, action: EditOrgEvaluateErrors): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    return {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            validationState: {
                type: ValidationErrorType.ERROR,
                message: 'Validation errors',
                validatedAt: new Date()
            }
        }
    };
}

function evaluateEditorState(editedOrganization: EditableOrganization): EditState {
    if (editedOrganization.name.syncState === SyncState.DIRTY) {
        return EditState.EDITED;
    }

    if (editedOrganization.id.syncState === SyncState.DIRTY) {
        return EditState.EDITED;
    }

    if (editedOrganization.logoUrl.syncState === SyncState.DIRTY) {
        return EditState.EDITED;
    }

    if (editedOrganization.homeUrl.syncState === SyncState.DIRTY) {
        return EditState.EDITED;
    }

    if (editedOrganization.researchInterests.syncState === SyncState.DIRTY) {
        return EditState.EDITED;
    }

    if (editedOrganization.isPrivate.syncState === SyncState.DIRTY) {
        return EditState.EDITED;
    }

    if (editedOrganization.description.syncState === SyncState.DIRTY) {
        return EditState.EDITED;
    }

    return EditState.UNEDITED;
}



// Name
export function editOrgUpdateNameSuccess(state: AsyncModel<EditOrgViewModel>, action: EditOrgUpdateNameSuccess): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const editedOrg = state.value.editedOrganization;
    let syncState;
    if (action.name !== editedOrg.name.remoteValue) {
        syncState = SyncState.DIRTY;
    } else {
        syncState = SyncState.CLEAN;
    }

    const newState = {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                name: {
                    ...state.value.editedOrganization.name,
                    value: action.name,
                    syncState: syncState,
                    validationState: validationStateOk()
                }
            }
        }
    };

    // This bit is just to ensure that the overall edit state (used for controlling, e.g., the 
    // enablement of a save button).
    const editState = evaluateEditorState(newState.value.editedOrganization);

    return {
        ...newState,
        value: {
            ...newState.value,
            editState
        }
    };
}

export function editOrgUpdateNameError(state: AsyncModel<EditOrgViewModel>, action: EditOrgUpdateNameError): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    return {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                name: {
                    ...state.value.editedOrganization.name,
                    value: action.name,
                    syncState: SyncState.DIRTY,
                    validationState: action.error
                }
            }
        }
    };
}

// Logo url
export function editOrgUpdateLogoUrlSuccess(state: AsyncModel<EditOrgViewModel>, action: UpdateLogoUrlSuccess): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const newState = {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                logoUrl: {
                    ...state.value.editedOrganization.logoUrl,
                    value: action.logoUrl,
                    syncState: SyncState.DIRTY,
                    validationState: validationStateOk()
                }
            }
        }
    };


    // This bit is just to ensure that the overall edit state (used for controlling, e.g., the 
    // enablement of a save button).
    const editState = evaluateEditorState(newState.value.editedOrganization);

    return {
        ...newState,
        value: {
            ...newState.value,
            editState
        }
    };
}

export function editOrgUpdateLogoUrlError(state: AsyncModel<EditOrgViewModel>, action: UpdateLogoUrlError): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    return {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                logoUrl: {
                    ...state.value.editedOrganization.logoUrl,
                    value: action.logoUrl,
                    syncState: SyncState.DIRTY,
                    validationState: action.error
                }
            }
        }
    };
}

// Update Home Url

// Logo url
export function editOrgUpdateHomeUrlSuccess(state: AsyncModel<EditOrgViewModel>, action: UpdateHomeUrlSuccess): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const newState = {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                homeUrl: {
                    ...state.value.editedOrganization.homeUrl,
                    value: action.homeUrl,
                    syncState: SyncState.DIRTY,
                    validationState: validationStateOk()
                }
            }
        }
    };

    // This bit is just to ensure that the overall edit state (used for controlling, e.g., the 
    // enablement of a save button).
    const editState = evaluateEditorState(newState.value.editedOrganization);

    return {
        ...newState,
        value: {
            ...newState.value,
            editState
        }
    };
}

export function editOrgUpdateHomeUrlError(state: AsyncModel<EditOrgViewModel>, action: UpdateHomeUrlError): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    return {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                homeUrl: {
                    ...state.value.editedOrganization.homeUrl,
                    value: action.homeUrl,
                    syncState: SyncState.DIRTY,
                    validationState: action.error
                }
            }
        }
    };
}

// Update Research Interests

// Logo url
export function updateResearchInterestsSuccess(state: AsyncModel<EditOrgViewModel>, action: UpdateResearchInterestsSuccess): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const newState = {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                researchInterests: {
                    ...state.value.editedOrganization.researchInterests,
                    value: action.researchInterests,
                    syncState: SyncState.DIRTY,
                    validationState: validationStateOk()
                }
            }
        }
    };

    // This bit is just to ensure that the overall edit state (used for controlling, e.g., the 
    // enablement of a save button).
    const editState = evaluateEditorState(newState.value.editedOrganization);

    return {
        ...newState,
        value: {
            ...newState.value,
            editState
        }
    };
}

export function updateResearchInterestsError(state: AsyncModel<EditOrgViewModel>, action: UpdateResearchInterestsError): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    return {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                researchInterests: {
                    ...state.value.editedOrganization.researchInterests,
                    value: action.researchInterests,
                    syncState: SyncState.DIRTY,
                    validationState: action.error
                }
            }
        }
    };
}

export function updateDescriptionSuccess(state: AsyncModel<EditOrgViewModel>, action: EditOrgUpdateDescriptionSuccess): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const editedOrg = state.value.editedOrganization;
    let syncState;
    if (action.description !== editedOrg.description.remoteValue) {
        syncState = SyncState.DIRTY;
    } else {
        syncState = SyncState.CLEAN;
    }

    const newState = {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                description: {
                    ...state.value.editedOrganization.description,
                    value: action.description,
                    syncState: syncState,
                    validationState: validationStateOk()
                }
            }
        }
    };

    // This bit is just to ensure that the overall edit state (used for controlling, e.g., the 
    // enablement of a save button).
    const editState = evaluateEditorState(newState.value.editedOrganization);

    return {
        ...newState,
        value: {
            ...newState.value,
            editState
        }
    };
}

export function editOrgUpdateDescriptionError(state: AsyncModel<EditOrgViewModel>, action: EditOrgUpdateDescriptionError): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    return {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                description: {
                    ...state.value.editedOrganization.description,
                    value: action.description,
                    syncState: SyncState.DIRTY,
                    validationState: action.error
                }
            }
        }
    };
}

export function updateIsPrivateSuccess(state: AsyncModel<EditOrgViewModel>, action: UpdateIsPrivateSuccess): AsyncModel<EditOrgViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const editedOrg = state.value.editedOrganization;
    let syncState;
    if (action.isPrivate !== editedOrg.isPrivate.remoteValue) {
        syncState = SyncState.DIRTY;
    } else {
        syncState = SyncState.CLEAN;
    }

    const newState = {
        ...state,
        value: {
            ...state.value,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.value.editedOrganization,
                isPrivate: {
                    ...state.value.editedOrganization.isPrivate,
                    value: action.isPrivate,
                    syncState: syncState,
                    validationState: validationStateOk()
                }
            }
        }
    };

    // This bit is just to ensure that the overall edit state (used for controlling, e.g., the 
    // enablement of a save button).
    const editState = evaluateEditorState(newState.value.editedOrganization);

    return {
        ...newState,
        value: {
            ...newState.value,
            editState
        }
    };
};

export function haveReducer(actionType: ActionFlag): boolean {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (actionType) {
        case ActionFlag.EDIT_ORG_LOAD_START:
        case ActionFlag.EDIT_ORG_LOAD_SUCCESS:
        case ActionFlag.EDIT_ORG_LOAD_ERROR:
        case ActionFlag.EDIT_ORG_UNLOAD:
        case ActionFlag.EDIT_ORG_SAVE_START:
        case ActionFlag.EDIT_ORG_SAVE_SUCCESS:
        case ActionFlag.EDIT_ORG_SAVE_ERROR:
        case ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS:
        case ActionFlag.EDIT_ORG_UPDATE_NAME_ERROR:
        case ActionFlag.EDIT_ORG_UPDATE_LOGO_URL_SUCCESS:
        case ActionFlag.EDIT_ORG_UPDATE_LOGO_URL_ERROR:
        case ActionFlag.EDIT_ORG_UPDATE_HOME_URL_SUCCESS:
        case ActionFlag.EDIT_ORG_UPDATE_HOME_URL_ERROR:
        case ActionFlag.EDIT_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS:
        case ActionFlag.EDIT_ORG_UPDATE_RESEARCH_INTERESTS_ERROR:
        case ActionFlag.EDIT_ORG_UPDATE_IS_PRIVATE_SUCCESS:
        case ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_SUCCESS:
        case ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_ERROR:
        case ActionFlag.EDIT_ORG_EVALUATE_OK:
        case ActionFlag.EDIT_ORG_EVALUATE_ERRORS:
            return true;
        default:
            return false;
    }
}

export function localReducer(state: AsyncModel<EditOrgViewModel>, action: Action): AsyncModel<EditOrgViewModel> | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.EDIT_ORG_LOAD_START:
            return loadStart(state, action as LoadStart);
        case ActionFlag.EDIT_ORG_LOAD_SUCCESS:
            return loadSuccess(state, action as LoadSuccess);
        case ActionFlag.EDIT_ORG_LOAD_ERROR:
            return loadError(state, action as LoadError);

        case ActionFlag.EDIT_ORG_UNLOAD:
            return unload(state, action as Unload);

        case ActionFlag.EDIT_ORG_SAVE_START:
            return editOrgSaveStart(state, action as EditOrgSaveStart);
        case ActionFlag.EDIT_ORG_SAVE_SUCCESS:
            return editOrgSaveSuccess(state, action as EditOrgSaveSuccess);
        case ActionFlag.EDIT_ORG_SAVE_ERROR:
            return editOrgSaveError(state, action as EditOrgSaveError);

        case ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS:
            return editOrgUpdateNameSuccess(state, action as EditOrgUpdateNameSuccess);
        case ActionFlag.EDIT_ORG_UPDATE_NAME_ERROR:
            return editOrgUpdateNameError(state, action as EditOrgUpdateNameError);

        case ActionFlag.EDIT_ORG_UPDATE_LOGO_URL_SUCCESS:
            return editOrgUpdateLogoUrlSuccess(state, action as UpdateLogoUrlSuccess);
        case ActionFlag.EDIT_ORG_UPDATE_LOGO_URL_ERROR:
            return editOrgUpdateLogoUrlError(state, action as UpdateLogoUrlError);

        case ActionFlag.EDIT_ORG_UPDATE_HOME_URL_SUCCESS:
            return editOrgUpdateHomeUrlSuccess(state, action as UpdateHomeUrlSuccess);
        case ActionFlag.EDIT_ORG_UPDATE_HOME_URL_ERROR:
            return editOrgUpdateHomeUrlError(state, action as UpdateHomeUrlError);

        case ActionFlag.EDIT_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS:
            return updateResearchInterestsSuccess(state, action as UpdateResearchInterestsSuccess);
        case ActionFlag.EDIT_ORG_UPDATE_RESEARCH_INTERESTS_ERROR:
            return updateResearchInterestsError(state, action as UpdateResearchInterestsError);

        case ActionFlag.EDIT_ORG_UPDATE_IS_PRIVATE_SUCCESS:
            return updateIsPrivateSuccess(state, action as UpdateIsPrivateSuccess);

        // case ActionFlag.EDIT_ORG_UPDATE_ID_SUCCESS:
        //     return editOrgUpdateIdSuccess(state, action as EditOrgUpdateIdSuccess)
        // case ActionFlag.EDIT_ORG_UPDATE_ID_ERROR:
        //     return editOrgUpdateIdError(state, action as EditOrgUpdateIdError)
        case ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_SUCCESS:
            return updateDescriptionSuccess(state, action as EditOrgUpdateDescriptionSuccess);
        case ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_ERROR:
            return editOrgUpdateDescriptionError(state, action as EditOrgUpdateDescriptionError);
        case ActionFlag.EDIT_ORG_EVALUATE_OK:
            return editOrgEvaluateOk(state, action as EditOrgEvaluateOK);
        case ActionFlag.EDIT_ORG_EVALUATE_ERRORS:
            return editOrgEvaluateErrors(state, action as EditOrgEvaluateErrors);
        default:
            return null;
    }
}


export default function reducer(state: StoreState, action: Action): StoreState | null {
    if (!haveReducer(action.type)) {
        return null;
    }

    if (state.auth.userAuthorization === null) {
        return state;
    }

    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.EDIT_ORGANIZATION) {
        return state;
    }

    // if (state.view.value.model.value.subView.model.loadingState !== AsyncModelState.SUCCESS) {
    //     return state;
    // }


    // if (state.view.value.model.loadingState !== AsyncModelState.SUCCESS) {
    //     return state;
    // }

    const newViewModel = localReducer(state.view.value.views.viewOrg.value.subView.model, action);
    if (newViewModel == null) {
        return null;
    }
    return {
        ...state,
        view: {
            ...state.view,
            value: {
                ...state.view.value,
                views: {
                    ...state.view.value.views,
                    viewOrg: {
                        ...state.view.value.views.viewOrg,
                        value: {
                            ...state.view.value.views.viewOrg.value,
                            subView: {
                                ...state.view.value.views.viewOrg.value.subView,
                                model: newViewModel
                            }
                        }
                    }
                }
            }
        }
    };

};