import { Action } from 'redux'
import * as actions from '../../actions/viewOrganization/cancelOutboxRequest'
import { StoreState, ViewOrgViewModelKind } from '../../../types'
import { ActionFlag } from '../../actions'


export function cancelRequestSuccess(state: StoreState, action: actions.CancelJoinRequestSuccess): StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }
    console.log('canceling...', action)
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    requestOutbox: action.requests
                }
            }
        }
    }
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_SUCCESS:
            return cancelRequestSuccess(state, action as actions.CancelJoinRequestSuccess)
        default:
            return null
    }
}

