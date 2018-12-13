import * as groupsApi from '../../apis/groups'
import { SortDirection, EditableOrganization, UIErrorType, OrganizationUpdate, UIError } from '../../../types';
import * as requestModel from '../requests'
import * as userModel from '../user';
import Validation from './validation'



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
    username: groupsApi.Username,
    joinedAt: Date
    type: MemberType
}

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

export type Relation = NoRelation | ViewRelation | MembershipRequestPendingRelation | MembershipInvitationPendingRelation | MemberRelation | AdminRelation | OwnerRelation

export type username = string

export interface Member {
    username: username
    type: MemberType
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

export interface Organization {
    id: string
    name: string
    gravatarHash: string | null
    description: string
    owner: Member
    members: Array<Member>
    // relation: UserOrgRelation
    createdAt: Date
    modifiedAt: Date,
    narratives: Array<NarrativeInfo>,
    apps: Array<AppInfo>
}

export function determineRelation(
    org: Organization,
    username: userModel.Username,
    request: requestModel.UserRequest | null,
    invitation: requestModel.UserInvitation | null): Relation {
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

export function groupToOrganization(group: groupsApi.Group, currentUser: username): Organization {

    const owner = {
        username: group.owner.name,
        joinedAt: new Date(group.owner.joined),
        type: MemberType.OWNER
    }

    // We join admins and members, since they are all members, just different privileges in the org
    const members: Array<Member> = (<Array<Member>>[
        // owner
    ]).concat(group.admins.map((admin) => {
        return {
            username: admin.name,
            joinedAt: new Date(admin.joined),
            type: MemberType.ADMIN
        }
    })).concat(group.members.map((member) => {
        return {
            username: member.name,
            joinedAt: new Date(member.joined),
            type: MemberType.MEMBER
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
        id: group.id,
        name: group.name,
        gravatarHash: group.custom.gravatarhash || null,
        description: group.custom.description,
        owner: owner,
        members: members,
        modifiedAt: new Date(group.moddate),
        createdAt: new Date(group.createdate),
        narratives: narratives,
        apps: []
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
    organizations: Array<Organization>
    total: number
}

export interface Query {
    searchTerms: Array<string>
    username: groupsApi.Username
    sortBy: string
    sortDirection: SortDirection
    filter: string
}


export interface NarrativeResource {
    workspaceId: number
    title: string
    permission: UserWorkspacePermission
    isPublic: boolean
}

export function applyOrgSearch(orgs: Array<Organization>, searchTerms: Array<string>): Array<Organization> {
    const searchTermsRe = searchTerms.map((term) => {
        return new RegExp(term, 'i')
    })
    const filteredOrgs = orgs.filter((org) => {
        if (searchTerms.length === 0) {
            return true;
        }
        return searchTermsRe.every((termRe) => {
            return termRe.test(org.name) ||
                termRe.test(org.owner.username) ||
                termRe.test(org.owner.username)
        })
    })

    return filteredOrgs
}

function applySort(organizations: Array<Organization>, sortBy: string, sortDirection: SortDirection): Array<Organization> {
    const direction = sortDirection === SortDirection.ASCENDING ? 1 : -1
    switch (sortBy) {
        case 'created':
            return organizations.slice().sort((a, b) => {
                return direction * (a.createdAt.getTime() - b.createdAt.getTime())
            })
        // case 'modifiedAt':
        //     return organizations.slice().sort((a, b) => {
        //         return direction * (a.modifiedAt.getTime() - b.modifiedAt.getTime())
        //     })
        case 'name':
            return organizations.slice().sort((a, b) => {
                return direction * a.name.localeCompare(b.name)
            })
        case 'owner':
            return organizations.slice().sort((a, b) => {
                return direction * a.owner.username.localeCompare(b.owner.username)
            })
        default:
            console.warn('unimplemented sort field: ' + sortBy)
            return organizations;
    }
}



function applyFilter(organizations: Array<Organization>, filter: string, username: groupsApi.Username): Array<Organization> {
    switch (filter) {
        case 'all':
            return organizations
        case 'memberOf':
            return organizations.filter((org) => (
                (org.members.findIndex((member) => (member.username === username)) >= 0)
            ))
        case 'owned':
            return organizations.filter((org) => (org.owner.username === username))
        case 'notOwned':
            return organizations.filter((org) => (org.owner.username !== username))
        // TODO: re-enable when have relation again...
        // case 'pending':
        //     return organizations.filter((org) => (
        //         org.relation.type === UserRelationToOrganization.MEMBER_INVITATION_PENDING ||
        //         org.relation.type === UserRelationToOrganization.MEMBER_REQUEST_PENDING
        //     ))
        // case 'groupPending':
        //     return organizations.filter((org) => (
        //         (org.relation.type === UserRelationToOrganization.ADMIN ||
        //             org.relation.type === UserRelationToOrganization.OWNER) &&
        //         (org.adminRequests && org.adminRequests.length > 0)
        //     ))
        default:
            console.warn('unknown filter : ' + filter)
            return organizations
    }
}

export class OrganizationModel {

    params: ConstructorParams
    groupsClient: groupsApi.GroupsClient
    organizations: Map<OrganizationID, Organization>

    constructor(params: ConstructorParams) {
        this.params = params
        this.groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        this.organizations = new Map<OrganizationID, Organization>()
    }

    async getOrg(id: OrganizationID): Promise<Organization> {
        if (this.organizations.has(id)) {
            return this.organizations.get(id)!
        }
        return this.groupsClient.getGroupById(id)
            .then((group) => {
                const org = groupToOrganization(group, this.params.username)
                this.organizations.set(id, org)
                return org
            })
    }

    async getOrgs(ids: Array<OrganizationID>): Promise<Array<Organization>> {
        return Promise.all(ids.map((id) => {
            return this.getOrg(id)
        }))
    }

    async getAllOrgs(): Promise<Array<Organization>> {
        const groups = await this.groupsClient.getGroups()
        const ids = groups.map((group) => {
            return group.id
        })
        return this.getOrgs(ids)
    }

    async getOwnOrgs(): Promise<Array<Organization>> {
        const orgs = await this.getAllOrgs()

        return orgs.filter((org: Organization) => {
            if (org.owner.username === this.params.username) {
                return true
            }
            if (org.members.find(({ username }) => {
                return (username === this.params.username)
            })) {
                return true
            }
            return false
        })
    }

    async queryOrgs(query: Query): Promise<QueryResults> {
        const orgs = await this.getAllOrgs()

        const filtered = applyFilter(orgs, query.filter, query.username)
        const searched = applyOrgSearch(filtered, query.searchTerms)
        const sorted = applySort(searched, query.sortBy, query.sortDirection)

        return {
            organizations: sorted,
            total: orgs.length
        }
    }

    async ownOrgs(username: groupsApi.Username): Promise<QueryResults> {
        const orgs = await this.getAllOrgs()

        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const groups = await groupsClient.getGroups()

        const ownGroups = groups.filter((group: groupsApi.Group) => {
            if (group.owner.name === username) {
                return true
            }
            if (group.members.find((member) => {
                return (member.name === username)
            })) {
                return true
            }
            if (group.admins.find((member) => {
                return (member.name === username)
            })) {
                return true
            }
            return false
        })


        const ownOrganizations = ownGroups.map((group) => {
            return groupToOrganization(group, username)
        })

        return {
            organizations: ownOrganizations,
            total: ownOrganizations.length
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
        if ((newOrg.id.error && newOrg.id.error.type === UIErrorType.ERROR) ||
            (newOrg.name.error && newOrg.name.error.type === UIErrorType.ERROR) ||
            (newOrg.gravatarHash.error && newOrg.gravatarHash.error.type === UIErrorType.ERROR) ||
            (newOrg.description.error && newOrg.description.error.type === UIErrorType.ERROR)) {
            return Promise.reject(new Error('One or more fields are invalid'))
        }

        return groupsClient.createGroup({
            id: newOrg.id.value,
            name: newOrg.name.value,
            gravatarhash: newOrg.gravatarHash.value,
            description: newOrg.description.value
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
            gravatarhash: orgUpdate.gravatarHash,
            description: orgUpdate.description
        })
    }

    validateOrgId(id: string): [string, UIError] {
        return Validation.validateOrgId(id);
    }

    validateOrgName(name: string): [string, UIError] {
        return Validation.validateOrgName(name)
    }

    validateOrgDescription(description: string): [string, UIError] {
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

    memberToAdmin(groupId: string, member: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.memberToAdmin({
            groupId,
            member
        })
    }

    adminToMember(groupId: string, member: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.adminToMember({
            groupId,
            member
        })
    }
    removeMember(groupId: string, member: string): Promise<void> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.removeMember({
            groupId,
            member
        })
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