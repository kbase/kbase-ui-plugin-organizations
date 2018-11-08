import { Action, bindActionCreators } from 'redux'
import {
    EditOrgStart, EditOrgSuccess, EditOrgError,
    EditOrgUpdateNameSuccess, EditOrgUpdateNameError, EditOrgUpdateDescriptionSuccess, EditOrgUpdateDescriptionError, EditOrgSaveStart, EditOrgSaveSuccess, EditOrgSaveError
} from '../actions/editOrg'
import { StoreState, EditOrgState } from '../../types'
import { ActionFlag } from '../actions'

function editOrgStart(state: StoreState, action: EditOrgStart): StoreState {
    return { ...state, editOrg: { state: EditOrgState.FETCHING } }
}

function editOrgSuccess(state: StoreState, action: EditOrgSuccess): StoreState {
    return { ...state, editOrg: { state: EditOrgState.READY, editedOrganization: action.organization } }
}

function editOrgError(state: StoreState, action: EditOrgError): StoreState {
    return { ...state, editOrg: { state: EditOrgState.ERROR, error: action.error } }
}

// saving

function editOrgSaveStart(state: StoreState, action: EditOrgSaveStart): StoreState {
    return {...state, editOrg: {...state.editOrg, state: EditOrgState.SAVING}}
}

function editOrgSaveSuccess(state: StoreState, action: EditOrgSaveSuccess): StoreState {
    return {...state, editOrg: {...state.editOrg, state: EditOrgState.SAVED}}
}

function editOrgSaveError(state: StoreState, action: EditOrgSaveError): StoreState {
    return {...state, editOrg: {...state.editOrg,
                                state: EditOrgState.ERROR,
                                error: action.error}}
}

// export function updateOrgStart(state: StoreState, action: actions.UpdateOrgStart): types.StoreState {
//     return { ...state, updateOrg: { pending: true } }
// }

// export function updateOrgSuccess(state: types.StoreState, action: actions.UpdateOrgStart): types.StoreState {
//     return { ...state, updateOrg: { pending: false, editedOrganization: action. } }
// }

// export function updateOrgError(state: types.StoreState, action: actions.UpdateOrgError): types.StoreState {
//     return { ...state, error: action.error }
// }

function updateNameSuccess(state: StoreState, action: EditOrgUpdateNameSuccess): StoreState {
    // just brute force it ... destructuring would be brutal.
    console.log('success!', action.name)
    return {
        ...state,
        editOrg: {
            ...state.editOrg,
            editedOrganization: {
                ...state.editOrg.editedOrganization!,
                name: {
                    value: action.name
                }
            }
        }
    }
}

function updateNameError(state: StoreState, action: EditOrgUpdateNameError): StoreState {
    return {
        ...state,
        editOrg: {
            ...state.editOrg,
            editedOrganization: {
                ...state.editOrg.editedOrganization!,
                name: {
                    value: action.name,
                    error: action.error
                }
            }
        }
    }
}

function updateDescriptionSuccess(state: StoreState, action: EditOrgUpdateDescriptionSuccess): StoreState {
    // just brute force it ... destructuring would be brutal.
    console.log('success!', action.description)
    return {
        ...state,
        editOrg: {
            ...state.editOrg,
            editedOrganization: {
                ...state.editOrg.editedOrganization!,
                description: {
                    value: action.description
                }
            }
        }
    }
}

function updateDescriptionError(state: StoreState, action: EditOrgUpdateDescriptionError): StoreState {
    return {
        ...state,
        editOrg: {
            ...state.editOrg,
            editedOrganization: {
                ...state.editOrg.editedOrganization!,
                description: {
                    value: action.description,
                    error: action.error
                }
            }
        }
    }
}

function reducer(state: StoreState, action: Action): StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.EDIT_ORG_START:
            return editOrgStart(state, action as EditOrgStart)
        case ActionFlag.EDIT_ORG_SUCCESS:
            return editOrgSuccess(state, action as EditOrgSuccess)
        case ActionFlag.EDIT_ORG_ERROR:
            return editOrgError(state, action as EditOrgError)
        case ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS:
            return updateNameSuccess(state, action as EditOrgUpdateNameSuccess)
        case ActionFlag.EDIT_ORG_UPDATE_NAME_ERROR:
            return updateNameError(state, action as EditOrgUpdateNameError)
        case ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_SUCCESS:
            return updateDescriptionSuccess(state, action as EditOrgUpdateDescriptionSuccess)
        case ActionFlag.EDIT_ORG_UPDATE_DESCRIPTION_ERROR:
            return updateDescriptionError(state, action as EditOrgUpdateDescriptionError)
        default:
            return null
    }
}


export default reducer