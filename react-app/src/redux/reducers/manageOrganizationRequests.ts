import { Action } from 'redux';
import * as actions from '../actions/manageOrganizationRequests';
import { StoreState } from '../../types';
import { ActionFlag } from '../actions';
import { AsyncModelState } from '../../types/common';
import { ManageOrganizationRequestsViewModel } from '../../types/views/Main/views/ManageOrganizationRequests';

export function loadStart(
    state: ManageOrganizationRequestsViewModel,
    action: actions.LoadStart): ManageOrganizationRequestsViewModel {
    return {
        loadingState: AsyncModelState.LOADING
    };
}

export function loadSuccess(
    state: ManageOrganizationRequestsViewModel,
    action: actions.LoadSuccess): ManageOrganizationRequestsViewModel {
    return {
        loadingState: AsyncModelState.SUCCESS,
        value: {
            organization: action.organization,
            requests: action.requests,
            invitations: action.invitations
        }
    };

}

export function loadError(
    state: ManageOrganizationRequestsViewModel,
    action: actions.LoadError): ManageOrganizationRequestsViewModel {
    return {
        loadingState: AsyncModelState.ERROR,
        error: action.error
    };
}

export function unload(state: ManageOrganizationRequestsViewModel, action: actions.Unload): ManageOrganizationRequestsViewModel {
    return {
        loadingState: AsyncModelState.NONE,
    };
}

export function getViewAccessSuccess(state: ManageOrganizationRequestsViewModel, action: actions.GetViewAccessSuccess): ManageOrganizationRequestsViewModel {
    // Note: we use the state object rather than peeling off the viewModel because
    // TS can't trace the assertion (not falsy) of the variable back to the object 
    // property it was taken from.
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const requests = state.value.requests;
    const newRequests = requests.map((request) => {
        if (request.id === action.request.id) {
            return action.request;
        }
        return request;
    });

    return {
        ...state,
        value: {
            ...state.value,
            requests: newRequests
        }
    };
}


function localReducer(state: ManageOrganizationRequestsViewModel, action: Action): ManageOrganizationRequestsViewModel | null {
    switch (action.type) {
        case ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_START:
            return loadStart(state, action as actions.LoadStart);
        case ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess);
        case ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_ERROR:
            return loadError(state, action as actions.LoadError);
        case ActionFlag.ADMIN_MANAGE_REQUESTS_UNLOAD:
            return unload(state, action as actions.Unload);
        case ActionFlag.ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_SUCCESS:
            return getViewAccessSuccess(state, action as actions.GetViewAccessSuccess);
        default:
            return null;
    }
}

export default function reducer(state: StoreState, action: Action<any>): StoreState | null {
    if (state.auth.userAuthorization === null) {
        return null;
    }

    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return null;
    }

    // if (state.view.value.kind !== ViewKind.MANAGE_ORGANIZATION_REQUESTS) {
    //     return null;
    // }

    // if (state.view.value.model.loadingState !== AsyncModelState.SUCCESS) {
    //     return state;
    // }

    const model = localReducer(state.view.value.views.manageRequests, action);
    if (model) {
        return {
            ...state,
            view: {
                ...state.view,
                value: {
                    ...state.view.value,
                    views: {
                        ...state.view.value.views,
                        manageRequests: model
                    }
                }
            }
        };
    }
    return null;
}