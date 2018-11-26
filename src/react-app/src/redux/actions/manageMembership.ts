import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { ActionFlag } from './index'
import { Model } from '../../data/model'
import { AppError, Organization, StoreState } from '../../types';

// Loading

export interface Load extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LOAD
}

export interface LoadStart extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_START
}

export interface LoadSuccess extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_SUCCESS,
    organization: Organization
}

export interface LoadError extends Action {
    type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_ERROR,
    error: AppError
}

export function loadStart(): LoadStart {
    return {
        type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_START
    }
}

export function loadSuccess(organization: Organization): LoadSuccess {
    return {
        type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_SUCCESS,
        organization: organization
    }
}

export function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.MANAGE_MEMBERSHIP_LOAD_ERROR,
        error: error
    }
}

export function manageMembershipLoad(organizationId: string, memberUsername: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        console.log('here?')
        dispatch(loadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()
        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        })

        model.getOrg(organizationId)
            .then((org) => {
                dispatch(loadSuccess(org))
            })
            .catch((err) => {
                dispatch(loadError({
                    code: err.name,
                    message: err.message
                }))
            })
    }

}

// Modify fields


// Save