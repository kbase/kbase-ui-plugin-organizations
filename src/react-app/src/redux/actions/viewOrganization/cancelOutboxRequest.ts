import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from '../index'
import {
    StoreState,
    AppError,
    UIError,
    UIErrorType,
    ViewOrgViewModelKind
} from '../../../types'

import * as requestModel from '../../../data/models/requests'
import { AnError, makeError } from '../../../lib/error';

export interface CancelJoinRequest extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST
}

export interface CancelJoinRequestStart extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_START
}

export interface CancelJoinRequestSuccess extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_SUCCESS
    requests: Array<requestModel.Request>
}

export interface CancelJoinRequestError extends Action {
    type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_ERROR,
    error: AnError
}

export function cancelRequest(requestId: requestModel.RequestID) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_START
        })

        const state = getState()

        const viewModel = state.views.viewOrgView.viewModel

        if (viewModel === null) {
            dispatch({
                type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,
                error: {
                    code: 'error',
                    message: 'No view model'
                }
            })
            return
        }

        // argh
        if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
            dispatch({
                type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,
                error: {
                    code: 'invalid state',
                    message: 'Not the right kind of view model'
                }
            })
            return
        }

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = state

        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            await requestClient.cancelRequest(requestId)

            const requests: Array<requestModel.Request> = await requestClient.getRequestOutboxForOrg(viewModel.organization.id)

            dispatch({
                type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_SUCCESS,
                requests
            } as CancelJoinRequestSuccess)
        } catch (ex) {
            dispatch({
                type: ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_ERROR,
                error: makeError({
                    code: 'error',
                    message: ex.message
                })
            } as CancelJoinRequestError)
        }
    }
}