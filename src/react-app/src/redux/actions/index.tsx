import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import * as types from '../../types';
import { Model } from '../../data/model'

export enum ActionFlag {
    APP = 1,
    APP_START,
    APP_SUCCESS,
    // APP_SUCCESS_IFRAME,
    // APP_SUCCESS_SOLO,
    APP_ERROR,

    SORT_ORGS,
    SORT_ORGS_START,

    FILTER_ORGS,
    FILTER_ORGS_START,

    SEARCH_ORGS,
    SEARCH_ORGS_START,
    SEARCH_ORGS_SUCCESS,
    SEARCH_ORGS_ERROR,

    UPDATE_ORG,
    UPDATE_ORG_START,
    UPDATE_ORG_SUCCESS,
    UPDATE_ORG_ERROR,

    // viewing org
    VIEW_ORG_FETCH,
    VIEW_ORG_FETCH_START,
    VIEW_ORG_FETCH_SUCCESS,
    VIEW_ORG_FETCH_ERROR,
    VIEW_ORG_STOP,
    // editing org
    EDIT_ORG,
    EDIT_ORG_START,
    EDIT_ORG_SUCCESS,
    EDIT_ORG_ERROR,
    EDIT_ORG_SAVE,
    EDIT_ORG_SAVE_START,
    EDIT_ORG_SAVE_SUCCESS,
    EDIT_ORG_SAVE_ERROR,
    // edit org, field level updates
    EDIT_ORG_UPDATE_NAME,
    EDIT_ORG_UPDATE_NAME_SUCCESS,
    EDIT_ORG_UPDATE_NAME_ERROR,
    EDIT_ORG_UPDATE_DESCRIPTION,
    EDIT_ORG_UPDATE_DESCRIPTION_SUCCESS,
    EDIT_ORG_UPDATE_DESCRIPTION_ERROR,

    // add org fields
    ADD_ORG_EDIT,
    ADD_ORG_EDIT_START,
    ADD_ORG_EDIT_FINISH,

    ADD_ORG_UPDATE_NAME,
    ADD_ORG_UPDATE_NAME_SUCCESS,
    ADD_ORG_UPDATE_NAME_ERROR,
    ADD_ORG_UPDATE_GRAVATAR_HASH,
    ADD_ORG_UPDATE_GRAVATAR_HASH_SUCCESS,
    ADD_ORG_UPDATE_GRAVATAR_HASH_ERROR,
    ADD_ORG_UPDATE_ID,
    ADD_ORG_UPDATE_ID_SUCCESS,
    ADD_ORG_UPDATE_ID_ERROR,
    ADD_ORG_UPDATE_DESCRIPTION,
    ADD_ORG_UPDATE_DESCRIPTION_SUCCESS,
    ADD_ORG_UPDATE_DESCRIPTION_ERROR,
    ADD_ORG_EVALUATE,
    ADD_ORG_EVALUATE_OK,
    ADD_ORG_EVALUATE_ERRORS,

    ADD_ORG,
    ADD_ORG_START,
    ADD_ORG_SUCCESS,
    ADD_ORG_ERROR,

    // Auth
    AUTH_CHECK,
    AUTH_CHECK_START,
    AUTH_CHECK_ERROR,
    AUTH_AUTHORIZED,
    AUTH_UNAUTHORIZED,
    AUTH_REMOVE_AUTHORIZATION,
    AUTH_ADD_AUTHORIZATION
}


// // Update an org

// // export interface UpdateOrg  extends Action {
// //     type: ActionFlag.UPDATE_ORG,
// //     orgUpdate: types.OrganizationUpdate
// // }

// // export function updateOrg(orgUpdate: types.OrganizationUpdate) : UpdateOrg {
// //     return {
// //         type: ActionFlag.UPDATE_ORG,
// //         orgUpdate: orgUpdate
// //     }
// // }


// export interface UpdateOrgStart extends Action {
//     type: ActionFlag.UPDATE_ORG_START
// }

// export function updateOrgStart(): UpdateOrgStart {
//     return {
//         type: ActionFlag.UPDATE_ORG_START
//     }
// }

// export interface UpdateOrgSuccess extends Action {
//     type: ActionFlag.UPDATE_ORG_SUCCESS,
//     organization: types.Organization
// }

// export function updateOrgSuccess(org: types.Organization): UpdateOrgSuccess {
//     return {
//         type: ActionFlag.UPDATE_ORG_SUCCESS,
//         organization: org
//     }
// }

// export interface UpdateOrgError extends Action {
//     type: ActionFlag.UPDATE_ORG_ERROR,
//     error: types.AppError
// }
// export function updateOrgError(error: types.AppError): UpdateOrgError {
//     return {
//         type: ActionFlag.UPDATE_ORG_ERROR,
//         error: error
//     }
// }


// // export interface UpdateOrg extends Action {
// //     type: ActionFlag.UPDATE_ORG,
// //     orgUpdate: types.OrganizationUpdate
// // }

// // export function updateOrg(orgUpdate: types.OrganizationUpdate) {
// //     return (dispatch: ThunkDispatch<types.StoreState, void, Action>, getState : () => types.StoreState)  => {
// //         dispatch(updateOrgStart())

// //         const {auth: {token}} = getState()
// //         const model = new Model({token})

// //         return model.updateOrg(orgUpdate)
// //             .then((org: types.Organization) => {
// //                 // TODO: also total.
// //                 dispatch(updateOrgSuccess(org))
// //             })
// //             .catch((error) => {
// //                 dispatch(updateOrgError({
// //                     code: error.name,
// //                     message: error.message
// //                 }))
// //             })
// //     }
// // }



// // org name update

// export interface UpdateName extends Action {
//     type: ActionFlag.EDIT_ORG_UPDATE_NAME,
//     name: string
// }

// export interface UpdateNameSuccess extends Action {
//     type: ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS,
//     name: string
// }

// export function updateNameSuccess(name: string): UpdateNameSuccess {
//     return {
//         type: ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS,
//         name: name
//     }
// }

// // export class UpdateNameSuccess {
// //     static type: ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS = ActionFlag.EDIT_ORG_UPDATE_NAME_SUCCESS
// //     static createAction(name: string) {
// //         return {
// //             type: this.type,
// //             name: name
// //         }
// //     }
// //     static reducer(state: types.StoreState,
// //                    action: actions.UpdateNameSuccess): types.StoreState {
// //             // just brute force it ... destructuring would be brutal.
// //             const newState = {...state}
// //             newState.editOrg.editedOrganization = {...state.editOrg.editedOrganization!, name: action.name}
// //             console.log('here2!', action.name, newState)
// //             return newState
// //         }
// //     }

// // }

// export interface UpdateNameError extends Action {
//     type: ActionFlag.EDIT_ORG_UPDATE_NAME_ERROR,
//     error: types.AppError
// }

// export function updateNameError(error: types.AppError): UpdateNameError {
//     return {
//         type: ActionFlag.EDIT_ORG_UPDATE_NAME_ERROR,
//         error: error
//     }
// }

// export function updateName(name: string) {
//     return (dispatch: ThunkDispatch<types.StoreState, void, Action>,
//         getState: () => types.StoreState) => {
//         // validate the name

//         let errorMessage;

//         if (name.length === 0) {
//             errorMessage = 'The organization name may not be empty'
//         }

//         if (errorMessage) {
//             dispatch(updateNameError({
//                 code: 'invalid',
//                 message: errorMessage
//             }))
//         } else {
//             dispatch(updateNameSuccess(name))
//         }
//     }
// }

