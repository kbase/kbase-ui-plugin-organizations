import {
    Organization, OrganizationUpdate,
    UIError,
    UIErrorType,
    SortDirection,
    FieldState,
    EditableOrganization,
    UserRelationToOrganization,
    UserBase,
    Member,
    Admin,
    Owner,
    GroupRequest,
    RequestType,
    RequestStatus,
    OwnerRelation,
    UserOrgRelation,
    AdminRelation,
    MemberRelation,
    MembershipRequestPendingRelation,
    MembershipInvitationPendingRelation,
    ViewRelation
} from '../types';
// import { organizations } from './data';
import { UserProfileClient, UserProfile, User } from './userProfile'
import { GroupsClient, Group, GroupList, BriefGroup } from './groups'
import * as groups from './groups'
import { string } from 'prop-types';

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
                termRe.test(org.owner.realname)
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

function applyFilter(organizations: Array<Organization>, filter: string, username: string): Array<Organization> {
    switch (filter) {
        case 'all':
            return organizations
        case 'owned':
            return organizations.filter((org) => (org.owner.username === username))
        case 'notOwned':
            return organizations.filter((org) => (org.owner.username !== username))
        case 'pending':
            return organizations.filter((org) => (
                org.relation.type === UserRelationToOrganization.MEMBER_INVITATION_PENDING ||
                org.relation.type === UserRelationToOrganization.MEMBER_REQUEST_PENDING
            ))
        case 'groupPending':
            return organizations.filter((org) => (
                (org.relation.type === UserRelationToOrganization.ADMIN ||
                    org.relation.type === UserRelationToOrganization.OWNER) &&
                (org.adminRequests && org.adminRequests.length > 0)
            ))
        default:
            console.warn('unknown filter : ' + filter)
            return organizations
    }
}

export interface Query {
    searchTerms: Array<string>
    username: string
    sortBy: string
    sortDirection: SortDirection
    filter: string
}

export interface QueryResults {
    organizations: Array<Organization>
    total: number
}

function wait(timeout: number) {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            resolve(true)
        }, timeout)
    })
}

// export function newOrg(state: StoreState, action: actions.AddOrg): StoreState {
//     const {organizations, auth:{username}} = state;
//     const org: Organization = {
//         ...action.newOrg,
//         createdAt: new Date(),
//         modifiedAt: new Date(),
//         owner: username
//     }
//     organizations.push(org)
//     return {...state, organizations}
// }

interface ModelParams {
    token: string,
    username: string,
    groupsServiceURL: string,
    userProfileServiceURL: string,
    workspaceServiceURL: string
}

function promiseTry<T>(fun: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
        try {
            return resolve(fun())
        } catch (ex) {
            reject(ex)
        }
    })
}

export class Model {
    // organizations: Organizations
    // token: string
    // groupsServiceURL: string
    // userProfileServiceURL: string
    // workspaceServiceURL: string
    params: ModelParams
    cachedOrgs: Array<Organization> | null


    constructor(params: ModelParams) {
        // this.organizations = organizations;
        this.params = params
        this.cachedOrgs = null
    }

    getPendingRequests(): Promise<{ requests: Array<groups.GroupRequest>, invitations: Array<groups.GroupRequest> }> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return Promise.all([
            groupsClient.getCreatedRequests({
                includeClosed: false,
                sortDirection: groups.SortDirection.DESCENDING,
                startAt: new Date(0)
            })
                .then((requests) => {
                    return requests
                }),
            groupsClient.getTargetedRequests({
                includeClosed: false,
                sortDirection: groups.SortDirection.DESCENDING,
                startAt: new Date(0)
            })
                .then((requests) => {
                    return requests
                })
        ])
            .then(([createdRequests, targetedRequests]) => {
                // here we just want to know ... does this user have any
                // pending requests with this group!
                return {
                    requests: createdRequests,
                    invitations: targetedRequests
                }
            })
    }

    groupRequestToGroupRequest(request: groups.GroupRequest): Promise<GroupRequest> {
        function stringToRequestType(type: string): RequestType {
            return RequestType.JOIN_GROUP_REQUEST
        }

        function stringToRequestStatus(status: string): RequestStatus {
            return RequestStatus.OPEN
        }

        const userProfileClient = new UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })

        const usernames = [request.requester]
        if (request.targetuser) {
            usernames.push(request.targetuser)
        }

        return userProfileClient.getUserProfiles(usernames)
            .then((profiles) => {
                return {
                    id: request.id,
                    groupId: request.groupid,
                    requester: this.profileToUser(profiles[0]),
                    type: stringToRequestType(request.type),
                    status: stringToRequestStatus(request.status),
                    subjectUser: profiles[1] ? this.profileToUser(profiles[1]) : null,
                    subjectWorkspaceId: request.targetws || null,
                    createdAt: new Date(request.createdate),
                    expireAt: new Date(request.expiredate),
                    modifiedAt: new Date(request.moddate)
                }

            })
    }


    getPendingGroupRequests(groupId: string): Promise<Array<GroupRequest>> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.getGroupRequests(groupId, {
            includeClosed: false,
            sortDirection: groups.SortDirection.DESCENDING,
            startAt: new Date(0)
        })
            .then((requests) => {
                return Promise.all(requests.map((request) => {
                    return this.groupRequestToGroupRequest(request)
                }))
            })
    }

    groupToOrg(group: Group, username: string): Promise<Organization> {
        const { id, name, owner, description, createdate, moddate } = group
        let relation: UserRelationToOrganization
        // TODO: when we have access to members, admins, and group publication status, we can 
        // flesh out all user relations.
        if (username === group.owner) {
            relation = UserRelationToOrganization.OWNER
        } else {
            relation = UserRelationToOrganization.VIEW
        }
        const userProfileClient = new UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })
        let allUsers: Array<string> = []
        if (group.members) {
            allUsers = group.members.slice()
        }
        if (group.admins) {
            allUsers = allUsers.concat(group.admins)
        }
        allUsers.push(group.owner)

        return this.getPendingRequests()
            .then(({ requests, invitations }) => {
                // pending join requests
                const pendingRequests = new Map<string, groups.GroupRequest>()
                requests.forEach((req) => {
                    if (req.type === 'Request group membership' && req.requester === username) {
                        pendingRequests.set(req.groupid, req)
                    }
                })

                // pending invitations to join
                const pendingInvites = new Map<string, groups.GroupRequest>()
                invitations.forEach((req) => {
                    if (req.type === 'Invite to group' && req.targetuser === username) {
                        pendingInvites.set(req.groupid, req)
                    }
                })

                return userProfileClient.getUserProfiles(allUsers)
                    .then((userProfiles) => {
                        const userProfileMap = userProfiles.reduce((map, profile) => {
                            map.set(profile.user.username, profile)
                            return map
                        }, new Map<string, UserProfile>())

                        const ownerProfile = userProfileMap.get(group.owner)
                        if (!ownerProfile) {
                            throw new Error('No profile for owner!')
                        }
                        // TODO: if members really is always an array, we can skip this defaulting behavior
                        const memberUsernames = group.members || []
                        const members: Array<Member> = memberUsernames.map((member) => {
                            const p = userProfileMap.get(member)
                            if (typeof p === 'undefined') {
                                throw new Error('Member without profile!')
                            }
                            return this.profileToUser(p)
                        }).sort((a, b) => {
                            return a.realname.localeCompare(b.realname);
                        })

                        const adminUsernames = group.admins || []
                        const admins: Array<Admin> = adminUsernames.map((admin) => {
                            const p = userProfileMap.get(admin)
                            if (typeof p === 'undefined') {
                                throw new Error('Admin without profile')
                            }
                            return this.profileToUser(p)
                        })

                        let relation: UserOrgRelation
                        // TODO: when we have access to members, admins, and group publication status, we can 
                        // flesh out all user relations.
                        if (this.params.username === group.owner) {
                            relation = {
                                type: UserRelationToOrganization.OWNER
                            } as OwnerRelation
                        } else if (group.admins.indexOf(this.params.username) >= 0) {
                            relation = {
                                type: UserRelationToOrganization.ADMIN
                            } as AdminRelation
                        } else if (group.members.indexOf(this.params.username) >= 0) {
                            relation = {
                                type: UserRelationToOrganization.MEMBER
                            } as MemberRelation
                        } else if (pendingRequests.has(group.id)) {
                            relation = {
                                type: UserRelationToOrganization.MEMBER_REQUEST_PENDING,
                                requestId: pendingRequests.get(group.id)!.id
                            } as MembershipRequestPendingRelation
                        } else if (pendingInvites.has(group.id)) {
                            relation = {
                                type: UserRelationToOrganization.MEMBER_INVITATION_PENDING,
                                requestId: pendingInvites.get(group.id)!.id
                            } as MembershipInvitationPendingRelation
                        } else {
                            relation = {
                                type: UserRelationToOrganization.VIEW
                            } as ViewRelation
                        }

                        // perhaps get the pending admin requests
                        return promiseTry<Organization>((): Promise<Organization> => {
                            if (relation.type === UserRelationToOrganization.ADMIN ||
                                relation.type === UserRelationToOrganization.OWNER) {
                                return this.getPendingGroupRequests(group.id)
                                    .then((requests) => {
                                        return {
                                            id: group.id,
                                            name: group.name,
                                            gravatarHash: group.custom ? (group.custom.gravatarhash || null) : null,
                                            description: group.description,
                                            createdAt: new Date(group.createdate),
                                            modifiedAt: new Date(group.moddate),
                                            owner: this.profileToUser(ownerProfile),
                                            relation: relation,
                                            members: members,
                                            admins: admins,
                                            adminRequests: requests
                                        }
                                    })
                            } else {
                                return Promise.resolve({
                                    id: group.id,
                                    name: group.name,
                                    gravatarHash: group.custom ? (group.custom.gravatarhash || null) : null,
                                    description: group.description,
                                    createdAt: new Date(group.createdate),
                                    modifiedAt: new Date(group.moddate),
                                    owner: this.profileToUser(ownerProfile),
                                    relation: relation,
                                    members: members,
                                    admins: admins,
                                    adminRequests: []
                                })
                            }
                        })

                    })
            })
    }

    getPendingAdminRequests(groupIds: Array<string>): Promise<Map<string, Array<GroupRequest>>> {
        return Promise.all(groupIds.map((id) => {
            return this.getPendingGroupRequests(id)
                .then((requests) => {
                    return {
                        groupId: id,
                        requests: requests
                    }
                })
        }))
            .then((allRequests) => {
                const pendingRequests = new Map<string, Array<GroupRequest>>()
                allRequests.forEach(({ groupId, requests }) => {
                    pendingRequests.set(groupId, requests)
                })
                return pendingRequests
            })
    }

    groupsToOrgs(groups: Array<Group>, username: string): Promise<Array<Organization>> {
        const userProfileClient = new UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })

        const allUsers = groups.reduce((allUsers, group) => {
            allUsers.set(group.owner, true)
            group.members.forEach((member) => allUsers.set(member, true))
            group.admins.forEach((admin) => allUsers.set(admin, true))
            return allUsers;
        }, new Map<string, boolean>()).keys()

        const adminGroupIds = groups
            .filter(({ owner, admins }) => (owner === username || admins.indexOf(username) >= 0))
            .map(({ id }) => id)

        return Promise.all([
            userProfileClient.getUserProfiles(Array.from(allUsers)),
            this.getPendingRequests(),
            this.getPendingAdminRequests(adminGroupIds)
        ])
            .then(([profiles, { requests, invitations }, pendingAdminRequests]) => {
                const profileMap = profiles.reduce((profileMap, profile) => {
                    profileMap.set(profile.user.username, profile)
                    return profileMap
                }, new Map<string, UserProfile>())

                // now make a per-group map out of this...
                const pendingRequests = new Map<string, groups.GroupRequest>()
                requests.forEach((req) => {
                    if (req.requester === username) {
                        pendingRequests.set(req.groupid, req)
                    }
                })

                const pendingInvites = new Map<string, groups.GroupRequest>()
                invitations.forEach((req) => {
                    if (req.targetuser === username) {
                        pendingInvites.set(req.groupid, req)
                    }
                })

                return Promise.all(groups.map((group) => {
                    const { id, name, description, createdate, moddate, owner, members, admins, custom: { gravatarhash } } = group
                    let relation: UserOrgRelation
                    // TODO: when we have access to members, admins, and group publication status, we can 
                    // flesh out all user relations.
                    if (this.params.username === group.owner) {
                        relation = {
                            type: UserRelationToOrganization.OWNER
                        } as OwnerRelation
                    } else if (group.admins.indexOf(this.params.username) >= 0) {
                        relation = {
                            type: UserRelationToOrganization.ADMIN
                        } as AdminRelation
                    } else if (group.members.indexOf(this.params.username) >= 0) {
                        relation = {
                            type: UserRelationToOrganization.MEMBER
                        } as MemberRelation
                    } else if (pendingRequests.has(group.id)) {
                        relation = {
                            type: UserRelationToOrganization.MEMBER_REQUEST_PENDING,
                            requestId: pendingRequests.get(group.id)!.id
                        } as MembershipRequestPendingRelation
                    } else if (pendingInvites.has(group.id)) {
                        relation = {
                            type: UserRelationToOrganization.MEMBER_INVITATION_PENDING,
                            requestId: pendingInvites.get(group.id)!.id
                        } as MembershipInvitationPendingRelation
                    } else {
                        relation = {
                            type: UserRelationToOrganization.VIEW
                        } as ViewRelation
                    }

                    return {
                        id, name, description,
                        gravatarHash: gravatarhash || null,
                        owner: this.profileToUser(profileMap.get(group.owner)!),
                        createdAt: new Date(createdate),
                        modifiedAt: new Date(moddate),
                        relation: relation,
                        members: members.map((username) => this.profileToUser(profileMap.get(username)!)),
                        admins: admins.map((username) => this.profileToUser(profileMap.get(username)!)),
                        adminRequests: (pendingAdminRequests.has(id) ? pendingAdminRequests.get(id)! : [])
                    }
                }))
            })
    }

    getOrgs(username: string): Promise<Array<Organization>> {
        if (this.cachedOrgs) {
            return Promise.resolve(this.cachedOrgs)
        }
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        return groupsClient.getGroups()
            .then((groups) => {
                return this.groupsToOrgs(groups, username)
            })
    }

    queryOrgs(query: Query): Promise<QueryResults> {

        let start = new Date().getTime()
        return this.getOrgs(query.username)
            .then((orgs) => {
                const filtered = applyFilter(orgs, query.filter, query.username)
                const searched = applyOrgSearch(filtered, query.searchTerms)
                const sorted = applySort(searched, query.sortBy, query.sortDirection)

                return {
                    organizations: sorted,
                    total: orgs.length
                }
            })
    }

    profileToUser(profile: UserProfile): UserBase {
        return {
            username: profile.user.username,
            realname: profile.user.realname,
            city: profile.profile.userdata.city,
            state: profile.profile.userdata.state,
            country: profile.profile.userdata.country,
            organization: profile.profile.userdata.organization,
            avatarOption: profile.profile.userdata.avatarOption,
            gravatarHash: profile.profile.synced.gravatarHash,
            gravatarDefault: profile.profile.userdata.gravatarDefault
        }
    }

    getOrg(id: string): Promise<Organization> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        return groupsClient.getGroupById(id)
            .then((group) => {
                return this.groupToOrg(group, this.params.username)
            })
    }

    getGroup(id: string): Promise<Group> {
        if (id.length === 0) {
            return Promise.reject(new Error('Group id may not be an empty string'))
        }
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        return groupsClient.getGroupById(id)
            .then((group) => {
                return group
            })
    }

    groupExists(id: string): Promise<boolean> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        return groupsClient.groupExists(id)
            .then(({ exists }) => {
                return exists
            })
    }

    addOrg(newOrg: EditableOrganization, username: string): Promise<Organization> {
        const groupsClient = new GroupsClient({
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
            description: newOrg.description.value,
            type: 'Organization'
        })
            .then((group) => {
                return this.groupToOrg(group, username)
            })
    }

    // TODO this is fake until update is implemented on the back end
    updateOrg(id: string, orgUpdate: OrganizationUpdate): Promise<void> {

        const groupsClient = new GroupsClient({
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

    requestMembershipToGroup(id: string): Promise<GroupRequest> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.requestMembership({
            groupId: id
        })
            .then((request: groups.GroupRequest) => {
                return this.groupRequestToGroupRequest(request)
            })
            .catch((err) => {
                throw err;
            })
    }

    cancelRequest(requestId: string): Promise<GroupRequest> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.cancelRequest({
            requestId
        })
            .then((request: groups.GroupRequest) => {
                return this.groupRequestToGroupRequest(request)
            })
    }

    acceptRequest(requestId: string): Promise<GroupRequest> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.acceptRequest({
            requestId
        })
            .then((request: groups.GroupRequest) => {
                return this.groupRequestToGroupRequest(request)
            })
    }

    denyRequest(requestId: string): Promise<GroupRequest> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.denyRequest({
            requestId
        })
            .then((request: groups.GroupRequest) => {
                return this.groupRequestToGroupRequest(request)
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
}

export class Validation {
    static validateOrgId(id: string): [string, UIError] {
        // May not be empty
        if (id.length === 0) {
            return [
                id, {
                    type: UIErrorType.ERROR,
                    message: 'Organization id may not be empty'
                }]
        }
        // No spaces
        if (id.match(/\s/)) {
            return [
                id, {
                    type: UIErrorType.ERROR,
                    message: 'Organization id may not contain a space'
                }]
        }
        // May not exceed maximum size
        // todo: what is the real limit?
        if (id.length > 100) {
            return [
                id, {
                    type: UIErrorType.ERROR,
                    message: 'Organization id may not be longer than 100 characters'
                }]
        }

        // May not contain non-alphanumeric and underscore
        const alphaRe = /^[a-zA-Z0-9_]+$/
        if (!id.match(alphaRe)) {
            return [
                id, {
                    type: UIErrorType.ERROR,
                    message: 'Organization id may only contain alphanumeric (a-z, A-Z, 0-9) and underscore (_)'
                }
            ]
        }

        return [id, {
            type: UIErrorType.NONE
        }]
    }

    static validateOrgName(name: string): [string, UIError] {
        if (name.length === 0) {
            return [
                name, {
                    type: UIErrorType.ERROR,
                    message: 'Organization name may not be empty'
                }]
        }
        if (name.length > 256) {
            return [
                name, {
                    type: UIErrorType.ERROR,
                    message: 'Organization name may not be longer than 256 characters'
                }]
        }
        return [
            name, {
                type: UIErrorType.NONE
            }]
    }

    static validateOrgGravatarHash(gravatarHash: string): [string, UIError] {
        if (gravatarHash.length === 0) {
            return [
                gravatarHash, {
                    type: UIErrorType.NONE
                }]
        }
        if (gravatarHash.length > 32) {
            return [
                gravatarHash, {
                    type: UIErrorType.ERROR,
                    message: 'Organization gravatar hash may not be longer than 32 characters'
                }]
        }
        return [
            gravatarHash, {
                type: UIErrorType.NONE
            }]
    }

    static validateOrgDescription(name: string): [string, UIError] {
        if (name.length === 0) {
            return [
                name, {
                    type: UIErrorType.ERROR,
                    message: 'Organization description may not be empty'
                }]
        }
        // TODO: Is there really a limit?
        if (name.length > 4096) {
            return [
                name, {
                    type: UIErrorType.ERROR,
                    message: 'Organization name may not be longer than 4,096 characters'
                }]
        }
        return [
            name, {
                type: UIErrorType.NONE
            }]
    }
}

export class StaticData {
    static makeEmptyEditableOrganization(): EditableOrganization {
        return {
            id: {
                value: '',
                status: FieldState.NONE,
                error: {
                    type: UIErrorType.NONE
                }
            },
            name: {
                value: '',
                status: FieldState.NONE,
                error: {
                    type: UIErrorType.NONE
                }
            },
            gravatarHash: {
                value: '',
                status: FieldState.NONE,
                error: {
                    type: UIErrorType.NONE
                }
            },
            description: {
                value: '',
                status: FieldState.NONE,
                error: {
                    type: UIErrorType.NONE
                }
            }
        }
    }

}