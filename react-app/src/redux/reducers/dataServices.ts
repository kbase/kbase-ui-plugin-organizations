import { Action } from 'redux';
import * as actions from '../actions/dataServices';
import { StoreState } from '../../types';
import { ActionFlag } from '../actions';

function loadSuccess(state: StoreState, action: actions.LoadSuccess): StoreState {
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