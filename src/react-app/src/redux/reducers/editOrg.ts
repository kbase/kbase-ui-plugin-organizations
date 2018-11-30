import { Action } from 'redux'
import { StoreState, EditState, SaveState, UIErrorType, FieldState, ValidationState } from '../../types';
import { ActionFlag } from '../actions';
import {
    EditOrgEditStart, EditOrgEditSuccess, EditOrgEditError,
    EditOrgEvaluateOK, EditOrgEvaluateErrors,
    EditOrgSave, EditOrgSaveStart, EditOrgSaveError, EditOrgSaveSuccess,
    EditOrgUpdateNameSuccess, EditOrgUpdateNameError,
    // EditOrgUpdateIdSuccess, EditOrgUpdateIdError,
    EditOrgUpdateDescriptionSuccess, EditOrgUpdateDescriptionError,
    EditOrgUpdateGravatarHashError, EditOrgUpdateGravatarHashSuccess
} from '../actions/editOrg'



// EDIT ORG

// Edit session loading

export function editOrgEditStart(state: StoreState, action: EditOrgEditStart) {
    return {
        ...state, editOrg: {
            ...state.editOrg,
            editState: EditState.UNEDITED,
            validationState: ValidationState.NONE,
            saveState: SaveState.NEW,
            // TODO: get rid of this...
            organizationId: action.id,
            editedOrganization: {
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

export function editOrgEditSuccess(state: StoreState, action: EditOrgEditSuccess) {
    return {
        ...state, editOrg: {
            ...state.editOrg,
            editedOrganization: action.editedOrganization,
            organization: action.organization,
            editState: EditState.UNEDITED
        }
    }
}

// save

export function editOrgSaveStart(state: StoreState, action: EditOrgSaveStart): StoreState {
    return {
        ...state,
        editOrg: {
            ...state.editOrg,
            saveState: SaveState.SAVING
        }
    }
}

export function editOrgSaveSuccess(state: StoreState, action: EditOrgSaveSuccess): StoreState {
    return {
        ...state,
        editOrg: {
            ...state.editOrg,
            editState: EditState.UNEDITED,
            saveState: SaveState.SAVED
        }
    }
}

export function editOrgSaveError(state: StoreState, action: EditOrgSaveError): StoreState {
    return {
        ...state,
        editOrg: {
            ...state.editOrg,
            saveState: SaveState.SAVE_ERROR,
            error: action.error
        }
    }
}

// Evaluate edit session

export function editOrgEvaluateOk(state: StoreState, action: EditOrgEvaluateOK): StoreState {
    return {
        ...state,
        editOrg: {
            ...state.editOrg,
            validationState: ValidationState.VALID
        }
    }
}

export function editOrgEvaluateErrors(state: StoreState, action: EditOrgEvaluateErrors): StoreState {
    return {
        ...state,
        editOrg: {
            ...state.editOrg,
            validationState: ValidationState.INVALID
        }
    }
}



// Name
export function editOrgUpdateNameSuccess(state: StoreState, action: EditOrgUpdateNameSuccess) {
    return {
        ...state, editOrg: {
            ...state.editOrg,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.editOrg.editedOrganization,
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

export function editOrgUpdateNameError(state: StoreState, action: EditOrgUpdateNameError) {
    return {
        ...state, editOrg: {
            ...state.editOrg,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.editOrg.editedOrganization,
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
export function editOrgUpdateGravatarHashSuccess(state: StoreState, action: EditOrgUpdateGravatarHashSuccess) {
    return {
        ...state, editOrg: {
            ...state.editOrg,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.editOrg.editedOrganization,
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

export function editOrgUpdateGravatarHashError(state: StoreState, action: EditOrgUpdateGravatarHashError) {
    return {
        ...state, editOrg: {
            ...state.editOrg,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.editOrg.editedOrganization,
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

export function editOrgUpdateDescriptionSuccess(state: StoreState, action: EditOrgUpdateDescriptionSuccess) {
    return {
        ...state, editOrg: {
            ...state.editOrg,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.editOrg.editedOrganization,
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

export function editOrgUpdateDescriptionError(state: StoreState, action: EditOrgUpdateDescriptionError) {
    return {
        ...state, editOrg: {
            ...state.editOrg,
            editState: EditState.EDITED,
            editedOrganization: {
                ...state.editOrg.editedOrganization,
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
        case ActionFlag.EDIT_ORG_EDIT_START:
            return editOrgEditStart(state, action as EditOrgEditStart)
        case ActionFlag.EDIT_ORG_EDIT_SUCCESS:
            return editOrgEditSuccess(state, action as EditOrgEditSuccess)
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

        // case ActionFlag.EDIT_ORG_UPDATE_ID_SUCCESS:
        //     return editOrgUpdateIdSuccess(state, action as EditOrgUpdateIdSuccess)
        // case ActionFlag.EDIT_ORG_UPDATE_ID_ERROR:
        //     return editOrgUpdateIdError(state, action as EditOrgUpdateIdError)
        case ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_SUCCESS:
            return editOrgUpdateDescriptionSuccess(state, action as EditOrgUpdateDescriptionSuccess)
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