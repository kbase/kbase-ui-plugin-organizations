import {
    StoreState, SortDirection, AuthState, AppState,
    EditState, SaveState, ValidationState, BrowseOrgsState, ComponentLoadingState
} from "../types";

// rawOrganizations: [],
//                         organizations: [],
//                         totalCount: 0,
//                         filteredCount: 0,
//                         sortBy: 'name',
//                         sortDirection: SortDirection.ASCENDING,
//                         filter: 'all',
//                         searchTerms: [],
//                         selectedOrganizationId: null,
//                         searching: false
export class StateInstances {
    static makeInitialState(): StoreState {
        return {
            entities: {
                users: {
                    byId: new Map(),
                    all: []
                },
                orgs: {
                    byId: new Map(),
                    all: []
                },
                requests: {
                    byId: new Map(),
                    all: []
                },
                narratives: {
                    byId: new Map()
                }
            },
            db: {
                notifications: {
                    all: [],
                    byId: new Map(),
                    // collections: {
                    //     byGroup: new Map()
                    // }
                }
            },
            views: {
                browseOrgsView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
                organizationCentricView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
                addOrgView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
                editOrgView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                    // organizationId: '',
                    // editState: EditState.NONE,
                    // saveState: SaveState.NONE,
                    // validationState: ValidationState.NONE,
                    // editedOrganization: StaticData.makeEmptyEditableOrganization(),
                    // organization: null
                },
                manageOrganizationRequestsView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
                viewMembersView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
                inviteUserView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
                manageMembershipView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
                requestNarrativeView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
                dashboardView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
                viewOrgView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
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
                        },
                        Feeds: {
                            url: ''
                        },
                        Auth: {
                            url: ''
                        }
                    }
                }
            },

            updateOrg: {
                pending: false
            },


        }
    }
}