import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from '../index'
import {
    StoreState,
    AppError, UIError, UIErrorType
} from '../../../types'

import * as orgModel from '../../../data/models/organization/model'
import * as requestModel from '../../../data/models/requests'
import * as uberModel from '../../../data/models/uber'

// Reject inbound request

export interface RejectRequestAction<T> extends Action<T> {
}

export interface RejectInboxRequest extends RejectRequestAction<ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST> {
    type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST
    request: requestModel.Request
}

interface RejectInboxRequestStart extends RejectRequestAction<ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_START> {
    type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_START
}

export interface RejectInboxRequestSuccess extends RejectRequestAction<ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_SUCCESS> {
    type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_SUCCESS
    requests: Array<requestModel.Request>
}

interface RejectInboxRequestError extends RejectRequestAction<ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_ERROR> {
    type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_ERROR,
    error: AppError
}

export function rejectInboxRequest(request: requestModel.Request) {
    return async (dispatch: ThunkDispatch<StoreState, void, RejectRequestAction<any>>, getState: () => StoreState) => {
        const state = getState()

        if (!state.views.dashboardView.viewModel) {
            dispatch({
                type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_ERROR,
                error: {
                    code: 'error',
                    message: 'No dashboard view model'
                }
            })
        }

        dispatch({
            type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_START
        })

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = state

        // do the cancelation
        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            const newRequest = await requestClient.denyRequest(request.id)

            // refetch the inbox
            const outbox = await requestClient.getInboundRequests()

            dispatch({
                type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_SUCCESS,
                requests: outbox
            })

            // send the inbox in the success
        } catch (ex) {
            dispatch({
                type: ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_ERROR,
                error: {
                    code: ex.name,
                    message: ex.message
                }
            })
        }


        // or error
    }
}