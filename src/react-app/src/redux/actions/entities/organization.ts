import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from '../index'
import * as orgModel from '../../../data/models/organization/model'
import { StoreState } from '../../../types'
import { AnError, makeError } from '../../../lib/error';

export interface OrganizationEntityAction extends Action {

}

// Organization

export interface Load extends OrganizationEntityAction {
    type: ActionFlag.ENTITY_ORGANIZATION_LOAD
}

interface LoadStart extends OrganizationEntityAction {
    type: ActionFlag.ENTITY_ORGANIZATION_LOAD_START
}

export interface LoadSuccess extends OrganizationEntityAction {
    type: ActionFlag.ENTITY_ORGANIZATION_LOAD_SUCCESS
    organization: orgModel.Organization
}

interface LoadError extends OrganizationEntityAction {
    type: ActionFlag.ENTITY_ORGANIZATION_LOAD_ERROR
    error: AnError
}

export function load(organizationId: orgModel.OrganizationID) {
    return async (dispatch: ThunkDispatch<StoreState, void, OrganizationEntityAction>, getState: () => StoreState) => {
        dispatch(<LoadStart>{
            type: ActionFlag.ENTITY_ORGANIZATION_LOAD_START
        })

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        })

        try {
            const organization = await orgClient.getOrg(organizationId)
            dispatch(<LoadSuccess>{
                type: ActionFlag.ENTITY_ORGANIZATION_LOAD_SUCCESS,
                organization
            })
        } catch (ex) {
            dispatch(<LoadError>{
                type: ActionFlag.ENTITY_ORGANIZATION_LOAD_ERROR,
                error: makeError({
                    code: ex.name,
                    message: ex.message
                })
            })
        }
    }
}