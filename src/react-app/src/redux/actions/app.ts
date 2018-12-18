import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import * as types from '../../types'
import IFrameSimulator, { IFrameParams } from '../../lib/IFrameSimulator';
import { IFrameIntegration } from '../../lib/IFrameIntegration';

// Action Definitions

// export interface AppStart extends Action {
//     type: ActionFlag.APP_START,

// }

export interface AppSuccess extends Action {
    type: ActionFlag.APP_SUCCESS,
    config: types.AppConfig
}

export interface AppError extends Action {
    type: ActionFlag.APP_ERROR,
    error: AppError
}

// Action Creators

export function appSuccess(config: types.AppConfig): AppSuccess {
    return {
        type: ActionFlag.APP_SUCCESS,
        config: config
    }
}

export function appError(error: AppError): AppError {
    return {
        type: ActionFlag.APP_ERROR,
        error: error
    }
}

// Action Thunks

export function appStart() {
    return (dispatch: ThunkDispatch<types.StoreState, void, Action>, getState: () => types.StoreState) => {
        // check and see if we are in an iframe
        const iframeParams = new IFrameIntegration().getParamsFromIFrame()

        if (iframeParams) {
            dispatch(appSuccess({
                baseUrl: '',
                services: {
                    Groups: {
                        url: iframeParams.params.groupsServiceURL
                    },
                    UserProfile: {
                        url: iframeParams.params.userProfileServiceURL
                    },
                    Workspace: {
                        url: iframeParams.params.workspaceServiceURL
                    },
                    ServiceWizard: {
                        url: iframeParams.params.serviceWizardURL
                    },
                    Feeds: {
                        url: iframeParams.params.feedsServiceURL
                    },
                    Auth: {
                        url: iframeParams.params.authServiceURL
                    }
                }
            }))
        } else {
            const fakeIframeParams = new IFrameSimulator().getParamsFromIFrame()
            dispatch(appSuccess({
                baseUrl: '',
                services: {
                    Groups: {
                        url: fakeIframeParams.params.groupsServiceURL
                    },
                    UserProfile: {
                        url: fakeIframeParams.params.userProfileServiceURL
                    },
                    Workspace: {
                        url: fakeIframeParams.params.workspaceServiceURL
                    },
                    ServiceWizard: {
                        url: fakeIframeParams.params.serviceWizardURL
                    },
                    Feeds: {
                        url: fakeIframeParams.params.feedsServiceURL
                    },
                    Auth: {
                        url: fakeIframeParams.params.authServiceURL
                    }
                }
            }))
        }


        // if so, get the params

        // if not, use the fake to get it
    }
}
