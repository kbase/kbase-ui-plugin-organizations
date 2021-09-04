import { Action } from "redux";
import * as actions from "../actions/browseOrgs";
import { StoreState } from "../store/types";
import { ActionFlag } from "../actions";
import * as orgModel from "../../data/models/organization/model";
import { BrowseOrgsViewModel } from "../store/types/views/Main/views/BrowseOrgs";
import { AsyncModelState } from "../store/types/common";

export function applyOrgSearch(
  orgs: Array<orgModel.Organization>,
  searchTerms: Array<string>
) {
  const filteredOrgs = orgs.filter((org) => {
    if (searchTerms.length === 0) {
      return true;
    }
    return searchTerms.every((term) => {
      // todo : make more efficient!!!
      return new RegExp(term, "i").test(org.name);
    });
  });

  return {
    organizations: filteredOrgs,
    totalCount: orgs.length,
    filteredCount: filteredOrgs.length,
  };
}

// TODO:
// dispatch the start of the request
// do the request
// dispatch the success (will be same for all queries?)
// dispatch the error
// FOR NOW:
// do it here...
export function searchOrgs(
  state: BrowseOrgsViewModel,
  action: actions.SearchOrgs
): BrowseOrgsViewModel {
  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }

  return {
    ...state,
    // loadingState: AsyncModelState.LOADING,
    value: {
      ...state.value,
      selectedOrganizationId: null,
      searchTerms: action.searchTerms,
      searching: true,
    },
  };
}

export function searchOrgsStart(
  state: BrowseOrgsViewModel,
  action: actions.SearchOrgsStart
): BrowseOrgsViewModel {
  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }
  return {
    ...state,
    value: {
      ...state.value,
      searchTerms: action.searchTerms,
      searching: true,
    },
  };
}

export function searchOrgsSuccess(
  state: BrowseOrgsViewModel,
  action: actions.SearchOrgsSuccess
): BrowseOrgsViewModel {
  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }
  return {
    ...state,
    loadingState: AsyncModelState.SUCCESS,
    value: {
      ...state.value,
      organizations: action.organizations,
      openRequests: action.openRequests,
      totalCount: action.totalCount,
      filteredCount: action.organizations.length,
      searching: false,
    },
  };
}

// TODO: hmm, uses the global error -- this was early in the development of this (a whole two weeks ago!)
// and this should now go in the "browseOrgs" (or better named "searchOrgs") branch.
export function searchOrgsError(
  state: BrowseOrgsViewModel,
  action: actions.SearchOrgsError
): BrowseOrgsViewModel {
  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }

  return {
    ...state,
    loadingState: AsyncModelState.ERROR,
    error: {
      code: action.error.code,
      message: action.error.message,
    },
    // value: {
    //     ...state.value,
    //     searching: false,
    //     error: action.error
    // }
  };
}

export function sortOrgsStart(
  state: BrowseOrgsViewModel,
  action: actions.SortOrgsStart
): BrowseOrgsViewModel {
  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }

  return {
    ...state,
    value: {
      ...state.value,
      sortField: action.sortField,
      sortDirection: action.sortDirection,
      searching: true,
    },
  };
}

function filterOrgsStart(
  state: BrowseOrgsViewModel,
  action: actions.FilterOrgsStart
): BrowseOrgsViewModel {
  if (state.loadingState !== AsyncModelState.SUCCESS) {
    return state;
  }

  const { filter } = action;

  return {
    ...state,
    value: {
      ...state.value,
      filter,
      searching: true,
    },
  };
}

function loadStart(
  state: BrowseOrgsViewModel,
  action: actions.LoadStart
): BrowseOrgsViewModel {
  return {
    loadingState: AsyncModelState.LOADING,
  };
}

function loadError(
  state: BrowseOrgsViewModel,
  action: actions.LoadError
): BrowseOrgsViewModel {
  return {
    loadingState: AsyncModelState.ERROR,
    error: action.error,
  };
}

function loadSuccess(
  state: BrowseOrgsViewModel,
  action: actions.LoadSuccess
): BrowseOrgsViewModel {
  const {
    defaultViewModel: {
      rawOrganizations,
      organizations,
      openRequests,
      searchTerms,
      sortField,
      sortDirection,
      filter,
      totalCount,
      filteredCount,
      selectedOrganizationId,
      error,
      searching,
    },
  } = action;

  return {
    loadingState: AsyncModelState.SUCCESS,
    value: {
      rawOrganizations,
      organizations,
      openRequests,
      searchTerms,
      sortField,
      sortDirection,
      filter,
      totalCount,
      filteredCount,
      selectedOrganizationId,
      error,
      searching,
    },
  };
}

function unload(
  state: BrowseOrgsViewModel,
  action: actions.Unload
): BrowseOrgsViewModel {
  return {
    loadingState: AsyncModelState.NONE,
  };
}

function localReducer(
  state: BrowseOrgsViewModel,
  action: Action
): BrowseOrgsViewModel | null {
  // NB using discriminant union nature of the ActionX types to narrow
  // the type.

  switch (action.type) {
    case ActionFlag.BROWSE_ORGS_LOAD_START:
      return loadStart(state, action as actions.LoadStart);
    case ActionFlag.BROWSE_ORGS_LOAD_ERROR:
      return loadError(state, action as actions.LoadError);
    case ActionFlag.BROWSE_ORGS_LOAD_SUCCESS:
      return loadSuccess(state, action as actions.LoadSuccess);
    case ActionFlag.BROWSE_ORGS_SEARCH:
      return searchOrgs(state, action as actions.SearchOrgs);
    case ActionFlag.BROWSE_ORGS_SEARCH_START:
      return searchOrgsStart(state, action as actions.SearchOrgsStart);
    case ActionFlag.BROWSE_ORGS_SEARCH_SUCCESS:
      return searchOrgsSuccess(state, action as actions.SearchOrgsSuccess);
    case ActionFlag.BROWSE_ORGS_SEARCH_ERROR:
      return searchOrgsError(state, action as actions.SearchOrgsError);
    // case ActionFlag.SORT_ORGS_STAR:
    //     return sortOrgs(state, action as actions.SortOrgs)
    case ActionFlag.BROWSE_ORGS_SORT_START:
      return sortOrgsStart(state, action as actions.SortOrgsStart);
    case ActionFlag.BROWSE_ORGS_FILTER_START:
      return filterOrgsStart(state, action as actions.FilterOrgsStart);
    case ActionFlag.BROWSE_ORGS_UNLOAD:
      return unload(state, action as actions.Unload);
    default:
      return null;
  }
}

export default function reducer(
  state: StoreState,
  action: Action<any>
): StoreState | null {
  if (state.auth.userAuthorization === null) {
    return null;
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    return null;
  }

  // if (state.view.value.kind !== ViewKind.BROWSE_ORGS) {
  //     return null;
  // }

  // if (state.view.value.model.loadingState !== AsyncModelState.SUCCESS) {
  //     return state;
  // }

  const browseOrgsView = localReducer(
    state.view.value.views.browseOrgs,
    action
  );
  if (browseOrgsView) {
    return {
      ...state,
      view: {
        ...state.view,
        value: {
          ...state.view.value,
          views: {
            ...state.view.value.views,
            browseOrgs: browseOrgsView,
          },
        },
      },
    };
  }
  return null;
}
