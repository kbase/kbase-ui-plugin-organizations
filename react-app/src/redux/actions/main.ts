import { Action } from 'redux';
import { AppError } from '@kbase/ui-components';

import { ThunkDispatch } from 'redux-thunk';
import { ActionFlag } from '.';
import { StoreState } from '../../types';

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
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart());
        // const {
        //     auth: { userAuthorization },
        //     app: {
        //         config: {
        //             services: {
        //                 Catalog: { url: catalogURL }
        //             }
        //         }
        //     }
        // } = getState();

        // TODO: Load initial view, not NONE!
        // const view: View<ViewKind.BROWSE_ORGS, BrowseOrgsViewModel> = {
        //     kind: ViewKind.BROWSE_ORGS,
        //     model: {
        //         loadingState: AsyncModelState.NONE
        //     }
        // };
        // const view: MainViewModel = {
        //     value: {
        //         views: {

        //         }
        //     }
        // }

        // console.log('about to call load success', view);
        dispatch(loadSuccess());

        // if (!userAuthorization) {
        //     dispatch(
        //         mainLoadError({
        //             message: 'Not authorized',
        //             code: 'unauthorized'
        //         })
        //     );
        //     return;
        // }

        // // determine auth
        // // TODO: we need a model object for interacting with the outside world
        // const catalogClient = new CatalogClient({
        //     token: userAuthorization.token,
        //     url: catalogURL,
        //     module: 'Catalog'
        // });

        // try {
        //     const isAdmin = await catalogClient.isAdmin();
        //     dispatch(mainLoadSuccess(isAdmin ? true : false));
        // } catch (ex) {
        //     dispatch(
        //         mainLoadError({
        //             message: ex.message,
        //             code: 'error-checking-admin-status'
        //         })
        //     );
        // }
    };
}

export function unload() {
    return {
        type: ActionFlag.MAIN_UNLOAD
    };
}
