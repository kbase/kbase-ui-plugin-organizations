import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { ActionFlag } from '../index'
import { AnError } from '../../../lib/error'
import { StoreState } from '../../../types'
import * as orgModel from '../../../data/models/organization/model'
import { makeError } from '../../../combo/error/api'


// Add Org

// export interface AddOrganization extends Action<ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION> {
//     type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION,
//     organizationId: orgModel.OrganizationID
// }

// export interface AddOrganizationStart extends Action<ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_START> {
//     type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_START
// }

// export interface AddOrganizationSuccess extends Action<ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_SUCCESS> {
//     type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_SUCCESS,
//     organizationId: orgModel.OrganizationID
// }

// export interface AddOrganizationError extends Action<ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_ERROR> {
//     type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_ERROR,
//     error: AnError
// }

// export function addOrganization(organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) {
//     return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
//         dispatch({
//             type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_START
//         } as AddOrganizationStart)

//         const {
//             auth: { authorization: { token, username } },
//             app: { config },
//             views: {
//                 viewOrgView: { viewModel }
//             }
//         } = getState()
//         if (viewModel === null) {
//             throw new Error('view is not populated')
//         }
//         const orgClient = new orgModel.OrganizationModel({
//             token, username,
//             groupsServiceURL: config.services.Groups.url
//         })
//         try {
//             await orgClient.addRelatedOrganization({ organizationId, relatedOrganizationId })
//             dispatch({
//                 type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_SUCCESS,
//                 organizationId
//             })
//         } catch (ex) {
//             dispatch({
//                 type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_ERROR,
//                 error: makeError({
//                     code: 'error',
//                     message: ex.message
//                 })
//             })
//         }
//     }
// }


// Remove Org

export interface RemoveOrganization extends Action<ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION> {
    type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION,
    organizationId: orgModel.OrganizationID
}

export interface RemoveOrganizationStart extends Action<ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_START> {
    type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_START
}

export interface RemoveOrganizationSuccess extends Action<ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS> {
    type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS,
    organizationId: orgModel.OrganizationID
}

export interface RemoveOrganizationError extends Action<ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_ERROR> {
    type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_ERROR,
    error: AnError
}

export function removeOrganization(organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_START
        } as RemoveOrganizationStart)

        const {
            auth: { authorization: { token, username } },
            app: { config },
            views: {
                viewOrgView: { viewModel }
            }
        } = getState()
        if (viewModel === null) {
            throw new Error('view is not populated')
        }
        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        })
        try {
            await orgClient.removeRelatedOrganization({ organizationId, relatedOrganizationId })
            dispatch({
                type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS,
                organizationId: relatedOrganizationId
            } as RemoveOrganizationSuccess)
            // dispatch(viewOrgActions.reload(organizationId))
        } catch (ex) {
            dispatch({
                type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_ERROR,
                error: makeError({
                    code: 'error',
                    message: ex.message
                })
            })
        }
    }
}