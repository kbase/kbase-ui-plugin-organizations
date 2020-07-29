
import * as orgModel from '../../../../../../../../data/models/organization/model';
import { OrganizationUser, User } from '../../../../../common';

export enum InviteUserViewState {
    NONE = 0,
    EDITING,
    SENDABLE,
    SENDING,
    SUCCESS,
    ERROR
}

export type InviteUserViewModel = {
    organization: orgModel.Organization;
    users: Array<OrganizationUser> | null;
    selectedUser: {
        user: User,
        relation: orgModel.UserRelationToOrganization;
    } | null;
    editState: InviteUserViewState;
};