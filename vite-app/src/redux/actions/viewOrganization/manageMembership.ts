import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";
import { ActionFlag } from "..";
import * as orgModel from "../../../data/models/organization/model";
import Validation from "../../../data/models/organization/validation";
import { AnError, makeError } from "../../../lib/error";
import {
  extractViewOrgModelPlus,
  extractViewOrgSubView
} from "../../../lib/stateExtraction";
import { StoreState } from "../../store/types";
import {
  AsyncModelState,
  SyncState,
  ValidationErrorType
} from "../../store/types/common";
import { SubViewKind } from "../../store/types/views/Main/views/ViewOrg";
import * as viewOrgActions from "../viewOrg";

// Loading

export interface Load extends Action {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD;
}

export interface LoadStart extends Action {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_START;
}

export interface LoadSuccess extends Action {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_SUCCESS;
  organization: orgModel.Organization;
  editableMemberProfile: orgModel.EditableMemberProfile;
}

export interface LoadError extends Action {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_ERROR;
  error: AnError;
}

export interface Unload extends Action {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UNLOAD;
}

export function loadStart(): LoadStart {
  return {
    type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_START,
  };
}

export function loadSuccess(
  organization: orgModel.Organization,
  editableMemberProfile: orgModel.EditableMemberProfile,
): LoadSuccess {
  return {
    type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_SUCCESS,
    organization: organization,
    editableMemberProfile: editableMemberProfile,
  };
}

export function loadError(error: AnError): LoadError {
  return {
    type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_ERROR,
    error: error,
  };
}

export function unload() {
  return {
    type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UNLOAD,
  };
}

export function load(organizationId: string) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    dispatch(loadStart());

    const { username, token, config } = extractViewOrgModelPlus(getState());

    const orgClient = new orgModel.OrganizationModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
      userProfileServiceURL: config.services.UserProfile.url,
    });

    // TODO: here is where we would hook into the store state entities for groups
    try {
      const org = await orgClient.getOrg(organizationId);
      if (org.kind !== orgModel.OrganizationKind.NORMAL) {
        dispatch(
          loadError(
            makeError({
              code: "invalid state",
              message: 'Organization must be of kind "NORMAL"',
            }),
          ),
        );
        return;
      }

      if (!org.isMember) {
        dispatch(
          loadError(
            makeError({
              code: "notfound",
              message: 'The user "' + username +
                '" is not a member of this org',
            }),
          ),
        );
        return;
      }

      let thisMember = org.members.find((member) => {
        return member.username === username;
      });

      if (!thisMember) {
        if (org.owner.username === username) {
          thisMember = org.owner;
        }
      }

      if (!thisMember) {
        dispatch(
          loadError(
            makeError({
              code: "notfound",
              message: 'The user "' + username +
                '" was not found in the members list',
            }),
          ),
        );
        return;
      }

      const editableProfile: orgModel.EditableMemberProfile = {
        title: {
          value: thisMember.title || "",
          remoteValue: thisMember.title,
          syncState: SyncState.NEW,
          validationState: {
            type: ValidationErrorType.OK,
            validatedAt: new Date(),
          },
        },
      };
      dispatch(loadSuccess(org, editableProfile));
      // dispatch(evaluate())
    } catch (ex: any) {
      console.error("Error :(", ex);
      dispatch(
        loadError(
          makeError({
            code: ex.name,
            message: ex.message,
          }),
        ),
      );
    }
  };
}

// Leaving the Org

export interface LeaveOrg extends Action {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LEAVE_ORG;
  organizationId: orgModel.OrganizationID;
}

// 
// For some reason decided to avoid action functions in this case.
// 
// interface LeaveOrgSuccess extends Action {
//   type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LEAVE_ORG_SUCCESS;
// }

// interface LeaveOrgError extends Action {
//   type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LEAVE_ORG_ERROR;
//   error: AnError;
// }


export function leaveOrg(organizationId: orgModel.OrganizationID) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    dispatch({
      type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LEAVE_ORG_START,
    });

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

    try {
      orgClient.removeMember(organizationId, username);
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LEAVE_ORG_SUCCESS,
      });
      dispatch(viewOrgActions.reload(organizationId));
    } catch (ex: any) {
      console.error("ERROR leaving org", ex);
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LEAVE_ORG_ERROR,
        error: {
          code: ex.name,
          message: ex.message,
        },
      });
    }
  };
}

// Updating Profile

export interface UpdateTitle {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UPDATE_TITLE;
  title: string;
}

export interface UpdateTitleStart {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UPDATE_TITLE_START;
}

export interface UpdateTitleSuccess {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UPDATE_TITLE_SUCCESS;
  title: string;
}

export interface UpdateTitleError {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UPDATE_TITLE_ERROR;
  error: AnError;
}

export interface Save {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE;
  memberProfile: orgModel.EditableMemberProfile;
}

export interface SaveStart {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_START;
}

export interface SaveSuccess {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_SUCCESS;
}

export interface SaveError {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_ERROR;
  error: AnError;
}

export function updateTitle(title: string) {
  return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
    const [validatedTitle, error] = Validation.validateMemberTitle(title);

    if (error.type !== ValidationErrorType.OK) {
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UPDATE_TITLE_ERROR,
        error: makeError({
          code: "invalid",
          message: error.message,
        }),
      });
    } else {
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UPDATE_TITLE_SUCCESS,
        title: validatedTitle,
      });
    }
    dispatch(evaluate());
  };
}

export interface Evaluate
  extends Action<ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE> {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE;
}

export interface EvaluateSuccess
  extends Action<ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE_SUCCESS> {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE_SUCCESS;
}

export interface EvaluateError
  extends Action<ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE_ERROR> {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE_ERROR;
}

function ensureViewModel(state: StoreState) {
  const subView = extractViewOrgSubView(state);

  if (subView.kind !== SubViewKind.MANAGE_MEMBERSHIP) {
    throw new Error("Wrong subview");
  }

  if (subView.model.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Wrong async state");
  }

  return subView.model.value;
}

export function evaluate() {
  return (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    const viewModel = ensureViewModel(getState());
    const { editableMemberProfile } = viewModel;

    if (
      editableMemberProfile.title.validationState.type !==
        ValidationErrorType.OK
    ) {
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE_ERROR,
      });
      return;
    }

    dispatch({
      type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE_SUCCESS,
    });
  };
}

export interface Save
  extends Action<ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE> {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE;
}

export interface SaveStart
  extends Action<ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_START> {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_START;
}

export interface SaveSuccess
  extends Action<ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_SUCCESS> {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_SUCCESS;
}

export interface SaveError
  extends Action<ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_ERROR> {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_ERROR;
}

export function save() {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    dispatch({
      type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_START,
    });

    const viewModel = ensureViewModel(getState());
    const { organization, editableMemberProfile } = viewModel;

    const {
      authentication,
      app: { config },
    } = getState();

    if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
      throw new Error("Not authenticated.");
    }
    const { userAuthentication: { token, username } } = authentication;

    const update = {
      title: editableMemberProfile.title.value,
    };

    const orgClient = new orgModel.OrganizationModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
      userProfileServiceURL: config.services.UserProfile.url,
    });

    try {
      await orgClient.updateMember(organization.id, username, update);
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_SUCCESS,
      });
    } catch (ex: any) {
      console.error("error saving member profile", ex);
      dispatch({
        type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_ERROR,
        error: makeError({
          code: "error",
          message: ex.message,
        }),
      });
    }
    dispatch(evaluate());
  };
}

// Demote self to member

// Demote admin to member

export interface DemoteSelfToMember extends Action {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_DEMOTE_SELF_TO_MEMBER;
  organizationId: string;
}

export interface DemoteSelfToMemberStart extends Action {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_DEMOTE_SELF_TO_MEMBER_START;
}

export interface DemoteSelfToMemberSuccess extends Action {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_DEMOTE_SELF_TO_MEMBER_SUCCESS;
  organizationId: string;
}

export interface DemoteSelfToMemberError extends Action {
  type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_DEMOTE_SELF_TO_MEMBER_ERROR;
  error: AnError;
}

export function demoteToMemberStart(): DemoteSelfToMemberStart {
  return {
    type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_DEMOTE_SELF_TO_MEMBER_START,
  };
}

export function demoteSelfToMemberSuccess(
  organizationId: string,
): DemoteSelfToMemberSuccess {
  return {
    type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_DEMOTE_SELF_TO_MEMBER_SUCCESS,
    organizationId: organizationId,
  };
}

export function demoteSelfToMemberError(
  error: AnError,
): DemoteSelfToMemberError {
  return {
    type: ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_DEMOTE_SELF_TO_MEMBER_ERROR,
    error: error,
  };
}

export function demoteSelfToMember(organizationId: string) {
  return (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    dispatch(demoteToMemberStart());
    const { username, token, config } = extractViewOrgModelPlus(getState());
    const viewModel = ensureViewModel(getState());

    // const {
    //     auth: { userAuthorization },
    //     app: { config },
    //     views: {
    //         viewOrgView: { viewModel }
    //     }
    // } = getState();

    // if (userAuthorization === null) {
    //     throw new Error('Unauthorized');
    // }
    // const { token, username } = userAuthorization;

    // if (viewModel === null) {
    //     throw new Error('view is not populated');
    // }
    const orgClient = new orgModel.OrganizationModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
      userProfileServiceURL: config.services.UserProfile.url,
    });

    orgClient
      .adminToMember(viewModel.organization.id, username)
      .then((_org) => {
        dispatch(demoteSelfToMemberSuccess(organizationId));
        dispatch(viewOrgActions.reload(viewModel.organization.id));
        // dispatch(viewMembersLoad(view.organization.id))
      })
      .catch((err: Error) => {
        dispatch(
          demoteSelfToMemberError(
            makeError({
              code: err.name,
              message: err.message,
            }),
          ),
        );
      });
  };
}
