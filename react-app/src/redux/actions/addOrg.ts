import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { StoreState } from "../store/types";
import { ActionFlag } from "./index";

import { AppError } from "@kbase/ui-components";
import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";
import { JSONRPC11Exception } from "@kbase/ui-lib/lib/comm/JSONRPC11/JSONRPC11";
import { UIServiceClient } from "../../data/apis/uiService";
import * as orgModel from "../../data/models/organization/model";
import Validation from "../../data/models/organization/validation";
import DebouncingProcess from "../../lib/DebouncingProcess";
import { extractAddOrgModel, extractAppInfo } from "../../lib/stateExtraction";
import {
  EditableOrganization,
  SyncState,
  ValidationErrorType,
  ValidationState
} from "../store/types/common";

// ACTIONS

export interface Save extends Action<ActionFlag.ADD_ORG_SAVE> {
  type: ActionFlag.ADD_ORG_SAVE;
}

export interface SaveStart extends Action<ActionFlag.ADD_ORG_SAVE_START> {
  type: ActionFlag.ADD_ORG_SAVE_START;
}

export interface SaveSuccess extends Action<ActionFlag.ADD_ORG_SAVE_SUCCESS> {
  type: ActionFlag.ADD_ORG_SAVE_SUCCESS;
  organization: orgModel.Organization;
}

export interface SaveError extends Action<ActionFlag.ADD_ORG_SAVE_ERROR> {
  type: ActionFlag.ADD_ORG_SAVE_ERROR;
  error: AppError;
}

// Editing

export interface Load extends Action<ActionFlag.ADD_ORG_LOAD> {
  type: ActionFlag.ADD_ORG_LOAD;
}

export interface LoadStart {
  type: ActionFlag.ADD_ORG_LOAD_START;
}

export interface LoadSuccess {
  type: ActionFlag.ADD_ORG_LOAD_SUCCESS;
  newOrganization: EditableOrganization;
}

export interface LoadError {
  type: ActionFlag.ADD_ORG_LOAD_ERROR;
  error: AppError;
}

export interface Unload {
  type: ActionFlag.ADD_ORG_UNLOAD;
}

// Evaluating state of form

export interface AddOrgEvaluate extends Action<ActionFlag.ADD_ORG_EVALUATE> {
  type: ActionFlag.ADD_ORG_EVALUATE;
}

export interface AddOrgEvaluateOK
  extends Action<ActionFlag.ADD_ORG_EVALUATE_OK> {
  type: ActionFlag.ADD_ORG_EVALUATE_OK;
}

export interface AddOrgEvaluateErrors
  extends Action<ActionFlag.ADD_ORG_EVALUATE_ERRORS> {
  type: ActionFlag.ADD_ORG_EVALUATE_ERRORS;
}

// Updating name field

export interface UpdateName extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_NAME;
  name: string;
}

export interface UpdateNameSuccess {
  type: ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS;
  name: string;
}

export interface UpdateNameError extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_NAME_ERROR;
  name: string;
  error: ValidationState;
}

// Updating logo url field

export interface UpdateLogoUrl extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL;
  name: string;
}

export interface UpdateLogoUrlSuccess {
  type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL_SUCCESS;
  logoUrl: string | null;
}

export interface UpdateLogoUrlError extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL_ERROR;
  logoUrl: string | null;
  error: ValidationState;
}

// Updating home url field
export interface UpdateHomeUrl extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_HOME_URL;
  homeUrl: string | null;
}

export interface UpdateHomeUrlSuccess extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_HOME_URL_SUCCESS;
  homeUrl: string | null;
}

export interface UpdateHomeUrlError extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_HOME_URL_ERROR;
  homeUrl: string | null;
  error: ValidationState;
}

// Updating research interests field
export interface UpdateResearchInterests extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS;
  researchInterests: string;
}

export interface UpdateResearchInterestsSuccess extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS;
  researchInterests: string;
}

export interface UpdateResearchInterestsError extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_ERROR;
  researchInterests: string;
  error: ValidationState;
}

// Updating id Field

export interface UpdateId extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_ID;
  id: string;
}

export interface UpdateIdSuccess {
  type: ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS;
  id: string;
}

export interface UpdateIdError extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_ID_ERROR;
  id: string;
  error: ValidationState;
}

export interface UpdateIdPass extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_ID_PASS;
  id: string;
}

// Updating description field

export interface UpdateDescription extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION;
  description: string;
}

export interface UpdateDescriptionSuccess {
  type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS;
  description: string;
}

export interface UpdateDescriptionError extends Action {
  type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR;
  description: string;
  error: ValidationState;
}

// Update is private field

export interface UpdateIsPrivate
  extends Action<ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE> {
  type: ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE;
  isPrivate: boolean;
}

export interface UpdateIsPrivateSuccess
  extends Action<ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_SUCCESS> {
  type: ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_SUCCESS;
  isPrivate: boolean;
}

export interface UpdateIsPrivateError
  extends Action<ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_ERROR> {
  type: ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_ERROR;
  error: ValidationState;
}

// ACTION CREATORS

export function saveStart(): SaveStart {
  return {
    type: ActionFlag.ADD_ORG_SAVE_START,
  };
}

export function saveSuccess(org: orgModel.Organization): SaveSuccess {
  return {
    type: ActionFlag.ADD_ORG_SAVE_SUCCESS,
    organization: org,
  };
}

export function saveError(error: AppError): SaveError {
  return {
    type: ActionFlag.ADD_ORG_SAVE_ERROR,
    error: error,
  };
}

// Editing

function loadStart() {
  return {
    type: ActionFlag.ADD_ORG_LOAD_START,
  };
}

function loadSuccess(newOrganization: EditableOrganization) {
  return {
    type: ActionFlag.ADD_ORG_LOAD_SUCCESS,
    newOrganization: newOrganization,
  };
}

// function loadError(error: AppError) {
//     return {
//         type: ActionFlag.ADD_ORG_LOAD_ERROR,
//         error: error
//     };
// }

export function unload() {
  return {
    type: ActionFlag.ADD_ORG_UNLOAD,
  };
}

// Evaluate

export function addOrgEvaluateOk(): AddOrgEvaluateOK {
  return {
    type: ActionFlag.ADD_ORG_EVALUATE_OK,
  };
}

export function addOrgEvaluateErrors(): AddOrgEvaluateErrors {
  return {
    type: ActionFlag.ADD_ORG_EVALUATE_ERRORS,
  };
}

// Update Name

export function updateNameSuccess(name: string): UpdateNameSuccess {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_NAME_SUCCESS,
    name: name,
  };
}

export function updateNameError(
  name: string,
  error: ValidationState,
): UpdateNameError {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_NAME_ERROR,
    name: name,
    error: error,
  };
}

export function updateIdSuccess(id: string): UpdateIdSuccess {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_ID_SUCCESS,
    id: id,
  };
}

export function updateIdPass(id: string): UpdateIdPass {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_ID_PASS,
    id: id,
  };
}

// Update Logo URL Hash

export function updateLogoUrlSuccess(
  logoUrl: string | null,
): UpdateLogoUrlSuccess {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL_SUCCESS,
    logoUrl: logoUrl,
  };
}

export function updateLogoUrlError(
  logoUrl: string | null,
  error: ValidationState,
): UpdateLogoUrlError {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL_ERROR,
    logoUrl: logoUrl,
    error: error,
  };
}

// Update Home URL Hash

export function updateHomeUrlSuccess(
  logoUrl: string | null,
): UpdateHomeUrlSuccess {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_HOME_URL_SUCCESS,
    homeUrl: logoUrl,
  };
}

export function updateHomeUrlError(
  logoUrl: string | null,
  error: ValidationState,
): UpdateHomeUrlError {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_HOME_URL_ERROR,
    homeUrl: logoUrl,
    error: error,
  };
}

// Update Id

export function updateIdError(
  id: string,
  error: ValidationState,
): UpdateIdError {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_ID_ERROR,
    id: id,
    error: error,
  };
}

export function updateDescriptionSuccess(
  description: string,
): UpdateDescriptionSuccess {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_SUCCESS,
    description: description,
  };
}

export function updateDescriptionError(
  description: string,
  error: ValidationState,
): UpdateDescriptionError {
  return {
    type: ActionFlag.ADD_ORG_UPDATE_DESCRIPTION_ERROR,
    description: description,
    error: error,
  };
}

// ACTION THUNKS

export function load() {
  return (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    dispatch(loadStart());

    const newOrg: EditableOrganization = {
      id: {
        value: "",
        remoteValue: null,
        syncState: SyncState.CLEAN,
        validationState: Validation.validateOrgId("")[1],
      },
      name: {
        value: "",
        remoteValue: null,
        syncState: SyncState.CLEAN,
        validationState: Validation.validateOrgName("")[1],
      },
      logoUrl: {
        value: "",
        remoteValue: null,
        syncState: SyncState.CLEAN,
        validationState: Validation.validateOrgLogoUrl("")[1],
      },
      homeUrl: {
        value: "",
        remoteValue: null,
        syncState: SyncState.CLEAN,
        validationState: Validation.validateOrgHomeUrl("")[1],
      },
      researchInterests: {
        value: "",
        remoteValue: null,
        syncState: SyncState.CLEAN,
        validationState: Validation.validateOrgResearchInterests("")[1],
      },
      description: {
        value: "",
        remoteValue: null,
        syncState: SyncState.CLEAN,
        validationState: Validation.validateOrgDescription("")[1],
      },
      isPrivate: {
        value: false,
        remoteValue: null,
        syncState: SyncState.CLEAN,
        validationState: {
          type: ValidationErrorType.OK,
          validatedAt: new Date(),
        },
      },
    };
    dispatch(loadSuccess(newOrg));
    dispatch(addOrgEvaluate());
  };
}

// function ensureViewModel(state: StoreState) {
//     const subView = extractAddOrgModel(state);

//     if (subView.kind !== SubViewKind.REQUEST_NARRATIVE) {
//         throw new Error('Wrong subview');
//     }

//     if (subView.model.loadingState !== AsyncModelState.SUCCESS) {
//         throw new Error('Wrong async state');
//     }

//     return subView.model.value;
// }

export function addOrg() {
  return (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    const state = getState();

    // // This check is to satisfy TS. Since viewModel is nullable, it has no way
    // // of knowing that our app flow ensures that it is populated.
    // // In terms of generalized usage of the redux store, though, there is no
    // // way to ensure this! So we really should perform our state checks before
    // // handling any event
    // if (!state.views.addOrgView.viewModel) {
    //     dispatch(
    //         saveError({
    //             code: 'invalid',
    //             message: 'Unexpected condition: no view model'
    //         })
    //     );
    //     return;
    // }

    // // TODO: other validations!!!

    // dispatch(saveStart());

    // const {
    //     auth: {
    //         userAuthorization
    //     },
    //     views: {
    //         addOrgView: {
    //             viewModel: { newOrganization }
    //         }
    //     },
    //     app: { config }
    // } = state;

    // if (userAuthorization === null) {
    //     throw new Error('Unauthorized');
    // }
    // const { token, username } = userAuthorization;

    const { newOrganization } = extractAddOrgModel(state);
    const { username, token, config } = extractAppInfo(getState());

    // const orgClient = new orgModel.OrganizationModel({
    //     token,
    //     username,
    //     groupsServiceURL: config.services.Groups.url,
    //     userProfileServiceURL: config.services.UserProfile.url
    // });

    const orgClient = new orgModel.OrganizationModel({
      token,
      username,
      groupsServiceURL: config.services.Groups.url,
      userProfileServiceURL: config.services.UserProfile.url,
    });

    if (!newOrganization) {
      dispatch(
        saveError({
          code: "app",
          message: "The new organization data does not yet exist",
        }),
      );
      return;
    }

    orgClient
      .addOrg(newOrganization, username)
      .then((org: orgModel.Organization) => {
        dispatch(saveSuccess(org));
      })
      .catch((error) => {
        console.error("error adding", newOrganization, error);

        // note that we dispatch an AppError compliant object,
        // which wraps the original exception object.
        dispatch(
          saveError({
            code: error.code || error.name,
            message: error.message,
          }),
        );
      });
  };
}

export function addOrgEvaluate() {
  return (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    const state = getState();

    const { newOrganization } = extractAddOrgModel(state);

    if (newOrganization.name.validationState.type !== ValidationErrorType.OK) {
      dispatch(addOrgEvaluateErrors());
      return;
    }

    if (newOrganization.id.validationState.type !== ValidationErrorType.OK) {
      dispatch(addOrgEvaluateErrors());
      return;
    }

    // TODO: quick hack to allow unmodified fields to evaluate to true.

    if (
      newOrganization.logoUrl.validationState.type !== ValidationErrorType.OK
    ) {
      dispatch(addOrgEvaluateErrors());
      return;
    }

    if (
      newOrganization.homeUrl.validationState.type !== ValidationErrorType.OK
    ) {
      dispatch(addOrgEvaluateErrors());
      return;
    }

    if (
      newOrganization.researchInterests.validationState.type !==
        ValidationErrorType.OK
    ) {
      dispatch(addOrgEvaluateErrors());
      return;
    }

    if (
      newOrganization.description.validationState.type !==
        ValidationErrorType.OK
    ) {
      dispatch(addOrgEvaluateErrors());
      return;
    }

    dispatch(addOrgEvaluateOk());
  };
}

function orgModelFromState(state: StoreState) {
  const {
    authentication,
    app: { config },
  } = state;

  if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    throw new Error("Not authenticated.");
  }
  const { userAuthentication: { token, username } } = authentication;

  return new orgModel.OrganizationModel({
    token,
    username,
    groupsServiceURL: config.services.Groups.url,
    userProfileServiceURL: config.services.UserProfile.url,
  });
}

export function updateName(name: string) {
  return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
    const [validatedName, error] = Validation.validateOrgName(name);

    if (error.type !== ValidationErrorType.OK) {
      dispatch(updateNameError(validatedName, error));
    } else {
      dispatch(updateNameSuccess(validatedName));
    }
    dispatch(addOrgEvaluate());
  };
}

let checkLogoUrlProcess: DebouncingProcess;

class CheckIfLogoUrlExistsProcess extends DebouncingProcess {
  dispatch: ThunkDispatch<StoreState, void, Action>;
  url: string;
  timeout: number;
  serviceWizardURL: string;
  token: string;
  constructor({
    delay,
    dispatch,
    url,
    timeout,
    serviceWizardURL,
    token,
  }: {
    delay: number;
    dispatch: ThunkDispatch<StoreState, void, Action>;
    url: string;
    timeout: number;
    serviceWizardURL: string;
    token: string;
  }) {
    super({ delay });

    this.dispatch = dispatch;
    this.url = url;
    this.serviceWizardURL = serviceWizardURL;
    this.token = token;
    this.timeout = timeout;
  }

  async task(): Promise<void> {
    try {
      const client = new UIServiceClient({
        url: this.serviceWizardURL,
        token: this.token,
        timeout: this.timeout
      });
      const result = await client.checkImageURL({
        url: this.url,
        timeout: this.timeout,
      });

      if (this.canceled) {
        return;
      }

      if (result.is_valid) {
        this.dispatch(updateLogoUrlSuccess(this.url));
      } else {
        switch (result.error.code) {
          case "not-found":
            this.dispatch(
              updateLogoUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: "This logo url does not exist",
              }),
            );
            break;
          case "invalid-content-type":
            this.dispatch(
              updateLogoUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: "Invalid content type: " +
                  result.error.info["content_type"],
              }),
            );
            break;
          case "missing-content-type":
            this.dispatch(
              updateLogoUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: "Missing content type",
              }),
            );
            break;
          default:
            this.dispatch(
              updateLogoUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: "unknown error",
              }),
            );
            break;
        }
      }
    } catch (ex: any) {
      console.error("ERROR checking logo url", ex);
      if (this.canceled) {
        return;
      }
      this.dispatch(
        updateLogoUrlError(this.url, {
          type: ValidationErrorType.ERROR,
          validatedAt: new Date(),
          message: "Error checking logo url: " + ex.message,
        }),
      );
    }
    this.dispatch(addOrgEvaluate());
  }
}

export function updateLogoUrl(logoUrl: string | null) {
  return (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    if (checkLogoUrlProcess) {
      checkLogoUrlProcess.cancel();
    }

    const [validatedLogoUrl, error] = Validation.validateOrgLogoUrl(logoUrl);

    if (error.type !== ValidationErrorType.OK) {
      dispatch({
        type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL_ERROR,
        logoUrl: logoUrl,
        error: error,
      } as UpdateLogoUrlError);
      return;
    }

    // initial success, but the check may invalidate it.
    dispatch({
      type: ActionFlag.ADD_ORG_UPDATE_LOGO_URL_SUCCESS,
      logoUrl: validatedLogoUrl,
    });

    dispatch(addOrgEvaluate());

    if (validatedLogoUrl !== null && validatedLogoUrl.length > 0) {
      const {
        authentication,
        app: {
          config: {
            services: {
              ServiceWizard: { url: serviceWizardURL },
            },
          },
        },
      } = getState();

      if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
        throw new Error("Not authenticated.");
      }
      const { userAuthentication: { token } } = authentication;

      checkLogoUrlProcess = new CheckIfLogoUrlExistsProcess({
        delay: 100,
        url: validatedLogoUrl,
        timeout: 1000,
        dispatch,
        serviceWizardURL,
        token,
      });

      checkLogoUrlProcess.start();
    }
  };
}

// export function updateLogoUrl(name: string | null) {
//     return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
//         const [validatedLogoUrl, error] = Validation.validateOrgLogoUrl(name)

//         if (error.type !== ValidationErrorType.OK) {
//             dispatch(updateLogoUrlError(validatedLogoUrl, error))
//         } else {
//             dispatch(updateLogoUrlSuccess(validatedLogoUrl))
//         }
//         dispatch(addOrgEvaluate())
//     }
// }

let checkHomeUrlProcess: DebouncingProcess;

class CheckIfHomeUrlExistsProcess extends DebouncingProcess {
  dispatch: ThunkDispatch<StoreState, void, Action>;
  url: string;
  timeout: number;
  serviceWizardURL: string;
  token: string;
  constructor({
    delay,
    dispatch,
    url,
    timeout,
    serviceWizardURL,
    token,
  }: {
    delay: number;
    dispatch: ThunkDispatch<StoreState, void, Action>;
    url: string;
    timeout: number;
    serviceWizardURL: string;
    token: string;
  }) {
    super({ delay });

    this.dispatch = dispatch;
    this.url = url;
    this.serviceWizardURL = serviceWizardURL;
    this.token = token;
    this.timeout = timeout;
  }

  async task(): Promise<void> {
    try {
      const client = new UIServiceClient({
        url: this.serviceWizardURL,
        token: this.token,
        timeout: this.timeout
      });

      const result = await client.checkHTMLURL({
        url: this.url,
        timeout: this.timeout,
      });

      if (this.canceled) {
        return;
      }

      if (result.is_valid) {
        this.dispatch(updateHomeUrlSuccess(this.url));
      } else {
        switch (result.code) {
          case "not-found":
            this.dispatch(
              updateHomeUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: "This home url does not exist",
              }),
            );
            break;
          case "invalid-content-type":
            this.dispatch(
              updateHomeUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: "Invalid content type: " +
                  result.error.info["content_type"],
              }),
            );
            break;
          case "missing-content-type":
            this.dispatch(
              updateHomeUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: "Missing content type",
              }),
            );
            break;
        }
      }
    } catch (ex) {
        if (ex instanceof JSONRPC11Exception) {
            this.dispatch(
              updateHomeUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: ex.message,
              }),
            );
        } else if (ex instanceof Error) {
          this.dispatch(
              updateHomeUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: "Error checking home url: " + ex.message,
              }),
            );
        } else {
          this.dispatch(
              updateHomeUrlError(this.url, {
                type: ValidationErrorType.ERROR,
                validatedAt: new Date(),
                message: "Unknown error checking home url",
              }),
            );
        }
    }
    this.dispatch(addOrgEvaluate());
  }
}

export function updateHomeUrl(homeUrl: string | null) {
  return (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    if (checkHomeUrlProcess) {
      checkHomeUrlProcess.cancel();
    }

    const [validatedHomeUrl, error] = Validation.validateOrgHomeUrl(homeUrl);

    if (error.type !== ValidationErrorType.OK) {
      dispatch({
        type: ActionFlag.ADD_ORG_UPDATE_HOME_URL_ERROR,
        homeUrl: homeUrl,
        error: error,
      } as UpdateHomeUrlError);
      return;
    }

    // initial success, but the check may invalidate it.
    dispatch({
      type: ActionFlag.ADD_ORG_UPDATE_HOME_URL_SUCCESS,
      homeUrl: validatedHomeUrl,
    });

    dispatch(addOrgEvaluate());

    if (validatedHomeUrl !== null && validatedHomeUrl.length > 0) {
      const {
        authentication,
        app: {
          config: {
            services: {
              ServiceWizard: { url: serviceWizardURL },
            },
          },
        },
      } = getState();

      if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
        throw new Error("Not authenticated.");
      }
      const { userAuthentication: { token } } = authentication;

      checkHomeUrlProcess = new CheckIfHomeUrlExistsProcess({
        delay: 100,
        url: validatedHomeUrl,
        timeout: 1000,
        dispatch,
        serviceWizardURL,
        token,
      });

      checkHomeUrlProcess.start();
    }
  };
}

export function updateResearchInterests(researchInterests: string) {
  return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
    const [validatedResearchInterests, error] = Validation
      .validateOrgResearchInterests(researchInterests);

    if (error.type !== ValidationErrorType.OK) {
      dispatch({
        type: ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_ERROR,
        researchInterests: validatedResearchInterests,
        error: error,
      } as UpdateResearchInterestsError);
    } else {
      dispatch({
        type: ActionFlag.ADD_ORG_UPDATE_RESEARCH_INTERESTS_SUCCESS,
        researchInterests: validatedResearchInterests,
      } as UpdateResearchInterestsSuccess);
    }
  };
}

export function updateIsPrivate(isPrivate: boolean) {
  return (dispatch: ThunkDispatch<StoreState, void, Action>) => {
    // no validation for now ... what is there to validate?

    dispatch({
      type: ActionFlag.ADD_ORG_UPDATE_IS_PRIVATE_SUCCESS,
      isPrivate,
    });
    dispatch(addOrgEvaluate());
  };
}

class CheckIfExistsProcess extends DebouncingProcess {
  model: orgModel.OrganizationModel;
  dispatch: ThunkDispatch<StoreState, void, Action>;
  id: string;
  constructor({
    delay,
    model,
    dispatch,
    id,
  }: {
    delay: number;
    model: orgModel.OrganizationModel;
    dispatch: ThunkDispatch<StoreState, void, Action>;
    id: string;
  }) {
    super({ delay });

    this.model = model;
    this.dispatch = dispatch;
    this.id = id;
  }

  async task(): Promise<void> {
    try {
      const exists = await this.model.orgExists(this.id);
      if (this.canceled) {
        return;
      }
      if (exists) {
        this.dispatch(
          updateIdError(this.id, {
            type: ValidationErrorType.ERROR,
            validatedAt: new Date(),
            message: "This org id is already in use",
          }),
        );
      } else {
        this.dispatch(updateIdSuccess(this.id));
      }
    } catch (ex: any) {
      if (this.canceled) {
        return;
      }
      this.dispatch(
        updateIdError(this.id, {
          type: ValidationErrorType.ERROR,
          validatedAt: new Date(),
          message: "Error checking for org id existence: " + ex.message,
        }),
      );
    }
    this.dispatch(addOrgEvaluate());
  }
}

let checkIDProcess: DebouncingProcess;

/*
updateId

Handles updating an org id update from the new organization form.

This action handles the normal field validation, but also requires a check
that the org id is not in use. This requires an api call to the groups
service, which introduces an indeterminate latency, and thus special handling.
*/

export function updateId(id: string) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    if (checkIDProcess) {
      checkIDProcess.cancel();
    }

    const [validatedId, error] = Validation.validateOrgId(id);
    if (error.type !== ValidationErrorType.OK) {
      dispatch(updateIdError(validatedId, error));
      dispatch(addOrgEvaluate());
      return;
    }

    // this is an unusual action -- it is in intermediate "success" -- the field
    // has passed the synchronous syntax validation, so we need to feed the value
    // back to the form, but the eventual success occurs later.
    dispatch(updateIdPass(id));

    // const {newOrganization} = extractAddOrgModel(state);
    // const { viewModel: viewOrgViewModel, username, token, config } = extractViewOrgModelPlus(getState());

    // const {
    //     views: {
    //         addOrgView: { viewModel }
    //     }
    // } = getState();

    // if (!viewModel) {
    //     // do nothing
    //     return;
    // }

    // For the id existence check, we want to ensure that we don't trip up the
    // user experience.
    // Think of the org id check as an async process.
    // If that process is active when an update appears here, cancel it and proceed.
    // Launch an existence check process which will initiate the check after some
    // period of time (e.g. 100ms). This ensures that a fast typist will not trigger
    // a sequence of existence checks.
    // In that process, after the existence check, look to see if the process has
    // been canceled (see step 1 above). If so, do not issue any redux events.
    // Otherwise, issue the success or error events as appropriate.

    const model = orgModelFromState(getState());

    checkIDProcess = new CheckIfExistsProcess({
      delay: 100,
      id: validatedId,
      dispatch: dispatch,
      model: model,
    });

    checkIDProcess.start();
  };
}

export function updateDescription(description: string) {
  return (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    const [validatedDescription, error] = Validation.validateOrgDescription(
      description,
    );

    if (error.type !== ValidationErrorType.OK) {
      dispatch(updateDescriptionError(validatedDescription, error));
    } else {
      dispatch(updateDescriptionSuccess(validatedDescription));
    }
    dispatch(addOrgEvaluate());
  };
}
