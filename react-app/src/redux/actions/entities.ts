import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { ActionFlag } from './index';
import * as userModel from '../../data/models/user';
import * as orgModel from '../../data/models/organization/model';
import * as narrativeModel from '../../data/models/narrative';
import { StoreState } from '../../types';
import * as appModel from '../../data/models/apps';
import { AnError, makeError } from '../../lib/error';
import { AppError } from '@kbase/ui-components';


export interface EntityAction extends Action {
}

export interface UserLoader extends EntityAction {
    type: ActionFlag.ENTITY_USER_LOADER,
    userId: userModel.Username;
}

export interface UserLoaderStart extends EntityAction {
    type: ActionFlag.ENTITY_USER_LOADER_START;
}

export interface UserLoaderSuccess extends EntityAction {
    type: ActionFlag.ENTITY_USER_LOADER_SUCCESS,
    user: userModel.User;
}

export interface UserLoaderError extends EntityAction {
    type: ActionFlag.ENTITY_USER_LOADER_ERROR,
    error: AppError;
}


export function userLoaderStart(): UserLoaderStart {
    return {
        type: ActionFlag.ENTITY_USER_LOADER_START
    };
}

export function userLoaderSuccess(user: userModel.User): UserLoaderSuccess {
    return {
        type: ActionFlag.ENTITY_USER_LOADER_SUCCESS,
        user: user
    };
}

export function userLoaderError(error: AppError): UserLoaderError {
    return {
        type: ActionFlag.ENTITY_USER_LOADER_ERROR,
        error: error
    };
}

export function userLoader(userId: userModel.Username) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(userLoaderStart());

        const {
            auth: { userAuthorization },
            app: { config }
        } = getState();

        if (userAuthorization === null) {
            throw new Error('Unauthorized');
        }
        const { token } = userAuthorization;

        const model = new userModel.UserModel({
            token,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            const user = await model.getUser(userId);
            dispatch(userLoaderSuccess(user));
        } catch (ex) {
            dispatch(userLoaderError({
                code: 'error',
                message: ex.message
            }));
        }
    };
}


export interface OrganizationLoader extends EntityAction {
    type: ActionFlag.ENTITY_ORGANIZATION_LOADER,
    organizationId: orgModel.OrganizationID;
}

export interface OrganizationLoaderStart extends EntityAction {
    type: ActionFlag.ENTITY_ORGANIZATION_LOADER_START;
}

export interface OrganizationLoaderSuccess extends EntityAction {
    type: ActionFlag.ENTITY_ORGANIZATION_LOADER_SUCCESS,
    organization: orgModel.Organization | orgModel.InaccessiblePrivateOrganization;
}

export interface OrganizationLoaderError extends EntityAction {
    type: ActionFlag.ENTITY_ORGANIZATION_LOADER_ERROR,
    error: AppError;
}


export function organizationLoaderStart(): OrganizationLoaderStart {
    return {
        type: ActionFlag.ENTITY_ORGANIZATION_LOADER_START
    };
}

export function organizationLoaderSuccess(organization: orgModel.Organization | orgModel.InaccessiblePrivateOrganization): OrganizationLoaderSuccess {
    return {
        type: ActionFlag.ENTITY_ORGANIZATION_LOADER_SUCCESS,
        organization: organization
    };
}

export function organizationLoaderError(error: AppError): OrganizationLoaderError {
    return {
        type: ActionFlag.ENTITY_ORGANIZATION_LOADER_ERROR,
        error: error
    };
}

export function organizationLoader(organizationId: orgModel.OrganizationID) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(organizationLoaderStart());

        const {
            auth: { userAuthorization },
            app: { config }
        } = getState();

        if (userAuthorization === null) {
            throw new Error('Unauthorized');
        }
        const { token, username } = userAuthorization;

        const model = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            const organization = await model.getOrg(organizationId);
            dispatch(organizationLoaderSuccess(organization));
        } catch (ex) {
            dispatch(organizationLoaderError({
                code: 'error',
                message: ex.message
            }));
        }
    };
}

// Narratives

export interface LoadNarrative {
    type: ActionFlag.ENTITY_NARRATIVE_LOAD;
}

interface LoadNarrativeStart {
    type: ActionFlag.ENTITY_NARRATIVE_LOAD_START;
}

export interface LoadNarrativeSuccess {
    type: ActionFlag.ENTITY_NARRATIVE_LOAD_SUCCESS;
    narrative: narrativeModel.Narrative;
}

interface LoadNarrativeError {
    type: ActionFlag.ENTITY_NARRATIVE_LOAD_ERROR;
    error: AppError;
}

export function loadNarrative(workspaceId: narrativeModel.WorkspaceID) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.ENTITY_NARRATIVE_LOAD_START
        } as LoadNarrativeStart);

        const {
            auth: { userAuthorization },
            app: { config }
        } = getState();

        if (userAuthorization === null) {
            throw new Error('Unauthorized');
        }
        const { token, username } = userAuthorization;

        const narrativeClient = new narrativeModel.NarrativeModel({
            token, username,
            workspaceServiceURL: config.services.Workspace.url,
            groupsServiceURL: config.services.Groups.url,
            serviceWizardURL: config.services.ServiceWizard.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            const narrative = await narrativeClient.getNarrative(workspaceId);
            dispatch({
                type: ActionFlag.ENTITY_NARRATIVE_LOAD_SUCCESS,
                narrative: narrative
            } as LoadNarrativeSuccess);
        } catch (ex) {
            dispatch({
                type: ActionFlag.ENTITY_NARRATIVE_LOAD_ERROR,
                error: {
                    code: ex.name,
                    message: ex.message
                }
            } as LoadNarrativeError);
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

export function accessNarrativeSuccess(organization: orgModel.Organization): AccessNarrativeSuccess {
    return {
        type: ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_SUCCESS,
        organization: organization
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

        const state = getState();
        if (!state.views.viewOrgView.viewModel) {
            dispatch(accessNarrativeError({
                code: 'error',
                message: 'No view model'
            }));
            return;
        }

        const {
            auth: { userAuthorization },
            app: { config },
            views: {
                viewOrgView: {
                    viewModel: {
                        organization
                    }
                }
            }
        } = state;

        if (userAuthorization === null) {
            throw new Error('Unauthorized');
        }
        const { token, username } = userAuthorization;

        if (!organization) {
            return;
        }

        const groupId = organization.id;
        const resourceId = String(narrative.workspaceId);

        const orgClient = new orgModel.OrganizationModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url
        });

        try {
            await orgClient.grantNarrativeAccess(groupId, resourceId);
            const org = await orgClient.getOrg(groupId);
            if (org.kind !== orgModel.OrganizationKind.NORMAL) {
                dispatch(accessNarrativeError({
                    code: 'invalid state',
                    message: 'Cannot access a Narrative for an inaccessible Organization'
                }));
                return;
            }
            dispatch(accessNarrativeSuccess(org));
        } catch (ex) {
            dispatch(accessNarrativeError({
                code: 'error',
                message: ex.message
            }));
        }

    };
}

// App

export interface LoadApp {
    type: ActionFlag.ENTITY_LOAD_APP;
    appId: appModel.AppID;
}

export interface LoadAppStart {
    type: ActionFlag.ENTITY_LOAD_APP_START;
}


export interface LoadAppSuccess {
    type: ActionFlag.ENTITY_LOAD_APP_SUCCESS,
    app: appModel.AppFullInfo;
}

export interface LoadAppError {
    type: ActionFlag.ENTITY_LOAD_APP_ERROR,
    error: AnError;
}

function loadAppStart() {
    return {
        type: ActionFlag.ENTITY_LOAD_APP_START
    };
}

function loadAppSuccess(app: appModel.AppFullInfo) {
    return {
        type: ActionFlag.ENTITY_LOAD_APP_SUCCESS,
        app
    };
}

function loadAppError(error: AnError) {
    return {
        type: ActionFlag.ENTITY_LOAD_APP_ERROR,
        error: error
    };
}

export function loadApp(appId: appModel.AppID) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadAppStart());

        const {
            auth: { userAuthorization },
            app: { config }
        } = getState();

        if (userAuthorization === null) {
            throw new Error('Unauthorized');
        }
        const { token } = userAuthorization;

        const appClient = new appModel.AppClient({
            token,
            narrativeMethodStoreURL: config.services.NarrativeMethodStore.url
        });

        try {
            const app = await appClient.getApp(appId);
            dispatch(loadAppSuccess(app));
        } catch (ex) {
            dispatch(loadAppError(makeError({
                code: 'error',
                message: ex.message
            })));
        }
    };
}


