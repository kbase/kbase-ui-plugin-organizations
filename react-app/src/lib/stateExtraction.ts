import { StoreState } from "../redux/store/types";
import { AsyncModelState } from "../redux/store/types/common";
import {
  ViewAccessibleOrgViewModel,
  ViewInaccessiblePrivateOrgViewModel,
  ViewOrgSubView,
  ViewOrgViewModelKind,
} from "../redux/store/types/views/Main/views/ViewOrg";
import { AppConfig } from "@kbase/ui-components";
import { BrowseOrgsViewModel } from "../redux/store/types/views/Main/views/BrowseOrgs";
import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";

export function extractViewOrgSubView(state: StoreState): ViewOrgSubView {
  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    throw new Error("Not authenticated.");
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  if (
    state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL
  ) {
    throw new Error("Wrong model");
  }

  const {
    view: {
      value: {
        views: {
          viewOrg: {
            value: {
              subView,
            },
          },
        },
      },
    },
  } = state;

  // return state.view.value.model.value.subView;
  return subView;
}

export function extractViewOrgModel(
  state: StoreState,
): ViewAccessibleOrgViewModel {
  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    throw new Error("Not authenticated.");
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
  //     throw new Error('Not in view orgs view');
  // }

  if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  if (
    state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL
  ) {
    throw new Error("Wrong model");
  }

  const {
    view: {
      value: {
        views: {
          viewOrg: {
            value,
          },
        },
      },
    },
  } = state;

  // return state.view.value.model.value.subView;
  return value;
}

export function extractViewOrgModel2(
  state: StoreState,
): ViewAccessibleOrgViewModel | ViewInaccessiblePrivateOrgViewModel {
  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    throw new Error("Not authenticated.");
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
  //     throw new Error('Not in view orgs view');
  // }

  if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  // if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
  //     throw new Error('Wrong model');
  // }

  const {
    view: {
      value: {
        views: {
          viewOrg: {
            value,
          },
        },
      },
    },
  } = state;

  // return state.view.value.model.value.subView;
  return value;
}

export function extractBrowseOrgsViewModel(state: StoreState): {
  viewModel: BrowseOrgsViewModel;
  token: string;
  username: string;
  config: AppConfig;
} {
  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    throw new Error("Not authenticated.");
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  // if (state.view.value.kind !== ViewKind.BROWSE_ORGS) {
  //     throw new Error('Not in view orgs view');
  // }

  // if (state.view.value.model.loadingState !== AsyncModelState.SUCCESS) {
  //     throw new Error('Async model not loaded!');
  // }

  // const {
  //     view: {
  //         value: {
  //             model
  //         }
  //     }
  // } = state;

  // return state.view.value.model.value.subView;
  // return model;

  const {
    authentication: { userAuthentication: { token, username } },
    app: { config },
    view: {
      value: {
        views: {
          browseOrgs,
        },
      },
    },
  } = state;

  // return state.view.value.model.value.subView;
  return { viewModel: browseOrgs, token, username, config };
}

export function extractAppInfo(state: StoreState): {
  token: string;
  username: string;
  config: AppConfig;
} {
  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    throw new Error("Not authenticated.");
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Main async model not loaded!");
  }

  // if (state.view.value.kind !== ViewKind.BROWSE_ORGS) {
  //     throw new Error('Not in view orgs view');
  // }

  // if (state.view.value.model.loadingState !== AsyncModelState.SUCCESS) {
  //     throw new Error('Async model not loaded!');
  // }

  // const {
  //     view: {
  //         value: {
  //             model
  //         }
  //     }
  // } = state;

  // return state.view.value.model.value.subView;
  // return model;

  const {
    authentication: { userAuthentication: { token, username } },
    app: { config },
  } = state;

  // return state.view.value.model.value.subView;
  return { token, username, config };
}

export function extractBrowseOrgsModel(state: StoreState) {
  const { viewModel, config, username, token } = extractBrowseOrgsViewModel(
    state,
  );

  if (viewModel.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Not loaded");
  }

  return { model: viewModel.value, config, username, token };
}

export function extractAddOrgModel(state: StoreState) {
  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    throw new Error("Not authenticated.");
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  // if (state.view.value.kind !== ViewKind.ADD_ORG) {
  //     throw new Error('Not in view orgs view');
  // }

  if (state.view.value.views.addOrg.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  const {
    view: {
      value: {
        views: {
          addOrg: {
            value,
          },
        },
      },
    },
  } = state;

  // return state.view.value.model.value.subView;
  return value;
}

export function extractManageOrganizationRequestsModel(state: StoreState) {
  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    throw new Error("Not authenticated.");
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  // if (state.view.value.kind !== ViewKind.MANAGE_ORGANIZATION_REQUESTS) {
  //     throw new Error('Not in view orgs view');
  // }

  if (
    state.view.value.views.manageRequests.loadingState !==
      AsyncModelState.SUCCESS
  ) {
    throw new Error("Async model not loaded!");
  }

  const {
    view: {
      value: {
        views: {
          manageRequests: {
            value,
          },
        },
      },
    },
  } = state;

  // return state.view.value.model.value.subView;
  return value;
}

// export function extractEditOrgModel(state: StoreState) {
//     if (state.auth.userAuthorization === null) {
//         throw new Error('Not authorized.');
//     }

//     if (state.view.loadingState !== AsyncModelState.SUCCESS) {
//         throw new Error('Async model not loaded!');
//     }

//     if (state.view.value.kind !== ViewKind.) {
//         throw new Error('Not in view orgs view');
//     }

//     if (state.view.value.model.loadingState !== AsyncModelState.SUCCESS) {
//         throw new Error('Async model not loaded!');
//     }

//     const {
//         view: {
//             value: {
//                 model: {
//                     value
//                 }
//             }
//         }
//     } = state;

//     // return state.view.value.model.value.subView;
//     return value;
// }

export function extractViewOrgModelPlus(state: StoreState): {
  viewModel: ViewAccessibleOrgViewModel;
  token: string;
  username: string;
  config: AppConfig;
} {
  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    throw new Error("Not authenticated.");
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
  //     throw new Error('Not in view orgs view');
  // }

  if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  if (
    state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL
  ) {
    throw new Error("Wrong model");
  }

  const {
    authentication: { userAuthentication: { token, username } },
    app: { config },
    view: {
      value: {
        views: {
          viewOrg: {
            value,
          },
        },
      },
    },
  } = state;

  // return state.view.value.model.value.subView;
  return { viewModel: value, token, username, config };
}

export function extractViewOrgModelPlus2(state: StoreState): {
  viewModel: ViewAccessibleOrgViewModel | ViewInaccessiblePrivateOrgViewModel;
  token: string;
  username: string;
  config: AppConfig;
} {
  if (state.authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    throw new Error("Not authenticated.");
  }

  if (state.view.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
  //     throw new Error('Not in view orgs view');
  // }

  if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
    throw new Error("Async model not loaded!");
  }

  if (
    state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL &&
    state.view.value.views.viewOrg.value.kind !==
      ViewOrgViewModelKind.PRIVATE_INACCESSIBLE
  ) {
    throw new Error("Wrong model");
  }

  const {
    authentication: { userAuthentication: { token, username } },
    app: { config },
    view: {
      value: {
        views: {
          viewOrg: {
            value,
          },
        },
      },
    },
  } = state;

  // return state.view.value.model.value.subView;
  return { viewModel: value, token, username, config };
}
