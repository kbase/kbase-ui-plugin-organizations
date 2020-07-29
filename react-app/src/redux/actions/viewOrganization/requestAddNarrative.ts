import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionFlag } from '../index';
import {
    StoreState, Narrative
} from '../../store/types';
import * as orgModel from '../../../data/models/organization/model';
import * as narrativeModel from '../../../data/models/narrative';
import * as requestModel from '../../../data/models/requests';
import { AnError } from '../../../lib/error';
import { makeError } from '../../../combo/error/api';
import { OrganizationNarrative } from '../../../data/models/narrative';
import * as viewOrgActions from '../viewOrg';
import { extractViewOrgModelPlus, extractViewOrgSubView } from '../../../lib/stateExtraction';
import { SubViewKind } from '../../store/types/views/Main/views/ViewOrg';
import { AsyncModelState } from '../../store/types/common';

export interface Load extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD;
}

export interface LoadStart extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_START;
}

export interface LoadSuccess extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_SUCCESS;
    organization: orgModel.Organization;
    narratives: Array<narrativeModel.OrganizationNarrative>;
    relation: orgModel.Relation;
}

export interface LoadError extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR;
    error: AnError;
}

export function loadStart(): LoadStart {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_START
    };
}

export function loadSuccess(organization: orgModel.Organization, narratives: Array<narrativeModel.OrganizationNarrative>, relation: orgModel.Relation): LoadSuccess {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_SUCCESS,
        organization, narratives, relation
    };
}

export function loadError(error: AnError): LoadError {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR,
        error: error
    };
}

export function load(organizationId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart());

        const { username, token, config } = extractViewOrgModelPlus(getState());

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });
        const narrativeClient = new narrativeModel.NarrativeModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            serviceWizardURL: config.services.ServiceWizard.url,
            workspaceServiceURL: config.services.Workspace.url,
            userProfileServiceURL: config.services.UserProfile.url
        });
        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        });

        try {
            const [org, narratives, request, invitation] = await Promise.all<orgModel.Organization, narrativeModel.OrganizationNarrative[], requestModel.UserRequest | null, requestModel.UserInvitation | null>([
                orgClient.getOrganization(organizationId),
                narrativeClient.getOwnNarratives(organizationId),
                requestClient.getUserRequestForOrg(organizationId),
                requestClient.getUserInvitationForOrg(organizationId)
            ]);

            const relation = orgModel.determineRelation(org, username, request, invitation);

            dispatch(loadSuccess(org, narratives, relation));
        } catch (ex) {
            console.error('loading error', ex);
            dispatch(loadError(makeError({
                code: ex.name,
                message: ex.message
            })));
        }
    };
}

// Selecting narrative
export interface SelectNarrative {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE,
    narrative: Narrative;
}

export interface SelectNarrativeStart {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_START;
}

export interface SelectNarrativeSuccess {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_SUCCESS;
    narrative: narrativeModel.OrganizationNarrative;
}

export interface SelectNarrativeError {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_ERROR;
    error: AnError;
}

export function selectNarrativeStart(): SelectNarrativeStart {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_START
    };
}

export function selectNarrativeSuccess(narrative: OrganizationNarrative): SelectNarrativeSuccess {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_SUCCESS,
        narrative: narrative
    };
}

export function selectNarrativeError(error: AnError): SelectNarrativeError {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_ERROR,
        error: error
    };
}

export function selectNarrative(narrative: OrganizationNarrative) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(selectNarrativeStart());

        // TODO: fetch narrative and populate the selected narrative accordingly...
        dispatch(selectNarrativeSuccess(narrative));
    };
}

// Sending Request
export interface SendRequest {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND;
}

export interface SendRequestStart {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_START;
}

export interface SendRequestSuccess {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_SUCCESS,
    request: requestModel.Request | boolean;
}

export interface SendRequestError {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_ERROR,
    error: AnError;
}


export function sendRequestStart(): SendRequestStart {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_START
    };
}

export function sendRequestSuccess(request: requestModel.Request | boolean): SendRequestSuccess {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_SUCCESS,
        request: request
    };
}

export function sendRequestError(error: AnError): SendRequestError {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_SEND_ERROR,
        error: error
    };
}

export function sendRequest(groupId: string, workspaceId: number) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(sendRequestStart());

        const {
            auth: { userAuthorization },
            app: { config } } = getState();

        if (userAuthorization === null) {
            throw new Error('Unauthorized');
        }
        const { token, username } = userAuthorization;

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            const request = await orgClient.addOrRequestNarrativeToGroup(groupId, workspaceId);
            dispatch(sendRequestSuccess(request));
            dispatch(viewOrgActions.reload(groupId));
        } catch (ex) {
            dispatch(sendRequestError(makeError({
                code: ex.name,
                message: ex.message
            })));
        }
    };
}

// Unloading

export interface Unload extends Action {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_UNLOAD;
}

export function unload(): Unload {
    return {
        type: ActionFlag.REQUEST_ADD_NARRATIVE_UNLOAD
    };
}

// SORTING

export interface Sort {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SORT;
    sort: narrativeModel.Sort;
}

export interface SortStart {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SORT_START;
}

export interface SortSuccess {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SORT_SUCCESS;
    narratives: Array<narrativeModel.OrganizationNarrative>;
}

export interface SortError {
    type: ActionFlag.REQUEST_ADD_NARRATIVE_SORT_ERROR;
    error: AnError;
}


function ensureViewModel(state: StoreState) {
    const subView = extractViewOrgSubView(state);

    if (subView.kind !== SubViewKind.ADD_NARRATIVE) {
        throw new Error('Wrong subview');
    }

    if (subView.model.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Wrong async state');
    }

    return subView.model.value;
}

export function sort(sort: narrativeModel.Sort) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.REQUEST_ADD_NARRATIVE_SORT_START
        } as SortStart);

        const { username, token, config } = extractViewOrgModelPlus(getState());
        const viewModel = ensureViewModel(getState());

        const narrativeClient = new narrativeModel.NarrativeModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            serviceWizardURL: config.services.ServiceWizard.url,
            workspaceServiceURL: config.services.Workspace.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            const sorted = narrativeClient.sortOrganizationNarratives(viewModel.narratives, sort);
            dispatch({
                type: ActionFlag.REQUEST_ADD_NARRATIVE_SORT_SUCCESS,
                narratives: sorted
            } as SortSuccess);
        } catch (ex) {
            dispatch({
                type: ActionFlag.REQUEST_ADD_NARRATIVE_SORT_ERROR,
                error: makeError({
                    code: 'error',
                    message: ex.message
                })
            });
        }

    };
}