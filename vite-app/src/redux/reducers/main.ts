import { Reducer } from 'react';
import { Action } from 'redux';
import { ActionFlag } from '../actions';
import { MainLoadStart, MainLoadSuccess, Unload } from '../actions/main';
import { StoreState } from '../store/types';
import { AsyncModelState } from '../store/types/common';

function loadStart(state: StoreState, _action: MainLoadStart): StoreState {
    return {
        ...state,
        view: {
            loadingState: AsyncModelState.LOADING
        }
    };
}

function loadSuccess(state: StoreState, _action: MainLoadSuccess): StoreState {
    return {
        ...state,
        view: {
            loadingState: AsyncModelState.SUCCESS,
            value: {
                views: {
                    addOrg: {
                        loadingState: AsyncModelState.NONE
                    },
                    browseOrgs: {
                        loadingState: AsyncModelState.NONE
                    },
                    manageRequests: {
                        loadingState: AsyncModelState.NONE
                    },
                    viewMembers: {
                        loadingState: AsyncModelState.NONE
                    },
                    viewOrg: {
                        loadingState: AsyncModelState.NONE
                    },
                }
            }
        }
    };
}

function unload(state: StoreState, _action: Unload): StoreState {
    return {
        ...state,
        view: {
            loadingState: AsyncModelState.NONE
        }
    };
}

const reducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
    if (!state) {
        return state;
    }
    switch (action.type) {
        case ActionFlag.MAIN_LOAD_START:
            return loadStart(state, action as MainLoadStart);
        case ActionFlag.MAIN_LOAD_SUCCESS:
            return loadSuccess(state, action as MainLoadSuccess);
        case ActionFlag.MAIN_UNLOAD:
            return unload(state, action as Unload);
    }
};

export default reducer;
