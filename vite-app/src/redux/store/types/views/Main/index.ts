import { AsyncModel } from "../../common";
import { AddOrgViewModel } from "./views/AddOrg";
import { BrowseOrgsViewModel } from "./views/BrowseOrgs";
import { ManageOrganizationRequestsViewModel } from "./views/ManageOrganizationRequests";
import { ViewMembersViewModel } from "./views/ViewMembers";
import { ViewOrgViewModel } from "./views/ViewOrg";

export enum ViewKind {
    NONE,
    ADD_ORG,
    BROWSE_ORGS,
    VIEW_ORG,
    // EDIT_ORG,
    VIEW_MEMBERS,
    MANAGE_ORGANIZATION_REQUESTS
}

export interface NoneViewModel { }

export interface MainView {
    views: {
        browseOrgs: BrowseOrgsViewModel,
        viewOrg: AsyncModel<ViewOrgViewModel>,
        viewMembers: ViewMembersViewModel,
        manageRequests: ManageOrganizationRequestsViewModel,
        addOrg: AddOrgViewModel;
    };
}

// export type MainViews =
//     View<ViewKind.NONE, NoneViewModel> |
//     View<ViewKind.ADD_ORG, AddOrgViewModel> |
//     // View<ViewKind.EDIT_ORG, EditOrgViewModel> |
//     View<ViewKind.MANAGE_ORGANIZATION_REQUESTS, ManageOrganizationRequestsViewModel> |
//     View<ViewKind.VIEW_MEMBERS, ViewMembersViewModel> |
//     View<ViewKind.BROWSE_ORGS, BrowseOrgsViewModel> |
//     View<ViewKind.VIEW_ORG, ViewOrgViewModel>;

export type MainViewModel = AsyncModel<MainView>;