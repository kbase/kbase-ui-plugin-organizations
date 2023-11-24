import { Action } from 'redux';
import { ActionFlag } from '../actions';
import * as actions from '../actions/dataServices';
import { StoreState } from '../store/types';

function loadSuccess(state: StoreState, _action: actions.LoadSuccess): StoreState {
    return {
        ...state,
        db: {
            ...state.db,
        }
    };
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.DATA_SERVICE_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess);
        default:
            return null;
    }
}