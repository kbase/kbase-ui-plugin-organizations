import { Action } from 'redux'
import * as actions from '../../actions/viewOrganization/acceptInboxRequest'
import { StoreState, ViewOrgViewModelKind } from '../../../types'
import { ActionFlag } from '../../actions'


export function acceptInboxRequestSuccess(state: StoreState, action: actions.AcceptRequestSuccess): StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
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
        case ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_SUCCESS:
            return acceptInboxRequestSuccess(state, action as actions.AcceptRequestSuccess)
        default:
            return null
    }
}

