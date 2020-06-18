import { Action } from 'redux';
import * as actions from '../../actions/viewOrganization/acceptInboxRequest';
import { StoreState } from '../../../types';
import { ActionFlag } from '../../actions';
import { ViewOrgViewModelKind } from '../../../types/views/Main/views/ViewOrg';
import { AsyncModelState } from '../../../types/common';

export function acceptInboxRequestSuccess(state: StoreState, action: actions.AcceptRequestSuccess): StoreState {
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
        case ActionFlag.VIEW_ORG_ACCEPT_INBOX_REQUEST_SUCCESS:
            return acceptInboxRequestSuccess(state, action as actions.AcceptRequestSuccess);
        default:
            return null;
    }
}

