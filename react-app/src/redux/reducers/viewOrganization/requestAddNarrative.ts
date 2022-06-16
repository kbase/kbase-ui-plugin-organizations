import { Action } from "redux";
import * as actions from "../../actions/viewOrganization/requestAddNarrative";
import { NarrativeState, StoreState } from "../../store/types";
import { ActionFlag } from "../../actions";
import {
  AsyncModel,
  AsyncModelState,
  SaveState,
  SelectionState,
} from "../../store/types/common";
import { RequestNarrativeViewModel } from "../../store/types/views/Main/views/ViewOrg/views/RequestNarrative";
import {
  SubViewKind,
  ViewOrgViewModelKind,
} from "../../store/types/views/Main/views/ViewOrg";
import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";

export function loadStart(
  state: AsyncModel<RequestNarrativeViewModel>,
  action: actions.LoadStart,
): AsyncModel<RequestNarrativeViewModel> {
  return {
    loadingState: AsyncModelState.LOADING,
  };
}

export function loadSuccess(
  state: AsyncModel<RequestNarrativeViewModel>,
  action: actions.LoadSuccess,
): AsyncModel<RequestNarrativeViewModel> {
  return {
    loadingState: AsyncModelState.SUCCESS,
    value: {
      organization: action.organization,
      narratives: action.narratives,
      selectedNarrative: null,
      relation: action.relation,
      error: null,
      selectionState: SelectionState.NONE,
      saveState: SaveState.SAVED,
    },
  };
}

export function loadError(
  state: AsyncModel<RequestNarrativeViewModel>,
  action: actions.LoadError,
): AsyncModel<RequestNarrativeViewModel> {
  return {
    loadingState: AsyncModelState.ERROR,
    error: action.error,
  };
}

export function sendRequestStart(
  state: RequestNarrativeViewModel,
  action: actions.SendRequestStart,
): RequestNarrativeViewModel {
  return {
    ...state,
    saveState: SaveState.SAVING,
  };
}

export function sendRequestSuccess(
  state: RequestNarrativeViewModel,
  action: actions.SendRequestSuccess,
): RequestNarrativeViewModel {
  const newState: RequestNarrativeViewModel = {
    ...state,
    saveState: SaveState.SAVED,
  };

  const viewModel = newState;

  const selectedNarrative = viewModel.selectedNarrative;

  // If the request is by an admin, it will be returned as true, not the request
  // (the api returns {complete: true})
  if (action.request === true) {
    viewModel.narratives = viewModel.narratives.map((orgNarrative) => {
      if (
        orgNarrative.narrative.workspaceId ===
          selectedNarrative!.narrative.workspaceId
      ) {
        orgNarrative.status = NarrativeState.ASSOCIATED;
      }
      return orgNarrative;
    });
  } else {
    viewModel.narratives = viewModel.narratives.map((orgNarrative) => {
      if (
        orgNarrative.narrative.workspaceId ===
          selectedNarrative!.narrative.workspaceId
      ) {
        orgNarrative.status = NarrativeState.REQUESTED;
      }
      return orgNarrative;
    });
  }

  return newState;
}

export function sendRequestError(
  state: RequestNarrativeViewModel,
  action: actions.SendRequestError,
): RequestNarrativeViewModel {
  return {
    ...state,
    saveState: SaveState.SAVE_ERROR,
    error: action.error,
  };
}

export function selectNarrativeStart(
  state: RequestNarrativeViewModel,
  action: actions.SelectNarrativeStart,
): RequestNarrativeViewModel {
  // TODO: hmm, is this really async???
  // return {
  //     ...state,
  //     value: {
  //         ...state.value
  //     }
  // };
  // TODO: implement
  return state;
}

export function selectNarrativeSuccess(
  state: RequestNarrativeViewModel,
  action: actions.SelectNarrativeSuccess,
): RequestNarrativeViewModel {
  return {
    ...state,
    selectedNarrative: action.narrative,
  };
}

export function unload(
  state: AsyncModel<RequestNarrativeViewModel>,
  action: actions.Unload,
): AsyncModel<RequestNarrativeViewModel> {
  return {
    loadingState: AsyncModelState.NONE,
  };
}

function sortSuccess(
  state: RequestNarrativeViewModel,
  action: actions.SortSuccess,
): RequestNarrativeViewModel {
  return {
    ...state,
    narratives: action.narratives,
  };
}

function localReducerAsync(
  state: AsyncModel<RequestNarrativeViewModel>,
  action: Action,
): AsyncModel<RequestNarrativeViewModel> | null {
  switch (action.type) {
    case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_START:
      return loadStart(state, action as actions.LoadStart);
    case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_SUCCESS:
      return loadSuccess(state, action as actions.LoadSuccess);
    case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR:
      return loadError(state, action as actions.LoadError);
    case ActionFlag.REQUEST_ADD_NARRATIVE_UNLOAD:
      return unload(state, action as actions.Unload);
    default:
      return null;
  }
}

function localReducer(
  state: RequestNarrativeViewModel,
  action: Action,
): RequestNarrativeViewModel | null {
  switch (action.type) {
    case ActionFlag.REQUEST_ADD_NARRATIVE_SEND_START:
      return sendRequestStart(state, action as actions.SendRequestStart);

    case ActionFlag.REQUEST_ADD_NARRATIVE_SEND_SUCCESS:
      return sendRequestSuccess(state, action as actions.SendRequestSuccess);

    case ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_START:
      return selectNarrativeStart(
        state,
        action as actions.SelectNarrativeStart,
      );

    case ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_SUCCESS:
      return selectNarrativeSuccess(
        state,
        action as actions.SelectNarrativeSuccess,
      );

    case ActionFlag.REQUEST_ADD_NARRATIVE_SORT_SUCCESS:
      return sortSuccess(state, action as actions.SortSuccess);

    default:
      return null;
  }
}

function haveReducer(action: Action): boolean {
  switch (action.type) {
    case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_START:
    case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_SUCCESS:
    case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR:
    case ActionFlag.REQUEST_ADD_NARRATIVE_SEND_START:
    case ActionFlag.REQUEST_ADD_NARRATIVE_SEND_SUCCESS:
    case ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_SUCCESS:
    case ActionFlag.REQUEST_ADD_NARRATIVE_UNLOAD:
    case ActionFlag.REQUEST_ADD_NARRATIVE_SORT_SUCCESS:
      return true;
    default:
      return false;
  }
}

// export default function reducer(state: StoreState, action: Action): StoreState | null {
//     if (!haveReducer(action)) {
//         return null;
//     }
//     if (!state.views.viewOrgView.viewModel) {
//         return state;
//     }
//     if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
//         return state;
//     }
//     const viewState: RequestNarrativeViewModel = state.views.viewOrgView.viewModel.subViews.requestNarrativeView;
//     const newViewState = localReducer(viewState, action);
//     if (newViewState === null) {
//         return null;
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
//                         requestNarrativeView: newViewState
//                     }
//                 }
//             }
//         }
//     };
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
      SubViewKind.ADD_NARRATIVE
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
