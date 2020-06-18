import { Action } from 'redux';
import * as actions from '../../actions/viewOrganization/denyInboxRequest';
import { StoreState } from '../../../types';
import { ActionFlag } from '../../actions';
import { AsyncModelState } from '../../../types/common';
import { ViewOrgViewModelKind } from '../../../types/views/Main/views/ViewOrg';


export function rejectInboxRequestSuccess(state: StoreState, action: actions.RejectInboxRequestSuccess): StoreState {
    if (state.auth.userAuthorization === null) {
        throw new Error('Not authorized.');
    }

    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     throw new Error('Not in view orgs view');
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error('Wrong model');
    }

    return {
        ...state,
        view: {
            ...state.view,
            value: {
                ...state.view.value,
                views: {
                    ...state.view.value.views,
                    viewOrg: {
                        ...state.view.value.views.viewOrg,
                        value: {
                            ...state.view.value.views.viewOrg.value,
                            requestInbox: action.requests
                        }
                    }
                }
            }
        }
    };
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_REJECT_INBOX_REQUEST_SUCCESS:
            return rejectInboxRequestSuccess(state, action as actions.RejectInboxRequestSuccess);
        default:
            return null;
    }
}

