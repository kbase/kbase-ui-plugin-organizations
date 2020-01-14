import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionFlag } from '../index';
import * as orgModel from '../../../data/models/organization/model';
import * as appsModel from '../../../data/models/apps';
import {
    StoreState, ViewOrgViewModelKind, SelectableApp,
    ResourceRelationToOrg, ViewOrgViewModel, AddAppsViewModel
} from '../../../types';
import { AnError } from '../../../combo/error/api';
import { makeError } from '../../../lib/error';
import { NarrativeMethodStoreClient } from '../../../data/apis/narrativeMethodStore';
import { RequestResourceType, RequestType } from '../../../data/models/requests';
import * as viewOrgActions from '../viewOrg';

export interface AddAppsAction extends Action {

}

export interface Load extends AddAppsAction {
    type: ActionFlag.VIEW_ORG_ADD_APPS_LOAD;
}

export interface LoadStart extends AddAppsAction {
    type: ActionFlag.VIEW_ORG_ADD_APPS_LOAD_START;
}

export interface LoadSuccess extends AddAppsAction {
    type: ActionFlag.VIEW_ORG_ADD_APPS_LOAD_SUCCESS;
    rawApps: Array<SelectableApp>;
    sortBy: string;
    searchBy: string;
    apps: Array<SelectableApp>;
    selectedApp: SelectableApp | null;
}

export interface LoadError extends AddAppsAction {
    type: ActionFlag.VIEW_ORG_ADD_APPS_LOAD_ERROR,
    error: AnError;
}

export interface Unload extends AddAppsAction {
    type: ActionFlag.VIEW_ORG_ADD_APPS_UNLOAD;
}

function loadStart(): LoadStart {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_LOAD_START
    };
}

function loadError(error: AnError): LoadError {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_LOAD_ERROR,
        error: error
    };
}

function loadSuccess(apps: Array<SelectableApp>) {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_LOAD_SUCCESS,
        rawApps: apps,
        sortBy: 'name',
        searchBy: '',
        apps,
        selectedApp: null
    };
}

export function unload(): Unload {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_UNLOAD
    };
}

export function load() {
    return async (dispatch: ThunkDispatch<StoreState, void, AddAppsAction>, getState: () => StoreState) => {
        dispatch(loadStart());

        const state = getState();

        // get the org, with the usual funny business.
        const {
            views: {
                viewOrgView: {
                    viewModel
                }
            }
        } = state;

        if (!viewModel) {
            dispatch(loadError(makeError({
                code: 'load-error',
                message: 'Error loading: no org view model'
            })));
            return;
        }

        if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
            dispatch(loadError(makeError({
                code: 'load-error',
                message: 'Error loading: no org view model'
            })));
            return;
        }

        const { organization } = viewModel;

        if (organization.kind !== orgModel.OrganizationKind.NORMAL) {
            dispatch(loadError(makeError({
                code: 'load-error',
                message: 'Error loading: not normal org'
            })));
            return;
        }

        // get all apps. we can do this because there 
        // are not very many. 
        // TODO: switch to search, not filter, model; this
        // implies paging, sorting, etc. on the back end.
        const {
            auth: { userAuthorization },
            app: {
                config: {
                    services: {
                        NarrativeMethodStore: {
                            url: narrativeMethodStoreURL
                        }
                    }
                } } } = state;

        if (userAuthorization === null) {
            throw new Error('Unauthorized');
        }
        const { token, username } = userAuthorization;

        const nmsClient = new NarrativeMethodStoreClient({
            url: narrativeMethodStoreURL,
            token: token
        });

        const hasInboxRequest = (appId: appsModel.AppID) => {
            // const groupsAppId = appId.split('/').join('.')
            return viewModel.requestInbox.find((request) => {
                if (request.resourceType === RequestResourceType.APP) {
                    if (request.type === RequestType.REQUEST) {
                        if (request.appId === appId) {
                            return true;
                        }
                    }
                }
                return false;
            });
        };

        const hasOutboxRequest = (appId: appsModel.AppID) => {
            // const groupsAppId = appId.split('/').join('.')
            return viewModel.requestOutbox.find((request) => {
                if (request.resourceType === RequestResourceType.APP) {
                    if (request.type === RequestType.REQUEST) {
                        if (request.appId === appId) {
                            return true;
                        }
                    }
                }
                return false;
            });
        };

        try {
            const methods = await nmsClient.list_methods({ tag: 'release' });

            const appResources = organization.apps;

            const apps = methods
                .filter((method) => {
                    return (method.authors.includes(username));
                })
                .map((method) => {
                    let relation: ResourceRelationToOrg;
                    const appId = method.id;
                    if (appResources.find((appResource) => {
                        // TODO: why, oh, why use module.method?? 
                        // Oh, I know why, but why??
                        return (appResource.appId === appId);
                    })) {
                        relation = ResourceRelationToOrg.ASSOCIATED;
                    } else if (hasOutboxRequest(appId)) {
                        relation = ResourceRelationToOrg.ASSOCIATION_PENDING;
                    } else if (hasInboxRequest(appId)) {
                        relation = ResourceRelationToOrg.ASSOCIATION_PENDING;
                    } else {
                        relation = ResourceRelationToOrg.NONE;
                    }
                    return {
                        app: appsModel.methodBriefInfoToAppBriefInfo(method),
                        selected: false,
                        relation, appId
                    };
                })
                // TODO: Sort will be separated.
                .sort((a, b) => {
                    return (a.app.name.localeCompare(b.app.name));
                });


            dispatch(loadSuccess(apps));
        } catch (ex) {
            dispatch(loadError(makeError({
                code: 'error',
                message: ex.message
            })));
        }

    };
}

// Select app

export interface Select {
    type: ActionFlag.VIEW_ORG_ADD_APPS_SELECT;
    appID: string;
}

export interface SelectSuccess {
    type: ActionFlag.VIEW_ORG_ADD_APPS_SELECT_SUCCESS;
    selectedApp: SelectableApp;
}

export function selectSuccess(selectedApp: SelectableApp): SelectSuccess {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_SELECT_SUCCESS,
        selectedApp
    };
}

function ensureViewModel(state: StoreState): [ViewOrgViewModel, AddAppsViewModel] {
    const {
        views: {
            viewOrgView: {
                viewModel
            }
        }
    } = state;

    if (!viewModel) {
        throw new Error('Error loading: no org view model');
    }

    if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error('View model not NORMAL kind');
    }

    const {
        subViews: {
            addAppsView: {
                viewModel: addAppsViewModel
            }
        }
    } = viewModel;

    if (addAppsViewModel === null) {
        throw new Error('Error loading: no org subview model');
    }

    return [viewModel, addAppsViewModel];
}

export function select(selectedAppId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, AddAppsAction>, getState: () => StoreState) => {
        const state = getState();

        try {
            const [, viewModel] = ensureViewModel(state);

            // now to the actual work...
            // get the apps;
            // pluck the selected one out
            // set it to the selected one,
            // mark the apps in the list as selected (TODO)

            const selected = viewModel.apps.filter((app) => {
                return (app.app.id === selectedAppId);
            });

            if (selected.length === 0) {
                dispatch(loadError(makeError({
                    code: 'runtime-error',
                    message: 'Strange, no matching app for selection'
                })));
                return;
            }

            dispatch(selectSuccess(selected[0]));
        } catch (ex) {
            dispatch(loadError(makeError({
                code: 'runtime-error',
                message: ex.message
            })));
            return;
        }
    };
}

// Association

export interface RequestAssociation {
    type: ActionFlag.VIEW_ORG_ADD_APPS_REQUEST_ASSOCIATE_APP,
    appId: string;
}

export interface RequestAssociationStart {
    type: ActionFlag.VIEW_ORG_ADD_APPS_REQUEST_ASSOCIATE_APP_START;
}

export interface RequestAssociationSuccess {
    type: ActionFlag.VIEW_ORG_ADD_APPS_REQUEST_ASSOCIATE_APP_SUCCESS,
    appId: string;
    pending: boolean;
}

export interface RequestAssociationError {
    type: ActionFlag.VIEW_ORG_ADD_APPS_REQUEST_ASSOCIATE_APP_ERROR,
    error: AnError;
}

export function requestAssociationSuccess(appId: string, pending: boolean): RequestAssociationSuccess {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_REQUEST_ASSOCIATE_APP_SUCCESS,
        appId, pending
    };
}

export function RequestAssociationError(error: AnError): RequestAssociationError {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_REQUEST_ASSOCIATE_APP_ERROR,
        error
    };
}

export function requestAssociation(appId: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, AddAppsAction>, getState: () => StoreState) => {
        try {
            const [orgViewModel,] = ensureViewModel(getState());

            // do the association request

            // depending on the response, set the pending flag
            const {
                auth: { userAuthorization },
                app: {
                    config: {
                        services: {
                            Groups: {
                                url: groupsUrl
                            },
                            UserProfile: {
                                url: userProfileUrl
                            }
                        }
                    }
                }
            } = getState();

            if (userAuthorization === null) {
                throw new Error('Unauthorized');
            }
            const { token, username } = userAuthorization;

            const orgClient = new orgModel.OrganizationModel({
                groupsServiceURL: groupsUrl,
                userProfileServiceURL: userProfileUrl,
                username, token
            });

            // App id is naturally module/method, but the groups api wants module.method.
            // Why, oh why?, other than being more "REST friendly?"
            const groupsAppId = appId.split('/').join('.');

            const result = await orgClient.addOrRequestAppToGroup(orgViewModel.organization.id, groupsAppId);

            let pending: boolean;
            if (result === true) {
                pending = false;
            } else {
                pending = true;
            }

            // now to the actual work...
            // get the apps;
            // pluck the selected one out
            // set it to the selected one,
            // mark the apps in the list as selected (TODO)

            // const selected = viewModel.apps.filter((app) => {
            //     return (app.app.id === selectedAppId)
            // })

            // if (selected.length === 0) {
            //     dispatch(loadError(makeError({
            //         code: 'runtime-error',
            //         message: 'Strange, no matching app for selection'
            //     })))
            //     return
            // }

            dispatch(requestAssociationSuccess(appId, pending));
            dispatch(viewOrgActions.reload(orgViewModel.organization.id));
        } catch (ex) {
            dispatch(RequestAssociationError(makeError({
                code: 'runtime-error',
                message: ex.message
            })));
            return;
        }
    };
}

// SEARCH

export interface Search {
    type: ActionFlag.VIEW_ORG_ADD_APPS_SEARCH,
    searchBy: string;
}

export interface SearchStart {
    type: ActionFlag.VIEW_ORG_ADD_APPS_SEARCH_START;
}

export interface SearchSuccess {
    type: ActionFlag.VIEW_ORG_ADD_APPS_SEARCH_SUCCESS;
    apps: Array<SelectableApp>;
}

export interface SearchError {
    type: ActionFlag.VIEW_ORG_ADD_APPS_SEARCH_ERROR;
    error: AnError;
}

function searchStart(): SearchStart {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_SEARCH_START
    };
}

function searchSuccess(apps: Array<SelectableApp>): SearchSuccess {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_SEARCH_SUCCESS,
        apps
    };
}

function searchError(error: AnError): SearchError {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_SEARCH_ERROR,
        error
    };
}

// function ensureView(state: StoreState): View<AddAppsViewModel> {
//     const {
//         views: {
//             viewOrgView: { viewModel }
//         }
//     } = state
//     if (viewModel === null) {
//         throw new Error('invalid state -- no view value')
//     }
//     if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
//         throw new Error('invalid state -- no view value')
//     }
//     const { addAppsView } = viewModel.subViews
//     if (addAppsView === null) {
//         throw new Error('invalid state -- no view value')
//     }
//     return addAppsView
// }

// function ensureViewModel(state: StoreState): AddAppsViewModel {
//     const view = ensureView(state)
//     if (view.viewModel === null) {
//         throw new Error('invalid state -- no view model')
//     }
//     return view.viewModel
// }


type SearchExpression = Array<RegExp>;

function applySearch(apps: Array<SelectableApp>, searchExpression: SearchExpression) {
    return apps.filter((app) => {
        if (searchExpression.length === 0) {
            return true;
        }
        return searchExpression.every((expr) => {
            return expr.test(app.app.name) ||
                expr.test(app.app.subtitle) ||
                expr.test(app.app.moduleName);
        });
    });
}

export function search(searchBy: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, AddAppsAction>, getState: () => StoreState) => {
        try {
            dispatch(searchStart());

            // TODO: better parser
            const searchExpression = searchBy.split(/[\s]+/).map((term) => {
                return new RegExp(term, 'i');
            });

            const [, viewModel] = ensureViewModel(getState());

            const {
                rawApps
            } = viewModel;

            const foundApps = applySearch(rawApps, searchExpression);

            dispatch(searchSuccess(foundApps));

        } catch (ex) {
            dispatch(searchError(makeError({
                code: 'error',
                message: ex.message
            })));
        }
    };

}

// SORT

export interface Sort {
    type: ActionFlag.VIEW_ORG_ADD_APPS_SORT;
}
export interface SortStart {
    type: ActionFlag.VIEW_ORG_ADD_APPS_SORT_START;
}

export interface SortSuccess {
    type: ActionFlag.VIEW_ORG_ADD_APPS_SORT_SUCCESS;
    apps: Array<SelectableApp>;
}

export interface SortError {
    type: ActionFlag.VIEW_ORG_ADD_APPS_SORT_ERROR;
    error: AnError;
}

function sortStart(): SortStart {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_SORT_START
    };
}

function sortSuccess(apps: Array<SelectableApp>): SortSuccess {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_SORT_SUCCESS,
        apps
    };
}

function sortError(error: AnError): SortError {
    return {
        type: ActionFlag.VIEW_ORG_ADD_APPS_SORT_ERROR,
        error
    };
}

function applySort(apps: Array<SelectableApp>, sortBy: string) {
    switch (sortBy) {
        case 'name':
            return apps.sort((a, b) => {
                return a.app.name.localeCompare(b.app.name);
            });
        case 'module':
            return apps.sort((a, b) => {
                const moduleMatch = a.app.moduleName.localeCompare(b.app.moduleName);
                if (!moduleMatch) {
                    return a.app.name.localeCompare(b.app.name);
                }
                return moduleMatch;
            });
        default:
            return apps;
    }
}

export function sort(sortBy: string) {
    return async (dispatch: ThunkDispatch<StoreState, void, AddAppsAction>, getState: () => StoreState) => {
        try {
            dispatch(sortStart());

            const [, viewModel] = ensureViewModel(getState());

            const {
                apps
            } = viewModel;

            // TODO: better parser
            const sortedApps = applySort(apps.slice(0), sortBy);

            dispatch(sortSuccess(sortedApps));
        } catch (ex) {
            dispatch(sortError(makeError({
                code: 'error',
                message: ex.message
            })));
        }
    };

}