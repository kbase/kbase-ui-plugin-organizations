import { Action } from 'redux';
import * as actions from '../../actions/viewOrganization/cancelOutboxRequest';
import { StoreState } from '../../store/types';
import { ActionFlag } from '../../actions';
import { AsyncModelState } from '../../store/types/common';
import { ViewOrgViewModelKind } from '../../store/types/views/Main/views/ViewOrg';


export function cancelRequestSuccess(state: StoreState, action: actions.CancelJoinRequestSuccess): StoreState {
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

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL && 
        state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.PRIVATE_INACCESSIBLE) {
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
                            requestOutbox: action.requests
                        }
                    }
                }
            }
        }
    };
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_CANCEL_JOIN_REQUEST_SUCCESS:
            return cancelRequestSuccess(state, action as actions.CancelJoinRequestSuccess);
        default:
            return null;
    }
}

