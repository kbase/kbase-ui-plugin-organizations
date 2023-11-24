import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";
import { Action } from "redux";
import { ActionFlag } from "../../actions";
import * as actions from "../../actions/viewOrganization/addApps";
import { StoreState } from "../../store/types";
import { AsyncModel, AsyncModelState } from "../../store/types/common";
import {
  SubViewKind,
  ViewOrgViewModelKind,
} from "../../store/types/views/Main/views/ViewOrg";
import {
  AddAppViewModel,
  ResourceRelationToOrg,
} from "../../store/types/views/Main/views/ViewOrg/views/AddApp";

export function loadStart(
  _state: AsyncModel<AddAppViewModel>,
  _action: actions.LoadStart,
): AsyncModel<AddAppViewModel> {
  return {
    loadingState: AsyncModelState.LOADING,
  };
}

export function loadSuccess(
  _state: AsyncModel<AddAppViewModel>,
  action: actions.LoadSuccess,
): AsyncModel<AddAppViewModel> {
  return {
    loadingState: AsyncModelState.SUCCESS,
    value: {
      rawApps: action.rawApps,
      sortBy: action.sortBy,
      searchBy: action.searchBy,
      apps: action.apps,
      selectedApp: action.selectedApp,
    },
  };
}

export function loadError(
  _state: AsyncModel<AddAppViewModel>,
  action: actions.LoadError,
): AsyncModel<AddAppViewModel> {
  return {
    loadingState: AsyncModelState.ERROR,
    error: action.error,
  };
}

export function unload(
  _state: AsyncModel<AddAppViewModel>,
  _action: actions.Unload,
): AsyncModel<AddAppViewModel> {
  return {
    loadingState: AsyncModelState.NONE,
  };
}

export function selectSuccess(
  state: AsyncModel<AddAppViewModel>,
  action: actions.SelectSuccess,
): AsyncModel<AddAppViewModel> {
  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }

  const newRawApps = state.value.rawApps.slice(0);
  // TODO might need more item setting here
  newRawApps.forEach((app) => {
    if (app.appId === action.selectedApp.appId) {
      app.selected = true;
    } else {
      app.selected = false;
    }
  });

  // TODO: reapply sort and search??
  const newApps = state.value.apps.slice(0);
  newApps.forEach((app) => {
    if (app.appId === action.selectedApp.appId) {
      app.selected = true;
    } else {
      app.selected = false;
    }
  });

  return {
    ...state,
    value: {
      ...state.value,
      apps: newApps,
      rawApps: newRawApps,
      selectedApp: action.selectedApp,
    },
  };
}

export function requestAssociationSuccess(
  state: AsyncModel<AddAppViewModel>,
  action: actions.RequestAssociationSuccess,
): AsyncModel<AddAppViewModel> {
  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }

  const newRawApps = state.value.rawApps.slice(0);
  // TODO might need more item setting here
  newRawApps.forEach((app) => {
    if (app.app.id === action.appId) {
      if (action.pending) {
        app.relation = ResourceRelationToOrg.ASSOCIATION_PENDING;
      } else {
        app.relation = ResourceRelationToOrg.ASSOCIATED;
      }
    }
  });

  // TODO: reapply sort and search??
  const newApps = state.value.apps.slice(0);
  newApps.forEach((app) => {
    if (app.app.id === action.appId) {
      if (action.pending) {
        app.relation = ResourceRelationToOrg.ASSOCIATION_PENDING;
      } else {
        app.relation = ResourceRelationToOrg.ASSOCIATED;
      }
    }
  });

  return {
    ...state,
    value: {
      ...state.value,
      apps: newApps,
      rawApps: newRawApps,
      // selectedApp: action.selectedApp
    },
  };
}

// TODO: route the search and/or search expression here too???
function searchSuccess(
  state: AsyncModel<AddAppViewModel>,
  action: actions.SearchSuccess,
): AsyncModel<AddAppViewModel> {
  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }

  return {
    ...state,
    value: {
      ...state.value,
      apps: action.apps,
    },
  };
}

function sortSuccess(
  state: AsyncModel<AddAppViewModel>,
  action: actions.SortSuccess,
): AsyncModel<AddAppViewModel> {
  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }
  return {
    ...state,
    value: {
      ...state.value,
      sortBy: action.sortBy,
      apps: action.apps,
    },
  };
}

function haveReducer(action: Action): boolean {
  switch (action.type) {
    case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_START:
    case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_SUCCESS:
    case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_ERROR:
    case ActionFlag.VIEW_ORG_ADD_APPS_UNLOAD:
    case ActionFlag.VIEW_ORG_ADD_APPS_SELECT_SUCCESS:
    case ActionFlag.VIEW_ORG_ADD_APPS_REQUEST_ASSOCIATE_APP_SUCCESS:
    case ActionFlag.VIEW_ORG_ADD_APPS_SEARCH_SUCCESS:
    case ActionFlag.VIEW_ORG_ADD_APPS_SORT_SUCCESS:
      return true;
    default:
      return false;
  }
}

function localReducer(
  state: AsyncModel<AddAppViewModel>,
  action: actions.AddAppsAction,
): AsyncModel<AddAppViewModel> | null {
  switch (action.type) {
    case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_START:
      return loadStart(state, action as actions.LoadStart);
    case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_SUCCESS:
      return loadSuccess(state, action as actions.LoadSuccess);
    case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_ERROR:
      return loadError(state, action as actions.LoadError);
    case ActionFlag.VIEW_ORG_ADD_APPS_UNLOAD:
      return unload(state, action as actions.Unload);
    case ActionFlag.VIEW_ORG_ADD_APPS_SELECT_SUCCESS:
      return selectSuccess(state, action as actions.SelectSuccess);
    case ActionFlag.VIEW_ORG_ADD_APPS_REQUEST_ASSOCIATE_APP_SUCCESS:
      return requestAssociationSuccess(
        state,
        action as actions.RequestAssociationSuccess,
      );
    case ActionFlag.VIEW_ORG_ADD_APPS_SEARCH_SUCCESS:
      return searchSuccess(state, action as actions.SearchSuccess);
    case ActionFlag.VIEW_ORG_ADD_APPS_SORT_SUCCESS:
      return sortSuccess(state, action as actions.SortSuccess);
    default:
      return null;
  }
}

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
    state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.ADD_APP
  ) {
    return state;
  }

  // if (state.view.value.views.viewOrg.value.subView.model.loadingState !== AsyncModelState.SUCCESS) {
  //     return state;
  // }

  const viewState = state.view.value.views.viewOrg.value.subView.model;
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
                model: newViewState,
              },
            },
          },
        },
      },
      // viewOrgView: {
      //     ...state.views.viewOrgView,
      //     viewModel: {
      //         ...state.views.viewOrgView.viewModel,
      //         subViews: {
      //             ...state.views.viewOrgView.viewModel.subViews,
      //             addAppsView: newViewState
      //         }
      //     }
      // }
    },
  };
}
