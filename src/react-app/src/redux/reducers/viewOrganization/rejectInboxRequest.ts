import { Action } from 'redux'
import * as actions from '../../actions/viewOrganization/rejectInboxRequest'
import { StoreState, ViewOrgViewModelKind } from '../../../types'
import { ActionFlag } from '../../actions'


export function rejectInboxRequestSuccess(state: StoreState, action: actions.RejectInboxRequestSuccess): StoreState {
    const viewModel = state.views.viewOrgView.viewModel
    if (!viewModel) {
        return state
    }
    if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...viewModel,
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

