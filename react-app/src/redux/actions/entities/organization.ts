import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { ActionFlag } from "../index";
import * as orgModel from "../../../data/models/organization/model";
import { StoreState } from "../../store/types";
import { AnError, makeError } from "../../../lib/error";

export interface OrganizationEntityAction extends Action {}

// Organization

export interface Load extends OrganizationEntityAction {
  type: ActionFlag.ENTITY_ORGANIZATION_LOAD;
}

interface LoadStart extends OrganizationEntityAction {
  type: ActionFlag.ENTITY_ORGANIZATION_LOAD_START;
}

export interface LoadSuccess extends OrganizationEntityAction {
  type: ActionFlag.ENTITY_ORGANIZATION_LOAD_SUCCESS;
  organization: orgModel.Organization;
}

interface LoadError extends OrganizationEntityAction {
  type: ActionFlag.ENTITY_ORGANIZATION_LOAD_ERROR;
  error: AnError;
}

export function load(organizationId: orgModel.OrganizationID) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, OrganizationEntityAction>,
    getState: () => StoreState
  ) => {
    dispatch({
      type: ActionFlag.ENTITY_ORGANIZATION_LOAD_START,
    } as LoadStart);

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

    try {
      const organization = await orgClient.getOrg(organizationId);
      dispatch({
        type: ActionFlag.ENTITY_ORGANIZATION_LOAD_SUCCESS,
        organization,
      } as LoadSuccess);
    } catch (ex: any) {
      dispatch({
        type: ActionFlag.ENTITY_ORGANIZATION_LOAD_ERROR,
        error: makeError({
          code: ex.name,
          message: ex.message,
        }),
      } as LoadError);
    }
  };
}
