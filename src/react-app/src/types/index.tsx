import { ViewOrganizationState } from "../components/ViewOrganization";
import { types } from "util";

/* Types from the organization service (approximately) */

/*
    Organization
*/

export interface OrganizationUpdate {
    name: string
    gravatarHash: string | null
    description: string
}

export enum UIErrorType {
    NONE = 0,
    INFO,
    WARNING,
    ERROR
}

export interface UIError {
    type: UIErrorType,
    message?: string
}

export interface EditableOrganization {
    id: {
        value: string,
        status: FieldState,
        error: UIError
    }
    name: {
        value: string,
        status: FieldState,
        error: UIError
    }
    gravatarHash: {
        value: string | null
        status: FieldState
        error: UIError
    }
    description: {
        value: string,
        status: FieldState,
        error: UIError
    }
}

export interface Owner {
    username: string
    realname: string
    organization: string
    city: string
    state: string
    country: string
    avatarOption: string
    gravatarHash: string
    gravatarDefault: string
}

export enum UserRelationToOrganization {
    NONE = 0,
    VIEW,
    MEMBER,
    ADMIN,
    OWNER
}

export interface BriefOrganization {
    id: string
    name: string
    gravatarHash: string | null
    owner: {
        username: string
        realname: string
    },
    relation: UserRelationToOrganization,
    createdAt: Date
    modifiedAt: Date
}

export interface Organization {
    id: string
    name: string
    gravatarHash: string | null
    description: string
    owner: Owner
    relation: UserRelationToOrganization
    createdAt: Date
    modifiedAt: Date
}

export interface EditedOrganization {
    id: {
        value: string,
        error?: UIError
    }
    name: {
        value: string,
        error?: UIError
    }
    description: {
        value: string,
        error?: UIError
    }
}

/*
    Collection of organizations
*/

export type Organizations = Array<Organization>


/* REDUX */

export enum AuthState {
    NONE = 0,
    CHECKING,
    AUTHORIZED,
    UNAUTHORIZED,
    ERROR
}

export interface UserAuthorization {
    token: string,
    username: string,
    realname: string,
    roles: Array<string>
}


export interface Authorization {
    status: AuthState,
    message: string,
    authorization: UserAuthorization
}

// export enum Filter {
//     All = 1,
//     Yours
// }


export enum EditOrgState {
    NONE = 0,
    FETCHING,
    READY,
    EDITING_CAN_SAVE,
    EDITING_ERRORS,
    SAVING,
    SAVED,
    ERROR
}

// export enum AddOrgState {
//     NONE = 0,
//     READY,
//     UNEDITED_OK,
//     UNEDITED_
//     EDITED_OK,
//     EDITED_ERRORS,
//     SAVING,
//     SAVED,
//     ERROR
// }

export enum SyncState {
    NONE = 'NONE',
    NEW = 'NEW',
    DIRTY = 'DIRTY',
    CLEAN = 'CLEAN'
}

export enum EditState {
    NONE = 'NONE',
    UNEDITED = 'UNEDITED',
    EDITED = 'EDITED'
}

// TODO: or CLEAN to replace new and saved
export enum SaveState {
    NONE = 'NONE',
    NEW = 'NEW',
    READY = 'READY',
    SAVING = 'SAVING',
    SAVED = 'SAVED',
    SAVE_ERROR = 'SAVE_ERROR'
}

export enum ValidationState {
    NONE = 'NONE',
    VALID = 'VALID',
    INVALID = 'INVALID'
}

export enum FieldState {
    NONE = 0,
    UNEDITED_OK,
    UNEDITED_ERROR,
    EDITED_OK,
    EDITED_ERROR,
    EDITED_WARNING
}

export enum ViewOrgState {
    NONE = 0,
    INITIAL,
    FETCHING,
    READY,
    ERROR
}

export enum AppState {
    NONE = 0,
    LOADING,
    READY,
    ERROR
}

export enum SortDirection {
    ASCENDING = 'asc',
    DESCENDING = 'desc'
}


export interface StoreState {
    browseOrgs: {
        rawOrganizations: Array<BriefOrganization>
        organizations: Array<BriefOrganization>
        totalCount: number
        filteredCount: number
        sortBy: string
        sortDirection: SortDirection
        filter: string
        searchTerms: Array<string>
        selectedOrganizationId: string | null
        searching: boolean
    }

    auth: Authorization
    error: AppError | null

    app: {
        status: AppState,
        config: AppConfig,
        error?: AppError
    },
    addOrg: {
        editState: EditState,
        saveState: SaveState,
        validationState: ValidationState,
        newOrganization: EditableOrganization
        error?: AppError
    }
    updateOrg: {
        pending: boolean
    }
    viewOrg: {
        state: ViewOrgState
        organization?: Organization
        error?: AppError
    }
    editOrg: {
        organizationId: string,
        editState: EditState,
        saveState: SaveState,
        validationState: ValidationState,
        editedOrganization: EditableOrganization
        error?: AppError
    }
}

/* COMPONENT PROPS */




// ADD ORG




// export interface EditOrganizationProps {
//     id: string,
//     state: EditOrgState
//     organization?: Organization
//     editedOrganization?: EditedOrganization
//     error?: AppError
//     onEditOrg: (id: string) => void
//     onUpdateOrg: () => void
//     onUpdateName: (name: string) => void,
//     onUpdateDescription: (description: string) => void
// }


export interface AppError {
    code: string,
    message: string
}

export interface AppConfig {
    baseUrl: string,
    services: {
        Groups: {
            url: string
        },
        UserProfile: {
            url: string
        },
        Workspace: {
            url: string
        }
    }
}

export interface AuthProps {
    authorization: Authorization,
    // authStatus: AuthState,
    // token: string | null,
    // username: string | null,
    // realname: string | null,
    hosted: boolean,
    checkAuth: () => void,
    onRemoveAuthorization: () => void,
    onAddAuthorization: (token: string) => void
}

