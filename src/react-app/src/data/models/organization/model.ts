import * as groupsApi from '../../apis/groups'
import {
    SortDirection, EditableOrganization, ValidationState, EditableString, ValidationErrorType
} from '../../../types';
import * as requestModel from '../requests'
import * as userModel from '../user'
import Validation from './validation'

// import Member from '../../../components/entities/Member';


export interface OrganizationUpdate {
    name: string
    logoUrl: string | null
    description: string
    isPrivate: boolean
    homeUrl: string | null
    researchInterests: string
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

export interface EditableMemberProfile {
    title: EditableString
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

export type Relation = NoRelation | ViewRelation | MembershipRequestPendingRelation | MembershipInvitationPendingRelation | MemberRelation | AdminRelation | OwnerRelation

export type Username = string

export enum MemberType {
    MEMBER = 0,
    ADMIN,
    OWNER
}
export interface Member {
    username: groupsApi.Username
    joinedAt: Date
    lastVisitedAt: Date | null
    type: MemberType
    title: string | null
}

export interface MemberUpdate {
    title?: string
}

export enum UserWorkspacePermission {
    NONE = 0,
    VIEW,
    EDIT,
    ADMIN,
    OWNER
}

export type WorkspaceID = number

export interface NarrativeResource {
    workspaceId: number
    title: string
    permission: UserWorkspacePermission
    isPublic: boolean
    createdAt: Date
    updatedAt: Date
    description: string
}

export type AppID = string

export interface AppInfo {
    appId: AppID
}

export interface BriefOrganization {
    id: string
    name: string
    logoUrl: string | null
    isPrivate: boolean
    homeUrl: string | null
    researchInterests: string | null
    // TODO: we need researchInterests here
    owner: Member
    relation: UserRelationToOrganization

    isMember: boolean
    isAdmin: boolean
    isOwner: boolean

    createdAt: Date
    modifiedAt: Date
    lastVisitedAt: Date | null

    memberCount: number
    narrativeCount: number
    relatedOrganizations: Array<OrganizationID>
}

export enum OrganizationKind {
    NORMAL = 0,
    INACCESSIBLE_PRIVATE
}

export interface InaccessiblePrivateOrganization {
    kind: OrganizationKind.INACCESSIBLE_PRIVATE
    id: string
    isPrivate: boolean
    relation: UserRelationToOrganization
}

export interface Organization {
    kind: OrganizationKind.NORMAL
    id: string
    name: string

    isPrivate: boolean
    isMember: boolean
    isAdmin: boolean
    isOwner: boolean

    relation: UserRelationToOrganization
    logoUrl: string | null
    homeUrl: string | null
    researchInterests: string
    description: string
    owner: Member
    areMembersPrivate: boolean
    members: Array<Member>
    // relation: UserOrgRelation
    createdAt: Date
    modifiedAt: Date
    lastVisitedAt: Date | null
    narratives: Array<NarrativeResource>
    apps: Array<AppInfo>
    memberCount: number
    narrativeCount: number
    appCount: number
    relatedOrganizations: Array<OrganizationID>
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
    invitation: requestModel.UserInvitation | null): Relation {

    if (org.kind === OrganizationKind.INACCESSIBLE_PRIVATE) {
        if (request && request.user === username) {
            return {
                type: UserRelationToOrganization.MEMBER_REQUEST_PENDING,
                requestId: request.id
            } as MembershipRequestPendingRelation
        } else if (invitation && invitation.user === username) {
            return {
                type: UserRelationToOrganization.MEMBER_INVITATION_PENDING,
                requestId: invitation.id
            } as MembershipInvitationPendingRelation
        } else {
            return {
                type: UserRelationToOrganization.NONE
            } as NoRelation
        }
    }

    if (username === org.owner.username) {
        return {
            type: UserRelationToOrganization.OWNER
        } as OwnerRelation
    } else {
        const member = org.members.find((member) => {
            return (member.username === username)
        })
        if (member) {
            switch (member.type) {
                case MemberType.MEMBER:
                    return {
                        type: UserRelationToOrganization.MEMBER
                    } as MemberRelation
                case MemberType.ADMIN:
                    return {
                        type: UserRelationToOrganization.ADMIN
                    } as AdminRelation
                case MemberType.OWNER:
                    return {
                        type: UserRelationToOrganization.OWNER
                    } as OwnerRelation
                default:
                    return {
                        type: UserRelationToOrganization.NONE
                    } as NoRelation
            }
        } else if (request && request.user === username) {
            return {
                type: UserRelationToOrganization.MEMBER_REQUEST_PENDING,
                requestId: request.id
            } as MembershipRequestPendingRelation
        } else if (invitation && invitation.user === username) {
            return {
                type: UserRelationToOrganization.MEMBER_INVITATION_PENDING,
                requestId: invitation.id
            } as MembershipInvitationPendingRelation
        } else {
            return {
                type: UserRelationToOrganization.NONE
            } as NoRelation
        }
    }
}

function groupPermissionToWorkspacePermission(groupsPermission: string): UserWorkspacePermission {
    switch (groupsPermission) {
        case 'None':
            return UserWorkspacePermission.NONE
        case 'Read':
            return UserWorkspacePermission.VIEW
        case 'Write':
            return UserWorkspacePermission.EDIT
        case 'Admin':
            return UserWorkspacePermission.ADMIN
        case 'Own':
            return UserWorkspacePermission.OWNER
        default:
            throw new Error('Invalid groups user permission: ' + groupsPermission)
    }
}

export function groupToOrganization(group: groupsApi.Group, currentUser: Username): Organization {

    const owner: Member = {
        username: group.owner.name,
        joinedAt: new Date(group.owner.joined),
        lastVisitedAt: group.owner.lastvisit ? new Date(group.owner.lastvisit) : null,
        type: MemberType.OWNER,
        title: 'Owner'
    }

    // We join admins and members, since they are all members, just different privileges in the org
    const members = (<Array<Member>>[
        // owner
    ]).concat(group.admins.map((admin) => {
        return {
            username: admin.name,
            joinedAt: new Date(admin.joined),
            lastVisitedAt: admin.lastvisit ? new Date(admin.lastvisit) : null,
            type: MemberType.ADMIN,
            title: admin.custom.title
        }
    })).concat(group.members.map((member) => {
        return {
            username: member.name,
            joinedAt: new Date(member.joined),
            lastVisitedAt: member.lastvisit ? new Date(member.lastvisit) : null,
            type: MemberType.MEMBER,
            title: member.custom.title
        }
    }))

    const narratives: Array<NarrativeResource> = group.resources.workspace.map((info) => {
        return {
            workspaceId: parseInt(info.rid, 10),
            title: info.narrname,
            isPublic: info.public,
            permission: groupPermissionToWorkspacePermission(info.perm),
            createdAt: new Date(info.narrcreate),
            updatedAt: new Date(info.moddate),
            description: info.description
        }
    })
    const apps: Array<AppInfo> = []


    return {
        kind: OrganizationKind.NORMAL,
        id: group.id,
        name: group.name,
        isPrivate: group.private,
        isMember: (group.role !== "None"),
        isAdmin: (group.role === "Admin" || group.role === "Owner"),
        isOwner: (group.role === "Owner"),
        relation: groupRoleToUserRelation(group.role),
        logoUrl: group.custom.logourl || null,
        homeUrl: group.custom.homeurl || null,
        researchInterests: group.custom.researchinterests || '',
        description: group.custom.description,
        owner: owner,
        areMembersPrivate: group.privatemembers,
        members: members,
        modifiedAt: new Date(group.moddate),
        createdAt: new Date(group.createdate),
        lastVisitedAt: group.lastvisit ? new Date(group.lastvisit) : null,
        narratives: narratives,
        apps: [],
        memberCount: group.memcount,
        narrativeCount: group.rescount.workspace || 0,
        appCount: group.rescount.catalogmethod || 0,
        relatedOrganizations: group.custom ? group.custom.relatedgroups ? group.custom.relatedgroups.split(',') : [] : []
    }
}

export function groupToPrivateOrganization(group: groupsApi.InaccessiblePrivateGroup, currentUser: Username): InaccessiblePrivateOrganization {
    return {
        kind: OrganizationKind.INACCESSIBLE_PRIVATE,
        id: group.id,
        isPrivate: group.private,
        // isMember: false,
        relation: groupRoleToUserRelation(group.role)
    }
}

// export function determineRelation(group: Group, username: userModel.Username) {
//     let relation: UserOrgRelation
//     // TODO: when we have access to members, admins, and group publication status, we can 
//     // flesh out all user relations.
//     // const orgMembers: Array<username> = this.membersAndAdminsToMembers(members, admins, profileMap)

//     if (username === group.owner) {
//         relation = {
//             type: UserRelationToOrganization.OWNER
//         } as OwnerRelation
//     } else if (group.admins.indexOf(username) >= 0) {
//         relation = {
//             type: UserRelationToOrganization.ADMIN
//         } as AdminRelation
//     } else if (group.members.indexOf(username) >= 0) {
//         relation = {
//             type: UserRelationToOrganization.MEMBER
//         } as MemberRelation
//     } else if (pendingRequests.has(group.id)) {
//         relation = {
//             type: UserRelationToOrganization.MEMBER_REQUEST_PENDING,
//             requestId: pendingRequests.get(group.id)!.id
//         } as MembershipRequestPendingRelation
//     } else if (pendingInvites.has(group.id)) {
//         relation = {
//             type: UserRelationToOrganization.MEMBER_INVITATION_PENDING,
//             requestId: pendingInvites.get(group.id)!.id
//         } as MembershipInvitationPendingRelation
//     } else {
//         relation = {
//             type: UserRelationToOrganization.VIEW
//         } as ViewRelation
//     }
// }

export type GroupID = string
export type OrganizationID = GroupID


export interface ConstructorParams {
    groupsServiceURL: string
    token: string
    username: groupsApi.Username
}

export interface QueryResults {
    organizations: Array<BriefOrganization>
    total: number
}

export interface Query {
    searchTerms: Array<string>
    username: groupsApi.Username
    sortField: string
    sortDirection: SortDirection
    filter: Filter
}

export function applySearch(orgs: Array<BriefOrganization>, searchTerms: Array<string>): Array<BriefOrganization> {
    const searchTermsRe = searchTerms.map((term) => {
        return new RegExp(term, 'i')
    })
    const filteredOrgs = orgs.filter((org) => {
        if (searchTerms.length === 0) {
            return true;
        }
        return searchTermsRe.every((termRe) => {
            return termRe.test(org.name) ||
                termRe.test(org.researchInterests || '') ||
                termRe.test(org.owner.username)
        })
    })
    return filteredOrgs
}

function dateDays(d: Date) {
    const t = d.getTime()
    return Math.round(t / (1000 * 60 * 60 * 24))
}

function applySortComparison(sortField: string, direction: number, a: BriefOrganization, b: BriefOrganization) {
    switch (sortField) {
        case 'created':
            return direction * (dateDays(a.createdAt) - dateDays(b.createdAt))
        case 'modified':
        case 'changed':
            return direction * (dateDays(a.modifiedAt) - dateDays(b.modifiedAt))
        case 'name':
            return direction * a.name.localeCompare(b.name)
        case 'owner':
            // TODO: after the dust settles for org -> brief org conversion,
            // we may need to convert the owner to a member via profile...
            return direction * a.owner.username.localeCompare(b.owner.username)
        case 'narrativeCount':
            return direction * (a.narrativeCount - b.narrativeCount)
        case 'memberCount':
            return direction * (a.memberCount - b.memberCount)
        default:
            console.warn('unimplemented sort field: ' + sortField)
            return 0;
    }
}

function applySort(organizations: Array<BriefOrganization>, sortField: string, sortDirection: SortDirection): Array<BriefOrganization> {
    const direction = sortDirection === SortDirection.ASCENDING ? 1 : -1
    return organizations.slice().sort((a, b) => {
        return applySortComparison(sortField, direction, a, b) || applySortComparison('name', 1, a, b)
    })
}

function groupRoleToUserRelation(role: groupsApi.Role): UserRelationToOrganization {
    switch (role) {
        case 'None': return UserRelationToOrganization.NONE
        case 'Member': return UserRelationToOrganization.MEMBER
        case 'Admin': return UserRelationToOrganization.ADMIN
        case 'Owner': return UserRelationToOrganization.OWNER
        default: throw new Error('Unknown role: ' + role)
    }
}

export interface Filter {
    roleType: string,
    roles: Array<string>,
    privacy: string
}

function applyFilter(organizations: Array<BriefOrganization>, { roleType, roles, privacy }: Filter, username: groupsApi.Username): Array<BriefOrganization> {
    function applyRoleType(org: BriefOrganization) {
        switch (roleType) {
            case 'myorgs':
                return [
                    UserRelationToOrganization.MEMBER,
                    UserRelationToOrganization.ADMIN,
                    UserRelationToOrganization.OWNER
                ].includes(org.relation)
            case 'notmyorgs':
                return ![
                    UserRelationToOrganization.MEMBER,
                    UserRelationToOrganization.ADMIN,
                    UserRelationToOrganization.OWNER
                ].includes(org.relation)
            case 'all':
            default:
                return true
        }
    }
    function applyRole(org: BriefOrganization) {
        if (roles.length === 0) {
            return true
        }
        return roles.some((role) => {
            switch (role) {
                case 'member':
                    return (org.relation === UserRelationToOrganization.MEMBER)
                case 'admin':
                    return (org.relation === UserRelationToOrganization.ADMIN)
                case 'owner':
                    return (org.relation === UserRelationToOrganization.OWNER)
                default:
                    return false
            }
        })
    }
    function applyPrivacy(org: BriefOrganization) {
        switch (privacy) {
            case 'public':
                return !org.isPrivate
            case 'private':
                return org.isPrivate
            case 'any':
                return true
            default:
                return false
        }
    }
    return organizations.filter((org) => {
        return applyRoleType(org) && applyRole(org) && applyPrivacy(org)
    })

    // switch (filter) {
    //     case 'role:all':
    //         return organizations
    //     case 'notMemberOf':
    //         return organizations.filter((org) => {
    //             return (org.relation === UserRelationToOrganization.NONE)
    //         })
    //     case 'memberOf':
    //         return organizations.filter((org) => {
    //             return (org.relation !== UserRelationToOrganization.NONE)
    //         })
    //     case 'role:member':
    //         return organizations.filter((org) => {
    //             return (org.relation === UserRelationToOrganization.MEMBER)
    //         })
    //     case 'role:myorgs':
    //         return organizations.filter((org) => {
    //             return [
    //                 UserRelationToOrganization.MEMBER,
    //                 UserRelationToOrganization.ADMIN,
    //                 UserRelationToOrganization.OWNER
    //             ].includes(org.relation)
    //         })
    //     case 'role:notmyorgs':
    //         return organizations.filter((org) => {
    //             return ![
    //                 UserRelationToOrganization.MEMBER,
    //                 UserRelationToOrganization.ADMIN,
    //                 UserRelationToOrganization.OWNER
    //             ].includes(org.relation)
    //         })

    //     case 'role:owner':
    //         return organizations.filter((org) => (org.relation === UserRelationToOrganization.OWNER))
    //     case 'role:notowner':
    //         return organizations.filter((org) => (org.relation !== UserRelationToOrganization.OWNER))
    //     case 'role:admin':
    //         return organizations.filter((org) => (org.relation === UserRelationToOrganization.OWNER ||
    //             org.relation === UserRelationToOrganization.ADMIN))
    //     case 'privacy:private':
    //         return organizations.filter((org) => {
    //             return org.private
    //         })
    //     case 'privacy:public':
    //         return organizations.filter((org) => {
    //             return !org.private
    //         })

    //     // TODO: re-enable when have relation again...
    //     // case 'pending':
    //     //     return organizations.filter((org) => (
    //     //         org.relation.type === UserRelationToOrganization.MEMBER_INVITATION_PENDING ||
    //     //         org.relation.type === UserRelationToOrganization.MEMBER_REQUEST_PENDING
    //     //     ))
    //     // case 'groupPending':
    //     //     return organizations.filter((org) => (
    //     //         (org.relation.type === UserRelationToOrganization.ADMIN ||
    //     //             org.relation.type === UserRelationToOrganization.OWNER) &&
    //     //         (org.adminRequests && org.adminRequests.length > 0)
    //     //     ))
    //     default:
    //         console.warn('unknown filter : ' + filter)
    //         return organizations
    // }
}



// Narrative Sort and Search
function narrativeSortByToComparator(sortBy: string) {
    switch (sortBy) {
        case 'name':
            return (a: NarrativeResource, b: NarrativeResource) => {
                return a.title.localeCompare(b.title)
            }
        case 'updated':
            return (a: NarrativeResource, b: NarrativeResource) => {
                return b.updatedAt.getTime() - a.updatedAt.getTime()
            }
        default:
        case 'added':
            return (a: NarrativeResource, b: NarrativeResource) => {
                return b.updatedAt.getTime() - a.updatedAt.getTime()
            }
    }
}

export function applyNarrativeSort(narratives: Array<NarrativeResource>, sortBy: string) {
    if (!sortBy) {
        return narratives
    }
    return narratives.slice().sort((a: NarrativeResource, b: NarrativeResource) => {
        const c1 = narrativeSortByToComparator(sortBy)(a, b)
        if (c1 === 0) {
            if (sortBy !== 'name') {
                return narrativeSortByToComparator('name')(a, b)
            }
        }
        return c1
    })
}

export function applyNarrativeSearch(narratives: Array<NarrativeResource>, searchBy: string) {
    const tokens = searchBy.split(/\s+/).map((token) => {
        return new RegExp(token, 'i')
    })
    if (tokens.length === 0) {
        return narratives
    }
    return narratives.slice().filter((narrative: NarrativeResource) => {
        return tokens.every((token: RegExp) => {
            return (token.test(narrative.title))
        })
    })
}

export interface NarrativeQuery {
    searchBy: string
    sortBy: string
}

export function queryNarratives(narratives: Array<NarrativeResource>, query: NarrativeQuery) {
    const searched = applyNarrativeSearch(narratives, query.searchBy)
    const sorted = applyNarrativeSort(searched, query.sortBy)
    return sorted
}

// Members Sort and Search

function memberSortByToComparator(sortBy: string) {
    switch (sortBy) {
        case 'name':
            // TODO: need to use user real name

            return (a: Member, b: Member) => {
                return a.username.localeCompare(b.username)
            }
        default:
        case 'added':
            return (a: Member, b: Member) => {
                return b.joinedAt.getTime() - a.joinedAt.getTime()
            }
    }
}

export function applyMembersSort(members: Array<Member>, sortBy: string) {
    if (!sortBy) {
        return members
    }
    return members.slice().sort((a: Member, b: Member) => {
        const c1 = memberSortByToComparator(sortBy)(a, b)
        if (c1 === 0) {
            if (sortBy !== 'name') {
                return memberSortByToComparator('name')(a, b)
            }
        }
        return c1
    })
}

export function applyMembersSearch(members: Array<Member>, searchBy: string) {
    const tokens = searchBy.split(/\s+/).map((token) => {
        return new RegExp(token, 'i')
    })
    if (tokens.length === 0) {
        return members
    }
    return members.slice().filter((member: Member) => {
        return tokens.every((token: RegExp) => {
            return (token.test(member.username) ||
                token.test(member.title || ''))
        })
    })
}

export interface MembersQuery {
    searchBy: string
    sortBy: string
}

export function queryMembers(members: Array<Member>, query: MembersQuery) {
    const searched = applyMembersSearch(members, query.searchBy)
    const sorted = applyMembersSort(searched, query.sortBy)
    return sorted
}

// function getCustomField(group: groupsApi.Group | groupsApi.BriefGroup, name: string): string | null {
//     if (!group.custom) {
//         return null
//     }
//     if (name in group.custom) {
//         return group.custom[name]
//     }
//     return null
// }

export class OrganizationModel {

    params: ConstructorParams
    groupsClient: groupsApi.GroupsClient
    organizations: Map<OrganizationID, Organization | InaccessiblePrivateOrganization>

    constructor(params: ConstructorParams) {
        this.params = params
        this.groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        this.organizations = new Map<OrganizationID, Organization>()
    }

    async getOrg(id: OrganizationID): Promise<Organization | InaccessiblePrivateOrganization> {
        if (this.organizations.has(id)) {
            return this.organizations.get(id)!
        }
        return this.groupsClient.getGroupById(id)
            .then((group) => {
                let org: Organization | InaccessiblePrivateOrganization
                if (group.role === "None" && group.private) {
                    org = groupToPrivateOrganization(group as groupsApi.InaccessiblePrivateGroup, this.params.username)
                } else {
                    org = groupToOrganization(group as groupsApi.Group, this.params.username)
                }
                this.organizations.set(id, org)
                return org
            })
    }

    async getOrganization(id: OrganizationID): Promise<Organization> {
        if (this.organizations.has(id)) {
            const org = this.organizations.get(id)!
            if (org.kind !== OrganizationKind.NORMAL) {
                throw new Error('Inaccessible Organization')
            }
            return org
        }
        return this.groupsClient.getGroupById(id)
            .then((group) => {
                console.log('group', group)
                if (group.role === "None" && group.private) {
                    throw new Error('Inaccessible Organization')
                }

                const org = groupToOrganization(group as groupsApi.Group, this.params.username)
                this.organizations.set(id, org)
                return org
            })
    }

    async getOrgs(ids: Array<OrganizationID>): Promise<Array<Organization | InaccessiblePrivateOrganization>> {
        return Promise.all(ids.map((id) => {
            return this.getOrg(id)
        }))
    }

    async getAllOrgs(): Promise<Array<Organization | InaccessiblePrivateOrganization>> {
        const groups = await this.groupsClient.getGroups()
        const ids = groups.map((group) => {
            return group.id
        })
        return this.getOrgs(ids)
    }

    async getOwnOrgs(): Promise<Array<BriefOrganization>> {
        const orgs = await this.getAllOrgs2()

        const ownOrgs = orgs
            .filter((org: BriefOrganization) => {
                // ensure that user has some relationship to the org:
                // member, admin, or owner
                return (org.relation !== UserRelationToOrganization.NONE)
            })

        return ownOrgs
    }

    listGroupToBriefOrganization(group: groupsApi.BriefGroup): BriefOrganization {
        return {
            id: group.id,
            name: group.name,
            logoUrl: group.custom.logourl || null,
            isPrivate: group.private,
            homeUrl: group.custom.homeurl || null,
            researchInterests: group.custom.researchinterests || null,
            owner: {
                username: group.owner,
                lastVisitedAt: null,
                type: MemberType.OWNER,
                joinedAt: new Date(group.createdate),
                title: 'Owner'
            },

            // owner: {
            //     username: group.owner.name,
            //     lastVisitedAt: group.owner.lastvisit ? new Date(group.owner.lastvisit) : null,
            //     type: MemberType.OWNER,
            //     joinedAt: new Date(group.owner.joined),
            //     title: group.owner.custom ? group.owner.custom.title : null
            // },
            // fix these...
            relation: groupRoleToUserRelation(group.role),
            isMember: (group.role !== "None"),
            isAdmin: (group.role === "Admin" || group.role === "Owner"),
            isOwner: (group.role === "Owner"),
            createdAt: new Date(group.createdate),
            modifiedAt: new Date(group.moddate),
            lastVisitedAt: group.lastvisit ? new Date(group.lastvisit) : null,
            memberCount: group.memcount || 0,
            narrativeCount: group.rescount.workspace || 0,
            relatedOrganizations: group.custom ? group.custom.relatedgroups ? group.custom.relatedgroups.split(',') : [] : []
        }
    }

    async getAllOrgs2(): Promise<Array<BriefOrganization>> {
        const groups = await this.groupsClient.listGroups()
        const orgs = groups.map((group) => {
            const org = this.listGroupToBriefOrganization(group)
            return org
        })
        return orgs
    }

    async queryOrgs(query: Query): Promise<QueryResults> {
        // const orgs = await this.getAllOrgs()
        const orgs = await this.getAllOrgs2()

        const filtered = applyFilter(orgs, query.filter, query.username)
        const searched = applySearch(filtered, query.searchTerms)
        const sorted = applySort(searched, query.sortField, query.sortDirection)

        return {
            organizations: sorted,
            total: orgs.length
        }
    }

    async ownOrgs(username: groupsApi.Username): Promise<QueryResults> {
        const orgs = await this.getAllOrgs2()
        const ownOrgs = orgs.filter((org: BriefOrganization) => {
            return (org.relation !== UserRelationToOrganization.NONE)
        })

        return {
            organizations: ownOrgs,
            total: ownOrgs.length
        }
    }

    async grantViewAccess(requestId: string): Promise<requestModel.Request> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        await groupsClient.grantReadAccessToRequestedResource({ requestId })
        const req = await groupsClient.getRequest(requestId)
        return requestModel.groupRequestToOrgRequest(req)
    }

    async addOrg(newOrg: EditableOrganization, username: groupsApi.Username): Promise<Organization> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        // do record-level validation
        if ((newOrg.id.validationState.type !== ValidationErrorType.OK) ||
            (newOrg.name.validationState.type !== ValidationErrorType.OK) ||
            (newOrg.logoUrl.validationState.type !== ValidationErrorType.OK) ||
            (newOrg.description.validationState.type !== ValidationErrorType.OK) ||
            (newOrg.isPrivate.validationState.type !== ValidationErrorType.OK)
        ) {
            return Promise.reject(new Error('One or more fields are invalid'))
        }

        return groupsClient.createGroup({
            id: newOrg.id.value,
            name: newOrg.name.value,
            logoUrl: newOrg.logoUrl.value,
            homeUrl: newOrg.homeUrl.value,
            researchInterests: newOrg.researchInterests.value,
            description: newOrg.description.value,
            isPrivate: newOrg.isPrivate.value
        })
            .then((group) => {
                return groupToOrganization(group, username)
            })
    }

    async orgExists(id: string): Promise<boolean> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        return groupsClient.groupExists(id)
            .then(({ exists }) => {
                return exists
            })
    }

    async updateOrg(id: string, orgUpdate: OrganizationUpdate): Promise<void> {

        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        // do record-level validation


        return groupsClient.updateGroup(id, {
            name: orgUpdate.name,
            logoUrl: orgUpdate.logoUrl,
            homeUrl: orgUpdate.homeUrl,
            researchInterests: orgUpdate.researchInterests,
            description: orgUpdate.description,
            private: orgUpdate.isPrivate
        })
    }

    validateOrgId(id: string): [string, ValidationState] {
        return Validation.validateOrgId(id);
    }

    validateOrgName(name: string): [string, ValidationState] {
        return Validation.validateOrgName(name)
    }

    validateOrgDescription(description: string): [string, ValidationState] {
        return Validation.validateOrgDescription(description);
    }

    async removeNarrativeFromOrg(organizationId: OrganizationID, workspaceId: number): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.deleteResource(
            organizationId,
            'workspace',
            String(workspaceId)
        )
    }

    async grantNarrativeAccess(groupId: string, resourceId: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        // TODO: yuck. need to 
        await groupsClient.grantResourceAccess(groupId, 'workspace', resourceId)
        return
    }

    async requestMembership(id: string): Promise<requestModel.Request> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const request = await groupsClient.requestMembership({
            groupId: id
        })
        return requestModel.groupRequestToOrgRequest(request)
    }

    async addOrRequestNarrativeToGroup(groupId: string, workspaceId: WorkspaceID): Promise<requestModel.Request | boolean> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const request = await groupsClient.addOrRequestNarrative({
            groupId: groupId,
            workspaceId: workspaceId
        })
        if (request.complete === true) {
            return true
        } else {
            return requestModel.groupRequestToOrgRequest(request)
        }
    }

    async memberToAdmin(groupId: string, member: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.memberToAdmin({
            groupId,
            member
        })
    }

    async adminToMember(groupId: string, member: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.adminToMember({
            groupId,
            member
        })
    }
    async removeMember(groupId: string, member: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.removeMember({
            groupId,
            member
        })
    }

    async updateMember(groupId: string, memberUsername: string, update: MemberUpdate) {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.updateMember({ groupId, memberUsername, update })
    }

    async visitOrg({ organizationId }: { organizationId: string }): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        return groupsClient.visitGroup({ groupId: organizationId })
    }

    async getOpenRequestsStatus({ organizationIds }: { organizationIds: Array<OrganizationID> }): Promise<Map<OrganizationID, RequestStatus>> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        const openRequests = await groupsClient.getOpenRequests({ groupIds: organizationIds })
        const result = new Map<OrganizationID, RequestStatus>()
        for (const [groupId, status] of openRequests.entries()) {
            const requestStatus: RequestStatus = stringToRequestStatus(status)
            result.set(<OrganizationID>groupId, requestStatus)
        }
        return result
    }

    async getOpenRequestStatus({ organizationId }: { organizationId: OrganizationID }): Promise<RequestStatus> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        const openRequests = await groupsClient.getOpenRequests({ groupIds: [organizationId] })
        for (const [groupId, status] of openRequests.entries()) {
            return stringToRequestStatus(status)
        }
        throw new Error('expected request status, got none')
    }

    async addRelatedOrganization({ organizationId, relatedOrganizationId }: { organizationId: OrganizationID, relatedOrganizationId: OrganizationID }): Promise<OrganizationID> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        return await groupsClient.addRelatedGroup(organizationId, relatedOrganizationId)
    }

    async removeRelatedOrganization({ organizationId, relatedOrganizationId }: { organizationId: OrganizationID, relatedOrganizationId: OrganizationID }): Promise<OrganizationID> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        return await groupsClient.removeRelatedGroup(organizationId, relatedOrganizationId)
    }
}

function stringToRequestStatus(status: groupsApi.RequestStatus): RequestStatus {
    switch (status.new) {
        case 'None': return RequestStatus.NONE
        case 'Old': return RequestStatus.OLD
        case 'New': return RequestStatus.NEW
        default: throw new Error('Invalid open request status: ' + status)
    }
}

export function userPermissionToWorkspacePermission(userPermission: string, isOwner: boolean) {
    if (isOwner) {
        return UserWorkspacePermission.OWNER
    }
    switch (userPermission) {
        case 'r':
            return UserWorkspacePermission.VIEW
        case 'w':
            return UserWorkspacePermission.EDIT
        case 'a':
            return UserWorkspacePermission.ADMIN
        default:
            throw new Error('Invalid workspace user permission: ' + userPermission)
    }
}