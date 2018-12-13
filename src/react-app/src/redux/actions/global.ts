import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import * as userModel from '../../data/models/user'
import * as orgModel from '../../data/models/organization/model'
import * as narrativeModel from '../../data/models/narrative'
import { AppError, StoreState } from '../../types';

// Access narrative

export interface AccessNarrative extends Action {
    type: ActionFlag.GLOBAL_ACCESS_NARRATIVE,
    narrative: orgModel.NarrativeResource
}

export interface AccessNarrativeStart extends Action {
    type: ActionFlag.GLOBAL_ACCESS_NARRATIVE_START
}

export interface AccessNarrativeSuccess extends Action {
    type: ActionFlag.GLOBAL_ACCESS_NARRATIVE_SUCCESS,
    narrative: narrativeModel.AccessibleNarrative
}

export interface AccessNarrativeError extends Action {
    type: ActionFlag.GLOBAL_ACCESS_NARRATIVE_ERROR,
    error: AppError
}

// Generators
export function accessNarrativeStart(): AccessNarrativeStart {
    return {
        type: ActionFlag.GLOBAL_ACCESS_NARRATIVE_START
    }
}

export function accessNarrativeSuccess(narrative: narrativeModel.AccessibleNarrative): AccessNarrativeSuccess {
    return {
        type: ActionFlag.GLOBAL_ACCESS_NARRATIVE_SUCCESS,
        narrative: narrative
    }
}

export function accessNarrativeError(error: AppError): AccessNarrativeError {
    return {
        type: ActionFlag.GLOBAL_ACCESS_NARRATIVE_ERROR,
        error: error
    }
}

// Thunk

export function accessNarrative(organizationId: orgModel.OrganizationID, workspaceId: narrativeModel.WorkspaceID) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(accessNarrativeStart())

        const state = getState()

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = state

        const resourceId = String(workspaceId)

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        const narrativeClient = new narrativeModel.NarrativeModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        console.log('hmm')
        try {
            await orgClient.grantNarrativeAccess(organizationId, resourceId)
            const updatedNarrative = await narrativeClient.getNarrative(workspaceId)
            if (updatedNarrative.access === narrativeModel.NarrativeAccess.NONE) {
                dispatch(accessNarrativeError({
                    code: 'error',
                    message: 'Narrative should be accessible, but is not'
                }))
                return
            }
            console.log('done')
            dispatch(accessNarrativeSuccess(updatedNarrative))
        } catch (ex) {
            console.log('error!', ex)
            dispatch(accessNarrativeError({
                code: 'error',
                message: ex.message
            }))
        }

    }
}