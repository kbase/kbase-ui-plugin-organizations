import { Action } from 'redux'
import * as actions from '../../actions/viewOrganization/manageRelatedOrganizations'
import { StoreState, ViewOrgViewModelKind, ViewOrgSubViewKind, ViewState, SelectableRelatableOrganization } from '../../../types';
import { ActionFlag } from '../../actions';
import { OrganizationModel } from '../../../data/models/organization/model';

export function loadSuccess(state: StoreState, action: actions.LoadSuccess): StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    subViews: {
                        ...state.views.viewOrgView.viewModel.subViews,
                        manageRelatedOrganizationsView: {
                            state: ViewState.OK,
                            error: null,
                            viewModel: {
                                kind: ViewOrgSubViewKind.MANAGE_RELATED_ORGS,
                                relatedOrganizations: state.views.viewOrgView.viewModel.organization.relatedOrganizations,
                                organization: state.views.viewOrgView.viewModel.organization,
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

export function unload(state: StoreState, action: actions.Unload): StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    subViews: {
                        ...state.views.viewOrgView.viewModel.subViews,
                        manageRelatedOrganizationsView: {
                            state: ViewState.NONE,
                            error: null,
                            viewModel: null
                        }
                    }
                }
            }
        }
    }
}

export function selectOrganization(state: StoreState, action: actions.SelectOrganization): StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }
    if (state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel === null) {
        return state
    }
    const availableOrgs = state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel.availableOrganizations;

    const organizations = availableOrgs.organizations.map((relatedOrg: SelectableRelatableOrganization) => {
        if (relatedOrg.organization.id === action.selectedOrganization.organization.id) {
            relatedOrg.isSelected = true
        } else {
            relatedOrg.isSelected = false
        }
        return relatedOrg
    })

    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    subViews: {
                        ...state.views.viewOrgView.viewModel.subViews,
                        manageRelatedOrganizationsView: {
                            ...state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView,
                            viewModel: {
                                ...state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel,
                                selectedOrganization: action.selectedOrganization,
                                availableOrganizations: {
                                    organizations: organizations,
                                    queried: actions.applyQuery(organizations, availableOrgs.searchBy),
                                    searchBy: availableOrgs.searchBy
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export function addOrganization(state: StoreState, action: actions.AddOrganizationSuccess): StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }
    if (state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel === null) {
        return state
    }
    const availableOrgs = state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel.availableOrganizations
    const newRelatedOrgs = state.views.viewOrgView.viewModel.organization.relatedOrganizations.concat([action.organizationId])

    const newAvailableOrgs = availableOrgs.organizations.map((relatedOrg: SelectableRelatableOrganization) => {
        if (newRelatedOrgs.includes(relatedOrg.organization.id)) {
            relatedOrg.isRelated = true
        } else {
            relatedOrg.isRelated = false
        }
        return relatedOrg
    })

    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    organization: {
                        ...state.views.viewOrgView.viewModel.organization,
                        relatedOrganizations: newRelatedOrgs
                    },
                    subViews: {
                        ...state.views.viewOrgView.viewModel.subViews,
                        manageRelatedOrganizationsView: {
                            ...state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView,
                            viewModel: {
                                ...state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel,
                                availableOrganizations: {
                                    organizations: newAvailableOrgs,
                                    queried: actions.applyQuery(newAvailableOrgs, availableOrgs.searchBy),
                                    searchBy: availableOrgs.searchBy
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export function removeOrganization(state: StoreState, action: actions.RemoveOrganizationSuccess): StoreState {

    if (!state.views.viewOrgView.viewModel) {
        return state
    }

    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }

    if (state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel === null) {
        return state
    }

    // Remove from the related orgs
    const relatedOrgs = state.views.viewOrgView.viewModel.organization.relatedOrganizations.filter((organizationId: string) => {
        return (organizationId !== action.organizationId)
    })

    const availableOrgs = state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel.availableOrganizations

    // Update the related status of the org in the management interface.
    const newAvailableOrgs = availableOrgs.organizations.filter((relatedOrg: SelectableRelatableOrganization) => {
        if (relatedOrg.organization.id === action.organizationId) {
            relatedOrg.isRelated = false
        }
        return relatedOrg
    })

    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    organization: {
                        ...state.views.viewOrgView.viewModel.organization,
                        relatedOrganizations: relatedOrgs
                    },
                    subViews: {
                        ...state.views.viewOrgView.viewModel.subViews,
                        manageRelatedOrganizationsView: {
                            ...state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView,
                            viewModel: {
                                ...state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel,
                                availableOrganizations: {
                                    organizations: newAvailableOrgs,
                                    queried: actions.applyQuery(newAvailableOrgs, availableOrgs.searchBy),
                                    searchBy: availableOrgs.searchBy
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


export function searchSuccess(state: StoreState, action: actions.SearchSuccess): StoreState {

    if (!state.views.viewOrgView.viewModel) {
        return state
    }

    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }

    if (state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel === null) {
        return state
    }

    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    subViews: {
                        ...state.views.viewOrgView.viewModel.subViews,
                        manageRelatedOrganizationsView: {
                            ...state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView,
                            viewModel: {
                                ...state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel,
                                availableOrganizations: {
                                    ...state.views.viewOrgView.viewModel.subViews.manageRelatedOrganizationsView.viewModel.availableOrganizations,
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

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_UNLOAD:
            return unload(state, action as actions.Unload)
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SELECT_ORGANIZATION:
            return selectOrganization(state, action as actions.SelectOrganization)
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_ADD_ORGANIZATION_SUCCESS:
            return addOrganization(state, action as actions.AddOrganizationSuccess)
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS:
            return removeOrganization(state, action as actions.RemoveOrganizationSuccess)
        case ActionFlag.VIEW_ORG_MANAGE_RELATED_ORGANIZATIONS_SEARCH_SUCCESS:
            return searchSuccess(state, action as actions.SearchSuccess)
        default:
            return null
    }
}
