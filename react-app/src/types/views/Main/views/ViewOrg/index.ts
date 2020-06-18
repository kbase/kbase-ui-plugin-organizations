import * as orgModel from '../../../../../data/models/organization/model';
import * as requestModel from '../../../../../data/models/requests';
import { AsyncModel, View } from '../../../../common';
import { AddAppViewModel } from './views/AddApp';
import { RequestNarrativeViewModel } from './views/RequestNarrative';
import { EditOrgViewModel } from './views/EditOrg';
import { ManageRelatedOrgsViewModel } from './views/ManageRelatedOrgs';
import { InviteUserViewModel } from './views/InviteUser';
import { ManageMembershipViewModel } from './views/ManageMembership';
import { OrganizationViewViewModel } from './views/OrganizationView';

export enum ViewOrgViewModelKind {
    NORMAL = 0,
    PRIVATE_INACCESSIBLE
}

// TODO: just for view org view, should be namespaced or something.
export enum SubViewKind {
    NORMAL = 0,
    MANAGE_RELATED_ORGS,
    INVITE_USER,
    MANAGE_MEMBERSHIP,
    EDIT_ORGANIZATION,
    ADD_NARRATIVE,
    ADD_APP
}

export type SubView<K extends SubViewKind, T> = View<K, T>;

export interface ViewAccessibleOrgViewModel {
    kind: ViewOrgViewModelKind.NORMAL,
    organization: orgModel.Organization;
    relation: orgModel.Relation;
    openRequest: orgModel.RequestStatus;
    groupRequests: Array<requestModel.Request> | null;
    groupInvitations: Array<requestModel.Request> | null;
    requestOutbox: Array<requestModel.Request>;
    requestInbox: Array<requestModel.Request>;
    narratives: {
        sortBy: string;
        searchBy: string;
        narratives: Array<orgModel.NarrativeResource>;
    };
    apps: {
        sortBy: string;
        searchBy: string;
        apps: Array<orgModel.AppResource>;
    };
    // sortNarrativesBy: string
    // searchNarrativesBy: string
    // narratives: Array<orgModel.NarrativeResource>
    sortMembersBy: string;
    searchMembersBy: string;
    members: Array<orgModel.Member>;

    subView: ViewOrgSubView;

    // subViews: {
    //     manageRelatedOrganizationsView: View<ManageRelatedOrgsViewModel>;
    //     inviteUserView: View<InviteUserViewModel>;
    //     requestNarrativeView: View<RequestNarrativeViewModel>;
    //     manageMembershipView: View<ManageMembershipViewModel>;
    //     addAppsView: View<AddAppsViewModel>;
    // };
}

export interface ViewInaccessiblePrivateOrgViewModel {
    kind: ViewOrgViewModelKind.PRIVATE_INACCESSIBLE,
    organization: orgModel.InaccessiblePrivateOrganization;
    relation: orgModel.Relation;
    requestOutbox: Array<requestModel.Request>;
}

export type ViewOrgViewModel =
    ViewAccessibleOrgViewModel | ViewInaccessiblePrivateOrgViewModel;

// SubViews


export interface NoneViewModel { }

export type ViewOrgSubView =
    // SubView<SubViewKind.NONE, NoneViewModel> |
    SubView<SubViewKind.NORMAL, AsyncModel<OrganizationViewViewModel>> |
    SubView<SubViewKind.ADD_APP, AsyncModel<AddAppViewModel>> |
    SubView<SubViewKind.ADD_NARRATIVE, AsyncModel<RequestNarrativeViewModel>> |
    SubView<SubViewKind.EDIT_ORGANIZATION, AsyncModel<EditOrgViewModel>> |
    SubView<SubViewKind.INVITE_USER, AsyncModel<InviteUserViewModel>> |
    SubView<SubViewKind.MANAGE_MEMBERSHIP, AsyncModel<ManageMembershipViewModel>> |
    SubView<SubViewKind.MANAGE_RELATED_ORGS, AsyncModel<ManageRelatedOrgsViewModel>>;
    // SubView<SubViewKind.REQUEST_NARRATIVE, AsyncModel<RequestNarrativeViewModel>>;


// export type ViewOrgSubView = ViewOrgSubViews;



// TODO: restore this



// export interface ViewOrgView {
//     loadingState: ComponentLoadingState;
//     error: AppError | null;
//     viewModel: ViewOrgViewModel | ViewInaccessiblePrivateOrgViewModel | null;
// }



// export interface NoneViewModel {
//     kind: ViewOrgSubViewKind.NONE;
// }







// export type ViewOrgSubView = View<NoneViewModel> | View<ManageRelatedOrgsViewModel>;