import * as userProfile from "../data/apis/userProfile"
import * as groups from "../data/apis/groups"
import * as orgModel from '../data/models/organization/model'
import * as userModel from "../data/models/user"
import * as requestModel from '../data/models/requests'
import * as narrativeModel from '../data/models/narrative'
import * as uberModel from '../data/models/uber'
import * as feedsModel from '../data/models/feeds'
import { AnError } from "../combo/error/api";

/* Types from the organization service (approximately) */

/*
    Organization
*/


export enum ComponentView {
    COMPACT = 0,
    NORMAL
}

export enum UIErrorType {
    NONE = 0,
    INFO,
    WARNING,
    ERROR
}

export interface UIError {
    type: UIErrorType
    message?: string
}

export enum SyncState {
    NONE = 0,
    NEW,
    DIRTY,
    CLEAN
}

export enum EditState {
    NONE = 'NONE',
    UNEDITED = 'UNEDITED',
    EDITED = 'EDITED'
}


// export enum ValidationState {
//     NONE = 0,
//     VALID,
//     INVALID,
//     // DIRTY = 'DIRTY',
//     MISSING
// }

export enum ValidationErrorType {
    OK = 0,
    ERROR,
    REQUIRED_MISSING
}

export interface ValidationStateBase {
    type: ValidationErrorType
    validatedAt: Date
}

export interface ValidationStateOk extends ValidationStateBase {
    type: ValidationErrorType.OK
}

export interface ValidationStateError extends ValidationStateBase {
    type: ValidationErrorType.ERROR
    message: string
}

export interface ValidationStateRequiredMissing extends ValidationStateBase {
    type: ValidationErrorType.REQUIRED_MISSING
    message: string
}

// export interface ValidationStateAsyncError extends ValidationStateBase {
//     type: ValidationErrorType.ASYNC_ERROR
//     message: string
//     
// }

export type ValidationState = ValidationStateOk | ValidationStateError | ValidationStateRequiredMissing

export interface Editable {
    value: any
    remoteValue: any
    syncState: SyncState
    // editState: EditState
    // validationState: ValidationState
    validationState: ValidationState
    // validatedAt: Date | null
    // error: UIError
}
export interface EditableString extends Editable {
    value: string,
    remoteValue: string | null
}

export interface EditableNullableString extends Editable {
    value: string | null
    remoteValue: string | null
}

export interface EditableBoolean extends Editable {
    value: boolean
    remoteValue: boolean | null
}

export interface EditableOrganization {
    id: EditableString
    name: EditableString
    description: EditableString
    isPrivate: EditableBoolean
    logoUrl: EditableNullableString
    homeUrl: EditableNullableString
    researchInterests: EditableString
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

// export enum UserRelationToOrganization {
//     NONE = 0,
//     VIEW,
//     MEMBER_REQUEST_PENDING,
//     MEMBER_INVITATION_PENDING,
//     MEMBER,
//     ADMIN,
//     OWNER
// }

// export interface UserOrgRelation {
//     type: UserRelationToOrganization
// }

// export interface NoRelation extends UserOrgRelation {
//     type: UserRelationToOrganization.NONE
// }

// export interface ViewRelation extends UserOrgRelation {
//     type: UserRelationToOrganization.VIEW
// }

// export interface MembershipRequestPendingRelation extends UserOrgRelation {
//     type: UserRelationToOrganization.MEMBER_REQUEST_PENDING,
//     requestId: string
// }

// export interface MembershipInvitationPendingRelation extends UserOrgRelation {
//     type: UserRelationToOrganization.MEMBER_INVITATION_PENDING,
//     requestId: string
// }

// export interface MemberRelation extends UserOrgRelation {
//     type: UserRelationToOrganization.MEMBER
// }

// export interface AdminRelation extends UserOrgRelation {
//     type: UserRelationToOrganization.ADMIN
// }

// export interface OwnerRelation extends UserOrgRelation {
//     type: UserRelationToOrganization.OWNER
// }



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


// export type Request = UserRequest | UserInvitation | WorkspaceRequest | WorkspaceInvitation | AppRequest | AppInvitation

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

// REVIVE in a different form? Or not? This is the old Organization
// export interface Organization {
//     id: string
//     name: string
//     gravatarHash: string | null
//     description: string
//     owner: Member
//     relation: UserOrgRelation
//     createdAt: Date
//     modifiedAt: Date,
//     members: Array<Member>,
//     // admins: Array<Admin>,
//     adminRequests: Array<requestModel.Request>,
//     narratives: Array<NarrativeResource>,
//     apps: Array<AppResource>
// }

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

export interface ManageOrganizationRequestsViewModel {
    organization: orgModel.Organization
    requests: Array<requestModel.Request>
    invitations: Array<requestModel.Request>
}

export interface ManageOrganizationRequestsView {
    loadingState: ComponentLoadingState
    error: AppError | null
    viewModel: ManageOrganizationRequestsViewModel | null
}

export interface ViewMembersViewModel {
    organization: orgModel.Organization
    relation: orgModel.Relation
}

export interface ViewMembersView {
    loadingState: ComponentLoadingState,
    error: AppError | null,
    viewModel: ViewMembersViewModel | null
}

export enum BrowseOrgsState {
    NONE = 0,
    SEARCHING,
    SUCCESS,
    ERROR
}

export interface BrowseOrgsViewModel {
    rawOrganizations: Array<orgModel.BriefOrganization>
    organizations: Array<orgModel.BriefOrganization>
    totalCount: number
    filteredCount: number
    sortField: string
    sortDirection: SortDirection
    filter: string
    searchTerms: Array<string>
    selectedOrganizationId: string | null,
    // TODO: let's make a new interface for running operations...
    searching: boolean
    error: AppError | null
}

export interface BrowseOrgsView {
    loadingState: ComponentLoadingState,
    error: AppError | null,
    viewModel: BrowseOrgsViewModel | null
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


// a user who may or may not be in an org, with org relation info
// todo: fetch more profile info.
export interface OrganizationUser {
    username: string
    realname: string
    relation: orgModel.UserRelationToOrganization
}

export interface InviteUserViewModel {
    organization: orgModel.Organization
    users: Array<OrganizationUser> | null
    selectedUser: {
        user: User,
        relation: orgModel.UserRelationToOrganization
    } | null
    editState: InviteUserViewState
}

export interface InviteUserView {
    loadingState: ComponentLoadingState
    viewModel: InviteUserViewModel | null
    error: AppError | null
    // viewState: AppError | InviteUserValue | null
}

export interface ManageMembershipViewModel {
    organization: orgModel.Organization
    editableMemberProfile: orgModel.EditableMemberProfile
    editState: EditState
    saveState: SaveState
    validationState: ValidationState
}

export interface ManageMembershipView {
    loadingState: ComponentLoadingState
    error: AnError | null
    viewModel: ManageMembershipViewModel | null
}

export enum NarrativeState {
    NONE = 0,
    ASSOCIATED,
    REQUESTED
}

export interface Narrative {
    workspaceId: number,
    objectId: number,
    title: string,
    status: NarrativeState,
    // inOrganization: boolean,
    // createdAt: Date,
    modifiedAt: Date
}

// export enum UserWorkspacePermission {
//     NONE = 0,
//     READ,
//     WRITE,
//     ADMIN,
//     OWN
// }


export enum ProcessingState {
    NONE = 0,
    PROCESSING,
    SUCCESS,
    ERROR
}


export enum RequestNarrativeState {
    NONE = 0,
    LOADING,
    ERROR,
    LOADED,
    SENDING,
    SENT
}


export interface RequestNarrativeViewModel {
    organization: orgModel.Organization
    narratives: Array<Narrative>
    selectedNarrative: Narrative | null
    relation: orgModel.Relation
    error: AppError | null
    saveState: SaveState
}

export interface RequestNarrativeView {
    loadingState: ComponentLoadingState
    error: AppError | null
    viewModel: RequestNarrativeViewModel | null
}

export interface AddOrgViewModel {
    editState: EditState
    saveState: SaveState
    error: AppError | null
    validationState: ValidationState
    newOrganization: EditableOrganization
}

export interface AddOrgView {
    loadingState: ComponentLoadingState
    error: AppError | null
    viewModel: AddOrgViewModel | null
}

export interface Notification {

}

export interface DashboardViewModel {
    organizations: Array<orgModel.BriefOrganization>
    // organizations: Array<uberModel.UberOrganization>
    // users: Map<userModel.Username, userModel.User>
    refreshState: ComponentLoadingState
    requestInbox: Array<requestModel.Request>
    requestOutbox: Array<requestModel.Request>
    pendingAdminRequests: Array<requestModel.Request>
    // notifications: Array<Notification>
}

export interface DashboardView {
    loadingState: ComponentLoadingState
    error: SomeError | null
    viewModel: DashboardViewModel | null
}

export interface UserEntity {
    userId: string
    profile: userProfile.UserProfile
}

export interface OrganizationEntity {
    groupId: string
    group: groups.Group
}

export interface RequestEntity {
    requestId: string
    request: groups.Request
}

export interface OrganizationCentricView {
    loadingState: ComponentLoadingState
    error: AppError | null
    viewModel: OrganizationCentricViewModel | null
}
export interface OrganizationCentricViewModel {
    organization: orgModel.Organization
    pendingJoinRequest: requestModel.UserRequest | null
    pendingJoinInvitation: requestModel.UserInvitation | null
    relation: orgModel.Relation
}

export enum ViewOrgViewModelKind {
    NORMAL = 0,
    PRIVATE_INACCESSIBLE
}

export interface ViewOrgViewModel {
    kind: ViewOrgViewModelKind.NORMAL,
    organization: orgModel.Organization
    relation: orgModel.Relation
    groupRequests: Array<requestModel.Request> | null
    groupInvitations: Array<requestModel.Request> | null
    requestOutbox: Array<requestModel.Request>
    requestInbox: Array<requestModel.Request>
}

export interface ViewInaccessiblePrivateOrgViewModel {
    kind: ViewOrgViewModelKind.PRIVATE_INACCESSIBLE,
    organization: orgModel.InaccessiblePrivateOrganization
    relation: orgModel.Relation
    requestOutbox: Array<requestModel.Request>
}

export interface ViewOrgView {
    loadingState: ComponentLoadingState
    error: AppError | null
    viewModel: ViewOrgViewModel | ViewInaccessiblePrivateOrgViewModel | null
}

export interface EditOrgViewModel {
    editState: EditState
    saveState: SaveState
    validationState: ValidationState
    editedOrganization: EditableOrganization
    organization: orgModel.Organization
    saveError: AppError | null
}

export interface EditOrgView {
    loadingState: ComponentLoadingState,
    error: AppError | null,
    viewModel: EditOrgViewModel | null
}

export interface LastVisited {
    lastVisitedAt: Date | null
}

export interface StoreState {
    // new!!
    entities: {
        users: {
            byId: Map<userModel.Username, userModel.User>
            all: Array<string>
        }
        orgs: {
            byId: Map<orgModel.OrganizationID, orgModel.Organization | orgModel.InaccessiblePrivateOrganization>
            all: Array<string>
        }
        requests: {
            byId: Map<requestModel.RequestID, requestModel.Request>
            all: Array<string>
        }
        narratives: {
            byId: Map<narrativeModel.WorkspaceID, narrativeModel.Narrative>
        }
        // notifications: {
        //     byId: <Map<
        // }
    }

    db: {
        notifications: {
            all: Array<feedsModel.OrganizationNotification>
            byId: Map<feedsModel.NotificationID, feedsModel.OrganizationNotification>
            // collections: {
            //     byGroup: Map<orgModel.OrganizationID, Array<feedsModel.NotificationID>>
            // }
        }
        lastVisited: {
            byId: Map<orgModel.OrganizationID, LastVisited>
        }
    }

    auth: Authorization
    error: AppError | null

    app: {
        status: AppState
        config: AppConfig
        error?: AppError
    }

    views: {
        browseOrgsView: BrowseOrgsView
        addOrgView: AddOrgView
        viewOrgView: ViewOrgView
        editOrgView: EditOrgView
        manageOrganizationRequestsView: ManageOrganizationRequestsView
        viewMembersView: ViewMembersView
        inviteUserView: InviteUserView
        manageMembershipView: ManageMembershipView
        requestNarrativeView: RequestNarrativeView
        dashboardView: DashboardView
        organizationCentricView: OrganizationCentricView
    }
    updateOrg: {
        pending: boolean
    }
}

export enum ErrorCode {
    NONE = 0,
    ERROR
}

/* COMPONENT PROPS */

export interface SomeError {
    code: ErrorCode
    message: string
    detail: string
    id: string
    at: Date

    errorHistory?: Array<AppError>
    trace?: Array<string>
    info?: any
}

export interface AppError {
    code: string
    message: string
    generatedAt?: Date
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
        }
        UserProfile: {
            url: string
        }
        Workspace: {
            url: string
        }
        ServiceWizard: {
            url: string
        }
        Feeds: {
            url: string
        }
        Auth: {
            url: string
        }
    }
    defaultPath: string
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

export interface IFrameParams {
    channelId: string
    frameId: string
    params: {
        groupsServiceURL: string
        userProfileServiceURL: string
        workspaceServiceURL: string
        serviceWizardURL: string
        feedsServiceURL: string
        authServiceURL: string
        originalPath: string | null,
        view: string | null,
        viewParams: any
    },
    parentHost: string
}