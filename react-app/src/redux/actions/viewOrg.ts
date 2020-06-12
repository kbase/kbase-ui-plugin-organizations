import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { ActionFlag } from './index';
import {
    StoreState,
    UIError, UIErrorType
} from '../../types';

import * as orgModel from '../../data/models/organization/model';
import * as requestModel from '../../data/models/requests';
import * as uberModel from '../../data/models/uber';
import { loadNarrative } from './entities';
import * as dataServices from './dataServices';
import { AnError, makeError } from '../../lib/error';
import * as narrativeModel from '../../data/models/narrative';
import { AppError } from '@kbase/ui-components';
import { extractViewOrgModelPlus, extractAppInfo } from '../../lib/stateExtraction';
import { ViewOrgViewModelKind, SubViewKind } from '../../types/views/Main/views/ViewOrg';
import { AsyncModelState } from '../../types/common';

// Action Types

export interface Load extends Action {
    type: ActionFlag.VIEW_ORG_LOAD;
    organizationId: string;
}

export interface ReLoad extends Action {
    type: ActionFlag.VIEW_ORG_RELOAD;
    organizationId: string;
}

export interface LoadStart extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_START;
}

export interface LoadNormalSuccess extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_NORMAL_SUCCESS;
    organization: orgModel.Organization;
    relation: orgModel.Relation;
    openRequest: orgModel.RequestStatus;
    groupRequests: Array<requestModel.Request> | null;
    groupInvitations: Array<requestModel.Request> | null;
    requestInbox: Array<requestModel.Request>;
    requestOutbox: Array<requestModel.Request>;
    narrativesSortBy: string;
    narratives: Array<orgModel.NarrativeResource>;
    apps: Array<orgModel.AppResource>;
    sortMembersBy: string,
    members: Array<orgModel.Member>;
}

export interface ReloadNormalSuccess extends Action {
    type: ActionFlag.VIEW_ORG_RELOAD_NORMAL_SUCCESS;
    organization: orgModel.Organization;
    relation: orgModel.Relation;
    openRequest: orgModel.RequestStatus;
    groupRequests: Array<requestModel.Request> | null;
    groupInvitations: Array<requestModel.Request> | null;
    requestInbox: Array<requestModel.Request>;
    requestOutbox: Array<requestModel.Request>;
    narrativesSortBy: string;
    narratives: Array<orgModel.NarrativeResource>;
    apps: Array<orgModel.AppResource>;
    sortMembersBy: string,
    members: Array<orgModel.Member>;
}

export interface LoadInaccessiblePrivateSuccess extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_INACCESSIBLE_PRIVATE_SUCCESS;
    organization: orgModel.InaccessiblePrivateOrganization;
    relation: orgModel.Relation;
    requestOutbox: Array<requestModel.Request>;
}

export interface LoadError extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_ERROR;
    error: AppError;
}

export interface Unload extends Action {
    type: ActionFlag.VIEW_ORG_UNLOAD;
}

// Loading subviews
export interface LoadSubview extends Action {
    type: ActionFlag.VIEW_ORG_LOAD_SUBVIEW,
    subView: SubViewKind;
}
export function loadSubview(subView: SubViewKind): LoadSubview {
    return {
        type: ActionFlag.VIEW_ORG_LOAD_SUBVIEW,
        subView
    };
}

// Join Requests

export interface ViewOrgJoinRequest extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST;
    requestId: string;
}

export interface ViewOrgJoinRequestStart extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST_START;
}

export interface ViewOrgJoinRequestSuccess extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST_SUCCESS;
}

export interface ViewOrgJoinRequestError extends Action {
    type: ActionFlag.VIEW_ORG_JOIN_REQUEST_ERROR;
    error: UIError;
}

// Join Request cancellation

export interface ViewOrgCancelJoinRequest extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST;
}

export interface ViewOrgCancelJoinRequestStart extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_START;
}

export interface ViewOrgCancelJoinRequestSuccess extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_SUCCESS;
}

export interface ViewOrgCancelJoinRequestError extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_ERROR,
    error: UIError;
}

// Join Invitation Acceptance

export interface AcceptJoinInvitation extends Action {
    type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION;
}

export interface AcceptJoinInvitationStart extends Action {
    type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_START;
}

export interface AcceptJoinInvitationSuccess extends Action {
    type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_SUCCESS;
}

export interface AcceptJoinInvitationError extends Action {
    type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_ERROR,
    error: AppError;
}

// Join Invitation Denial

export interface RejectJoinInvitation extends Action {
    type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION;
}

export interface RejectJoinInvitationStart extends Action {
    type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_START;
}

export interface RejectJoinInvitationSuccess extends Action {
    type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_SUCCESS;
}

export interface RejectJoinInvitationError extends Action {
    type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_ERROR,
    error: AppError;
}


// Delete Narrative

export interface RemoveNarrative extends Action {
    type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE;
}

export interface RemoveNarrativeStart extends Action {
    type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_START;
}

export interface RemoveNarrativeSuccess extends Action {
    type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_SUCCESS,
    narrativeId: narrativeModel.NarrativeID;
}

export interface RemoveNarrativeError extends Action {
    type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_ERROR,
    error: AppError;
}

// Generators

export function removeNarrativeStart(): RemoveNarrativeStart {
    return {
        type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_START
    };
}

export function removeNarrativeSuccess(narrativeId: narrativeModel.NarrativeID): RemoveNarrativeSuccess {
    return {
        type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_SUCCESS,
        narrativeId
    };
}

export function removeNarrativeError(error: AppError): RemoveNarrativeError {
    return {
        type: ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_ERROR,
        error: error
    };
}

// Thunk

export function removeNarrative(narrative: orgModel.NarrativeResource) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(removeNarrativeStart());

        const { viewModel: { organization }, username, token, config } = extractViewOrgModelPlus(getState());

        const groupId = organization.id;

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });


        try {
            await orgClient.removeNarrativeFromOrg(groupId, narrative.workspaceId);
            dispatch(removeNarrativeSuccess(narrative.workspaceId));
        } catch (ex) {
            dispatch(removeNarrativeError({
                code: ex.name,
                message: ex.message
            }));
        }
    };
}

// Access narrative

export interface AccessNarrative extends Action {
    type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE,
    narrative: orgModel.NarrativeResource;
}

export interface AccessNarrativeStart extends Action {
    type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_START;
}

export interface AccessNarrativeSuccess extends Action {
    type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_SUCCESS,
    organization: orgModel.Organization;
    narratives: Array<orgModel.NarrativeResource>;
}

export interface AccessNarrativeError extends Action {
    type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_ERROR,
    error: AppError;
}

// Generators
export function accessNarrativeStart(): AccessNarrativeStart {
    return {
        type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_START
    };
}

export function accessNarrativeSuccess(organization: orgModel.Organization, narratives: Array<orgModel.NarrativeResource>): AccessNarrativeSuccess {
    return {
        type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_SUCCESS,
        organization,
        narratives
    };
}

export function accessNarrativeError(error: AppError): AccessNarrativeError {
    return {
        type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_ERROR,
        error: error
    };
}

// Thunk

export function accessNarrative(narrative: orgModel.NarrativeResource) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(accessNarrativeStart());

        const { viewModel: {
            organization,
            narratives: { sortBy, searchBy }
        }, username, token, config } = extractViewOrgModelPlus(getState());

        const organizationId = organization.id;
        const resourceId = String(narrative.workspaceId);

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            await orgClient.grantNarrativeAccess(organizationId, resourceId);
            // Getting a fresh copy of the org will trigger the view org component and
            // all subcomponents with changed data to refresh. All we are intending here is that
            // the narrative in the list of narratives provided by the groups api is updated, but
            // there may be other elements of the group/org which have changed as well. So be it.

            // TODO: just update the narrative, don't reprocess everything.


            const org = await orgClient.getOrg(organizationId);

            if (org.kind !== orgModel.OrganizationKind.NORMAL) {
                dispatch(accessNarrativeError({
                    code: 'error',
                    message: 'Not a NORMAL org'
                }));
                return;
            }

            const narratives = org.narratives;

            const filteredNarratives = orgModel.queryNarratives(narratives, {
                sortBy: sortBy,
                searchBy: searchBy
            });

            dispatch(loadNarrative(narrative.workspaceId));
            dispatch(accessNarrativeSuccess(org, filteredNarratives));
        } catch (ex) {
            dispatch(accessNarrativeError({
                code: 'error',
                message: ex.message
            }));
        }

    };
}

// Generators

export function loadStart(): LoadStart {
    return {
        type: ActionFlag.VIEW_ORG_LOAD_START
    };
}

export function loadNormalSuccess(
    organization: orgModel.Organization,
    relation: orgModel.Relation,
    openRequest: orgModel.RequestStatus,
    groupRequests: Array<requestModel.Request> | null,
    groupInvitations: Array<requestModel.Request> | null,
    requestInbox: Array<requestModel.Request>,
    requestOutbox: Array<requestModel.Request>,
    narrativesSortBy: string,
    narratives: Array<orgModel.NarrativeResource>,
    apps: Array<orgModel.AppResource>,
    sortMembersBy: string,
    members: Array<orgModel.Member>): LoadNormalSuccess {
    return {
        type: ActionFlag.VIEW_ORG_LOAD_NORMAL_SUCCESS,
        organization, relation, openRequest,
        groupRequests, groupInvitations,
        requestInbox, requestOutbox,
        narrativesSortBy,
        narratives, sortMembersBy, members,
        apps
    };
}

export function reloadNormalSuccess(
    organization: orgModel.Organization,
    relation: orgModel.Relation,
    openRequest: orgModel.RequestStatus,
    groupRequests: Array<requestModel.Request> | null,
    groupInvitations: Array<requestModel.Request> | null,
    requestInbox: Array<requestModel.Request>,
    requestOutbox: Array<requestModel.Request>,
    narrativesSortBy: string,
    narratives: Array<orgModel.NarrativeResource>,
    apps: Array<orgModel.AppResource>,
    sortMembersBy: string,
    members: Array<orgModel.Member>): ReloadNormalSuccess {
    return {
        type: ActionFlag.VIEW_ORG_RELOAD_NORMAL_SUCCESS,
        organization, relation, openRequest,
        groupRequests, groupInvitations,
        requestInbox, requestOutbox,
        narrativesSortBy,
        narratives, sortMembersBy, members,
        apps
    };
}

export function loadInaccessiblePrivateSuccess(
    organization: orgModel.InaccessiblePrivateOrganization,
    relation: orgModel.Relation,
    requestOutbox: Array<requestModel.Request>): LoadInaccessiblePrivateSuccess {
    return {
        type: ActionFlag.VIEW_ORG_LOAD_INACCESSIBLE_PRIVATE_SUCCESS,
        organization, relation,
        requestOutbox
    };
}

export function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.VIEW_ORG_LOAD_ERROR,
        error: error
    };
}

// Join requests

export function viewOrgJoinRequestStart(): ViewOrgJoinRequestStart {
    return {
        type: ActionFlag.VIEW_ORG_JOIN_REQUEST_START
    };
}

export function viewOrgJoinRequestSuccess(): ViewOrgJoinRequestSuccess {
    return {
        type: ActionFlag.VIEW_ORG_JOIN_REQUEST_SUCCESS
    };
}

export function viewOrgJoinRequestError(error: UIError): ViewOrgJoinRequestError {
    return {
        type: ActionFlag.VIEW_ORG_JOIN_REQUEST_ERROR,
        error: error
    };
}

// Join Request Cancellation

export function viewOrgCancelJoinRequestStart(): ViewOrgCancelJoinRequestStart {
    return {
        type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_START
    };
}

export function viewOrgCancelJoinRequestSuccess(): ViewOrgCancelJoinRequestSuccess {
    return {
        type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_SUCCESS
    };
}

export function viewOrgCancelJoinRequestError(error: UIError): ViewOrgCancelJoinRequestError {
    return {
        type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_ERROR,
        error: error
    };
}

// Invitation Acceptance

export function acceptJoinInvitationStart(): AcceptJoinInvitationStart {
    return {
        type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_START
    };
}

export function acceptJoinInvitationSuccess(): AcceptJoinInvitationSuccess {
    return {
        type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_SUCCESS
    };
}

export function acceptJoinInvitationError(error: AppError): AcceptJoinInvitationError {
    return {
        type: ActionFlag.VIEW_ORG_ACCEPT_JOIN_INVITATION_ERROR,
        error: error
    };
}

// Invitation Rejection 

export function rejectJoinInvitationStart(): RejectJoinInvitationStart {
    return {
        type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_START
    };
}

export function rejectJoinInvitationSuccess(): RejectJoinInvitationSuccess {
    return {
        type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_SUCCESS
    };
}

export function rejectJoinInvitationError(error: AppError): RejectJoinInvitationError {
    return {
        type: ActionFlag.VIEW_ORG_REJECT_JOIN_INVITATION_ERROR,
        error: error
    };
}

// Join invitation acceptance

// TODO

// Thunks

export function unload() {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const state = getState();
        if (state.auth.userAuthorization === null) {
            return;
        }

        if (state.view.loadingState !== AsyncModelState.SUCCESS) {
            return;
        }

        if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
            dispatch({
                type: ActionFlag.VIEW_ORG_UNLOAD
            });
            return;
        }

        const {
            view: {
                value: {
                    views: {
                        viewOrg: {
                            value: viewModel
                        }
                    }
                }
            }
        } = state;
        // const viewModel = extractViewOrgModel2(getState());
        if (viewModel.kind === ViewOrgViewModelKind.PRIVATE_INACCESSIBLE) {
            return;
        }

        const { username, token, config } = extractAppInfo(getState());

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        if (viewModel.organization.relation === orgModel.UserRelationToOrganization.MEMBER ||
            viewModel.organization.relation === orgModel.UserRelationToOrganization.ADMIN ||
            viewModel.organization.relation === orgModel.UserRelationToOrganization.OWNER) {
            await orgClient.visitOrg({ organizationId: viewModel.organization.id });
        }

        dispatch(dataServices.load());

        dispatch({
            type: ActionFlag.VIEW_ORG_UNLOAD
        });
    };
}

export function load(organizationId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart());

        const {
            auth: { userAuthorization },
            app: { config }
        } = getState();

        if (userAuthorization === null) {
            throw new Error('Unauthorized');
        }
        const { token, username } = userAuthorization;

        const uberClient = new uberModel.UberModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            serviceWizardURL: config.services.ServiceWizard.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        });

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
        });

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            const { organization, relation } = await uberClient.getOrganizationForUser(organizationId);
            if (organization.kind !== orgModel.OrganizationKind.NORMAL) {
                const requestInbox = await requestClient.getRequestInboxForOrg(organizationId);
                dispatch(loadInaccessiblePrivateSuccess(organization, relation, requestInbox));
                return;
            }

            let openRequest;
            let orgRequests: Array<requestModel.Request> | null;
            let orgInvitations: Array<requestModel.Request> | null;
            let requestInbox: Array<requestModel.Request>;
            if (relation.type === orgModel.UserRelationToOrganization.OWNER ||
                relation.type === orgModel.UserRelationToOrganization.ADMIN) {
                orgRequests = await requestClient.getPendingOrganizationRequestsForOrg(organizationId);
                orgInvitations = await requestClient.getOrganizationInvitationsForOrg(organizationId);
                openRequest = await orgClient.getOpenRequestStatus({ organizationId });
                requestInbox = await requestClient.getCombinedRequestInboxForOrg(organizationId);
            } else {
                orgRequests = null;
                orgInvitations = null;
                openRequest = orgModel.RequestStatus.INAPPLICABLE;
                requestInbox = [];
            }


            // const requestInbox: Array<requestModel.Request> = await requestClient.getCombinedRequestInboxForOrg(organizationId)
            const requestOutbox: Array<requestModel.Request> = await requestClient.getRequestOutboxForOrg(organizationId);

            // default narrative sort?
            const narrativesSortBy = 'added';
            const narratives = orgModel.queryNarratives(organization.narratives, {
                sortBy: narrativesSortBy,
                searchBy: ''
            });

            // TODO: actual app sort and filter
            const apps = organization.apps;

            const sortMembersBy = 'added';
            const members = orgModel.queryMembers(organization.members, {
                sortBy: sortMembersBy,
                searchBy: ''
            });

            dispatch(loadNormalSuccess(organization, relation, openRequest, orgRequests, orgInvitations,
                requestInbox, requestOutbox, narrativesSortBy, narratives, apps, sortMembersBy, members));
        } catch (ex) {
            dispatch(loadError({
                code: ex.name,
                message: ex.message
            }));
        }
    };
}

export function reload(organizationId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        const { viewModel, username, token, config } = extractViewOrgModelPlus(getState());

        const uberClient = new uberModel.UberModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            serviceWizardURL: config.services.ServiceWizard.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url
        });

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
        });

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            const { organization, relation } = await uberClient.getOrganizationForUser(organizationId);
            if (organization.kind !== orgModel.OrganizationKind.NORMAL) {
                const requestInbox = await requestClient.getRequestInboxForOrg(organizationId);
                dispatch(loadInaccessiblePrivateSuccess(organization, relation, requestInbox));
                return;
            }

            let openRequest;
            let orgRequests: Array<requestModel.Request> | null;
            let orgInvitations: Array<requestModel.Request> | null;
            if (relation.type === orgModel.UserRelationToOrganization.OWNER ||
                relation.type === orgModel.UserRelationToOrganization.ADMIN) {
                orgRequests = await requestClient.getPendingOrganizationRequestsForOrg(organizationId);
                orgInvitations = await requestClient.getOrganizationInvitationsForOrg(organizationId);
                openRequest = await orgClient.getOpenRequestStatus({ organizationId });
            } else {
                orgRequests = null;
                orgInvitations = null;
                openRequest = orgModel.RequestStatus.INAPPLICABLE;
            }

            const requestInbox: Array<requestModel.Request> = await requestClient.getCombinedRequestInboxForOrg(organizationId);
            const requestOutbox: Array<requestModel.Request> = await requestClient.getRequestOutboxForOrg(organizationId);

            // default narrative sort?
            const narrativesSortBy = 'added';
            const narratives = orgModel.queryNarratives(organization.narratives, {
                sortBy: viewModel.narratives.sortBy,
                searchBy: viewModel.narratives.searchBy
            });

            // TODO: actual app sort and filter
            const apps = organization.apps;

            const sortMembersBy = 'added';
            const members = orgModel.queryMembers(organization.members, {
                sortBy: viewModel.sortMembersBy,
                searchBy: viewModel.searchMembersBy
            });

            dispatch(reloadNormalSuccess(organization, relation, openRequest, orgRequests, orgInvitations,
                requestInbox, requestOutbox, narrativesSortBy, narratives, apps, sortMembersBy, members));
        } catch (ex) {
            dispatch(loadError({
                code: ex.name,
                message: ex.message
            }));
        }
    };
}

export function viewOrgJoinRequest() {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        //TODO: could do a start here...
        const { viewModel: {
            organization
        }, username, token, config } = extractViewOrgModelPlus(getState());

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            await orgClient.requestMembership(organization.id);
            dispatch(viewOrgJoinRequestSuccess());
            dispatch(load((organization.id)));
        } catch (ex) {
            dispatch(viewOrgJoinRequestError({
                type: UIErrorType.ERROR,
                message: ex.message
            }));
        }
    };
}

export function viewOrgCancelJoinRequest(requestId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(viewOrgJoinRequestStart());

        const { username, token, config } = extractViewOrgModelPlus(getState());

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        });

        try {
            const newRequest = await requestClient.cancelRequest(requestId);
            dispatch(viewOrgCancelJoinRequestSuccess());
            dispatch(load(newRequest.organizationId));
        } catch (ex) {
            dispatch(viewOrgCancelJoinRequestError({
                type: UIErrorType.ERROR,
                message: ex.message
            }));
        }
    };
}

export function acceptJoinInvitation(requestId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(acceptJoinInvitationStart());

        const { username, token, config } = extractViewOrgModelPlus(getState());

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        });

        try {
            const newRequest = await requestClient.acceptJoinInvitation(requestId);
            dispatch(acceptJoinInvitationSuccess());
            // quick 'n easy
            dispatch(load(newRequest.organizationId));
        } catch (ex) {
            dispatch(acceptJoinInvitationError({
                code: ex.name,
                message: ex.message
            }));
        }
    };
}


export function rejectJoinInvitation(requestId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(acceptJoinInvitationStart());

        const { username, token, config } = extractViewOrgModelPlus(getState());

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        });

        try {
            const newRequest = await requestClient.rejectJoinInvitation(requestId);
            dispatch(rejectJoinInvitationSuccess());
            dispatch(load(newRequest.organizationId));
        } catch (ex) {
            dispatch(rejectJoinInvitationError({
                code: ex.name,
                message: ex.message
            }));
        }

    };
}

// SORT NARRATIVES
export interface SortNarratives {
    type: ActionFlag.VIEW_ORG_SORT_NARRATIVES,
    sortBy: string;
}

export interface SortNarrativesStart {
    type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_START;
}

export interface SortNarrativesSuccess {
    type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_SUCCESS;
    narratives: Array<orgModel.NarrativeResource>;
    sortBy: string;
}

export interface SortNarrativesError {
    type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_ERROR;
    error: AnError;
}



export function sortNarratives(sortBy: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_START
        });

        const { viewModel: {
            narratives: { narratives, sortBy, searchBy }
        } } = extractViewOrgModelPlus(getState());

        const sorted = orgModel.queryNarratives(narratives, {
            sortBy: sortBy,
            searchBy: searchBy
        });

        dispatch({
            type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_SUCCESS,
            narratives: sorted,
            sortBy
        });

    };
}


// SEARCH NARRATIVES

export interface SearchNarratives {
    type: ActionFlag.VIEW_ORG_SEARCH_NARRATIVES,
    searchBy: string;
}

export interface SearchtNarrativesStart {
    type: ActionFlag.VIEW_ORG_SEARCH_NARRATIVES_START;
}

export interface SearchNarrativesSuccess {
    type: ActionFlag.VIEW_ORG_SEARCH_NARRATIVES_SUCCESS;
    narratives: Array<orgModel.NarrativeResource>;
    searchBy: string;
}

export interface SearchNarrativesError {
    type: ActionFlag.VIEW_ORG_SEARCH_NARRATIVES_ERROR;
    error: AnError;
}



export function searchNarratives(searchBy: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.VIEW_ORG_SORT_NARRATIVES_START
        });

        const { viewModel: {
            narratives: { narratives, sortBy, searchBy }
        } } = extractViewOrgModelPlus(getState());

        const sorted = orgModel.queryNarratives(narratives, {
            sortBy: sortBy,
            searchBy: searchBy
        });

        dispatch({
            type: ActionFlag.VIEW_ORG_SEARCH_NARRATIVES_SUCCESS,
            searchBy: searchBy,
            narratives: sorted
        });

    };
}

// REmove app

export interface RemoveApp {
    type: ActionFlag.VIEW_ORG_REMOVE_APP,
    appId: string;
}

export interface RemoveAppStart {
    type: ActionFlag.VIEW_ORG_REMOVE_APP_START;
}

export interface RemoveAppSuccess {
    type: ActionFlag.VIEW_ORG_REMOVE_APP_SUCCESS;
    appId: string;
}

export interface RemoveAppError {
    type: ActionFlag.VIEW_ORG_REMOVE_APP_ERROR,
    error: AnError;
}

function removeAppStart() {
    return {
        type: ActionFlag.VIEW_ORG_REMOVE_APP_START
    };
}

function removeAppSuccess(appId: string) {
    return {
        type: ActionFlag.VIEW_ORG_REMOVE_APP_SUCCESS,
        appId
    };
}

function removeAppError(error: AnError) {
    return {
        type: ActionFlag.VIEW_ORG_REMOVE_APP_ERROR,
        error: error
    };
}

function orgClientFromState(state: StoreState): orgModel.OrganizationModel {
    const {
        auth: { userAuthorization },
        app: { config }
    }: StoreState = state;

    if (userAuthorization === null) {
        throw new Error('Unauthorized');
    }
    const { token, username } = userAuthorization;

    return new orgModel.OrganizationModel({
        token, username,
        groupsServiceURL: config.services.Groups.url,
        userProfileServiceURL: config.services.UserProfile.url
    });
}

export function removeApp(appId: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(removeAppStart());

        const { viewModel } = extractViewOrgModelPlus(getState());
        const orgClient = orgClientFromState(getState());

        try {
            orgClient.removeAppFromOrg(viewModel.organization.id, appId);
            dispatch(removeAppSuccess(appId));
        } catch (ex) {
            dispatch(removeAppError(makeError({
                code: 'error',
                message: ex.message
            })));
        }
    };
}