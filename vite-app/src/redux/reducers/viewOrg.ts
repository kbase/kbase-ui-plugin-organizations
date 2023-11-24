import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";
import { Action } from "redux";
import { ActionFlag } from "../actions";
import * as actions from "../actions/viewOrg";
import * as types from "../store/types";
import { StoreState } from "../store/types";
import { AsyncModel, AsyncModelState } from "../store/types/common";
import {
  SubViewKind,
  ViewAccessibleOrgViewModel,
  ViewInaccessiblePrivateOrgViewModel,
  ViewOrgViewModel,
  ViewOrgViewModelKind,
} from "../store/types/views/Main/views/ViewOrg";
import acceptInboxRequest from "./viewOrganization/acceptInboxRequest";
import addApps from "./viewOrganization/addApp";
import cancelOutboxRequest from "./viewOrganization/cancelOutboxRequests";
import denyInboxRequest from "./viewOrganization/denyInboxRequest";
import manageRelatedOrganizations from "./viewOrganization/manageRelatedOrganizations";
import relatedOrganizations from "./viewOrganization/relatedOrganizations";
import viewMembers from "./viewOrganization/viewMembers";

export function loadStart(
  _state: AsyncModel<ViewOrgViewModel>,
  _action: actions.LoadStart,
): AsyncModel<ViewOrgViewModel> {
  return {
    loadingState: AsyncModelState.LOADING,
  };
}

export function loadNormalSuccess(
  _state: AsyncModel<ViewOrgViewModel>,
  action: actions.LoadNormalSuccess,
): AsyncModel<ViewAccessibleOrgViewModel> {
  return {
    loadingState: AsyncModelState.SUCCESS,
    value: {
      kind: ViewOrgViewModelKind.NORMAL,
      organization: action.organization,
      relation: action.relation,
      openRequest: action.openRequest,
      groupRequests: action.groupRequests,
      groupInvitations: action.groupInvitations,
      requestInbox: action.requestInbox,
      requestOutbox: action.requestOutbox,
      narratives: {
        sortBy: action.narrativesSortBy,
        searchBy: "",
        narratives: action.narratives,
      },
      apps: {
        sortBy: "",
        searchBy: "",
        apps: action.apps,
      },
      sortMembersBy: action.sortMembersBy,
      members: action.members,
      searchMembersBy: "",
      subView: {
        kind: SubViewKind.NORMAL,
        model: {
          loadingState: AsyncModelState.NONE,
        },
      },
    },
  };
}

export function loadInaccessiblePrivateSuccess(
  _state: AsyncModel<ViewOrgViewModel>,
  action: actions.LoadInaccessiblePrivateSuccess,
): AsyncModel<ViewInaccessiblePrivateOrgViewModel> {
  return {
    loadingState: AsyncModelState.SUCCESS,
    value: {
      kind: ViewOrgViewModelKind.PRIVATE_INACCESSIBLE,
      organization: action.organization,
      relation: action.relation,
      requestOutbox: action.requestOutbox,
    },
  };
}

export function reloadNormalSuccess(
  state: AsyncModel<ViewOrgViewModel>,
  action: actions.ReloadNormalSuccess,
): AsyncModel<ViewOrgViewModel> {
  // const viewModel = state.views.viewOrgView.viewModel;
  // if (viewModel === null) {
  //     return state;
  // }
  // if (state..kind !== types.ViewOrgViewModelKind.NORMAL) {
  //     return state;
  // }

  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }

  // const s = state;

  // const vm = state.value;

  if (state.value.kind !== ViewOrgViewModelKind.NORMAL) {
    return state;
  }

  return {
    ...state,
    loadingState: AsyncModelState.SUCCESS,
    value: {
      kind: ViewOrgViewModelKind.NORMAL,
      organization: action.organization,
      relation: action.relation,
      openRequest: action.openRequest,
      groupRequests: action.groupRequests,
      groupInvitations: action.groupInvitations,
      requestInbox: action.requestInbox,
      requestOutbox: action.requestOutbox,
      narratives: {
        sortBy: action.narrativesSortBy,
        searchBy: "",
        narratives: action.narratives,
      },
      apps: {
        ...state.value.apps,
        apps: action.apps,
      },
      sortMembersBy: action.sortMembersBy,
      members: action.members,
      searchMembersBy: "",
      subView: {
        ...state.value.subView,
      },
    },
  };
}

// export function loadInaccessiblePrivateSuccess(state: ViewInaccessiblePrivateOrgViewModel, action: actions.LoadInaccessiblePrivateSuccess): ViewInaccessiblePrivateOrgViewModel {
//     return {
//         kind: ViewOrgViewModelKind.PRIVATE_INACCESSIBLE,
//         organization: action.organization,
//         relation: action.relation,
//         requestOutbox: action.requestOutbox
//     };
// }

export function loadError(
  _state: AsyncModel<ViewOrgViewModel>,
  action: actions.LoadError,
): AsyncModel<ViewOrgViewModel> {
  return {
    loadingState: AsyncModelState.ERROR,
    error: action.error,
  };
}

export function unload(
  _state: AsyncModel<ViewOrgViewModel>,
  _action: actions.Unload,
): AsyncModel<ViewOrgViewModel> {
  return {
    loadingState: AsyncModelState.NONE,
  };
}

export function removeNarrativeSuccess(
  state: ViewAccessibleOrgViewModel,
  action: actions.RemoveNarrativeSuccess,
): ViewAccessibleOrgViewModel {
  const narratives = state.organization.narratives;
  const newNarratives = narratives.filter((narrative) => {
    return (narrative.workspaceId !== action.narrativeId);
  });
  const newDisplayNarratives = state.narratives.narratives.filter(
    (narrative) => {
      return (narrative.workspaceId !== action.narrativeId);
    },
  );
  return {
    ...state,
    organization: {
      ...state.organization,
      narratives: newNarratives,
      narrativeCount: newNarratives.length,
    },
    narratives: {
      ...state.narratives,
      narratives: newDisplayNarratives,
    },
  };
}

export function accessNarrativeSuccess(
  state: ViewAccessibleOrgViewModel,
  action: actions.AccessNarrativeSuccess,
): ViewAccessibleOrgViewModel {
  return {
    ...state,
    narratives: {
      ...state.narratives,
      narratives: action.narratives,
    },
  };
}

export function sortNarrativesSuccess(
  state: ViewAccessibleOrgViewModel,
  action: actions.SortNarrativesSuccess,
): ViewAccessibleOrgViewModel {
  return {
    ...state,
    narratives: {
      ...state.narratives,
      sortBy: action.sortBy,
      narratives: action.narratives,
    },
  };
}

export function searchNarrativesSuccess(
  state: ViewAccessibleOrgViewModel,
  action: actions.SearchNarrativesSuccess,
): ViewAccessibleOrgViewModel {
  return {
    ...state,
    narratives: {
      ...state.narratives,
      searchBy: action.searchBy,
      narratives: action.narratives.slice(), // ensure it is updated
    },
  };
}

// Apps

export function sortAppsSuccess(
  state: ViewAccessibleOrgViewModel,
  action: actions.SortAppsSuccess,
): ViewAccessibleOrgViewModel {
  return {
    ...state,
    apps: {
      ...state.narratives,
      sortBy: action.sortBy,
      apps: action.apps.slice(),
    },
  };
}

export function searchAppsSuccess(
  state: ViewAccessibleOrgViewModel,
  action: actions.SearchAppsSuccess,
): ViewAccessibleOrgViewModel {
  return {
    ...state,
    apps: {
      ...state.narratives,
      searchBy: action.searchBy,
      apps: action.apps.slice(), // ensure it is updated
    },
  };
}

function removeAppSuccess(
  state: ViewAccessibleOrgViewModel,
  action: actions.RemoveAppSuccess,
): ViewAccessibleOrgViewModel {
  const newOrgApps = state.organization.apps.filter((app) => {
    return (app.appId !== action.appId);
  });

  const newApps = state.apps.apps.filter((app) => {
    return (app.appId !== action.appId);
  });

  return {
    ...state,
    organization: {
      ...state.organization,
      apps: newOrgApps,
      appCount: newOrgApps.length,
    },
    apps: {
      ...state.apps,
      apps: newApps,
    },
  };
}

function localViewModelReducer(
  state: AsyncModel<ViewOrgViewModel>,
  action: Action,
): AsyncModel<ViewOrgViewModel> | null {
  // NB using discriminant union nature of the ActionX types to narrow
  // the type.

  switch (action.type) {
    case ActionFlag.VIEW_ORG_LOAD_START:
      return loadStart(state, action as actions.LoadStart);
    case ActionFlag.VIEW_ORG_LOAD_NORMAL_SUCCESS:
      return loadNormalSuccess(state, action as actions.LoadNormalSuccess);
    case ActionFlag.VIEW_ORG_LOAD_ERROR:
      return loadError(state, action as actions.LoadError);
    case ActionFlag.VIEW_ORG_UNLOAD:
      return unload(state, action as actions.Unload);
    case ActionFlag.VIEW_ORG_RELOAD_NORMAL_SUCCESS:
      return reloadNormalSuccess(state, action as actions.ReloadNormalSuccess);
    case ActionFlag.VIEW_ORG_LOAD_INACCESSIBLE_PRIVATE_SUCCESS:
      return loadInaccessiblePrivateSuccess(
        state,
        action as actions.LoadInaccessiblePrivateSuccess,
      );
    default:
      return null;
  }
}

function loadSubview(
  state: ViewAccessibleOrgViewModel,
  action: actions.LoadSubview,
): ViewAccessibleOrgViewModel {
  return {
    ...state,
    subView: {
      kind: action.subView,
      model: {
        loadingState: AsyncModelState.NONE,
      },
    },
  };
}

function localAccessibleReducer(
  state: ViewAccessibleOrgViewModel,
  action: Action,
): ViewAccessibleOrgViewModel | null {
  // NB using discriminant union nature of the ActionX types to narrow
  // the type.

  switch (action.type) {
    case ActionFlag.VIEW_ORG_LOAD_SUBVIEW:
      return loadSubview(state, action as actions.LoadSubview);
    case ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_SUCCESS:
      return removeNarrativeSuccess(
        state,
        action as actions.RemoveNarrativeSuccess,
      );
    case ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_SUCCESS:
      return accessNarrativeSuccess(
        state,
        action as actions.AccessNarrativeSuccess,
      );
    case ActionFlag.VIEW_ORG_SORT_NARRATIVES_SUCCESS:
      return sortNarrativesSuccess(
        state,
        action as actions.SortNarrativesSuccess,
      );
    case ActionFlag.VIEW_ORG_SEARCH_NARRATIVES_SUCCESS:
      return searchNarrativesSuccess(
        state,
        action as actions.SearchNarrativesSuccess,
      );
    case ActionFlag.VIEW_ORG_REMOVE_APP_SUCCESS:
      return removeAppSuccess(state, action as actions.RemoveAppSuccess);
    case ActionFlag.VIEW_ORG_SORT_APPS_SUCCESS:
      return sortAppsSuccess(state, action as actions.SortAppsSuccess);
    case ActionFlag.VIEW_ORG_SEARCH_APPS_SUCCESS:
      return searchAppsSuccess(state, action as actions.SearchAppsSuccess);
    default:
      return null;
  }
}

function localInaccessibleReducer(
  _state: ViewInaccessiblePrivateOrgViewModel,
  _action: Action,
): ViewInaccessiblePrivateOrgViewModel | null {
  // NB using discriminant union nature of the ActionX types to narrow
  // the type.

  // switch (action.type) {
  //     case ActionFlag.VIEW_ORG_LOAD_INACCESSIBLE_PRIVATE_SUCCESS:
  //         return loadInaccessiblePrivateSuccess(state, action as actions.LoadInaccessiblePrivateSuccess);
  //     default:
  //         return null;
  // }
  console.warn("inaccessible reducer has nothing to do!");
  return null;
}

export default function reducer(
  state: types.StoreState,
  action: Action<any>,
): StoreState | null {
  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    return null;
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    return null;
  }

  // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
  //     return null;
  // }

  const newModel = localViewModelReducer(
    state.view.value.views.viewOrg,
    action,
  );
  if (newModel) {
    return {
      ...state,
      view: {
        ...state.view,
        value: {
          ...state.view.value,
          views: {
            ...state.view.value.views,
            viewOrg: newModel,
          },
        },
      },
    };
  }

  if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
    return null;
  }
  if (
    state.view.value.views.viewOrg.value.kind === ViewOrgViewModelKind.NORMAL
  ) {
    const newValue = localAccessibleReducer(
      state.view.value.views.viewOrg.value,
      action,
    );
    if (newValue) {
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
                value: newValue,
              },
            },
          },
        },
      };
    }
  } else {
    const newValue = localInaccessibleReducer(
      state.view.value.views.viewOrg.value,
      action,
    );
    if (newValue) {
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
                value: newValue,
              },
            },
          },
        },
      };
    }
  }

  return acceptInboxRequest(state, action) ||
    denyInboxRequest(state, action) ||
    cancelOutboxRequest(state, action) ||
    viewMembers(state, action) ||
    manageRelatedOrganizations(state, action) ||
    relatedOrganizations(state, action) ||
    relatedOrganizations(state, action) ||
    addApps(state, action);
}
