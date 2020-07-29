import { Action } from 'redux';
import * as actions from '../../actions/viewOrganization/manageRelatedOrganizations';
import { StoreState } from '../../store/types';
import { ActionFlag } from '../../actions';
import { SelectableRelatableOrganization } from '../../store/types/views/Main/views/ViewOrg/views/ManageRelatedOrgs';
import { AsyncModelState } from '../../store/types/common';
import { SubViewKind, ViewOrgViewModelKind } from '../../store/types/views/Main/views/ViewOrg';

export function loadSuccess(state: StoreState, action: actions.LoadSuccess): StoreState {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.MANAGE_RELATED_ORGS) {
        return state;
    }

    const {
        view: {
            value: {
                views: {
                    viewOrg: {
                        value: {
                            organization
                        }
                    }
                }
            }
        }
    } = state;


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
                            organization: {
                                ...state.view.value.views.viewOrg.value.organization,
                            },
                            subView: {
                                ...state.view.value.views.viewOrg.value.subView,
                                model: {
                                    loadingState: AsyncModelState.SUCCESS,
                                    value: {
                                        relatedOrganizations: organization.relatedOrganizations,
                                        organization: organization,
                                        availableOrganizations: {
                                            organizations: action.organizations,
                                            queried: action.organizations,
                                            searchBy: ''
                                        },
                                        selectedOrganization: null
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

export function unload(state: StoreState, action: actions.Unload): StoreState {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.MANAGE_RELATED_ORGS) {
        return state;
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
                            organization: {
                                ...state.view.value.views.viewOrg.value.organization,
                            },
                            subView: {
                                ...state.view.value.views.viewOrg.value.subView,
                                model: {
                                    loadingState: AsyncModelState.NONE
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

export function selectOrganization(state: StoreState, action: actions.SelectOrganization): StoreState {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.MANAGE_RELATED_ORGS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.model.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const {
        view: {
            value: {
                views: {
                    viewOrg: {
                        value: {
                            subView: {
                                model: {
                                    value: {
                                        availableOrganizations
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } = state;

    const newAvailableOrgs = availableOrganizations.organizations
        .map((relatedOrg: SelectableRelatableOrganization) => {
            if (relatedOrg.organization.id === action.selectedOrganization.organization.id) {
                relatedOrg.isSelected = true;
            } else {
                relatedOrg.isSelected = false;
            }
            return relatedOrg;
        });

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
                            organization: {
                                ...state.view.value.views.viewOrg.value.organization,
                            },
                            subView: {
                                ...state.view.value.views.viewOrg.value.subView,
                                model: {
                                    ...state.view.value.views.viewOrg.value.subView.model,
                                    value: {
                                        ...state.view.value.views.viewOrg.value.subView.model.value,
                                        selectedOrganization: action.selectedOrganization,
                                        availableOrganizations: {
                                            ...state.view.value.views.viewOrg.value.subView.model.value.availableOrganizations,
                                            organizations: newAvailableOrgs,
                                            queried: actions.applyQuery(newAvailableOrgs, availableOrganizations.searchBy),
                                            searchBy: availableOrganizations.searchBy
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

export function addOrganization(state: StoreState, action: actions.AddOrganizationSuccess): StoreState {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.MANAGE_RELATED_ORGS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.model.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const {
        view: {
            value: {
                views: {
                    viewOrg: {
                        value: {
                            organization: { relatedOrganizations },
                            subView: {
                                model: {
                                    value: {
                                        availableOrganizations
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } = state;

    // const availableOrgs = state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel.availableOrganizations;
    const newRelatedOrgs = relatedOrganizations.concat([action.organizationId]);

    const newAvailableOrgs = availableOrganizations.organizations
        .map((relatedOrg: SelectableRelatableOrganization) => {
            if (newRelatedOrgs.includes(relatedOrg.organization.id)) {
                relatedOrg.isRelated = true;
            } else {
                relatedOrg.isRelated = false;
            }
            return relatedOrg;
        });

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
                            organization: {
                                ...state.view.value.views.viewOrg.value.organization,
                                relatedOrganizations: newRelatedOrgs
                            },
                            subView: {
                                ...state.view.value.views.viewOrg.value.subView,
                                model: {
                                    ...state.view.value.views.viewOrg.value.subView.model,
                                    value: {
                                        ...state.view.value.views.viewOrg.value.subView.model.value,
                                        availableOrganizations: {
                                            ...state.view.value.views.viewOrg.value.subView.model.value.availableOrganizations,
                                            organizations: newAvailableOrgs,
                                            queried: actions.applyQuery(newAvailableOrgs, availableOrganizations.searchBy),
                                            searchBy: availableOrganizations.searchBy
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

export function removeOrganization(state: StoreState, action: actions.RemoveOrganizationSuccess): StoreState {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.MANAGE_RELATED_ORGS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.model.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const {
        view: {
            value: {
                views: {
                    viewOrg: {
                        value: {
                            organization: { relatedOrganizations },
                            subView: {
                                model: {
                                    value: {
                                        availableOrganizations
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } = state;

    // Remove from the related orgs
    const newRelatedOrgs = relatedOrganizations.filter((organizationId: string) => {
        return (organizationId !== action.organizationId);
    });

    // Update the related status of the org in the management interface.
    const newAvailableOrgs = availableOrganizations.organizations
        .filter((relatedOrg: SelectableRelatableOrganization) => {
            if (relatedOrg.organization.id === action.organizationId) {
                relatedOrg.isRelated = false;
            }
            return relatedOrg;
        });

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
                            organization: {
                                ...state.view.value.views.viewOrg.value.organization,
                                relatedOrganizations: newRelatedOrgs
                            },
                            subView: {
                                ...state.view.value.views.viewOrg.value.subView,
                                model: {
                                    ...state.view.value.views.viewOrg.value.subView.model,
                                    value: {
                                        ...state.view.value.views.viewOrg.value.subView.model.value,
                                        availableOrganizations: {
                                            ...state.view.value.views.viewOrg.value.subView.model.value.availableOrganizations,
                                            organizations: newAvailableOrgs,
                                            queried: actions.applyQuery(newAvailableOrgs, availableOrganizations.searchBy),
                                            searchBy: availableOrganizations.searchBy
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

export function searchSuccess(state: StoreState, action: actions.SearchSuccess): StoreState {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.MANAGE_RELATED_ORGS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.model.loadingState !== AsyncModelState.SUCCESS) {
        return state;
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
                            subView: {
                                ...state.view.value.views.viewOrg.value.subView,
                                model: {
                                    ...state.view.value.views.viewOrg.value.subView.model,
                                    value: {
                                        ...state.view.value.views.viewOrg.value.subView.model.value,
                                        availableOrganizations: {
                                            ...state.view.value.views.viewOrg.value.subView.model.value.availableOrganizations,
                                            queried: action.organizations,
                                            searchBy: action.searchBy
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess);
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_UNLOAD:
            return unload(state, action as actions.Unload);
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SELECT_ORGANIZATION:
            return selectOrganization(state, action as actions.SelectOrganization);
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_SUCCESS:
            return addOrganization(state, action as actions.AddOrganizationSuccess);
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS:
            return removeOrganization(state, action as actions.RemoveOrganizationSuccess);
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_SUCCESS:
            return searchSuccess(state, action as actions.SearchSuccess);
        default:
            return null;
    }
}
