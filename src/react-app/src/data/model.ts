import {
    Organization, OrganizationUpdate,
    UIError,
    UIErrorType,
    SortDirection,
    FieldState,
    EditableOrganization,
    UserRelationToOrganization,
    User,
    Member,
    GroupRequest,
    RequestType,
    RequestStatus,
    OwnerRelation,
    UserOrgRelation,
    AdminRelation,
    MemberRelation,
    MembershipRequestPendingRelation,
    MembershipInvitationPendingRelation,
    ViewRelation,
    MemberType,
    BriefUser,
    UserRequest,
    RequestResourceType,
    WorkspaceRequest,
    AppRequest,
    UserInvitation,
    WorkspaceInvitation,
    AppInvitation,
    Narrative
} from '../types';
// import { organizations } from './data';
import * as userProfile from './userProfile'
import { GroupsClient, Group } from './groups'
import * as groups from './groups'
import { NarrativeServiceClient } from './narrativeService';
import { WorkspaceInfo, ObjectInfo, workspaceInfoToObject, objectInfoToObject } from './workspaceUtils';

function stringToRequestType(type: string): RequestType {
    switch (type) {
        case 'Invite':
            return RequestType.INVITATION
        case 'Request':
            return RequestType.REQUEST
        default:
            throw new Error('unknown request type: ' + type)
    }
}

function stringToResourceType(type: string) {
    switch (type) {
        case 'user':
            return RequestResourceType.USER
        case 'workspace':
            return RequestResourceType.WORKSPACE
        case 'catalogmethod':
            return RequestResourceType.APP
        default:
            throw new Error('unknown resource type: ' + type)
    }
}

function stringToRequestStatus(status: string): RequestStatus {
    return RequestStatus.OPEN
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
                termRe.test(org.owner.user.username) ||
                termRe.test(org.owner.user.realname)
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
                return direction * a.owner.user.username.localeCompare(b.owner.user.username)
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
        case 'memberOf':
            return organizations.filter((org) => (
                (org.members.findIndex((member) => (member.user.username === username)) >= 0)
            ))
        case 'owned':
            return organizations.filter((org) => (org.owner.user.username === username))
        case 'notOwned':
            return organizations.filter((org) => (org.owner.user.username !== username))
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

export interface UserQuery {
    query: string
    excludedUsers: Array<string>
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
    token: string
    username: string
    groupsServiceURL: string
    userProfileServiceURL: string
    workspaceServiceURL: string
    serviceWizardURL: string
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

type GroupRequestOrBoolean = GroupRequest | boolean

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

    getPendingRequests(): Promise<{ requests: Array<groups.Request>, invitations: Array<groups.Request> }> {
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

    groupRequestToOrgRequest(request: groups.Request): Promise<UserRequest | UserInvitation | WorkspaceRequest | WorkspaceInvitation | AppRequest | AppInvitation> {
        const userProfileClient = new userProfile.UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })

        const usernames = [request.requester]
        if (request.resourcetype === 'user') {
            usernames.push(request.resource)
        }

        // TODO: make different types of requests based on the resource type...
        switch (request.resourcetype) {
            case 'user':
        }

        return userProfileClient.getUserProfiles(usernames)
            .then((profiles) => {

                const requestType = stringToRequestType(request.type);
                const resourceType = stringToResourceType(request.resourcetype)
                const requestStatus = stringToRequestStatus(request.status)

                switch (resourceType) {
                    case RequestResourceType.USER:
                        if (requestType === RequestType.REQUEST) {
                            return {
                                id: request.id,
                                groupId: request.groupid,
                                resourceType: resourceType,
                                requester: this.profileToUser(profiles[0]),
                                type: requestType,
                                status: requestStatus,
                                user: this.profileToUser(profiles[1]),
                                createdAt: new Date(request.createdate),
                                expireAt: new Date(request.expiredate),
                                modifiedAt: new Date(request.moddate)
                            } as UserRequest
                        } else {
                            return {
                                id: request.id,
                                groupId: request.groupid,
                                resourceType: resourceType,
                                requester: this.profileToUser(profiles[0]),
                                type: requestType,
                                status: requestStatus,
                                user: this.profileToUser(profiles[1]),
                                createdAt: new Date(request.createdate),
                                expireAt: new Date(request.expiredate),
                                modifiedAt: new Date(request.moddate)
                            } as UserInvitation
                        }

                    case RequestResourceType.WORKSPACE:
                        if (requestType === RequestType.REQUEST) {
                            return {
                                id: request.id,
                                groupId: request.groupid,
                                resourceType: resourceType,
                                requester: this.profileToUser(profiles[0]),
                                type: requestType,
                                status: requestStatus,
                                workspace: request.resource,
                                createdAt: new Date(request.createdate),
                                expireAt: new Date(request.expiredate),
                                modifiedAt: new Date(request.moddate)
                            } as WorkspaceRequest
                        } else {
                            return {
                                id: request.id,
                                groupId: request.groupid,
                                resourceType: resourceType,
                                requester: this.profileToUser(profiles[0]),
                                type: requestType,
                                status: requestStatus,
                                workspace: request.resource,
                                createdAt: new Date(request.createdate),
                                expireAt: new Date(request.expiredate),
                                modifiedAt: new Date(request.moddate)
                            } as WorkspaceInvitation
                        }
                    case RequestResourceType.APP:
                        if (requestType === RequestType.REQUEST) {
                            return {
                                id: request.id,
                                groupId: request.groupid,
                                resourceType: resourceType,
                                requester: this.profileToUser(profiles[0]),
                                type: requestType,
                                status: requestStatus,
                                app: request.resource,
                                createdAt: new Date(request.createdate),
                                expireAt: new Date(request.expiredate),
                                modifiedAt: new Date(request.moddate)
                            } as AppRequest
                        } else {
                            return {
                                id: request.id,
                                groupId: request.groupid,
                                resourceType: resourceType,
                                requester: this.profileToUser(profiles[0]),
                                type: requestType,
                                status: requestStatus,
                                app: request.resource,
                                createdAt: new Date(request.createdate),
                                expireAt: new Date(request.expiredate),
                                modifiedAt: new Date(request.moddate)
                            } as AppInvitation
                        }
                    default:
                        throw new Error('resource type not handled yet: ' + request.resourcetype)
                }


            })
    }


    getPendingOrganizationRequests(groupId: string): Promise<Array<GroupRequest>> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return Promise.all([
            groupsClient.getGroupRequests(groupId, {
                includeClosed: false,
                sortDirection: groups.SortDirection.DESCENDING,
                startAt: new Date(0)
            }),
            groupsClient.getCreatedRequests({
                includeClosed: false,
                sortDirection: groups.SortDirection.DESCENDING,
                startAt: new Date(0)
            })
        ])

            // return groupsClient.getGroupRequests(groupId, {
            //     includeClosed: false,
            //     sortDirection: groups.SortDirection.DESCENDING,
            //     startAt: new Date(0)
            // })
            .then(([groupRequests, adminRequests]) => {

                const groupAdminRequests = adminRequests.filter((request) => {
                    return (request.groupid === groupId)
                })

                return Promise.all(groupRequests.concat(groupAdminRequests).map((request) => {
                    return this.groupRequestToOrgRequest(request)
                }))
            })
    }

    membersAndAdminsToMembers(memberUsernames: Array<string>, adminUsernames: Array<string>, userProfileMap: Map<string, userProfile.UserProfile>): Array<Member> {
        return memberUsernames.map((member) => {
            const p = userProfileMap.get(member)
            if (typeof p === 'undefined') {
                throw new Error('Member without profile!')
            }
            return {
                type: MemberType.MEMBER,
                user: this.profileToUser(p)
            }
        }).concat(adminUsernames.map((admin) => {
            const p = userProfileMap.get(admin)
            if (typeof p === 'undefined') {
                throw new Error('Admin without profile')
            }
            return {
                type: MemberType.ADMIN,
                user: this.profileToUser(p)
            }
        }))
            .sort((a, b) => {
                return a.user.realname.localeCompare(b.user.realname);
            })

        // return members
    }

    getGroupMembers(group: Group, userProfileMap: Map<string, userProfile.UserProfile>): Array<Member> {
        return group.members.map((member) => {
            const p = userProfileMap.get(member)
            if (typeof p === 'undefined') {
                throw new Error('Member without profile!')
            }
            return {
                type: MemberType.MEMBER,
                user: this.profileToUser(p)
            }
        }).concat(group.admins.map((admin) => {
            const p = userProfileMap.get(admin)
            if (typeof p === 'undefined') {
                throw new Error('Admin without profile')
            }
            return {
                type: MemberType.ADMIN,
                user: this.profileToUser(p)
            }
        }))
            // .concat([
            //     {
            //         type: MemberType.OWNER,
            //         user: this.profileToUser(userProfileMap.get(group.owner)!)
            //     }
            // ])
            .sort((a, b) => {
                return a.user.realname.localeCompare(b.user.realname);
            })

        // return members
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
        const userProfileClient = new userProfile.UserProfileClient({
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
        return Promise.all([
            ((): Promise<Map<string, GroupRequest[]>> => {
                if (username === group.owner || group.admins.indexOf(username) >= 0) {
                    return this.getPendingAdminRequests([group.id])
                } else {
                    return Promise.resolve(new Map<string, GroupRequest[]>())
                }
            })(),
            this.getPendingRequests()
        ])
            // return this.getPendingRequests()
            .then(([pendingAdminRequests, { requests, invitations }]) => {

                // pending join requests
                const pendingRequests = new Map<string, groups.Request>()
                requests.forEach((req) => {
                    if (req.type === 'Request' && req.resourcetype === 'user' && req.requester === username) {
                        pendingRequests.set(req.groupid, req)
                    }
                })

                // pending invitations to join
                const pendingInvites = new Map<string, groups.Request>()
                invitations.forEach((req) => {
                    if (req.type === 'Invite' && req.resourcetype === 'user' && req.resource === username) {
                        pendingInvites.set(req.groupid, req)
                    }
                })

                return userProfileClient.getUserProfiles(allUsers)
                    .then((userProfiles) => {
                        const userProfileMap = userProfiles.reduce((map, profile) => {
                            map.set(profile.user.username, profile)
                            return map
                        }, new Map<string, userProfile.UserProfile>())

                        const ownerProfile = userProfileMap.get(group.owner)
                        if (!ownerProfile) {
                            throw new Error('No profile for owner!')
                        }
                        // TODO: if members really is always an array, we can skip this defaulting behavior
                        // const memberUsernames = group.members || []
                        // const adminUsernames = group.admins || []

                        // TODO: the user profile map needs to be cached, etc.
                        // const members = this.membersAndAdminsToMembers(memberUsernames, adminUsernames, userProfileMap).sort((a, b) => {
                        //     return a.user.realname.localeCompare(b.user.realname);
                        // })

                        const members = this.getGroupMembers(group, userProfileMap).sort((a, b) => {
                            return a.user.realname.localeCompare(b.user.realname);
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

                        // Get Narratives
                        const narratives = group.resources.workspace.map((workspace) => {
                            return {
                                title: workspace.narrname,
                                workspaceId: parseInt(workspace.rid, 10)
                            }
                        })

                        const apps = group.resources.catalogmethod.map((app) => {
                            return {
                                id: app.rid
                            }
                        })

                        // Get Apps

                        // perhaps get the pending admin requests
                        return promiseTry<Organization>((): Promise<Organization> => {
                            if (relation.type === UserRelationToOrganization.ADMIN ||
                                relation.type === UserRelationToOrganization.OWNER) {
                                return this.getPendingOrganizationRequests(group.id)
                                    .then((requests) => {
                                        return {
                                            id: group.id,
                                            name: group.name,
                                            gravatarHash: group.custom ? (group.custom.gravatarhash || null) : null,
                                            description: group.description,
                                            createdAt: new Date(group.createdate),
                                            modifiedAt: new Date(group.moddate),
                                            owner: {
                                                type: MemberType.OWNER,
                                                user: this.profileToUser(ownerProfile)
                                            },
                                            relation: relation,
                                            members: members,
                                            // admins: admins,
                                            adminRequests: (pendingAdminRequests.has(id) ? pendingAdminRequests.get(id)! : []),
                                            narratives,
                                            apps
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
                                    owner: {
                                        type: MemberType.OWNER,
                                        user: this.profileToUser(ownerProfile)
                                    },
                                    relation: relation,
                                    members: members,
                                    // admins: admins,
                                    adminRequests: [],
                                    narratives,
                                    apps
                                })
                            }
                        })

                    })
            })
    }

    getPendingAdminRequests(groupIds: Array<string>): Promise<Map<string, Array<GroupRequest>>> {

        return Promise.all(groupIds.map((id) => {
            return this.getPendingOrganizationRequests(id)
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
        const userProfileClient = new userProfile.UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })

        const allUsers = groups.reduce((allUsers, group) => {
            allUsers.set(group.owner, true)
            group.members.forEach((member) => allUsers.set(member, true))
            group.admins.forEach((admin) => allUsers.set(admin, true))
            return allUsers;
        }, new Map<string, boolean>()).keys()

        // Note that here we are dealing with raw groups so we check whether the user is an
        // admin by hand.
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
                }, new Map<string, userProfile.UserProfile>())

                // now make a per-group map out of this...
                const pendingRequests = new Map<string, groups.Request>()
                requests.forEach((req) => {
                    if (req.type === 'Request' && req.resourcetype === 'user' && req.requester === username) {
                        pendingRequests.set(req.groupid, req)
                    }
                })

                const pendingInvites = new Map<string, groups.Request>()
                invitations.forEach((req) => {
                    if (req.type === 'Invite' && req.resourcetype === 'user' && req.resource === username) {
                        pendingInvites.set(req.groupid, req)
                    }
                })

                return Promise.all(groups.map((group) => {
                    const { id, name, description, createdate, moddate, owner, members, admins, custom: { gravatarhash } } = group
                    let relation: UserOrgRelation
                    // TODO: when we have access to members, admins, and group publication status, we can 
                    // flesh out all user relations.
                    const orgMembers: Array<Member> = this.membersAndAdminsToMembers(members, admins, profileMap)

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

                    // Get Narratives
                    const narratives = group.resources.workspace.map((workspace) => {
                        return {
                            title: workspace.narrname,
                            workspaceId: parseInt(workspace.rid, 10)
                        }
                    })

                    const apps = group.resources.catalogmethod.map((app) => {
                        return {
                            id: app.rid
                        }
                    })

                    return {
                        id, name, description,
                        gravatarHash: gravatarhash || null,
                        owner: {
                            type: MemberType.OWNER,
                            user: this.profileToUser(profileMap.get(group.owner)!)
                        },
                        createdAt: new Date(createdate),
                        modifiedAt: new Date(moddate),
                        relation: relation,
                        members: orgMembers,
                        // admins: admins.map((username) => this.profileToUser(profileMap.get(username)!)),
                        adminRequests: (pendingAdminRequests.has(id) ? pendingAdminRequests.get(id)! : []),
                        narratives,
                        apps
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

    profileToUser(profile: userProfile.UserProfile): User {
        let jobTitle
        if (profile.profile.userdata.jobTitle === 'Other') {
            jobTitle = profile.profile.userdata.jobTitleOther
        } else {
            jobTitle = profile.profile.userdata.jobTitle
        }
        return {
            username: profile.user.username,
            realname: profile.user.realname,
            city: profile.profile.userdata.city,
            state: profile.profile.userdata.state,
            country: profile.profile.userdata.country,
            title: jobTitle,
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
            .then((request: groups.Request) => {
                return this.groupRequestToOrgRequest(request)
            })
            .catch((err) => {
                throw err;
            })
    }

    addOrRequestNarrativeToGroup(groupId: string, narrative: Narrative): Promise<GroupRequest | boolean> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.addOrRequestNarrative({
            groupId: groupId,
            workspaceId: narrative.workspaceId
        })
            .then((request): Promise<GroupRequest | boolean> => {
                if (request.complete === true) {
                    return Promise.resolve(true)
                } else {
                    return this.groupRequestToOrgRequest(request)
                }

            })
            .catch((err: Error) => {
                throw err;
            })
    }

    removeNarrativeFromGroup(groupId: string, workspaceId: number): Promise<void> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.deleteResource(
            groupId,
            'workspace',
            String(workspaceId)
        )
    }

    cancelRequest(requestId: string): Promise<GroupRequest> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.cancelRequest({
            requestId
        })
            .then((request: groups.Request) => {
                return this.groupRequestToOrgRequest(request)
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
            .then((request: groups.Request) => {
                return this.groupRequestToOrgRequest(request)
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
            .then((request: groups.Request) => {
                return this.groupRequestToOrgRequest(request)
            })
    }

    acceptJoinInvitation(requestId: string): Promise<GroupRequest> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.acceptRequest({
            requestId
        })
            .then((request: groups.Request) => {
                return this.groupRequestToOrgRequest(request)
            })
    }

    rejectJoinInvitation(requestId: string): Promise<GroupRequest> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.denyRequest({
            requestId
        })
            .then((request: groups.Request) => {
                return this.groupRequestToOrgRequest(request)
            })
    }

    memberToAdmin(groupId: string, member: string): Promise<void> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.memberToAdmin({
            groupId,
            member
        })
    }

    adminToMember(groupId: string, member: string): Promise<void> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.adminToMember({
            groupId,
            member
        })
    }
    removeMember(groupId: string, member: string): Promise<void> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.removeMember({
            groupId,
            member
        })
    }

    requestJoinGroup(groupId: string, username: string): Promise<GroupRequest> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.requestJoinGroup({
            groupId,
            username
        })
            .then((request) => {
                return this.groupRequestToOrgRequest(request)
            })
    }

    // Validation 

    validateOrgId(id: string): [string, UIError] {
        return Validation.validateOrgId(id);
    }

    validateOrgName(name: string): [string, UIError] {
        return Validation.validateOrgName(name)
    }

    validateOrgDescription(description: string): [string, UIError] {
        return Validation.validateOrgDescription(description);
    }

    // Users



    searchUsers(query: UserQuery): Promise<Array<BriefUser>> {
        const userProfileClient = new userProfile.UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })

        return userProfileClient.searchUsers(query.query)
            .then((users) => {
                return users
                    .filter(({ username }) => {
                        return (query.excludedUsers.indexOf(username) === -1)
                    })
                    .map(({ username, realname }) => {
                        return {
                            username, realname
                        }
                    })

            })

    }

    getUser(username: string): Promise<User> {
        const userProfileClient = new userProfile.UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })

        return userProfileClient.getUserProfile(username)
            .then((userProfile) => {
                return this.profileToUser(userProfile)
            })
    }

    // Narratives

    getOwnNarratives(organizationId: string): Promise<Array<Narrative>> {
        const narrativeServiceClient = new NarrativeServiceClient({
            url: this.params.serviceWizardURL,
            token: this.params.token,
            timeout: 10000,
        })

        return Promise.all([
            narrativeServiceClient.listNarratives('mine'),
            this.getOrg(organizationId)
        ])
            .then(([narrativesResult, organization]) => {
                const workspacesInOrg = organization.narratives.map((narrative) => {
                    return narrative.workspaceId
                })
                return narrativesResult.narratives
                    .map((nar) => {
                        return {
                            workspaceInfo: workspaceInfoToObject(nar.ws) as NarrativeWorkspaceInfo,
                            objectInfo: objectInfoToObject(nar.nar)
                        }
                    })
                    .filter((nar) => {
                        return (nar.workspaceInfo.metadata.is_temporary === 'false')
                    })
                    .map((narrative) => {
                        return {
                            workspaceId: narrative.workspaceInfo.id,
                            objectId: narrative.objectInfo.id,
                            title: narrative.workspaceInfo.metadata.narrative_nice_name,
                            inOrganization: (workspacesInOrg.indexOf(narrative.workspaceInfo.id) !== -1)
                        }
                    })
                    .sort((a, b) => {
                        return (a.title.localeCompare(b.title))
                    })
            })
    }
}

export interface NarrativeWorkspaceInfo extends WorkspaceInfo {
    metadata: {
        narrative_nice_name: string
        version: string
        is_temporary: string
    }
}
export interface GetOwnNarrativesResult {
    workspaceInfo: WorkspaceInfo
    objectInfo: ObjectInfo
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