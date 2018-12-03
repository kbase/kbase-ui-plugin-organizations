import { StoreState, SortDirection, AuthState, AppState, EditState, SaveState, ValidationState, ViewOrgState, ViewMembersViewState, BrowseOrgsState, InviteUserViewState, ComponentLoadingState, RequestNarrativeState } from "../types";
import { StaticData } from "../data/model";
import { NONAME } from "dns";

export class StateInstances {
    static makeInitialState(): StoreState {
        return {
            browseOrgs: {
                state: BrowseOrgsState.NONE,
                error: null,
                view: {
                    rawOrganizations: [],
                    organizations: [],
                    totalCount: 0,
                    filteredCount: 0,
                    sortBy: 'name',
                    sortDirection: SortDirection.ASCENDING,
                    filter: 'all',
                    searchTerms: [],
                    selectedOrganizationId: null,
                    searching: false
                }
            },

            auth: {
                status: AuthState.NONE,
                message: '',
                authorization: {
                    token: '',
                    username: '',
                    realname: '',
                    roles: []
                }
            },
            error: null,

            app: {
                status: AppState.NONE,
                config: {
                    baseUrl: '',
                    services: {
                        Groups: {
                            url: ''
                        },
                        UserProfile: {
                            url: ''
                        },
                        Workspace: {
                            url: ''
                        },
                        ServiceWizard: {
                            url: ''
                        }
                    }
                }
            },
            addOrgView: {
                loadingStatus: ComponentLoadingState.NONE,
                error: null,
                viewModel: null
            },
            updateOrg: {
                pending: false
            },
            viewOrg: {
                state: ViewOrgState.NONE
            },
            editOrg: {
                organizationId: '',
                editState: EditState.NONE,
                saveState: SaveState.NONE,
                validationState: ValidationState.NONE,
                editedOrganization: StaticData.makeEmptyEditableOrganization(),
                organization: null
            },
            manageOrganizationRequestsView: {
                state: ComponentLoadingState.NONE,
                error: null,
                viewState: null
            },
            viewMembersView: {
                state: ViewMembersViewState.NONE,
                error: null,
                view: null
            },
            inviteUserView: {
                loadingState: ComponentLoadingState.NONE,
                value: null,
                error: null
            },
            manageMembershipView: {
                loading: false,
                error: null,
                value: null
            },
            requestNarrativeView: {
                status: RequestNarrativeState.NONE,
                error: null,
                value: null
            }
        }
    }
}