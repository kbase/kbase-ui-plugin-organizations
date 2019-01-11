import { Action } from 'redux'
import * as actions from '../../actions/viewOrganization/rejectInboxRequest'
import { StoreState } from '../../../types'
import { ActionFlag } from '../../actions'


export function rejectInboxRequestSuccess(state: StoreState, action: actions.RejectInboxRequestSuccess): StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    requestInbox: action.requests
                }
            }
        }
    }
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_SUCCESS:
            rejectInboxRequestSuccess(state, action as actions.RejectInboxRequestSuccess)
        default:
            return null
    }
}

