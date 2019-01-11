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
    organizations: Array<uberModel.UberOrganization>
}

interface AcceptRequestError extends AcceptRequestAction<ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR> {
    type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,
    error: AppError
}

export function acceptInboxRequest(request: requestModel.Request) {
    return async (dispatch: ThunkDispatch<StoreState, void, AcceptRequestAction<any>>, getState: () => StoreState) => {
        const state = getState()

        if (!state.views.dashboardView.viewModel) {
            dispatch({
                type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_ERROR,
                error: {
                    code: 'error',
                    message: 'No dashboard view model'
                }
            })
        }

        dispatch({
            type: ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_START
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

        const uberClient = new uberModel.UberModel({
            token, username,
            groupsServiceURL: config.services.Groups.url,
            userProfileServiceURL: config.services.UserProfile.url,
            workspaceServiceURL: config.services.Workspace.url,
            serviceWizardURL: config.services.ServiceWizard.url
        })


        try {
            const newRequest = await requestClient.acceptRequest(request.id)

            // refetch the inbox
            const inbox = await requestClient.getCombinedRequestInboxForOrg(request.organizationId)

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

