import { ActionFlag } from "./index";
import { StoreState } from "../store/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import * as requestModel from "../../data/models/requests";
import * as orgModel from "../../data/models/organization/model";
import { AppError } from "@kbase/ui-components";
import {
  extractViewOrgModelPlus,
  extractManageOrganizationRequestsModel,
} from "../../lib/stateExtraction";

// Action types

// Start up requests manager

export interface Load extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD;
}

export interface LoadStart extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_START;
}

export interface LoadSuccess extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_SUCCESS;
  organization: orgModel.Organization;
  requests: Array<requestModel.Request>;
  invitations: Array<requestModel.Request>;
}

export interface LoadError extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_ERROR;
  error: AppError;
}

export interface Unload extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_UNLOAD;
}

// Accept join requests

export interface AcceptJoinRequest extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST;
  requestId: string;
}

export interface AcceptJoinRequestStart extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_START;
  requestId: string;
}

export interface AcceptJoinRequestSuccess extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_SUCCESS;
  request: requestModel.Request;
}

export interface AcceptJoinRequestError extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_ERROR;
  error: AppError;
}

export function acceptJoinRequestStart(
  requestId: string
): AcceptJoinRequestStart {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_START,
    requestId: requestId,
  };
}

export function acceptJoinRequestSuccess(
  request: requestModel.Request
): AcceptJoinRequestSuccess {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_SUCCESS,
    request: request,
  };
}

export function acceptJoinRequestError(
  error: AppError
): AcceptJoinRequestError {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_ACCEPT_JOIN_REQUEST_ERROR,
    error: error,
  };
}

// Deny join requests

export interface DenyJoinRequest extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST;
  requestId: string;
}

export interface DenyJoinRequestStart extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_START;
  requestId: string;
}

export interface DenyJoinRequestSuccess extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_SUCCESS;
  request: requestModel.Request;
}

export interface DenyJoinRequestError extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_ERROR;
  error: AppError;
}

export function denyJoinRequestStart(requestId: string): DenyJoinRequestStart {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_START,
    requestId: requestId,
  };
}

export function denyJoinRequestSuccess(
  request: requestModel.Request
): DenyJoinRequestSuccess {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_SUCCESS,
    request: request,
  };
}

export function denyJoinRequestError(error: AppError): DenyJoinRequestError {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_DENY_JOIN_REQUEST_ERROR,
    error: error,
  };
}

// Cancel join invitations

export interface CancelJoinInvitation extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION;
  requestId: string;
}

export interface CancelJoinInvitationStart extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_START;
}

export interface CancelJoinInvitationSuccess extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_SUCCESS;
  request: requestModel.Request;
}

export interface CancelJoinInvitationError extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_ERROR;
  error: AppError;
}

export function cancelJoinInvitationStart(): CancelJoinInvitationStart {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_START,
  };
}

export function cancelJoinInvitationSuccess(
  request: requestModel.Request
): CancelJoinInvitationSuccess {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_SUCCESS,
    request: request,
  };
}

export function cancelJoinInvitationError(
  error: AppError
): CancelJoinInvitationError {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_CANCEL_JOIN_INVITATION_ERROR,
    error: error,
  };
}

// Admin obtains view access
export interface GetViewAccess extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS;
  requestId: string;
}

export interface GetViewAccessStart extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_START;
}

export interface GetViewAccessSuccess extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_SUCCESS;
  request: requestModel.Request;
}

export interface GetViewAccessError extends Action {
  type: ActionFlag.ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_ERROR;
  error: AppError;
}

export function getViewAccessStart(): GetViewAccessStart {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_START,
  };
}

export function getViewAccessSuccess(
  request: requestModel.Request
): GetViewAccessSuccess {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_SUCCESS,
    request: request,
  };
}

export function getViewAccessError(error: AppError): GetViewAccessError {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_ERROR,
    error: error,
  };
}

export function getViewAccess(requestId: string) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState
  ) => {
    dispatch(getViewAccessStart());

    const {
      auth: { userAuthorization },
      app: { config },
    } = getState();

    if (userAuthorization === null) {
      throw new Error("Unauthorized");
    }
    const { token, username } = userAuthorization;

    const orgClient = new orgModel.OrganizationModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
      userProfileServiceURL: config.services.UserProfile.url,
    });

    // get requests
    try {
      const request = await orgClient.grantViewAccess(requestId);
      dispatch(getViewAccessSuccess(request));
    } catch (ex: any) {
      dispatch(
        getViewAccessError({
          code: ex.name,
          message: ex.message,
        })
      );
    }
  };
}

// Action generators

export function loadStart(): LoadStart {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_START,
  };
}

export function loadSuccess(
  organization: orgModel.Organization,
  requests: Array<requestModel.Request>,
  invitations: Array<requestModel.Request>
): LoadSuccess {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_SUCCESS,
    organization: organization,
    requests: requests,
    invitations: invitations,
  };
}

export function loadError(error: AppError): LoadError {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_ERROR,
    error: error,
  };
}

export function unload(): Unload {
  return {
    type: ActionFlag.ADMIN_MANAGE_REQUESTS_UNLOAD,
  };
}

// Action thunks

export function load(organizationId: string) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState
  ) => {
    const {
      auth: { userAuthorization },
      app: { config },
    } = getState();

    if (userAuthorization === null) {
      throw new Error("Unauthorized");
    }
    const { token, username } = userAuthorization;

    const orgClient = new orgModel.OrganizationModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
      userProfileServiceURL: config.services.UserProfile.url,
    });

    const requestClient = new requestModel.RequestsModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
    });

    // get requests
    try {
      const [organization, requests, invitations] = await Promise.all([
        orgClient.getOrg(organizationId),
        requestClient.getPendingOrganizationRequestsForOrg(organizationId),
        requestClient.getOrganizationInvitationsForOrg(organizationId),
      ]);
      if (organization.kind !== orgModel.OrganizationKind.NORMAL) {
        dispatch(
          loadError({
            code: "invalid state",
            message: 'Organization must be of kind "NORMAL"',
          })
        );
        return;
      }
      dispatch(loadSuccess(organization, requests, invitations));
    } catch (ex: any) {
      dispatch(
        loadError({
          code: ex.name,
          message: ex.message,
        })
      );
    }
  };
}

export function acceptJoinRequest(requestId: string) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState
  ) => {
    const { username, token, config } = extractViewOrgModelPlus(getState());

    // const {
    //     auth: { userAuthorization },
    //     views: { manageOrganizationRequestsView },
    //     app: { config }
    // } = getState();

    // if (userAuthorization === null) {
    //     throw new Error('Unauthorized');
    // }
    // const { token, username } = userAuthorization;

    const requestClient = new requestModel.RequestsModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
    });

    // if (!manageOrganizationRequestsView) {
    //     return;
    // }

    try {
      const request = await requestClient.acceptRequest(requestId);
      dispatch(acceptJoinRequestSuccess(request));
    } catch (ex: any) {
      dispatch(
        acceptJoinRequestError({
          code: ex.name,
          message: ex.message,
        })
      );
    }
  };
}

export function denyJoinRequest(requestId: string) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState
  ) => {
    const { username, token, config } = extractViewOrgModelPlus(getState());
    const viewModel = extractManageOrganizationRequestsModel(getState());

    const requestClient = new requestModel.RequestsModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
    });

    try {
      const request = await requestClient.denyRequest(requestId);
      dispatch(denyJoinRequestSuccess(request));
      dispatch(load(viewModel.organization.id));
    } catch (ex: any) {
      dispatch(
        denyJoinRequestError({
          code: ex.name,
          message: ex.message,
        })
      );
    }
  };
}

export function cancelJoinInvitation(requestId: string) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState
  ) => {
    const { username, token, config } = extractViewOrgModelPlus(getState());
    const viewModel = extractManageOrganizationRequestsModel(getState());

    const requestClient = new requestModel.RequestsModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
    });

    try {
      const request = await requestClient.cancelRequest(requestId);
      dispatch(load(viewModel.organization.id));
    } catch (ex: any) {
      dispatch(
        cancelJoinInvitationError({
          code: ex.name,
          message: ex.message,
        })
      );
    }
  };
}
