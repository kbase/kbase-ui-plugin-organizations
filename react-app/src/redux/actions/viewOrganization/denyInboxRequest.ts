import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { ActionFlag } from '../index';
import {
    StoreState
} from '../../store/types';

import * as requestModel from '../../../data/models/requests';
import { AppError } from '@kbase/ui-components';
import { extractViewOrgModelPlus } from '../../../lib/stateExtraction';

// Reject inbound request

export interface RejectRequestAction<T> extends Action<T> {
}

export interface RejectInboxRequest extends RejectRequestAction<ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST> {
    type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST;
    request: requestModel.Request;
}

interface RejectInboxRequestStart extends RejectRequestAction<ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_START> {
    type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_START;
}

export interface RejectInboxRequestSuccess extends RejectRequestAction<ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_SUCCESS> {
    type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_SUCCESS;
    requests: Array<requestModel.Request>;
}

interface RejectInboxRequestError extends RejectRequestAction<ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_ERROR> {
    type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_ERROR,
    error: AppError;
}

export function denyRequest(requestId: requestModel.RequestID) {
    return async (dispatch: ThunkDispatch<StoreState, void, RejectRequestAction<any>>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_START
        });

        const { viewModel, username, token, config } = extractViewOrgModelPlus(getState());

        // do the cancelation
        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        });

        try {
            await requestClient.denyRequest(requestId);

            // refetch the outbox
            const inbox = await requestClient.getRequestInboxForOrg(viewModel.organization.id);

            dispatch({
                type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_SUCCESS,
                requests: inbox
            } as RejectInboxRequestSuccess);

            // send the inbox in the success
        } catch (ex) {
            dispatch({
                type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_ERROR,
                error: {
                    code: ex.name,
                    message: ex.message
                }
            });
        }


        // or error
    };
}