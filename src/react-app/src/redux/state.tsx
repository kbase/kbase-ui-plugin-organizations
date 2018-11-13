import { StoreState, SortDirection, AuthState, AppState, EditState, SaveState, ValidationState, ViewOrgState, EditOrgState } from "../types";
import { StaticData } from "../data/model";

export class StateInstances {
    static makeInitialState(): StoreState {
        return {
            browseOrgs: {
                rawOrganizations: [],
                organizations: [],
                totalCount: 0,
                filteredCount: 0,
                sortBy: 'name',
                sortDirection: SortDirection.ASCENDING,
                filter: 'all',
                searchTerms: [],
                selectedOrganizationId: null,
                searching: false,
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
                        }
                    }
                }
            },
            addOrg: {
                editState: EditState.NONE,
                saveState: SaveState.NONE,
                validationState: ValidationState.NONE,
                newOrganization: StaticData.makeEmptyEditableOrganization()
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
                editedOrganization: StaticData.makeEmptyEditableOrganization()
            },
        }
    }
}