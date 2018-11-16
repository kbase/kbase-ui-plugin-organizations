import { ViewOrganizationState } from "../components/ViewOrganization";
import { types } from "util";
import Organizations from "../containers/Organizations";

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

export interface UserBase {
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

export interface User extends UserBase {

}

export interface Owner extends UserBase {

}

export interface Member extends UserBase {

}

export interface Admin extends UserBase {

}

export enum UserRelationToOrganization {
    NONE = 0,
    VIEW,
    MEMBER_REQUEST_PENDING,
    MEMBER_INVITATION_PENDING,
    MEMBER,
    ADMIN,
    OWNER
}

export interface UserOrgRelation {
    type: UserRelationToOrganization
}

export interface NoRelation extends UserOrgRelation {
    type: UserRelationToOrganization.NONE
}

export interface ViewRelation extends UserOrgRelation {
    type: UserRelationToOrganization.VIEW
}

export interface MembershipRequestPendingRelation extends UserOrgRelation {
    type: UserRelationToOrganization.MEMBER_REQUEST_PENDING,
    requestId: string
}

export interface MembershipInvitationPendingRelation extends UserOrgRelation {
    type: UserRelationToOrganization.MEMBER_INVITATION_PENDING,
    requestId: string
}

export interface MemberRelation extends UserOrgRelation {
    type: UserRelationToOrganization.MEMBER
}

export interface AdminRelation extends UserOrgRelation {
    type: UserRelationToOrganization.ADMIN
}

export interface OwnerRelation extends UserOrgRelation {
    type: UserRelationToOrganization.OWNER
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

export enum RequestType {
    JOIN_GROUP_REQUEST = 0,
    JOIN_GROUP_INVITE,
    ADD_WORKSPACE_INVITE,
    ADD_WORKSPACE_REQUEST
}

export enum RequestStatus {
    OPEN = 0,
    CANCELED,
    EXPIRED,
    ACCEPTED,
    DENIED
}

export type Username = string

export interface GroupRequest {
    id: string,
    groupId: string,
    requester: User,
    type: RequestType,
    status: RequestStatus,
    subjectUser: User | null,
    subjectWorkspaceId: number | null,
    createdAt: Date,
    expireAt: Date,
    modifiedAt: Date
}

export interface Organization {
    id: string
    name: string
    gravatarHash: string | null
    description: string
    owner: Owner
    relation: UserOrgRelation
    createdAt: Date
    modifiedAt: Date,
    members: Array<Member>,
    admins: Array<Admin>,
    adminRequests: Array<GroupRequest>
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

export interface ManageGroupRequestsView {
    view: {
        organization: Organization
        requests: Array<GroupRequest>
    } | null,
    error: AppError | null
}
export interface StoreState {
    browseOrgs: {
        rawOrganizations: Array<Organization>
        organizations: Array<Organization>
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
        status: AppState
        config: AppConfig
        error?: AppError
    }
    addOrg: {
        editState: EditState
        saveState: SaveState
        validationState: ValidationState
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
        organizationId: string
        editState: EditState
        saveState: SaveState
        validationState: ValidationState
        editedOrganization: EditableOrganization
        error?: AppError
    }
    manageGroupRequestsView: ManageGroupRequestsView | null
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

