import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ActionFlag } from '../index'
import {
    StoreState,
    AppError,
    ViewOrgViewModelKind
} from '../../../types'

import * as requestModel from '../../../data/models/requests'


export interface AcceptRequestAction<T> extends Action<T> {
}

export interface AcceptRequest extends AcceptRequestAction<ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST> {
    type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST
    request: requestModel.Request
}

interface AcceptRequestStart extends AcceptRequestAction<ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_START> {
    type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_START
}

export interface AcceptRequestSuccess extends AcceptRequestAction<ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_SUCCESS> {
    type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_SUCCESS,
    requests: Array<requestModel.Request>
}

interface AcceptRequestError extends AcceptRequestAction<ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR> {
    type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,
    error: AppError
}

export function acceptRequest(requestId: requestModel.RequestID) {
    return async (dispatch: ThunkDispatch<StoreState, void, AcceptRequestAction<any>>, getState: () => StoreState) => {
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

        dispatch({
            type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_START
        })

        const {
            auth: { authorization: { token, username } },
            app: { config }
        } = state

        // do the cancellation
        const requestClient = new requestModel.RequestsModel({
            token, username,
            groupsServiceURL: config.services.Groups.url
        })

        try {
            await requestClient.acceptRequest(requestId)

            // refetch the inbox
            const inbox = await requestClient.getCombinedRequestInboxForOrg(viewModel.organization.id)

            dispatch({
                type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_SUCCESS,
                requests: inbox
            })



            // send the inbox in the success
        } catch (ex) {
            dispatch({
                type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,
                error: {
                    code: ex.name,
                    message: ex.message
                }
            })
        }

        // or error
    }
}

