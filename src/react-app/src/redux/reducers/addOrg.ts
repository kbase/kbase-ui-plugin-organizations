import { Action } from 'redux'
import { StoreState, EditState, SaveState, UIErrorType, FieldState, ValidationState } from '../../types';
import { ActionFlag } from '../actions';
import {
    AddOrgEditStart, AddOrgEditFinish,
    AddOrgUpdateNameSuccess, AddOrgUpdateNameError,
    AddOrgUpdateIdSuccess, AddOrgUpdateIdError,
    AddOrgUpdateDescriptionSuccess, AddOrgUpdateDescriptionError,
    AddOrgError, AddOrgStart, AddOrgSuccess, AddOrgEvaluateOK, AddOrgEvaluateErrors, AddOrgUpdateGravatarHashError, AddOrgUpdateGravatarHashSuccess
} from '../actions/addOrg'

// ADD ORG

export function addOrgStart(state: StoreState, action: AddOrgStart): StoreState {
    return {
        ...state,
        addOrg: {
            ...state.addOrg,
            saveState: SaveState.SAVING
        }
    }
}

export function addOrgSuccess(state: StoreState, action: AddOrgSuccess): StoreState {
    return {
        ...state,
        addOrg: {
            ...state.addOrg,
            editState: EditState.UNEDITED,
            saveState: SaveState.SAVED
        }
    }
}

export function addOrgError(state: StoreState, action: AddOrgError): StoreState {
    return {
        ...state,
        addOrg: {
            ...state.addOrg,
            saveState: SaveState.SAVE_ERROR,
            error: action.error
        }
    }
}

export function addOrgEvaluateOk(state: StoreState, action: AddOrgEvaluateOK): StoreState {
    return {
        ...state,
        addOrg: {
            ...state.addOrg,
            validationState: ValidationState.VALID
        }
    }
}

export function addOrgEvaluateErrors(state: StoreState, action: AddOrgEvaluateErrors): StoreState {
    return {
        ...state,
        addOrg: {
            ...state.addOrg,
            validationState: ValidationState.INVALID
        }
    }
}

export function addOrgEditStart(state: StoreState, action: AddOrgEditStart) {
    return {
        ...state, addOrg: {
            ...state.addOrg,
            editState: EditState.UNEDITED,
            validationState: ValidationState.NONE,
            saveState: SaveState.NEW,
            newOrganization: {
                id: {
                    value: '',
                    status: FieldState.NONE,
                    error: {
                        type: UIErrorType.NONE
                    }
                },
                name: {
                    value: '',
                    status: FieldState.NONE,
                    error: {
                        type: UIErrorType.NONE
                    }
                },
                gravatarHash: {
                    value: '',
                    status: FieldState.NONE,
                    error: {
                        type: UIErrorType.NONE
                    }
                },
                description: {
                    value: '',
                    status: FieldState.NONE,
                    error: {
                        type: UIErrorType.NONE
                    }
                }
            }
        }
    }
}

export function addOrgEditFinish(state: StoreState, action: AddOrgEditFinish) {
    return {
        ...state, addOrg: {
            ...state.addOrg,
            editState: EditState.UNEDITED
        }
    }
}

// Name
export function addOrgUpdateNameSuccess(state: StoreState, action: AddOrgUpdateNameSuccess) {
    return {
        ...state, addOrg: {
            ...state.addOrg,
            editState: EditState.EDITED,
            newOrganization: {
                ...state.addOrg.newOrganization!,
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

export function addOrgUpdateNameError(state: StoreState, action: AddOrgUpdateNameError) {
    return {
        ...state, addOrg: {
            ...state.addOrg,
            editState: EditState.EDITED,
            newOrganization: {
                ...state.addOrg.newOrganization!,
                name: {
                    value: action.name,
                    status: FieldState.EDITED_ERROR,
                    error: action.error
                }
            }
        }
    }
}

// Gravatar hash
export function addOrgUpdateGravatarHashSuccess(state: StoreState, action: AddOrgUpdateGravatarHashSuccess) {
    return {
        ...state, addOrg: {
            ...state.addOrg,
            editState: EditState.EDITED,
            newOrganization: {
                ...state.addOrg.newOrganization!,
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

export function addOrgUpdateGravatarHashError(state: StoreState, action: AddOrgUpdateGravatarHashError) {
    return {
        ...state, addOrg: {
            ...state.addOrg,
            editState: EditState.EDITED,
            newOrganization: {
                ...state.addOrg.newOrganization!,
                gravatarHash: {
                    value: action.gravatarHash,
                    status: FieldState.EDITED_ERROR,
                    error: action.error
                }
            }
        }
    }
}

// Id

export function addOrgUpdateIdSuccess(state: StoreState, action: AddOrgUpdateIdSuccess) {
    return {
        ...state, addOrg: {
            ...state.addOrg,
            editState: EditState.EDITED,
            newOrganization: {
                ...state.addOrg.newOrganization!,
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

export function addOrgUpdateIdError(state: StoreState, action: AddOrgUpdateIdError) {
    return {
        ...state, addOrg: {
            ...state.addOrg,
            editState: EditState.EDITED,
            newOrganization: {
                ...state.addOrg.newOrganization!,
                id: {
                    value: action.id,
                    status: FieldState.EDITED_ERROR,
                    error: action.error
                }
            }
        }
    }
}

export function addOrgUpdateDescriptionSuccess(state: StoreState, action: AddOrgUpdateDescriptionSuccess) {
    return {
        ...state, addOrg: {
            ...state.addOrg,
            editState: EditState.EDITED,
            newOrganization: {
                ...state.addOrg.newOrganization!,
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

export function addOrgUpdateDescriptionError(state: StoreState, action: AddOrgUpdateDescriptionError) {
    return {
        ...state, addOrg: {
            ...state.addOrg,
            editState: EditState.EDITED,
            newOrganization: {
                ...state.addOrg.newOrganization!,
                description: {
                    value: action.description,
                    status: FieldState.EDITED_ERROR,
                    error: action.error
                }
            }
        }
    }
}

export function reducer(state: StoreState, action: Action): StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.ADD_ORG_START:
            return addOrgStart(state, action as AddOrgStart)
        case ActionFlag.ADD_ORG_SUCCESS:
            return addOrgSuccess(state, action as AddOrgSuccess)
        case ActionFlag.ADD_ORG_ERROR:
            return addOrgError(state, action as AddOrgError)
        case ActionFlag.ADD_ORG_EDIT_START:
            return addOrgEditStart(state, action as AddOrgEditStart)
        case ActionFlag.ADD_ORG_EDIT_FINISH:
            return addOrgEditFinish(state, action as AddOrgEditFinish)
        case ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS:
            return addOrgUpdateNameSuccess(state, action as AddOrgUpdateNameSuccess)
        case ActionFlag.ADD_ORG_UPDATE_NAME_ERROR:
            return addOrgUpdateNameError(state, action as AddOrgUpdateNameError)

        case ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_SUCCESS:
            return addOrgUpdateGravatarHashSuccess(state, action as AddOrgUpdateGravatarHashSuccess)
        case ActionFlag.ADD_ORG_UPDATE_GRAVATAR_HASH_ERROR:
            return addOrgUpdateGravatarHashError(state, action as AddOrgUpdateGravatarHashError)

        case ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS:
            return addOrgUpdateIdSuccess(state, action as AddOrgUpdateIdSuccess)
        case ActionFlag.ADD_ORG_UPDATE_ID_ERROR:
            return addOrgUpdateIdError(state, action as AddOrgUpdateIdError)
        case ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS:
            return addOrgUpdateDescriptionSuccess(state, action as AddOrgUpdateDescriptionSuccess)
        case ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR:
            return addOrgUpdateDescriptionError(state, action as AddOrgUpdateDescriptionError)
        case ActionFlag.ADD_ORG_EVALUATE_OK:
            return addOrgEvaluateOk(state, action as AddOrgEvaluateOK)
        case ActionFlag.ADD_ORG_EVALUATE_ERRORS:
            return addOrgEvaluateErrors(state, action as AddOrgEvaluateErrors)
        default:
            return null
    }
}

export default reducer