import { AppError } from '@kbase/ui-components';
import { Action } from 'redux';

import { ThunkDispatch } from 'redux-thunk';
import { ActionFlag } from '.';
import { StoreState } from '../store/types';

// MAIN Loading

export interface MainLoad extends Action<ActionFlag.MAIN_LOAD> {
    type: ActionFlag.MAIN_LOAD;
}

export interface MainLoadStart extends Action<ActionFlag.MAIN_LOAD_START> {
    type: ActionFlag.MAIN_LOAD_START;
}

export interface MainLoadSuccess extends Action<ActionFlag.MAIN_LOAD_SUCCESS> {
    type: ActionFlag.MAIN_LOAD_SUCCESS;
}

export interface MainLoadError extends Action<ActionFlag.MAIN_LOAD_ERROR> {
    type: ActionFlag.MAIN_LOAD_ERROR;
    error: AppError;
}

export interface Unload extends Action<ActionFlag.MAIN_UNLOAD> {
    type: ActionFlag.MAIN_UNLOAD;
}

export function loadStart(): MainLoadStart {
    return {
        type: ActionFlag.MAIN_LOAD_START
    };
}

export function loadSuccess(): MainLoadSuccess {
    return {
        type: ActionFlag.MAIN_LOAD_SUCCESS,
    };
}

export function loadError(error: AppError): MainLoadError {
    return {
        type: ActionFlag.MAIN_LOAD_ERROR,
        error
    };
}

export function load() {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, _getState: () => StoreState) => {
        dispatch(loadStart());
        dispatch(loadSuccess());
    };
}

export function unload() {
    return {
        type: ActionFlag.MAIN_UNLOAD
    };
}
