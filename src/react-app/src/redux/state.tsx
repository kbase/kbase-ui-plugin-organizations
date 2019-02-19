import {
    StoreState, AuthState, AppState,
    ComponentLoadingState
} from "../types"

import * as orgModel from '../data/models/organization/model'

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
                },
                organizations: {
                    byId: new Map()
                }
            },
            db: {
            },
            views: {
                browseOrgsView: {
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
                // inviteUserView: {
                //     loadingState: ComponentLoadingState.NONE,
                //     error: null,
                //     viewModel: null
                // },
                manageMembershipView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
                },
                // requestNarrativeView: {
                //     loadingState: ComponentLoadingState.NONE,
                //     error: null,
                //     viewModel: null
                // },
                viewOrgView: {
                    loadingState: ComponentLoadingState.NONE,
                    error: null,
                    viewModel: null
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
                        },
                        Auth: {
                            url: ''
                        }
                    },
                    defaultPath: '',
                    channelId: null
                }
            },

            updateOrg: {
                pending: false
            },


        }
    }
}