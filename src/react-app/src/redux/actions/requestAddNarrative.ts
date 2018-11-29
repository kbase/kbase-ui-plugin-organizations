import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { ActionFlag } from './index'
import { Model } from '../../data/model'
import { AppError, Organization, StoreState, Narrative, GroupRequest } from '../../types'
import { Group } from 'antd/lib/radio';

export interface Load extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD
}

export interface LoadStart extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_START
}

export interface LoadSuccess extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_SUCCESS,
    organization: Organization,
    narratives: Array<Narrative>
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

export function loadSuccess(organization: Organization, narratives: Array<Narrative>): LoadSuccess {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_SUCCESS,
        organization: organization,
        narratives: narratives
    }
}

export function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR,
        error: error
    }
}

export function load(organizationId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        Promise.all([
            model.getOrg(organizationId),
            model.getOwnNarratives(organizationId)
        ])
            .then(([org, narratives]) => {
                dispatch(loadSuccess(org, narratives))
            })
            .catch((err) => {
                console.error('loading error', err)
                dispatch(loadError({
                    code: err.name,
                    message: err.message
                }))
            })
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

        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })


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
    request: GroupRequest | boolean
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

export function sendRequestSuccess(request: GroupRequest | boolean): SendRequestSuccess {
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
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(sendRequestStart())

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const model = new Model({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })

        Promise.all([
            model.addOrRequestNarrativeToGroup(groupId, narrative)
        ])
            .then(([request]) => {
                dispatch(sendRequestSuccess(request))
            })
            .catch((err) => {
                console.error('loading error', err)
                dispatch(sendRequestError({
                    code: err.name,
                    message: err.message
                }))
            })
    }
}