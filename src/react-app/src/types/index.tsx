import { ViewOrganizationState } from "../components/viewOrganization/ViewOrganization";
import { types, error } from "util";
import Organizations from "../components/browseOrgs/OrganizationsContainer";
import { string } from "prop-types";

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

export interface User {
    username: string
    realname: string
    title: string | null
    organization: string | null
    city: string | null
    state: string | null
    country: string | null
    avatarOption: string | null
    gravatarHash: string | null
    gravatarDefault: string | null
}

export enum MemberType {
    MEMBER = 0,
    ADMIN,
    OWNER
}
export interface Member {
    user: User,
    type: MemberType
}



// export interface User extends UserBase {

// }

// export interface Owner extends UserBase {

// }

// export interface Member extends UserBase {

// }

// export interface Admin extends UserBase {

// }

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
    REQUEST = 0,
    INVITATION
}

export enum RequestResourceType {
    USER = 0,
    WORKSPACE,
    APP
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
    id: string
    groupId: string
    requester: User
    type: RequestType
    status: RequestStatus
    resourceType: RequestResourceType
    // subjectUser: User | null,
    // subjectWorkspaceId: number | null,
    createdAt: Date
    expireAt: Date
    modifiedAt: Date
}

export interface UserRequest extends GroupRequest {
    resourceType: RequestResourceType.USER
    type: RequestType.REQUEST
    user: User
}

export interface UserInvitation extends GroupRequest {
    resourceType: RequestResourceType.USER
    type: RequestType.INVITATION
    user: User
}


export interface WorkspaceRequest extends GroupRequest {
    resourceType: RequestResourceType.WORKSPACE
    type: RequestType.REQUEST
    workspace: string
}

export interface WorkspaceInvitation extends GroupRequest {
    resourceType: RequestResourceType.WORKSPACE
    type: RequestType.INVITATION
    workspace: string
}

export interface AppRequest extends GroupRequest {
    resourceType: RequestResourceType.APP
    type: RequestType.REQUEST
    app: string
}

export interface AppInvitation extends GroupRequest {
    resourceType: RequestResourceType.APP
    type: RequestType.INVITATION
    app: string
}

export interface App {
    id: string,
    module: string,
    func: string,
    version: string,
    title: string,
    category: string
}

export interface AppResource {
    id: string
}

export interface Organization {
    id: string
    name: string
    gravatarHash: string | null
    description: string
    owner: Member
    relation: UserOrgRelation
    createdAt: Date
    modifiedAt: Date,
    members: Array<Member>,
    // admins: Array<Admin>,
    adminRequests: Array<GroupRequest>,
    narratives: Array<NarrativeResource>,
    apps: Array<AppResource>
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

export enum ComponentLoadingState {
    NONE = 0,
    LOADING,
    SUCCESS,
    ERROR
}

export interface ManageOrganizationRequestsValue {
    organization: Organization
    requests: Array<GroupRequest>
}
export interface ManageOrganizationRequestsView {
    state: ComponentLoadingState
    viewState: ManageOrganizationRequestsValue | null
    error: AppError | null
}
export enum ViewMembersViewState {
    NONE = 0,
    LOADING,
    SUCCESS,
    ERROR
}

export interface ViewMembersView {
    state: ViewMembersViewState,
    error: AppError | null,
    view: {
        organization: Organization
    } | null
}

export enum BrowseOrgsState {
    NONE = 0,
    SEARCHING,
    SUCCESS,
    ERROR
}

export interface BrowseOrgsView {
    state: BrowseOrgsState,
    error: AppError | null,
    view: {
        rawOrganizations: Array<Organization>
        organizations: Array<Organization>
        totalCount: number
        filteredCount: number
        sortBy: string
        sortDirection: SortDirection
        filter: string
        searchTerms: Array<string>
        selectedOrganizationId: string | null,
        searching: boolean
    } | null
}

export enum InviteUserViewState {
    NONE = 0,
    EDITING,
    SENDABLE,
    SENDING,
    SUCCESS,
    ERROR
}

// user info we get out of user profile search
export interface BriefUser {
    username: string
    realname: string
}

// a user who may or may not be in an org, with org relation info
// todo: fetch more profile info.
export interface OrganizationUser {
    username: string
    realname: string
    relation: UserRelationToOrganization
}

export interface InviteUserValue {
    organization: Organization
    users: Array<OrganizationUser> | null
    selectedUser: {
        user: User,
        relation: UserRelationToOrganization
    } | null
    editState: InviteUserViewState
}

export interface InviteUserView {
    loadingState: ComponentLoadingState
    value: InviteUserValue | null
    error: AppError | null
    // viewState: AppError | InviteUserValue | null
}

export interface ManageMembershipValue {
    organization: Organization
}

export interface ManageMembershipView {
    // state: ComponentLoadingState,
    loading: boolean
    error: AppError | null
    value: ManageMembershipValue | null
    // viewState: AppError | ManageMembershipValue | null
}

export interface Narrative {
    workspaceId: number,
    objectId: number,
    title: string,
    inOrganization: boolean,
    // createdAt: Date,
    modifiedAt: Date
}

export enum UserWorkspacePermission {
    NONE = 0,
    READ,
    WRITE,
    ADMIN,
    OWN
}

export interface NarrativeResource {
    workspaceId: number
    title: string
    permission: UserWorkspacePermission
    isPublic: boolean
}

export enum RequestNarrativeState {
    NONE = 0,
    LOADING,
    ERROR,
    LOADED,
    SENDING,
    SENT
}

export interface RequestNarrativeValue {
    organization: Organization
    narratives: Array<Narrative>
    selectedNarrative: Narrative | null
}

export interface RequestNarrativeView {
    status: RequestNarrativeState
    error: AppError | null
    value: RequestNarrativeValue | null
}

export interface AddOrgViewModel {
    editState: EditState
    saveState: SaveState
    error: AppError | null
    validationState: ValidationState
    newOrganization: EditableOrganization
}

export interface AddOrgView {
    loadingStatus: ComponentLoadingState
    error: AppError | null
    viewModel: AddOrgViewModel | null
}

export interface StoreState {
    browseOrgs: BrowseOrgsView,

    auth: Authorization
    error: AppError | null

    app: {
        status: AppState
        config: AppConfig
        error?: AppError
    }
    addOrgView: AddOrgView
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
        organization: Organization | null
        error?: AppError
    }
    manageOrganizationRequestsView: ManageOrganizationRequestsView
    viewMembersView: ViewMembersView
    inviteUserView: InviteUserView
    manageMembershipView: ManageMembershipView
    requestNarrativeView: RequestNarrativeView
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
    code: string
    message: string
    trace?: Array<string>
    errors?: Array<AppError>
    exception?: AppException
}

export class AppException extends Error {
    code: string
    message: string
    detail?: string
    trace?: Array<string>
    errors?: Array<AppException>
    info?: Map<string, any>
    constructor({ code, message, detail, info }: { code: string, message: string, detail?: string, info?: Map<string, any> }) {
        super(message)
        this.name = 'AppException'
        this.code = code
        this.message = message
        this.detail = detail
        this.info = info

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppException)
        }

        if (this.stack) {
            if (this.stack.indexOf('\n') >= 0) {
                this.trace = this.stack.split('\n')
            } else {
                this.trace = [this.stack]
            }
        }
    }
}

export interface AppConfig {
    baseUrl: string
    services: {
        Groups: {
            url: string
        },
        UserProfile: {
            url: string
        },
        Workspace: {
            url: string
        },
        ServiceWizard: {
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

