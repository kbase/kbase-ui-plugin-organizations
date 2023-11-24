import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";
import { Action } from "redux";
import * as orgModel from "../../../data/models/organization/model";
import { ActionFlag } from "../../actions";
import * as actions from "../../actions/viewOrganization/inviteUser";
import { StoreState } from "../../store/types";
import { AsyncModel, AsyncModelState } from "../../store/types/common";
import {
  SubViewKind,
  ViewOrgViewModelKind,
} from "../../store/types/views/Main/views/ViewOrg";
import {
  InviteUserViewModel,
  InviteUserViewState,
} from "../../store/types/views/Main/views/ViewOrg/views/InviteUser";

export function loadStart(
  _state: AsyncModel<InviteUserViewModel>,
  _action: actions.LoadStart,
): AsyncModel<InviteUserViewModel> {
  return {
    loadingState: AsyncModelState.LOADING,
  };
}

export function loadSuccess(
  _state: AsyncModel<InviteUserViewModel>,
  action: actions.LoadSuccess,
): AsyncModel<InviteUserViewModel> {
  return {
    loadingState: AsyncModelState.SUCCESS,
    value: {
      editState: InviteUserViewState.EDITING,
      users: action.users,
      organization: action.organization,
      selectedUser: null,
    },
  };
}

export function loadError(
  _state: AsyncModel<InviteUserViewModel>,
  action: actions.LoadError,
): AsyncModel<InviteUserViewModel> {
  return {
    loadingState: AsyncModelState.ERROR,
    error: action.error,
  };
}

export function unload(
  _state: AsyncModel<InviteUserViewModel>,
  _action: actions.Unload,
): AsyncModel<InviteUserViewModel> {
  return {
    loadingState: AsyncModelState.NONE,
  };
}

// Just view model

export function searchUsersSuccess(
  state: InviteUserViewModel,
  action: actions.SearchUsersSuccess,
): InviteUserViewModel {
  return {
    ...state,
    users: action.users,
  };
}

export function selectUserSuccess(
  state: InviteUserViewModel,
  action: actions.SelectUserSuccess,
): InviteUserViewModel {
  return {
    ...state,
    selectedUser: {
      user: action.user,
      relation: action.relation,
    },
  };
}

export function sendInvitationStart(
  state: InviteUserViewModel,
  _action: actions.SendInvitationStart,
): InviteUserViewModel {
  return {
    ...state,
    editState: InviteUserViewState.SENDING,
  };
}

export function sendInvitationSuccess(
  state: InviteUserViewModel,
  _action: actions.SendInvitationSuccess,
): InviteUserViewModel {
  const { selectedUser, users } = state;

  // const selectedUser = state.inviteUserView.value.selectedUser
  if (!selectedUser) {
    throw new Error("selected user is null");
  }
  selectedUser.relation =
    orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING;

  if (!users) {
    throw new Error("users is null");
  }
  const newUsers = users.map((user) => {
    if (user.username === selectedUser.user.username) {
      user.relation =
        orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING;
    }
    return user;
  });

  return {
    ...state,
    editState: InviteUserViewState.SUCCESS,
    selectedUser: selectedUser,
    users: newUsers,
  };
}

// TODO: revive
// export function sendInvitationError(state: InviteUserViewModel, action: actions.SendInvitationError): InviteUserViewModel {
//     return {
//         ...state,
//         error: action.error
//     };
// }

function localReducerAsync(
  state: AsyncModel<InviteUserViewModel>,
  action: Action,
): AsyncModel<InviteUserViewModel> | null {
  switch (action.type) {
    case ActionFlag.INVITE_USER_LOAD_START:
      return loadStart(state, action as actions.LoadStart);
    case ActionFlag.INVITE_USER_LOAD_SUCCESS:
      return loadSuccess(state, action as actions.LoadSuccess);
    case ActionFlag.INVITE_USER_LOAD_ERROR:
      return loadError(state, action as actions.LoadError);
    case ActionFlag.INVITE_USER_UNLOAD:
      return unload(state, action as actions.Unload);
    default:
      return null;
  }
}

function localReducer(
  state: InviteUserViewModel,
  action: Action,
): InviteUserViewModel | null {
  switch (action.type) {
    case ActionFlag.INVITE_USER_SEARCH_USERS_SUCCESS:
      return searchUsersSuccess(state, action as actions.SearchUsersSuccess);
    case ActionFlag.INVITE_USER_SELECT_USER_SUCCESS:
      return selectUserSuccess(state, action as actions.SelectUserSuccess);
    case ActionFlag.INVITE_USER_SEND_INVITATION_START:
      return sendInvitationStart(state, action as actions.SendInvitationStart);
    case ActionFlag.INVITE_USER_SEND_INVITATION_SUCCESS:
      return sendInvitationSuccess(
        state,
        action as actions.SendInvitationSuccess,
      );
    // case ActionFlag.INVITE_USER_SEND_INVITATION_ERROR:
    //     return sendInvitationError(state, action as actions.SendInvitationError);
    default:
      return null;
  }
}

function haveReducer(action: Action): boolean {
  switch (action.type) {
    case ActionFlag.INVITE_USER_LOAD_START:
    case ActionFlag.INVITE_USER_LOAD_SUCCESS:
    case ActionFlag.INVITE_USER_LOAD_ERROR:
    case ActionFlag.INVITE_USER_UNLOAD:
    case ActionFlag.INVITE_USER_SEARCH_USERS_SUCCESS:
    case ActionFlag.INVITE_USER_SELECT_USER_SUCCESS:
    case ActionFlag.INVITE_USER_SEND_INVITATION_START:
    case ActionFlag.INVITE_USER_SEND_INVITATION_SUCCESS:
    case ActionFlag.INVITE_USER_SEND_INVITATION_ERROR:
      return true;
    default:
      return false;
  }
}

// function reducerx(state: StoreState, action: Action): StoreState | null {
//     if (!haveReducer(action)) {
//         return null
//     }
//     if (!state.views.viewOrgView.viewModel) {
//         return state
//     }
//     if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
//         return state
//     }
//     const viewState: InviteUserViewModel = state.views.viewOrgView.viewModel.subViews.inviteUserView
//     const newViewState = localReducer(viewState, action)
//     if (newViewState === null) {
//         return null
//     }
//     return {
//         ...state,
//         views: {
//             ...state.views,
//             viewOrgView: {
//                 ...state.views.viewOrgView,
//                 viewModel: {
//                     ...state.views.viewOrgView.viewModel,
//                     subViews: {
//                         ...state.views.viewOrgView.viewModel.subViews,
//                         inviteUserView: newViewState
//                     }
//                 }
//             }
//         }
//     }
// }

export default function reducer(
  state: StoreState,
  action: Action,
): StoreState | null {
  if (!haveReducer(action)) {
    return null;
  }

  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    return state;
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }

  // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
  //     return state;
  // }

  if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }

  if (
    state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL
  ) {
    return state;
  }

  if (
    state.view.value.views.viewOrg.value.subView.kind !==
      SubViewKind.INVITE_USER
  ) {
    return state;
  }

  const newAsyncState = localReducerAsync(
    state.view.value.views.viewOrg.value.subView.model,
    action,
  );

  if (newAsyncState) {
    return {
      ...state,
      view: {
        ...state.view,
        value: {
          ...state.view.value,
          views: {
            ...state.view.value.views,
            viewOrg: {
              ...state.view.value.views.viewOrg,
              value: {
                ...state.view.value.views.viewOrg.value,
                subView: {
                  ...state.view.value.views.viewOrg.value.subView,
                  model: newAsyncState,
                },
              },
            },
          },
        },
      },
    };
  }

  if (
    state.view.value.views.viewOrg.value.subView.model.loadingState !==
      AsyncModelState.SUCCESS
  ) {
    return state;
  }

  const viewState = state.view.value.views.viewOrg.value.subView.model.value;
  const newViewState = localReducer(viewState, action);
  if (newViewState === null) {
    return null;
  }
  return {
    ...state,
    view: {
      ...state.view,
      value: {
        ...state.view.value,
        views: {
          ...state.view.value.views,
          viewOrg: {
            ...state.view.value.views.viewOrg,
            value: {
              ...state.view.value.views.viewOrg.value,
              subView: {
                ...state.view.value.views.viewOrg.value.subView,
                model: {
                  ...state.view.value.views.viewOrg.value.subView.model,
                  value: newViewState,
                },
              },
            },
          },
        },
      },
    },
  };
}
