import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";
import { Action } from "redux";
import { ActionFlag } from "../actions";
import {
  AddOrgEvaluateErrors,
  AddOrgEvaluateOK,
  LoadError,
  LoadStart,
  LoadSuccess,
  SaveError,
  SaveStart,
  SaveSuccess,
  Unload,
  UpdateDescriptionError,
  UpdateDescriptionSuccess,
  UpdateHomeUrlError,
  UpdateHomeUrlSuccess,
  UpdateIdError,
  UpdateIdPass,
  UpdateIdSuccess,
  UpdateIsPrivateSuccess,
  UpdateLogoUrlError,
  UpdateLogoUrlSuccess,
  UpdateNameError,
  UpdateNameSuccess,
  UpdateResearchInterestsError,
  UpdateResearchInterestsSuccess,
} from "../actions/addOrg";
import { StoreState } from "../store/types";
import {
  AsyncModelState,
  EditState,
  SaveState,
  SyncState,
  ValidationErrorType,
} from "../store/types/common";
import {
  AddOrgModel,
  AddOrgViewModel,
} from "../store/types/views/Main/views/AddOrg";

// ADD ORG

export function loadStart(
  _state: AddOrgViewModel,
  _action: LoadStart,
): AddOrgViewModel {
  return {
    loadingState: AsyncModelState.LOADING,
  };
}

export function loadSuccess(
  _state: AddOrgViewModel,
  action: LoadSuccess,
): AddOrgViewModel {
  return {
    loadingState: AsyncModelState.SUCCESS,
    value: {
      editState: EditState.UNEDITED,
      validationState: {
        type: ValidationErrorType.OK,
        validatedAt: new Date(),
      },
      saveState: SaveState.NEW,
      error: null,
      newOrganization: action.newOrganization,
    },
  };
}
export function loadError(
  _state: AddOrgViewModel,
  action: LoadError,
): AddOrgViewModel {
  return {
    loadingState: AsyncModelState.ERROR,
    error: action.error,
  };
}

export function unload(
  _state: AddOrgViewModel,
  _action: Unload,
): AddOrgViewModel {
  return {
    loadingState: AsyncModelState.NONE,
  };
}

// Saving
export function saveStart(state: AddOrgModel, _action: SaveStart): AddOrgModel {
  return {
    ...state,
    saveState: SaveState.SAVING,
  };
}

export function saveSuccess(
  state: AddOrgModel,
  _action: SaveSuccess,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.UNEDITED,
    saveState: SaveState.SAVED,
  };
}

export function saveError(state: AddOrgModel, action: SaveError): AddOrgModel {
  return {
    ...state,
    saveState: SaveState.SAVE_ERROR,
    error: action.error,
  };
}

export function addOrgEvaluateOk(
  state: AddOrgModel,
  _action: AddOrgEvaluateOK,
): AddOrgModel {
  return {
    ...state,
    validationState: {
      type: ValidationErrorType.OK,
      validatedAt: new Date(),
    },
  };
}

export function addOrgEvaluateErrors(
  state: AddOrgModel,
  _action: AddOrgEvaluateErrors,
): AddOrgModel {
  return {
    ...state,
    validationState: {
      type: ValidationErrorType.ERROR,
      message: "TODO: form error",
      validatedAt: new Date(),
    },
  };
}

// Name
export function updateNameSuccess(
  state: AddOrgModel,
  action: UpdateNameSuccess,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      name: {
        ...state.newOrganization.name,
        value: action.name,
        syncState: SyncState.DIRTY,
        validationState: {
          type: ValidationErrorType.OK,
          validatedAt: new Date(),
        },
      },
    },
  };
}

export function updateNameError(
  state: AddOrgModel,
  action: UpdateNameError,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      name: {
        ...state.newOrganization.name,
        value: action.name,
        syncState: SyncState.DIRTY,
        validationState: action.error,
      },
    },
  };
}

// Logo URL
export function updateLogoUrlSuccess(
  state: AddOrgModel,
  action: UpdateLogoUrlSuccess,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      logoUrl: {
        ...state.newOrganization.logoUrl,
        syncState: SyncState.DIRTY,
        value: action.logoUrl,
        validationState: {
          type: ValidationErrorType.OK,
          validatedAt: new Date(),
        },
      },
    },
  };
}

export function updateLogoUrlError(
  state: AddOrgModel,
  action: UpdateLogoUrlError,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      logoUrl: {
        ...state.newOrganization.logoUrl,
        syncState: SyncState.DIRTY,
        value: action.logoUrl,
        validationState: action.error,
      },
    },
  };
}

// Home URL
export function updateHomeUrlSuccess(
  state: AddOrgModel,
  action: UpdateHomeUrlSuccess,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      homeUrl: {
        ...state.newOrganization.homeUrl,
        syncState: SyncState.DIRTY,
        value: action.homeUrl,
        validationState: {
          type: ValidationErrorType.OK,
          validatedAt: new Date(),
        },
      },
    },
  };
}

export function updateHomeUrlError(
  state: AddOrgModel,
  action: UpdateHomeUrlError,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      homeUrl: {
        ...state.newOrganization.homeUrl,
        syncState: SyncState.DIRTY,
        value: action.homeUrl,
        validationState: action.error,
      },
    },
  };
}

// Research Interests
export function updateResearchInterestsSuccess(
  state: AddOrgModel,
  action: UpdateResearchInterestsSuccess,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      researchInterests: {
        ...state.newOrganization.researchInterests,
        syncState: SyncState.DIRTY,
        value: action.researchInterests,
        validationState: {
          type: ValidationErrorType.OK,
          validatedAt: new Date(),
        },
      },
    },
  };
}

export function updateResearchInterestsError(
  state: AddOrgModel,
  action: UpdateResearchInterestsError,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      researchInterests: {
        ...state.newOrganization.researchInterests,
        syncState: SyncState.DIRTY,
        value: action.researchInterests,
        validationState: action.error,
      },
    },
  };
}

// Id

export function updateIdSuccess(
  state: AddOrgModel,
  _action: UpdateIdSuccess,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      id: {
        ...state.newOrganization.id,
        syncState: SyncState.DIRTY,
        validationState: {
          type: ValidationErrorType.OK,
          validatedAt: new Date(),
        },
      },
    },
  };
}

export function updateIdError(
  state: AddOrgModel,
  action: UpdateIdError,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      id: {
        ...state.newOrganization.id,
        value: action.id,
        syncState: SyncState.DIRTY,
        validationState: action.error,
      },
    },
  };
}

export function updateIdPass(
  state: AddOrgModel,
  action: UpdateIdPass,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      id: {
        ...state.newOrganization.id,
        value: action.id,
        syncState: SyncState.DIRTY,
      },
    },
  };
}

export function updateDescriptionSuccess(
  state: AddOrgModel,
  action: UpdateDescriptionSuccess,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      description: {
        ...state.newOrganization.description,
        value: action.description,
        syncState: SyncState.DIRTY,
        validationState: {
          type: ValidationErrorType.OK,
          validatedAt: new Date(),
        },
      },
    },
  };
}

export function updateDescriptionError(
  state: AddOrgModel,
  action: UpdateDescriptionError,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      description: {
        ...state.newOrganization.description,
        value: action.description,
        syncState: SyncState.DIRTY,
        validationState: action.error,
      },
    },
  };
}

export function updateIsPrivateSuccess(
  state: AddOrgModel,
  action: UpdateIsPrivateSuccess,
): AddOrgModel {
  return {
    ...state,
    editState: EditState.EDITED,
    newOrganization: {
      ...state.newOrganization,
      isPrivate: {
        ...state.newOrganization.isPrivate,
        value: action.isPrivate,
        syncState: SyncState.DIRTY,
        validationState: {
          type: ValidationErrorType.OK,
          validatedAt: new Date(),
        },
      },
    },
  };
}

export function haveReducer(actionType: ActionFlag): boolean {
  switch (actionType) {
    case ActionFlag.ADD_ORG_SAVE:
    case ActionFlag.ADD_ORG_SAVE_SUCCESS:
    case ActionFlag.ADD_ORG_SAVE_ERROR:
    case ActionFlag.ADD_ORG_LOAD_START:
    case ActionFlag.ADD_ORG_LOAD_SUCCESS:
    case ActionFlag.ADD_ORG_LOAD_ERROR:
    case ActionFlag.ADD_ORG_UNLOAD:
    case ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS:
    case ActionFlag.ADD_ORG_UPDATE_NAME_ERROR:
    case ActionFlag.ADD_ORG_UPDATE_LOGO_URL_SUCCESS:
    case ActionFlag.ADD_ORG_UPDATE_LOGO_URL_ERROR:
    case ActionFlag.ADD_ORG_UPDATE_HOME_URL_SUCCESS:
    case ActionFlag.ADD_ORG_UPDATE_HOME_URL_ERROR:
    case ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS:
    case ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_ERROR:
    case ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS:
    case ActionFlag.ADD_ORG_UPDATE_ID_ERROR:
    case ActionFlag.ADD_ORG_UPDATE_ID_PASS:
    case ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS:
    case ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR:
    case ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_SUCCESS:
    case ActionFlag.ADD_ORG_EVALUATE_OK:
    case ActionFlag.ADD_ORG_EVALUATE_ERRORS:
      return true;
    default:
      return false;
  }
}

export function localReducerViewModel(
  state: AddOrgViewModel,
  action: Action,
): AddOrgViewModel | null {
  // NB using discriminant union nature of the ActionX types to narrow
  // the type.
  // NB Did It!

  switch (action.type) {
    case ActionFlag.ADD_ORG_LOAD_START:
      return loadStart(state, action as LoadStart);
    case ActionFlag.ADD_ORG_LOAD_SUCCESS:
      return loadSuccess(state, action as LoadSuccess);
    case ActionFlag.ADD_ORG_LOAD_ERROR:
      return loadError(state, action as LoadError);
    case ActionFlag.ADD_ORG_UNLOAD:
      return unload(state, action as Unload);

    default:
      return null;
  }
}

export function localReducerModel(
  state: AddOrgModel,
  action: Action,
): AddOrgModel | null {
  // NB using discriminant union nature of the ActionX types to narrow
  // the type.

  switch (action.type) {
    case ActionFlag.ADD_ORG_SAVE:
      return saveStart(state, action as SaveStart);
    case ActionFlag.ADD_ORG_SAVE_SUCCESS:
      return saveSuccess(state, action as SaveSuccess);
    case ActionFlag.ADD_ORG_SAVE_ERROR:
      return saveError(state, action as SaveError);

    case ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS:
      return updateNameSuccess(state, action as UpdateNameSuccess);
    case ActionFlag.ADD_ORG_UPDATE_NAME_ERROR:
      return updateNameError(state, action as UpdateNameError);

    case ActionFlag.ADD_ORG_UPDATE_LOGO_URL_SUCCESS:
      return updateLogoUrlSuccess(state, action as UpdateLogoUrlSuccess);
    case ActionFlag.ADD_ORG_UPDATE_LOGO_URL_ERROR:
      return updateLogoUrlError(state, action as UpdateLogoUrlError);

    case ActionFlag.ADD_ORG_UPDATE_HOME_URL_SUCCESS:
      return updateHomeUrlSuccess(state, action as UpdateHomeUrlSuccess);
    case ActionFlag.ADD_ORG_UPDATE_HOME_URL_ERROR:
      return updateHomeUrlError(state, action as UpdateHomeUrlError);

    case ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS:
      return updateResearchInterestsSuccess(
        state,
        action as UpdateResearchInterestsSuccess,
      );
    case ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_ERROR:
      return updateResearchInterestsError(
        state,
        action as UpdateResearchInterestsError,
      );

    case ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS:
      return updateIdSuccess(state, action as UpdateIdSuccess);
    case ActionFlag.ADD_ORG_UPDATE_ID_ERROR:
      return updateIdError(state, action as UpdateIdError);
    case ActionFlag.ADD_ORG_UPDATE_ID_PASS:
      return updateIdPass(state, action as UpdateIdPass);

    case ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS:
      return updateDescriptionSuccess(
        state,
        action as UpdateDescriptionSuccess,
      );
    case ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR:
      return updateDescriptionError(state, action as UpdateDescriptionError);

    case ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_SUCCESS:
      return updateIsPrivateSuccess(state, action as UpdateIsPrivateSuccess);

    case ActionFlag.ADD_ORG_EVALUATE_OK:
      return addOrgEvaluateOk(state, action as AddOrgEvaluateOK);
    case ActionFlag.ADD_ORG_EVALUATE_ERRORS:
      return addOrgEvaluateErrors(state, action as AddOrgEvaluateErrors);
    default:
      return null;
  }
}

export default function reducer(
  state: StoreState,
  action: Action,
): StoreState | null {
  if (!haveReducer(action.type)) {
    return null;
  }

  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    return null;
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    return null;
  }

  // if (state.view.value.kind !== ViewKind.ADD_ORG) {
  //     return null;
  // }

  const newViewModel = localReducerViewModel(
    state.view.value.views.addOrg,
    action,
  );
  if (newViewModel) {
    return {
      ...state,
      view: {
        ...state.view,
        value: {
          ...state.view.value,
          views: {
            ...state.view.value.views,
            addOrg: newViewModel,
          },
        },
      },
    };
  }

  if (state.view.value.views.addOrg.loadingState !== AsyncModelState.SUCCESS) {
    return null;
  }

  const newModel = localReducerModel(
    state.view.value.views.addOrg.value,
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
            addOrg: {
              ...state.view.value.views.addOrg,
              value: newModel,
            },
          },
        },
      },
    };
  }
  return null;
}
