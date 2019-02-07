import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from './index'
import * as types from '../../types'
import IFrameSimulator from '../../lib/IFrameSimulator';
import { IFrameIntegration } from '../../lib/IFrameIntegration';

import { } from 'react-router-dom';

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
        let integration = new IFrameIntegration();
        let iframeParams = integration.getParamsFromIFrame();


        if (iframeParams) {
            let defaultPath

            // set up the message bus.
            let channelId = iframeParams.channelId;
            console.log('channel', channelId);

            // route from paths passed in from kbase-ui
            switch (iframeParams.params.view) {
                case 'org':
                    defaultPath = '/viewOrganization/' + iframeParams.params.viewParams.id
                    window.history.pushState(null, 'test', defaultPath)
                    break
                default:
                    defaultPath = '/organizations'
                    window.history.pushState(null, 'organizations', '/organizations')
                    break
            }

            // suck up all the params into our state.
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
                },
                defaultPath,
                channelId
            }))

        } else {
            iframeParams = new IFrameSimulator().getParamsFromIFrame()
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
                },
                defaultPath: '/organizations',
                channelId: null
            }))
        }
    }
}
