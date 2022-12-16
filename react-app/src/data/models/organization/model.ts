import * as groupsApi from '../../apis/groups';

import { EditableOrganization, EditableString, ValidationErrorType, ValidationState } from '../../../redux/store/types/common';
import * as requestModel from '../requests';
import * as userModel from '../user';
import Validation from './validation';

export interface OrganizationUpdate {
    name: string;
    logoUrl: string | null;
    description: string;
    isPrivate: boolean;
    homeUrl: string | null;
    researchInterests: string;
}

export interface User {
    username: string;
    realname: string;
    title: string | null;
    organization: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    avatarOption: string | null;
    gravatarHash: string | null;
    gravatarDefault: string | null;
}

export interface EditableMemberProfile {
    title: EditableString;
}
export enum UserRelationToOrganization {
    NONE = 'NONE',
    VIEW = 'VIEW',
    MEMBER_REQUEST_PENDING = 'MEMBER_REQUEST_PENDING',
    MEMBER_INVITATION_PENDING = 'MEMBER_INVITATION_PENDING',
    MEMBER = 'MEMBER',
    ADMIN = 'ADMIN',
    OWNER = 'OWNER'
}

export interface UserOrgRelation {
    type: UserRelationToOrganization;
}

export interface NoRelation extends UserOrgRelation {
    type: UserRelationToOrganization.NONE;
}

export interface ViewRelation extends UserOrgRelation {
    type: UserRelationToOrganization.VIEW;
}

export interface MembershipRequestPendingRelation extends UserOrgRelation {
    type: UserRelationToOrganization.MEMBER_REQUEST_PENDING;
    requestId: string;
}

export interface MembershipInvitationPendingRelation extends UserOrgRelation {
    type: UserRelationToOrganization.MEMBER_INVITATION_PENDING;
    requestId: string;
}

export interface MemberRelation extends UserOrgRelation {
    type: UserRelationToOrganization.MEMBER;
}

export interface AdminRelation extends UserOrgRelation {
    type: UserRelationToOrganization.ADMIN;
}

export interface OwnerRelation extends UserOrgRelation {
    type: UserRelationToOrganization.OWNER;
}

export type Relation =
    | NoRelation
    | ViewRelation
    | MembershipRequestPendingRelation
    | MembershipInvitationPendingRelation
    | MemberRelation
    | AdminRelation
    | OwnerRelation;

export type Username = string;

export enum MemberType {
    MEMBER = 0,
    ADMIN,
    OWNER
}
export interface Member {
    username: groupsApi.Username;
    realname: string;
    joinedAt: Date;
    lastVisitedAt: Date | null;
    type: MemberType;
    title: string | null;
    isVisible: boolean;
}

export interface MemberUpdate {
    title?: string;
}

export enum UserWorkspacePermission {
    NONE = 0,
    VIEW,
    EDIT,
    ADMIN,
    OWNER
}

export type WorkspaceID = number;

export interface NarrativeResource {
    workspaceId: number;
    title: string;
    permission: UserWorkspacePermission;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    addedAt: Date | null;
    description: string;
    isVisible: boolean;
}

export type AppID = string;

export interface AppResource {
    appId: AppID;
    addedAt: Date | null;
    isVisible: boolean;
}

export interface BriefOrganization {
    id: string;
    name: string;
    logoUrl: string | null;
    isPrivate: boolean;
    homeUrl: string | null;
    researchInterests: string | null;
    // TODO: we need researchInterests here
    owner: Member;
    relation: UserRelationToOrganization;

    isMember: boolean;
    isAdmin: boolean;
    isOwner: boolean;

    createdAt: Date;
    modifiedAt: Date;
    lastVisitedAt: Date | null;

    memberCount: number;
    narrativeCount: number;
    appCount: number;
    relatedOrganizations: Array<OrganizationID>;
}

export enum OrganizationKind {
    NORMAL = 0,
    INACCESSIBLE_PRIVATE
}

export interface InaccessiblePrivateOrganization {
    kind: OrganizationKind.INACCESSIBLE_PRIVATE;
    id: string;
    isPrivate: boolean;
    relation: UserRelationToOrganization;
}

export interface Organization {
    kind: OrganizationKind.NORMAL;
    id: string;
    name: string;

    isPrivate: boolean;
    isMember: boolean;
    isAdmin: boolean;
    isOwner: boolean;

    relation: UserRelationToOrganization;
    logoUrl: string | null;
    homeUrl: string | null;
    researchInterests: string;
    description: string;
    owner: Member;
    areMembersPrivate: boolean;
    members: Array<Member>;
    // relation: UserOrgRelation
    createdAt: Date;
    modifiedAt: Date;
    lastVisitedAt: Date | null;
    narratives: Array<NarrativeResource>;
    apps: Array<AppResource>;
    memberCount: number;
    narrativeCount: number;
    appCount: number;
    relatedOrganizations: Array<OrganizationID>;
}

// export interface RequestStatus {
//     new: boolean,
//     old: boolean
// }

// LEFT OF HERE - inapplicable should be set if the user is not an admin.
export enum RequestStatus {
    INAPPLICABLE = 'INAPPLICABLE',
    NONE = 'NONE',
    OLD = 'OLD',
    NEW = 'NEW'
}

export function determineRelation(
    org: Organization | InaccessiblePrivateOrganization,
    username: userModel.Username,
    request: requestModel.UserRequest | null,
    invitation: requestModel.UserInvitation | null
): Relation {
    if (org.kind === OrganizationKind.INACCESSIBLE_PRIVATE) {
        if (request && request.user === username) {
            return {
                type: UserRelationToOrganization.MEMBER_REQUEST_PENDING,
                requestId: request.id
            } as MembershipRequestPendingRelation;
        } else if (invitation && invitation.user === username) {
            return {
                type: UserRelationToOrganization.MEMBER_INVITATION_PENDING,
                requestId: invitation.id
            } as MembershipInvitationPendingRelation;
        } else {
            return {
                type: UserRelationToOrganization.NONE
            } as NoRelation;
        }
    }

    if (username === org.owner.username) {
        return {
            type: UserRelationToOrganization.OWNER
        } as OwnerRelation;
    } else {
        const member = org.members.find((member) => {
            return member.username === username;
        });
        if (member) {
            switch (member.type) {
                case MemberType.MEMBER:
                    return {
                        type: UserRelationToOrganization.MEMBER
                    } as MemberRelation;
                case MemberType.ADMIN:
                    return {
                        type: UserRelationToOrganization.ADMIN
                    } as AdminRelation;
                case MemberType.OWNER:
                    return {
                        type: UserRelationToOrganization.OWNER
                    } as OwnerRelation;
                default:
                    return {
                        type: UserRelationToOrganization.NONE
                    } as NoRelation;
            }
        } else if (request && request.user === username) {
            return {
                type: UserRelationToOrganization.MEMBER_REQUEST_PENDING,
                requestId: request.id
            } as MembershipRequestPendingRelation;
        } else if (invitation && invitation.user === username) {
            return {
                type: UserRelationToOrganization.MEMBER_INVITATION_PENDING,
                requestId: invitation.id
            } as MembershipInvitationPendingRelation;
        } else {
            return {
                type: UserRelationToOrganization.NONE
            } as NoRelation;
        }
    }
}

function groupPermissionToWorkspacePermission(groupsPermission: string): UserWorkspacePermission {
    switch (groupsPermission) {
        case 'None':
            return UserWorkspacePermission.NONE;
        case 'Read':
            return UserWorkspacePermission.VIEW;
        case 'Write':
            return UserWorkspacePermission.EDIT;
        case 'Admin':
            return UserWorkspacePermission.ADMIN;
        case 'Own':
            return UserWorkspacePermission.OWNER;
        default:
            throw new Error('Invalid groups user permission: ' + groupsPermission);
    }
}

function getRealname(users: Map<userModel.Username, userModel.User>, username: string, defaultValue: string) {
    const user = users.get(username);
    if (!user) {
        return defaultValue;
    }
    return user.realname;
}

export function groupToOrganization(
    group: groupsApi.Group,
    currentUser: Username,
    users: Map<userModel.Username, userModel.User>
): Organization {
    const owner: Member = {
        username: group.owner.name,
        realname: getRealname(users, group.owner.name, 'n/a'),
        joinedAt: new Date(group.owner.joined),
        lastVisitedAt: group.owner.lastvisit ? new Date(group.owner.lastvisit) : null,
        type: MemberType.OWNER,
        title: group.owner.custom.title,
        isVisible: true
    };

    // We join admins and members, since they are all members, just different privileges in the org
    const members = ([
        // owner
    ] as Array<Member>)
        .concat(
            group.admins.map((admin) => {
                return {
                    username: admin.name,
                    realname: getRealname(users, admin.name, 'n/a'),
                    joinedAt: new Date(admin.joined),
                    lastVisitedAt: admin.lastvisit ? new Date(admin.lastvisit) : null,
                    type: MemberType.ADMIN,
                    title: admin.custom.title,
                    isVisible: true
                };
            })
        )
        .concat(
            group.members.map((member) => {
                return {
                    username: member.name,
                    realname: getRealname(users, member.name, 'n/a'),
                    joinedAt: new Date(member.joined),
                    lastVisitedAt: member.lastvisit ? new Date(member.lastvisit) : null,
                    type: MemberType.MEMBER,
                    title: member.custom.title,
                    isVisible: true
                };
            })
        );

    const narratives: Array<NarrativeResource> = group.resources.workspace.map((info) => {
        return {
            workspaceId: parseInt(info.rid, 10),
            title: info.narrname,
            isPublic: info.public,
            permission: groupPermissionToWorkspacePermission(info.perm),
            createdAt: new Date(info.narrcreate),
            updatedAt: new Date(info.moddate),
            description: info.description,
            addedAt: info.added === null ? null : new Date(info.added),
            isVisible: true
        };
    });
    const apps: Array<AppResource> = group.resources.catalogmethod.map((info) => {
        return {
            appId: info.rid.split('.').join('/'),
            addedAt: info.added === null ? null : new Date(info.added),
            isVisible: true
        };
    });

    return {
        kind: OrganizationKind.NORMAL,
        id: group.id,
        name: group.name,
        isPrivate: group.private,
        isMember: group.role !== 'None',
        isAdmin: group.role === 'Admin' || group.role === 'Owner',
        isOwner: group.role === 'Owner',
        relation: groupRoleToUserRelation(group.role),
        logoUrl: group.custom.logourl || null,
        homeUrl: group.custom.homeurl || null,
        researchInterests: group.custom.researchinterests || '',
        description: group.custom.description || '',
        owner: owner,
        areMembersPrivate: group.privatemembers,
        members: members,
        modifiedAt: new Date(group.moddate),
        createdAt: new Date(group.createdate),
        lastVisitedAt: group.lastvisit ? new Date(group.lastvisit) : null,
        narratives: narratives,
        apps: apps,
        memberCount: group.memcount,
        narrativeCount: group.rescount.workspace || 0,
        appCount: group.rescount.catalogmethod || 0,
        relatedOrganizations: group.custom
            ? group.custom.relatedgroups
                ? group.custom.relatedgroups.split(',')
                : []
            : []
    };
}

export function groupToPrivateOrganization(
    group: groupsApi.InaccessiblePrivateGroup,
    currentUser: Username
): InaccessiblePrivateOrganization {
    return {
        kind: OrganizationKind.INACCESSIBLE_PRIVATE,
        id: group.id,
        isPrivate: group.private,
        // isMember: false,
        relation: groupRoleToUserRelation(group.role)
    };
}

export type GroupID = string;
export type OrganizationID = GroupID;

export interface QueryResults {
    organizations: Array<BriefOrganization>;
    total: number;
}

export interface Query {
    searchTerms: Array<string>;
    username: groupsApi.Username;
    sortField: string;
    sortDirection: groupsApi.SortDirection;
    filter: Filter;
}

export function applySearch(orgs: Array<BriefOrganization>, searchTerms: Array<string>): Array<BriefOrganization> {
    const searchTermsRe = searchTerms.map((term) => {
        return new RegExp(term, 'i');
    });
    const filteredOrgs = orgs.filter((org) => {
        if (searchTerms.length === 0) {
            return true;
        }
        return searchTermsRe.every((termRe) => {
            return (
                termRe.test(org.name) ||
                termRe.test(org.researchInterests || '') ||
                termRe.test(org.owner.username) ||
                termRe.test(org.owner.realname)
            );
        });
    });
    return filteredOrgs;
}

function dateDays(d: Date) {
    const t = d.getTime();
    return Math.round(t / (1000 * 60 * 60 * 24));
}

function applySortComparison(sortField: string, direction: number, a: BriefOrganization, b: BriefOrganization) {
    switch (sortField) {
        case 'created':
            return direction * (dateDays(a.createdAt) - dateDays(b.createdAt));
        case 'modified':
        case 'changed':
            return direction * (dateDays(a.modifiedAt) - dateDays(b.modifiedAt));
        case 'name':
            return direction * a.name.localeCompare(b.name);
        case 'owner':
            // TODO: after the dust settles for org -> brief org conversion,
            // we may need to convert the owner to a member via profile...
            return direction * a.owner.username.localeCompare(b.owner.username);
        case 'narrativeCount':
            return direction * (a.narrativeCount - b.narrativeCount);
        case 'appCount':
            return direction * (a.appCount - b.appCount);
        case 'memberCount':
            return direction * (a.memberCount - b.memberCount);
        default:
            console.warn('unimplemented sort field: ' + sortField);
            return 0;
    }
}

function applySort(
    organizations: Array<BriefOrganization>,
    sortField: string,
    sortDirection: groupsApi.SortDirection
): Array<BriefOrganization> {
    const direction = sortDirection === groupsApi.SortDirection.ASCENDING ? 1 : -1;
    return organizations.slice().sort((a, b) => {
        return applySortComparison(sortField, direction, a, b) || applySortComparison('name', 1, a, b);
    });
}

function groupRoleToUserRelation(role: groupsApi.Role): UserRelationToOrganization {
    switch (role) {
        case 'None':
            return UserRelationToOrganization.NONE;
        case 'Member':
            return UserRelationToOrganization.MEMBER;
        case 'Admin':
            return UserRelationToOrganization.ADMIN;
        case 'Owner':
            return UserRelationToOrganization.OWNER;
        default:
            throw new Error('Unknown role: ' + role);
    }
}

export interface Filter {
    roleType: string;
    roles: Array<string>;
    privacy: string;
}

function applyFilter(
    organizations: Array<BriefOrganization>,
    { roleType, roles, privacy }: Filter,
    username: groupsApi.Username
): Array<BriefOrganization> {
    function applyRoleType(org: BriefOrganization) {
        switch (roleType) {
            case 'myorgs':
                return [
                    UserRelationToOrganization.MEMBER,
                    UserRelationToOrganization.ADMIN,
                    UserRelationToOrganization.OWNER
                ].includes(org.relation);
            case 'notmyorgs':
                return ![
                    UserRelationToOrganization.MEMBER,
                    UserRelationToOrganization.ADMIN,
                    UserRelationToOrganization.OWNER
                ].includes(org.relation);
            case 'all':
            default:
                return true;
        }
    }
    function applyRole(org: BriefOrganization) {
        if (roles.length === 0) {
            return true;
        }
        return roles.some((role) => {
            switch (role) {
                case 'member':
                    return org.relation === UserRelationToOrganization.MEMBER;
                case 'admin':
                    return org.relation === UserRelationToOrganization.ADMIN;
                case 'owner':
                    return org.relation === UserRelationToOrganization.OWNER;
                default:
                    return false;
            }
        });
    }
    function applyPrivacy(org: BriefOrganization) {
        switch (privacy) {
            case 'public':
                return !org.isPrivate;
            case 'private':
                return org.isPrivate;
            case 'any':
                return true;
            default:
                return false;
        }
    }
    return organizations.filter((org) => {
        return applyRoleType(org) && applyRole(org) && applyPrivacy(org);
    });
}

// Narrative Sort and Search
function narrativeSortByToComparator(sortBy: string) {
    switch (sortBy) {
        case 'name':
            return (a: NarrativeResource, b: NarrativeResource) => {
                return a.title.localeCompare(b.title);
            };
        case 'updated':
            return (a: NarrativeResource, b: NarrativeResource) => {
                return b.updatedAt.getTime() - a.updatedAt.getTime();
            };
        default:
        case 'added':
            return (a: NarrativeResource, b: NarrativeResource) => {
                if (a.addedAt === null) {
                    if (b.addedAt === null) {
                        return 0;
                    } else {
                        // nulls sort to bottom
                        return 1;
                    }
                } else {
                    if (b.addedAt === null) {
                        return -1;
                    } else {
                        return b.addedAt.getTime() - a.addedAt.getTime();
                    }
                }
            };
    }
}

export function applyNarrativeSort(narratives: Array<NarrativeResource>, sortBy: string) {
    if (!sortBy) {
        return narratives;
    }
    return narratives.slice().sort((a: NarrativeResource, b: NarrativeResource) => {
        const c1 = narrativeSortByToComparator(sortBy)(a, b);
        if (c1 === 0) {
            if (sortBy !== 'name') {
                return narrativeSortByToComparator('name')(a, b);
            }
        }
        return c1;
    });
}

export function applyNarrativeSearch(narratives: Array<NarrativeResource>, searchBy: string) {
    const tokens = searchBy.split(/\s+/).map((token) => {
        return new RegExp(token, 'i');
    });
    if (tokens.length === 0) {
        return narratives;
    }
    // return narratives.slice().filter((narrative: NarrativeResource) => {
    //     return tokens.every((token: RegExp) => {
    //         return token.test(narrative.title);
    //     });
    // });
    narratives.forEach((narrative: NarrativeResource) => {
        narrative.isVisible = (tokens.every((token: RegExp) => {
            return token.test(narrative.title);
        }));
    });
    return narratives;
}

export interface NarrativeQuery {
    searchBy: string;
    sortBy: string;
}

export function queryNarratives(narratives: Array<NarrativeResource>, query: NarrativeQuery) {
    const searched = applyNarrativeSearch(narratives, query.searchBy);
    const sorted = applyNarrativeSort(searched, query.sortBy);
    return sorted;
}

// App Sort and Search
function appSortByToComparator(sortBy: string) {
    switch (sortBy) {
        case 'name':
            return (a: AppResource, b: AppResource) => {
                return a.appId.localeCompare(b.appId);
            };
        default:
        case 'added':
            return (a: AppResource, b: AppResource) => {
                if (a.addedAt === null) {
                    if (b.addedAt === null) {
                        return 0;
                    } else {
                        // nulls sort to bottom
                        return 1;
                    }
                } else {
                    if (b.addedAt === null) {
                        return -1;
                    } else {
                        return b.addedAt.getTime() - a.addedAt.getTime();
                    }
                }
            };
    }
}

export function applyAppSort(apps: Array<AppResource>, sortBy: string) {
    if (!sortBy) {
        return apps;
    }
    return apps.slice().sort((a: AppResource, b: AppResource) => {
        const c1 = appSortByToComparator(sortBy)(a, b);
        if (c1 === 0) {
            if (sortBy !== 'name') {
                return appSortByToComparator('name')(a, b);
            }
        }
        return c1;
    });
}

export function applyAppSearch(apps: Array<AppResource>, searchBy: string) {
    const tokens = searchBy.split(/\s+/).map((token) => {
        return new RegExp(token, 'i');
    });
    if (tokens.length === 0) {
        return apps;
    }
    apps.forEach((app: AppResource) => {
        app.isVisible = (tokens.every((token: RegExp) => {
            return token.test(app.appId);
        }));
    });
    return apps;
}

export interface AppQuery {
    searchBy: string;
    sortBy: string;
}

export function queryApps(apps: Array<AppResource>, query: AppQuery) {
    const searched = applyAppSearch(apps, query.searchBy);
    return applyAppSort(searched, query.sortBy);
}

// Members Sort and Search

function memberSortByToComparator(sortBy: string) {
    switch (sortBy) {
        case 'name':
            // TODO: need to use user real name

            return (a: Member, b: Member) => {
                return a.username.localeCompare(b.username);
            };
        default:
        case 'added':
            return (a: Member, b: Member) => {
                return b.joinedAt.getTime() - a.joinedAt.getTime();
            };
    }
}

export function applyMembersSort(members: Array<Member>, sortBy: string) {
    if (!sortBy) {
        return members;
    }
    return members.slice().sort((a: Member, b: Member) => {
        const c1 = memberSortByToComparator(sortBy)(a, b);
        if (c1 === 0) {
            if (sortBy !== 'name') {
                return memberSortByToComparator('name')(a, b);
            }
        }
        return c1;
    });
}

export function applyMembersSearch(members: Array<Member>, searchBy: string) {
    const tokens = searchBy.split(/\s+/).map((token) => {
        return new RegExp(token, 'i');
    });
    if (tokens.length === 0) {
        return members;
    }
    members.forEach((member: Member) => {
        member.isVisible = tokens.every((token: RegExp) => {
            return token.test(member.username) || token.test(member.realname || '');
        });
    });
    return members;
}

export interface MembersQuery {
    searchBy: string;
    sortBy: string;
}

export function queryMembers(members: Array<Member>, query: MembersQuery) {
    const searched = applyMembersSearch(members, query.searchBy);
    return applyMembersSort(searched, query.sortBy);
}

export interface ConstructorParams {
    groupsServiceURL: string;
    userProfileServiceURL: string;
    token: string;
    username: groupsApi.Username;
}

export class OrganizationModel {
    params: ConstructorParams;
    groupsClient: groupsApi.GroupsClient;
    usersClient: userModel.UserModel;
    // organizations: Map<OrganizationID, Organization | InaccessiblePrivateOrganization>

    constructor(params: ConstructorParams) {
        this.params = params;
        this.groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });
        this.usersClient = new userModel.UserModel({
            userProfileServiceURL: this.params.userProfileServiceURL,
            token: this.params.token
        });
        // this.organizations = new Map<OrganizationID, Organization>()
    }

    async getOrg(id: OrganizationID): Promise<Organization | InaccessiblePrivateOrganization> {
        const group = await this.groupsClient.getGroupById(id);

        // get users from user model (profile)
        if (group.role === 'None' && group.private) {
            return groupToPrivateOrganization(group as groupsApi.InaccessiblePrivateGroup, this.params.username);
        } else {
            const g = group as groupsApi.Group;
            // gather usernames from group
            const usernames: Array<string> = [];
            usernames.push(g.owner.name);
            g.admins.forEach((admin) => {
                usernames.push(admin.name);
            });
            g.members.forEach((member) => {
                usernames.push(member.name);
            });

            const users = await this.usersClient.getUsers(usernames);

            return groupToOrganization(g, this.params.username, users);
        }
    }

    async getGroupUsers(group: groupsApi.Group) {
        // gather usernames from group
        const usernames: Array<string> = [];
        usernames.push(group.owner.name);
        group.admins.forEach((admin) => {
            usernames.push(admin.name);
        });
        group.members.forEach((member) => {
            usernames.push(member.name);
        });

        return await this.usersClient.getUsers(usernames);
    }

    async getOrganization(id: OrganizationID): Promise<Organization> {
        const group = await this.groupsClient.getGroupById(id);
        if (group.role === 'None' && group.private) {
            throw new Error('Inaccessible Organization');
        }

        const users = await this.getGroupUsers(group as groupsApi.Group);

        return groupToOrganization(group as groupsApi.Group, this.params.username, users);
    }

    async getOrgs(ids: Array<OrganizationID>): Promise<Array<Organization | InaccessiblePrivateOrganization>> {
        return Promise.all(
            ids.map((id) => {
                return this.getOrg(id);
            })
        );
    }

    async getOwnOrgs(): Promise<Array<BriefOrganization>> {
        const orgs = await this.getAllOrgs2();

        const ownOrgs = orgs.filter((org: BriefOrganization) => {
            // ensure that user has some relationship to the org:
            // member, admin, or owner
            return org.relation !== UserRelationToOrganization.NONE;
        });

        return ownOrgs;
    }

    listGroupToBriefOrganization(
        group: groupsApi.BriefGroup,
        users: Map<userModel.Username, userModel.User>
    ): BriefOrganization {
        return {
            id: group.id,
            name: group.name,
            logoUrl: group.custom.logourl || null,
            isPrivate: group.private,
            homeUrl: group.custom.homeurl || null,
            researchInterests: group.custom.researchinterests || null,
            owner: {
                username: group.owner,
                realname: getRealname(users, group.owner, 'n/a'),
                lastVisitedAt: null,
                type: MemberType.OWNER,
                joinedAt: new Date(group.createdate),
                title: 'Owner',
                isVisible: true
            },
            relation: groupRoleToUserRelation(group.role),
            isMember: group.role !== 'None',
            isAdmin: group.role === 'Admin' || group.role === 'Owner',
            isOwner: group.role === 'Owner',
            createdAt: new Date(group.createdate),
            modifiedAt: new Date(group.moddate),
            lastVisitedAt: group.lastvisit ? new Date(group.lastvisit) : null,
            memberCount: group.memcount || 0,
            narrativeCount: group.rescount.workspace || 0,
            appCount: group.rescount.catalogmethod || 0,
            relatedOrganizations: group.custom
                ? group.custom.relatedgroups
                    ? group.custom.relatedgroups.split(',')
                    : []
                : []
        };
    }

    async getAllOrgs2(): Promise<Array<BriefOrganization>> {
        let allGroups: Array<groupsApi.BriefGroup> = [];
        let groups: Array<groupsApi.BriefGroup> = await this.groupsClient.listGroups();
        allGroups = allGroups.concat(groups);

        // While we've maxed out the request size, keep getting them.
        for (; groups.length === groupsApi.MAX_GROUPS_PER_LIST_REQUEST;) {
            groups = await this.groupsClient.listGroups({
                excludeUpTo: groups[groups.length - 1].id
            });
            allGroups = allGroups.concat(groups);
        }

        const usernames: Set<string> = new Set();
        allGroups.forEach((g) => {
            usernames.add(g.owner);
        });

        const users = await this.usersClient.getUsers(Array.from(usernames.values()));

        return allGroups.map((group) => {
            return this.listGroupToBriefOrganization(group, users);
        });
    }

    async queryOrgs(query: Query): Promise<QueryResults> {
        const orgs = await this.getAllOrgs2();

        const filtered = applyFilter(orgs, query.filter, query.username);
        const searched = applySearch(filtered, query.searchTerms);
        const sorted = applySort(searched, query.sortField, query.sortDirection);

        return {
            organizations: sorted,
            total: orgs.length
        };
    }

    async ownOrgs(username: groupsApi.Username): Promise<QueryResults> {
        const orgs = await this.getAllOrgs2();
        const ownOrgs = orgs.filter((org: BriefOrganization) => {
            return org.relation !== UserRelationToOrganization.NONE;
        });

        return {
            organizations: ownOrgs,
            total: ownOrgs.length
        };
    }

    async grantViewAccess(requestId: string): Promise<requestModel.Request> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        await groupsClient.grantReadAccessToRequestedResource({ requestId });
        const req = await groupsClient.getRequest(requestId);
        return requestModel.groupRequestToOrgRequest(req);
    }

    async addOrg(newOrg: EditableOrganization, username: groupsApi.Username): Promise<Organization> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        // do record-level validation
        if (
            newOrg.id.validationState.type !== ValidationErrorType.OK ||
            newOrg.name.validationState.type !== ValidationErrorType.OK ||
            newOrg.logoUrl.validationState.type !== ValidationErrorType.OK ||
            newOrg.description.validationState.type !== ValidationErrorType.OK ||
            newOrg.isPrivate.validationState.type !== ValidationErrorType.OK
        ) {
            return Promise.reject(new Error('One or more fields are invalid'));
        }

        const group = await groupsClient.createGroup({
            id: newOrg.id.value,
            name: newOrg.name.value,
            logoUrl: newOrg.logoUrl.value,
            homeUrl: newOrg.homeUrl.value,
            researchInterests: newOrg.researchInterests.value,
            description: newOrg.description.value,
            isPrivate: newOrg.isPrivate.value
        });

        const users = await this.getGroupUsers(group);

        return groupToOrganization(group, username, users);
    }

    async orgExists(id: string): Promise<boolean> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });
        return groupsClient.groupExists(id).then(({ exists }) => {
            return exists;
        });
    }

    async updateOrg(id: string, orgUpdate: OrganizationUpdate): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        // do record-level validation

        return groupsClient.updateGroup(id, {
            name: orgUpdate.name,
            logoUrl: orgUpdate.logoUrl,
            homeUrl: orgUpdate.homeUrl,
            researchInterests: orgUpdate.researchInterests,
            description: orgUpdate.description,
            private: orgUpdate.isPrivate
        });
    }

    validateOrgId(id: string): [string, ValidationState] {
        return Validation.validateOrgId(id);
    }

    validateOrgName(name: string): [string, ValidationState] {
        return Validation.validateOrgName(name);
    }

    validateOrgDescription(description: string): [string, ValidationState] {
        return Validation.validateOrgDescription(description);
    }

    async removeNarrativeFromOrg(organizationId: OrganizationID, workspaceId: number): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        return groupsClient.deleteResource(organizationId, 'workspace', String(workspaceId));
    }

    async removeAppFromOrg(organizationId: OrganizationID, appId: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        const groupFunnyAppId = appId.split('/').join('.');

        return groupsClient.deleteResource(organizationId, 'catalogmethod', groupFunnyAppId);
    }

    async grantNarrativeAccess(groupId: string, resourceId: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        await groupsClient.grantResourceAccess(groupId, 'workspace', resourceId);
    }

    async requestMembership(id: string): Promise<requestModel.Request> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        const request = await groupsClient.requestMembership({
            groupId: id
        });
        return requestModel.groupRequestToOrgRequest(request);
    }

    async addOrRequestNarrativeToGroup(
        groupId: string,
        workspaceId: WorkspaceID
    ): Promise<requestModel.Request | boolean> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        const request = await groupsClient.addOrRequestNarrative({
            groupId: groupId,
            workspaceId: workspaceId
        });
        if (request.complete === true) {
            return true;
        } else {
            return requestModel.groupRequestToOrgRequest(request);
        }
    }

    async addOrRequestAppToGroup(groupId: string, appId: string): Promise<requestModel.Request | boolean> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        const request = await groupsClient.addOrRequestResource({
            groupId,
            type: 'catalogmethod',
            resourceId: appId
        });
        if (request.complete === true) {
            return true;
        } else {
            return requestModel.groupRequestToOrgRequest(request);
        }
    }

    async memberToAdmin(groupId: string, member: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        return groupsClient.memberToAdmin({
            groupId,
            member
        });
    }

    async adminToMember(groupId: string, member: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        return groupsClient.adminToMember({
            groupId,
            member
        });
    }
    async removeMember(groupId: string, member: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        return groupsClient.removeMember({
            groupId,
            member
        });
    }

    async updateMember(groupId: string, memberUsername: string, update: MemberUpdate) {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        return groupsClient.updateMember({ groupId, memberUsername, update });
    }

    async visitOrg({ organizationId }: { organizationId: string; }): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });
        return groupsClient.visitGroup({ groupId: organizationId });
    }

    async getOpenRequestsStatus({
        organizationIds
    }: {
        organizationIds: Array<OrganizationID>;
    }): Promise<Map<OrganizationID, RequestStatus>> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });
        const openRequests = await groupsClient.getOpenRequests({ groupIds: organizationIds });
        const result = new Map<OrganizationID, RequestStatus>();
        for (const [groupId, status] of openRequests.entries()) {
            const requestStatus: RequestStatus = stringToRequestStatus(status);
            result.set(groupId as OrganizationID, requestStatus);
        }
        return result;
    }

    async getOpenRequestStatus({ organizationId }: { organizationId: OrganizationID; }): Promise<RequestStatus> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });
        const openRequests = await groupsClient.getOpenRequests({ groupIds: [organizationId] });
        for (const [, status] of openRequests.entries()) {
            return stringToRequestStatus(status);
        }
        throw new Error('expected request status, got none');
    }

    async addRelatedOrganization({
        organizationId,
        relatedOrganizationId
    }: {
        organizationId: OrganizationID;
        relatedOrganizationId: OrganizationID;
    }): Promise<OrganizationID> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });
        return await groupsClient.addRelatedGroup(organizationId, relatedOrganizationId);
    }

    async removeRelatedOrganization({
        organizationId,
        relatedOrganizationId
    }: {
        organizationId: OrganizationID;
        relatedOrganizationId: OrganizationID;
    }): Promise<OrganizationID> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });
        return await groupsClient.removeRelatedGroup(organizationId, relatedOrganizationId);
    }
}

function stringToRequestStatus(status: groupsApi.RequestStatus): RequestStatus {
    switch (status.new) {
        case 'None':
            return RequestStatus.NONE;
        case 'Old':
            return RequestStatus.OLD;
        case 'New':
            return RequestStatus.NEW;
        default:
            throw new Error('Invalid open request status: ' + status);
    }
}

export function userPermissionToWorkspacePermission(userPermission: string, isOwner: boolean) {
    if (isOwner) {
        return UserWorkspacePermission.OWNER;
    }
    switch (userPermission) {
        case 'r':
            return UserWorkspacePermission.VIEW;
        case 'w':
            return UserWorkspacePermission.EDIT;
        case 'a':
            return UserWorkspacePermission.ADMIN;
        default:
            throw new Error('Invalid workspace user permission: ' + userPermission);
    }
}
