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
    title: string
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

export interface NarrativeInfo {
    workspaceId: WorkspaceID,
    title: string,
    isPublic: boolean,
    permission: UserWorkspacePermission
}

export type AppID = string

export interface AppInfo {
    appId: AppID
}

export interface BriefOrganization {
    id: string
    name: string
    logoUrl: string | null
    private: boolean
    homeUrl: string | null
    researchInterests: string | null
    // TODO: we need researchInterests here
    owner: Username
    relation: UserRelationToOrganization
    createdAt: Date
    modifiedAt: Date
    lastVisitedAt: Date | null

    memberCount: number
    narrativeCount: number
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
    narratives: Array<NarrativeInfo>
    apps: Array<AppInfo>
    memberCount: number
    narrativeCount: number
    appCount: number
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

    const narratives: Array<NarrativeInfo> = group.resources.workspace.map((info) => {
        return {
            workspaceId: parseInt(info.rid, 10),
            title: info.narrname,
            isPublic: info.public,
            permission: groupPermissionToWorkspacePermission(info.perm)
        }
    })
    const apps: Array<AppInfo> = []


    return {
        kind: OrganizationKind.NORMAL,
        id: group.id,
        name: group.name,
        isPrivate: group.private,
        isMember: (group.role !== "None"),
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
        appCount: group.rescount.catalogmethod || 0
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


export interface NarrativeResource {
    workspaceId: number
    title: string
    permission: UserWorkspacePermission
    isPublic: boolean
}

export function applyOrgSearch(orgs: Array<BriefOrganization>, searchTerms: Array<string>): Array<BriefOrganization> {
    const searchTermsRe = searchTerms.map((term) => {
        return new RegExp(term, 'i')
    })
    const filteredOrgs = orgs.filter((org) => {
        if (searchTerms.length === 0) {
            return true;
        }
        return searchTermsRe.every((termRe) => {
            return termRe.test(org.name) ||
                termRe.test(org.owner)
        })
    })

    return filteredOrgs
}

function applySort(organizations: Array<BriefOrganization>, sortField: string, sortDirection: SortDirection): Array<BriefOrganization> {
    const direction = sortDirection === SortDirection.ASCENDING ? 1 : -1
    switch (sortField) {
        case 'created':
            return organizations.slice().sort((a, b) => {
                return direction * (a.createdAt.getTime() - b.createdAt.getTime())
            })
        case 'modified':
        case 'changed':
            return organizations.slice().sort((a, b) => {
                return direction * (a.modifiedAt.getTime() - b.modifiedAt.getTime())
            })
        case 'name':
            return organizations.slice().sort((a, b) => {
                return direction * a.name.localeCompare(b.name)
            })
        case 'owner':
            // TODO: after the dust settles for org -> brief org conversion,
            // we may need to convert the owner to a member via profile...
            return organizations.slice().sort((a, b) => {
                return direction * a.owner.localeCompare(b.owner)
            })
        default:
            console.warn('unimplemented sort field: ' + sortField)
            return organizations;
    }
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
                return !org.private
            case 'private':
                return org.private
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

        // return Promise.all(ownOrgs.map((org: BriefOrganization) => {
        //     return this.getOrg(org.id)
        // }))
    }



    listGroupToBriefOrganization(group: groupsApi.BriefGroup): BriefOrganization {
        return {
            id: group.id,
            name: group.name,
            logoUrl: group.custom.logourl || null,
            private: group.private,
            homeUrl: group.custom.homeurl || null,
            researchInterests: group.custom.researchinterests || null,
            owner: group.owner,
            // fix these...
            relation: groupRoleToUserRelation(group.role),
            createdAt: new Date(group.createdate),
            modifiedAt: new Date(group.moddate),
            lastVisitedAt: group.lastvisit ? new Date(group.lastvisit) : null,
            memberCount: group.memcount || 0,
            narrativeCount: group.rescount.workspace || 0
        }
    }

    async getAllOrgs2(): Promise<Array<BriefOrganization>> {
        const groups = await this.groupsClient.listGroups()
        const orgs = groups.map((group) => {
            return this.listGroupToBriefOrganization(group)
        })
        return orgs
    }

    async queryOrgs(query: Query): Promise<QueryResults> {
        // const orgs = await this.getAllOrgs()
        const orgs = await this.getAllOrgs2()

        const filtered = applyFilter(orgs, query.filter, query.username)
        const searched = applyOrgSearch(filtered, query.searchTerms)
        const sorted = applySort(searched, query.sortField, query.sortDirection)

        return {
            organizations: sorted,
            total: orgs.length
        }
    }

    async ownOrgs(username: groupsApi.Username): Promise<QueryResults> {
        // const orgs = await this.getAllOrgs2()

        // const groupsClient = new groupsApi.GroupsClient({
        //     url: this.params.groupsServiceURL,
        //     token: this.params.token
        // })

        // const groups = await groupsClient.getGroups()

        // const ownGroups = groups.filter((group: groupsApi.Group) => {
        //     if (group.owner.name === username) {
        //         return true
        //     }
        //     if (group.members.find((member) => {
        //         return (member.name === username)
        //     })) {
        //         return true
        //     }
        //     if (group.admins.find((member) => {
        //         return (member.name === username)
        //     })) {
        //         return true
        //     }
        //     return false
        // })


        // const ownOrganizations = ownGroups.map((group) => {
        //     // return groupToOrganization(group, username)
        //     return this.listGroupToBriefOrganization(group)
        // })

        const orgs = await this.getAllOrgs2()


        const ownOrgs = orgs.filter((org: BriefOrganization) => {

            return (org.relation !== UserRelationToOrganization.NONE)
            // if (org.owner === username) {
            //     return true
            // }
            // if (org.members.find((member) => {
            //     return (member.name === username)
            // })) {
            //     return true
            // }
            // if (group.admins.find((member) => {
            //     return (member.name === username)
            // })) {
            //     return true
            // }
            // return false
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

    async requestMembershipToGroup(id: string): Promise<requestModel.Request> {
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