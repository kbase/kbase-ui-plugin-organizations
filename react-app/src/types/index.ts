import * as userProfile from "../data/apis/userProfile";
import * as groups from "../data/apis/groups";
import * as orgModel from '../data/models/organization/model';
import * as userModel from "../data/models/user";
import * as requestModel from '../data/models/requests';
import * as narrativeModel from '../data/models/narrative';
import * as appModel from '../data/models/apps';

import { AppError, BaseStoreState } from "@kbase/ui-components";
import { MainViewModel } from "./views/Main";


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
    type: UIErrorType;
    message?: string;
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

export type Username = string;

export interface App {
    id: string,
    module: string,
    func: string,
    version: string,
    title: string,
    category: string;
}

export interface AppResource {
    id: string;
}

export interface EditedOrganization {
    id: {
        value: string,
        error?: UIError;
    };
    name: {
        value: string,
        error?: UIError;
    };
    description: {
        value: string,
        error?: UIError;
    };
}

/*
    Collection of organizations
*/

/* REDUX */

// export enum AuthState {
//     NONE = 0,
//     CHECKING,
//     AUTHORIZED,
//     UNAUTHORIZED,
//     ERROR
// }

// export interface UserAuthorization {
//     token: string,
//     username: string,
//     realname: string,
//     roles: Array<string>
// }


// export interface Authorization {
//     status: AuthState,
//     message: string,
//     authorization: UserAuthorization
// }

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


// user info we get out of user profile search


// a user who may or may not be in an org, with org relation info
// todo: fetch more profile info.


// View Model / Invite User (for admins)







// export interface ManageMembershipView {
//     loadingState: ComponentLoadingState
//     error: AnError | null
//     viewModel: ManageMembershipViewModel | null
// }

export enum NarrativeState {
    NONE = 0,
    ASSOCIATED,
    REQUESTED
}

export interface Narrative {
    workspaceId: number;
    objectId: number;
    title: string;
    status: NarrativeState;
    owner: Username;
    modifiedAt: Date;
}

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
    SELECTING,
    SELECTED,
    SENDING,
    SENT
}


// Entities

export interface UserEntity {
    userId: string;
    profile: userProfile.UserProfile;
}

export interface OrganizationEntity {
    groupId: string;
    group: groups.Group;
}

export interface RequestEntity {
    requestId: string;
    request: groups.Request;
}

export interface MyStoreState {
    // new!!
    entities: {
        users: {
            byId: Map<userModel.Username, userModel.User>;
            all: Array<string>;
        };
        orgs: {
            byId: Map<orgModel.OrganizationID, orgModel.Organization | orgModel.InaccessiblePrivateOrganization>;
            all: Array<string>;
        };
        requests: {
            byId: Map<requestModel.RequestID, requestModel.Request>;
            all: Array<string>;
        };
        narratives: {
            byId: Map<narrativeModel.WorkspaceID, narrativeModel.Narrative>;
        };
        organizations: {
            byId: Map<orgModel.OrganizationID, orgModel.Organization | orgModel.InaccessiblePrivateOrganization>;
        };
        apps: {
            byId: Map<appModel.AppID, appModel.AppFullInfo>;
        };
    };

    db: {
    };

    // auth: Authorization
    error: AppError | null;

    orgsApp: {
        // status: AppState;
        // config: AppConfig;
        error?: AppError,
    };

    view: MainViewModel;

    // views: {
    // browseOrgsView: BrowseOrgsView;
    // addOrgView: AddOrgView;
    // viewOrgView: ViewOrgView;
    // editOrgView: EditOrgView;
    // manageOrganizationRequestsView: ManageOrganizationRequestsView;
    // viewMembersView: ViewMembersView;
    // // inviteUserView: InviteUserView
    // manageMembershipView: ManageMembershipView
    // requestNarrativeView: RequestNarrativeView
    // organizationCentricView: OrganizationCentricView
    // };
    updateOrg: {
        pending: boolean;
    };
}

export interface StoreState extends BaseStoreState, MyStoreState {
    // entities: {
    //     jobs: {
    //         byId: Map<string, Job>
    //     }
    // },
}

export enum ErrorCode {
    NONE = 0,
    ERROR
}

/* COMPONENT PROPS */

export interface SomeError {
    code: ErrorCode;
    message: string;
    detail: string;
    id: string;
    at: Date;

    errorHistory?: Array<AppError>;
    trace?: Array<string>;
    info?: any;
}

// export interface AppError {
//     code: string;
//     message: string;
//     generatedAt?: Date;
//     trace?: Array<string>;
//     errors?: Array<AppError>;
//     exception?: AppException;
// }

export class AppException extends Error {
    code: string;
    message: string;
    detail?: string;
    trace?: Array<string>;
    errors?: Array<AppException>;
    info?: Map<string, any>;
    constructor({ code, message, detail, info }: { code: string, message: string, detail?: string, info?: Map<string, any>; }) {
        super(message);
        this.name = 'AppException';
        this.code = code;
        this.message = message;
        this.detail = detail;
        this.info = info;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppException);
        }

        if (this.stack) {
            if (this.stack.indexOf('\n') >= 0) {
                this.trace = this.stack.split('\n');
            } else {
                this.trace = [this.stack];
            }
        }
    }
}

// export interface AppConfig {
//     baseUrl: string;
//     services: {
//         Groups: {
//             url: string;
//         };
//         UserProfile: {
//             url: string;
//         };
//         Workspace: {
//             url: string;
//         };
//         ServiceWizard: {
//             url: string;
//         };
//         Auth: {
//             url: string;
//         };
//         NarrativeMethodStore: {
//             url: string;
//         };
//     };
//     defaultPath: string,
//     channelId: string | null;
// }

// export interface AuthProps {
//     authorization: Authorization,
//     // authStatus: AuthState,
//     // token: string | null,
//     // username: string | null,
//     // realname: string | null,
//     hosted: boolean,
//     checkAuth: () => void,
//     onRemoveAuthorization: () => void,
//     onAddAuthorization: (token: string) => void
// }

// export interface IFrameParams {
//     channelId: string
//     frameId: string
//     params: {
//         groupsServiceURL: string
//         userProfileServiceURL: string
//         workspaceServiceURL: string
//         serviceWizardURL: string
//         authServiceURL: string
//         narrativeMethodStoreURL: string
//         originalPath: string | null
//         view: string | null
//         viewParams: any
//     },
//     parentHost: string
// }