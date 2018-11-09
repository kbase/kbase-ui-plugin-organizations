import {
    Organization, BriefOrganization, NewOrganization, OrganizationUpdate,
    UIError,
    UIErrorType,
    SortDirection
} from '../types';
// import { organizations } from './data';
import { UserProfileClient, UserProfile } from './userProfile'
import { GroupsClient, Group, GroupList, BriefGroup } from './groups'
import { WorkspaceClient } from './workspace';

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
                termRe.test(org.owner.username) ||
                termRe.test(org.owner.realname)
        })
    })

    return filteredOrgs
}

function applySort(organizations: Array<BriefOrganization>, sortBy: string, sortDirection: SortDirection): Array<BriefOrganization> {
    const direction = sortDirection === SortDirection.ASCENDING ? 1 : -1
    switch (sortBy) {
        // case 'createdAt':
        //     return  organizations.slice().sort((a, b) => {
        //         return direction * (a.createdAt.getTime() - b.createdAt.getTime())
        //     })
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

function applyFilter(organizations: Array<BriefOrganization>, filter: string, username: string): Array<BriefOrganization> {
    switch (filter) {
        case 'all':
            return organizations
            break
        case 'owned':
            return organizations.filter((org) => (org.owner.username === username))
        case 'notOwned':
            return organizations.filter((org) => (org.owner.username !== username))
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
    organizations: Array<BriefOrganization>
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
    groupsServiceURL: string,
    userProfileServiceURL: string,
    workspaceServiceURL: string
}

export class Model {
    // organizations: Organizations
    // token: string
    // groupsServiceURL: string
    // userProfileServiceURL: string
    // workspaceServiceURL: string
    params: ModelParams


    constructor(params: ModelParams) {
        // this.organizations = organizations;
        this.params = params;
    }

    groupToOrg(group: Group, profile: UserProfile): Organization {
        const { id, name, owner, description, createdate, moddate } = group
        return {
            id: id,
            name: name,
            gravatarHash: group.custom.gravatarhash || null,
            description: description,
            owner: {
                username: owner,
                realname: profile.user.realname,
                city: profile.profile.userdata.city,
                state: profile.profile.userdata.state,
                country: profile.profile.userdata.country,
                organization: profile.profile.userdata.organization,
                avatarOption: profile.profile.userdata.avatarOption,
                gravatarHash: profile.profile.synced.gravatarHash,
                gravatarDefault: profile.profile.userdata.gravatarDefault
            },
            createdAt: new Date(createdate),
            modifiedAt: new Date(moddate)
        }
    }

    briefGroupToBriefOrg(group: BriefGroup, profile: UserProfile): BriefOrganization {
        const { id, name, owner, custom: { gravatarhash } } = group
        return { id, name, gravatarHash: gravatarhash || null, owner: { username: owner, realname: profile.user.realname }, createdAt: new Date(), modifiedAt: new Date() }
    }

    groupsToOrgs(groups: GroupList, profiles: Map<string, UserProfile>): Array<BriefOrganization> {
        return groups.map((group) => {
            return this.briefGroupToBriefOrg(group, profiles.get(group.owner)!)
        })
    }

    queryOrgs(query: Query): Promise<QueryResults> {
        const groups = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        const userProfileClient = new UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })
        const workspaceClient = new WorkspaceClient({
            url: this.params.workspaceServiceURL,
            token: this.params.token
        })
        return groups.getGroups()
            .then((groups) => {
                // Add user profiles to groups.
                // We do it here so that search can extend into user real names and possibly
                // other user profile attributes 
                const owners = groups.reduce((owners, group) => {
                    owners.set(group.owner, true)
                    return owners;
                }, new Map<string, boolean>()).keys()
                return userProfileClient.getUserProfiles(Array.from(owners))
                    .then((profiles) => {
                        const profileMap = profiles.reduce((profileMap, profile) => {
                            profileMap.set(profile.user.username, profile)
                            return profileMap
                        }, new Map<string, UserProfile>())
                        return this.groupsToOrgs(groups, profileMap)
                    })
            })
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

    getOrg(id: string): Promise<Organization> {
        const groups = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        const userProfileClient = new UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })
        return groups.getGroupById(id)
            .then((group) => {
                return userProfileClient.getUserProfile(group.owner)
                    .then((userProfile) => {
                        return {
                            id: group.id,
                            name: group.name,
                            gravatarHash: group.custom.gravatarhash || null,
                            description: group.description,
                            createdAt: new Date(group.createdate),
                            modifiedAt: new Date(group.moddate),
                            owner: {
                                username: group.owner,
                                realname: userProfile.user.realname,
                                city: userProfile.profile.userdata.city,
                                state: userProfile.profile.userdata.state,
                                country: userProfile.profile.userdata.country,
                                organization: userProfile.profile.userdata.organization,
                                avatarOption: userProfile.profile.userdata.avatarOption,
                                gravatarHash: userProfile.profile.synced.gravatarHash,
                                gravatarDefault: userProfile.profile.userdata.gravatarDefault
                            }
                        }
                    })

            })
    }

    getGroup(id: string): Promise<Group> {
        if (id.length === 0) {
            return Promise.reject(new Error('Group id may not be an empty string'))
        }
        const groups = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        return groups.getGroupById(id)
            .then((group) => {
                return group
            })
    }

    addOrg(newOrg: NewOrganization, username: string): Promise<Organization> {
        const groups = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const userProfileClient = new UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })

        // do record-level validation
        if ((newOrg.id.error && newOrg.id.error.type === UIErrorType.ERROR) ||
            (newOrg.name.error && newOrg.name.error.type === UIErrorType.ERROR) ||
            (newOrg.gravatarHash.error && newOrg.gravatarHash.error.type === UIErrorType.ERROR) ||
            (newOrg.description.error && newOrg.description.error.type === UIErrorType.ERROR)) {
            return Promise.reject(new Error('One or more fields are invalid'))
        }

        return groups.createGroup({
            id: newOrg.id.value,
            name: newOrg.name.value,
            gravatarhash: newOrg.gravatarHash.value,
            description: newOrg.description.value,
            type: 'Organization'
        })
            .then((group) => {
                return userProfileClient.getUserProfile(group.owner)
                    .then((userProfile) => {
                        return this.groupToOrg(group, userProfile)
                    })
            })
    }

    // TODO this is fake until update is implemented on the back end
    updateOrg(id: string, orgUpdate: OrganizationUpdate): Promise<Organization> {
        return new Promise<Organization>((resolve) => {
            return wait(200)
                .then(() => {
                    return this.getOrg(id)
                })
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
                    type: UIErrorType.ERROR,
                    message: 'Organization gravatar hash may not be empty'
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