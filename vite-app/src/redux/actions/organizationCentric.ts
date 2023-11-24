import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ActionFlag } from "./index";
import * as orgModel from "../../data/models/organization/model";
import * as requestModel from "../../data/models/requests";
import { StoreState } from "../store/types";
import { AppError } from "@kbase/ui-components";
import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";

export interface OrganizationCentricAction<T> extends Action<T> {}

export interface Load
  extends OrganizationCentricAction<ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD> {
  type: ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD;
}

export interface LoadStart
  extends
    OrganizationCentricAction<ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_START> {
  type: ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_START;
}

export interface LoadSuccess
  extends
    OrganizationCentricAction<
      ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_SUCCESS
    > {
  type: ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_SUCCESS;
  organization: orgModel.Organization;
  pendingJoinRequest: requestModel.UserRequest | null;
  pendingJoinInvitation: requestModel.UserInvitation | null;
  relation: orgModel.Relation;
}

export interface LoadError
  extends
    OrganizationCentricAction<ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_ERROR> {
  type: ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_ERROR;
  error: AppError;
}

export interface Unload
  extends
    OrganizationCentricAction<ActionFlag.ORGANIZATION_CENTRIC_VIEW_UNLOAD> {
  type: ActionFlag.ORGANIZATION_CENTRIC_VIEW_UNLOAD;
}

export function loadStart(): LoadStart {
  return {
    type: ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_START,
  };
}

export function loadSuccess({
  organization,
  pendingJoinRequest,
  pendingJoinInvitation,
  relation,
}: {
  organization: orgModel.Organization;
  pendingJoinRequest: requestModel.UserRequest | null;
  pendingJoinInvitation: requestModel.UserInvitation | null;
  relation: orgModel.Relation;
}): LoadSuccess {
  return {
    type: ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_SUCCESS,
    organization,
    pendingJoinRequest,
    pendingJoinInvitation,
    relation,
  };
}

export function loadError(error: AppError): LoadError {
  return {
    type: ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_ERROR,
    error: error,
  };
}

export function unload(): Unload {
  return {
    type: ActionFlag.ORGANIZATION_CENTRIC_VIEW_UNLOAD,
  };
}

export function load(organizationId: orgModel.OrganizationID) {
  return async (
    dispatch: ThunkDispatch<StoreState, ValidityState, Action>,
    getState: () => StoreState,
  ) => {
    dispatch(loadStart());

    const {
      authentication,
      app: { config },
    } = getState();

    if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
      throw new Error("Not authenticated.");
    }
    const { userAuthentication: { token, username } } = authentication;

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

    try {
      // get org
      const organization = await orgClient.getOrg(organizationId);
      if (organization.kind !== orgModel.OrganizationKind.NORMAL) {
        dispatch(
          loadError({
            code: "invalid state",
            message: 'Organization must be of kind "NORMAL"',
          }),
        );
        return;
      }

      // get pending requests
      const request = await requestClient.getUserRequestForOrg(organizationId);
      const invitation = await requestClient.getUserInvitationForOrg(
        organizationId,
      );

      const relation = orgModel.determineRelation(
        organization,
        username,
        request,
        invitation,
      );

      // current username is already here.
      dispatch(
        loadSuccess({
          organization,
          relation,
          pendingJoinRequest: request,
          pendingJoinInvitation: invitation,
        }),
      );
    } catch (ex: any) {
      dispatch(
        loadError({
          code: ex.name,
          message: ex.message,
        }),
      );
    }
  };
}
