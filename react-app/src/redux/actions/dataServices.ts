import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ActionFlag } from "./index";
import { AnError } from "../../lib/error";
import { StoreState } from "../store/types";

export interface Load extends Action<ActionFlag.DATA_SERVICE_LOAD> {
  type: ActionFlag.DATA_SERVICE_LOAD;
}

export interface LoadSuccess
  extends Action<ActionFlag.DATA_SERVICE_LOAD_SUCCESS> {
  type: ActionFlag.DATA_SERVICE_LOAD_SUCCESS;
}

export interface LoadError extends Action<ActionFlag.DATA_SERVICE_LOAD_ERROR> {
  type: ActionFlag.DATA_SERVICE_LOAD_ERROR;
  error: AnError;
}

// function loadError(error: AnError) {
//     return {
//         type: ActionFlag.DATA_SERVICE_LOAD_ERROR,
//         error: error
//     };
// }

export function load() {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState
  ) => {
    dispatch({
      type: ActionFlag.DATA_SERVICE_LOAD_START,
    });

    dispatch({
      type: ActionFlag.DATA_SERVICE_LOAD_SUCCESS,
    } as LoadSuccess);

    // const {
    //     auth: { authorization: { token, username } },
    //     app: { config } } = getState()

    // const userProfileClient = new userProfileModel.UserProfile({
    //     token, username,
    //     userProfileServiceURL: config.services.UserProfile.url
    // })

    // try {
    //     const userProfile = await userProfileClient.getProfile(username)

    //     dispatch({
    //         type: ActionFlag.DATA_SERVICE_LOAD_SUCCESS,
    //         profile: userProfile
    //     })
    // } catch (ex: any) {
    //     console.error('error', ex)
    //     dispatch(loadError(makeError({
    //         code: ex.name,
    //         message: ex.name
    //     })))
    // }
  };
}

export function unload() {
  return {
    type: ActionFlag.DATA_SERVICE_UNLOAD,
  };
}
