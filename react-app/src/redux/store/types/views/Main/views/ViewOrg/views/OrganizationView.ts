import { ViewOrgViewModelKind } from "..";
import * as orgModel from '../../../../../../../../data/models/organization/model';
import * as requestModel from '../../../../../../../../data/models/requests';

export interface OrganizationViewViewModel {
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
    sortMembersBy: string;
    searchMembersBy: string;
    members: Array<orgModel.Member>;

}

// export interface ViewInaccessiblePrivateOrgViewModel {
//     kind: ViewOrgViewModelKind.PRIVATE_INACCESSIBLE,
//     organization: orgModel.InaccessiblePrivateOrganization;
//     relation: orgModel.Relation;
//     requestOutbox: Array<requestModel.Request>;
// }