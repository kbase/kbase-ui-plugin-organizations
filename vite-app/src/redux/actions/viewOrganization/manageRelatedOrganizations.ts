import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ActionFlag } from "../index";
import { AnError } from "../../../lib/error";
import { StoreState } from "../../store/types";
import * as orgModel from "../../../data/models/organization/model";
import { makeError } from "../../../combo/error/api";
import { SelectableRelatableOrganization } from "../../store/types/views/Main/views/ViewOrg/views/ManageRelatedOrgs";
import { SubViewKind } from "../../store/types/views/Main/views/ViewOrg";
import {
  extractViewOrgSubView,
  extractViewOrgModelPlus,
} from "../../../lib/stateExtraction";
import { AsyncModelState } from "../../store/types/common";

export interface Load
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD;
}

export interface LoadStart
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_START> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_START;
}

export interface LoadSuccess
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_SUCCESS> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_SUCCESS;
  organizations: Array<SelectableRelatableOrganization>;
}

export interface LoadError
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_ERROR> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_ERROR;
  error: AnError;
}

export interface Unload
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_UNLOAD> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_UNLOAD;
}

function ensureViewModel(state: StoreState) {
  const subView = extractViewOrgSubView(state);

  if (subView.kind !== SubViewKind.MANAGE_RELATED_ORGS) {
    throw new Error("Wrong subview");
  }

  if (subView.model.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Wrong async state");
  }

  return subView.model.value;
}

export function load() {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState
  ) => {
    dispatch({
      type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_START,
    } as LoadStart);

    const {
      viewModel: { organization },
      username,
      token,
      config,
    } = extractViewOrgModelPlus(getState());
    // const { organization } = ensureViewModel(getState());

    const orgClient = new orgModel.OrganizationModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
      userProfileServiceURL: config.services.UserProfile.url,
    });

    try {
      const orgs = await orgClient.getAllOrgs2();
      const selectableOrgs = orgs.map((org) => {
        const isRelated = organization.relatedOrganizations.includes(org.id);
        return {
          isRelated: isRelated,
          isSelected: false,
          organization: org,
        } as SelectableRelatableOrganization;
      });
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_SUCCESS,
        organizations: selectableOrgs,
      });
    } catch (ex: any) {
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_ERROR,
        error: makeError({
          code: "error",
          message: ex.message,
        }),
      });
    }
  };
}

export function unload(): Unload {
  return {
    type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_UNLOAD,
  };
}

export interface SelectOrganization
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SELECT_ORGANIZATION> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SELECT_ORGANIZATION;
  selectedOrganization: SelectableRelatableOrganization;
}

export function selectOrganization(
  org: SelectableRelatableOrganization
): SelectOrganization {
  return {
    type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SELECT_ORGANIZATION,
    selectedOrganization: org,
  };
}

// Add Org

export interface AddOrganization
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION;
  organizationId: orgModel.OrganizationID;
}

export interface AddOrganizationStart
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_START> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_START;
}

export interface AddOrganizationSuccess
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_SUCCESS> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_SUCCESS;
  organizationId: orgModel.OrganizationID;
}

export interface AddOrganizationError
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_ERROR> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_ERROR;
  error: AnError;
}

export function addOrganization(
  organizationId: orgModel.OrganizationID,
  relatedOrganizationId: orgModel.OrganizationID
) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState
  ) => {
    dispatch({
      type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_START,
    } as AddOrganizationStart);

    const { username, token, config } = extractViewOrgModelPlus(getState());

    const orgClient = new orgModel.OrganizationModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
      userProfileServiceURL: config.services.UserProfile.url,
    });
    try {
      await orgClient.addRelatedOrganization({
        organizationId,
        relatedOrganizationId,
      });
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_SUCCESS,
        organizationId: relatedOrganizationId,
      });
    } catch (ex: any) {
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_ERROR,
        error: makeError({
          code: "error",
          message: ex.message,
        }),
      });
    }
  };
}

// Remove Org

export interface RemoveOrganization
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION;
  organizationId: orgModel.OrganizationID;
}

export interface RemoveOrganizationStart
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_START> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_START;
}

export interface RemoveOrganizationSuccess
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS;
  organizationId: orgModel.OrganizationID;
}

export interface RemoveOrganizationError
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_ERROR> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_ERROR;
  error: AnError;
}

export function removeOrganization(
  organizationId: orgModel.OrganizationID,
  relatedOrganizationId: orgModel.OrganizationID
) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState
  ) => {
    dispatch({
      type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_START,
    } as RemoveOrganizationStart);

    const { username, token, config } = extractViewOrgModelPlus(getState());

    const orgClient = new orgModel.OrganizationModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
      userProfileServiceURL: config.services.UserProfile.url,
    });
    try {
      await orgClient.removeRelatedOrganization({
        organizationId,
        relatedOrganizationId,
      });
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS,
        organizationId: relatedOrganizationId,
      } as RemoveOrganizationSuccess);
      // dispatch(viewOrgActions.reload(organizationId))
    } catch (ex: any) {
      dispatch({
        type: ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_ERROR,
        error: makeError({
          code: "error",
          message: ex.message,
        }),
      });
    }
  };
}

// Search Orgs

export interface Search
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH;
  query: string;
}

export interface SearchStart
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_START> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_START;
}

export interface SearchSuccess
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_SUCCESS> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_SUCCESS;
  organizations: Array<SelectableRelatableOrganization>;
  searchBy: string;
}

export interface SearchError
  extends Action<ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_ERROR> {
  type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_ERROR;
  error: AnError;
}

export function applyQuery(
  orgs: Array<SelectableRelatableOrganization>,
  query: string
) {
  const searchExp = query.split(/\s+/).map((term) => {
    return new RegExp(term, "i");
  });

  return orgs.filter(({ organization }) => {
    return searchExp.every((re) => {
      return (
        re.test(organization.name) ||
        // TODO: realname
        re.test(organization.owner.username)
      );
    });
  });
}

export function search(query: string) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState
  ) => {
    dispatch({
      type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_START,
    } as SearchStart);

    const { availableOrganizations } = ensureViewModel(getState());

    try {
      const availableOrgs = applyQuery(
        availableOrganizations.organizations,
        query
      );

      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_SUCCESS,
        organizations: availableOrgs,
        searchBy: query,
      } as SearchSuccess);
      // dispatch(viewOrgActions.reload(organizationId))
    } catch (ex: any) {
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_ERROR,
        error: makeError({
          code: "error",
          message: ex.message,
        }),
      });
    }
  };
}
