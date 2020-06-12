import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { ActionFlag } from '../index';
import {
    StoreState
} from '../../../types';

import * as requestModel from '../../../data/models/requests';
import * as viewOrgActions from '../viewOrg';
import { AppError } from '@kbase/ui-components';
import { extractViewOrgModelPlus } from '../../../lib/stateExtraction';

export interface AcceptRequestAction<T> extends Action<T> {
}

export interface AcceptRequest extends AcceptRequestAction<ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST> {
    type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST;
    request: requestModel.Request;
}

interface AcceptRequestStart extends AcceptRequestAction<ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_START> {
    type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_START;
}

export interface AcceptRequestSuccess extends AcceptRequestAction<ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_SUCCESS> {
    type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_SUCCESS,
    requests: Array<requestModel.Request>;
}

interface AcceptRequestError extends AcceptRequestAction<ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR> {
    type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,
    error: AppError;
}

export function acceptRequest(requestId: requestModel.RequestID) {
    return async (dispatch: ThunkDispatch<StoreState, void, AcceptRequestAction<any>>, getState: () => StoreState) => {
        const { viewModel, username, token, config } = extractViewOrgModelPlus(getState());
        // if (state.auth.userAuthorization === null) {
        //     throw new Error('Not authorized.');
        // }

        // if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        //     throw new Error('Async model not loaded!');
        // }

        // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
        //     throw new Error('Not in view orgs view');
        // }

        // if (state.view.value.model.loadingState !== AsyncModelState.SUCCESS) {
        //     throw new Error('Async model not loaded!');
        // }

        // if (state.view.value.model.value.kind !== ViewOrgViewModelKind.NORMAL) {
        //     throw new Error('Wrong model');
        // }

        // const {
        //     auth: { userAuthorization: { token, username } },
        //     app: { config },
        //     view: {
        //         value: {
        //             model: {
        //                 value: viewModel
        //             }
        //         }
        //     }
        // } = state;

        // dispatch({
        //     type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,
        //     error: {
        //         code: 'error',
        //         message: 'No view model'
        //     }
        // });
        // return;


        // dispatch({
        //     type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,
        //     error: {
        //         code: 'invalid state',
        //         message: 'Not the right kind of view model'
        //     }
        // });
        // return;

        dispatch({
            type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_START
        });

        // const {
        //     auth: { userAuthorization },
        //     app: { config }
        // } = state;

        // if (userAuthorization === null) {
        //     throw new Error('Unauthorized');
        // }
        // const { token, username } = userAuthorization;

        // do the cancellation
        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        });

        try {
            const request = await requestClient.acceptRequest(requestId);

            // refetch the inbox
            const inbox = await requestClient.getCombinedRequestInboxForOrg(viewModel.organization.id);

            dispatch({
                type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_SUCCESS,
                requests: inbox
            });
            dispatch(viewOrgActions.reload(request.organizationId));
            // send the inbox in the success
        } catch (ex) {
            dispatch({
                type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,
                error: {
                    code: ex.name,
                    message: ex.message
                }
            });
        }

        // or error
    };
}

