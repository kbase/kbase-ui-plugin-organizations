import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { ActionFlag } from './index'
import { Model } from '../../data/model'
import { AppError, StoreState, Narrative } from '../../types'

import * as orgModel from '../../data/models/organization/model'
import * as narrativeModel from '../../data/models/narrative'
import * as requestModel from '../../data/models/requests'

export interface Load extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD
}

export interface LoadStart extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_START
}

export interface LoadSuccess extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_SUCCESS
    organization: orgModel.Organization
    narratives: Array<Narrative>
    relation: orgModel.Relation
}

export interface LoadError extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR
    error: AppError
}

export function loadStart(): LoadStart {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_START
    }
}

export function loadSuccess(organization: orgModel.Organization, narratives: Array<Narrative>, relation: orgModel.Relation): LoadSuccess {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_SUCCESS,
        organization, narratives, relation
    }
}

export function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR,
        error: error
    }
}

export function load(organizationId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })
        const narrativeClient = new narrativeModel.NarrativeModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            serviceWizardURL: config.services.ServiceWizard.url,
            workspaceServiceURL: config.services.Workspace.url
        })
        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            const [org, narratives, request, invitation] = await Promise.all([
                orgClient.getOrganization(organizationId),
                narrativeClient.getOwnNarratives(organizationId),
                requestClient.getUserRequestForOrg(organizationId),
                requestClient.getUserInvitationForOrg(organizationId)
            ])

            const relation = orgModel.determineRelation(org, username, request, invitation)
            dispatch(loadSuccess(org, narratives, relation))
        } catch (ex) {
            console.error('loading error', ex)
            dispatch(loadError({
                code: ex.name,
                message: ex.message
            }))
        }
    }
}

// Selecting narrative
export interface SelectNarrative {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE,
    narrative: Narrative
}

export interface SelectNarrativeStart {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_START
}

export interface SelectNarrativeSuccess {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_SUCCESS
    narrative: Narrative
}

export interface SelectNarrativeError {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_ERROR
    error: AppError
}

export function selectNarrativeStart(): SelectNarrativeStart {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_START
    }
}

export function selectNarrativeSuccess(narrative: Narrative): SelectNarrativeSuccess {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_SUCCESS,
        narrative: narrative
    }
}

export function selectNarrativeError(error: AppError): SelectNarrativeError {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_ERROR,
        error: error
    }
}

export function selectNarrative(narrative: Narrative) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(selectNarrativeStart())

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        // TODO: fetch narrative and populate the selected narrative accordingly...


        dispatch(selectNarrativeSuccess(narrative))
    }
}

// Sending Request
export interface SendRequest {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND
}

export interface SendRequestStart {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_START
}

export interface SendRequestSuccess {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_SUCCESS,
    request: requestModel.Request | boolean
}

export interface SendRequestError {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_ERROR,
    error: AppError
}


export function sendRequestStart(): SendRequestStart {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_START
    }
}

export function sendRequestSuccess(request: requestModel.Request | boolean): SendRequestSuccess {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_SUCCESS,
        request: request
    }
}

export function sendRequestError(error: AppError): SendRequestError {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_ERROR,
        error: error
    }
}

export function sendRequest(groupId: string, narrative: Narrative) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(sendRequestStart())

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            const request = await orgClient.addOrRequestNarrativeToGroup(groupId, narrative.workspaceId)
            dispatch(sendRequestSuccess(request))
        } catch (ex) {
            dispatch(sendRequestError({
                code: ex.name,
                message: ex.message
            }))
        }
    }
}

// Unloading

export interface Unload extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_UNLOAD
}

export function unload(): Unload {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_UNLOAD
    }
}