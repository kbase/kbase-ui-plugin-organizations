import {
    RequestStatus,
    RequestResourceType,
} from '../types';
import * as userProfile from './apis/userProfile';
import { GroupsClient, } from './apis/groups';
import * as groups from './apis/groups';
import * as requestModel from './models/requests';
import { User } from '../types/common';

function stringToRequestType(type: string): requestModel.RequestType {
    switch (type) {
        case 'Invite':
            return requestModel.RequestType.INVITATION;
        case 'Request':
            return requestModel.RequestType.REQUEST;
        default:
            throw new Error('unknown request type: ' + type);
    }
}

function stringToResourceType(type: string) {
    switch (type) {
        case 'user':
            return RequestResourceType.USER;
        case 'workspace':
            return RequestResourceType.WORKSPACE;
        case 'catalogmethod':
            return RequestResourceType.APP;
        default:
            throw new Error('unknown resource type: ' + type);
    }
}

function stringToRequestStatus(status: string): RequestStatus {
    return RequestStatus.OPEN;
}

export interface UserQuery {
    query: string;
    excludedUsers: Array<string>;
}

function wait(timeout: number) {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            resolve(true);
        }, timeout);
    });
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
    token: string;
    username: string;
    groupsServiceURL: string;
    userProfileServiceURL: string;
    workspaceServiceURL: string;
    serviceWizardURL: string;
}

function promiseTry<T>(fun: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
        try {
            return resolve(fun());
        } catch (ex) {
            reject(ex);
        }
    });
}

export class Model {
    // organizations: Organizations
    // token: string
    // groupsServiceURL: string
    // userProfileServiceURL: string
    // workspaceServiceURL: string
    params: ModelParams;

    constructor(params: ModelParams) {
        // this.organizations = organizations;
        this.params = params;
    }

    getPendingRequests(): Promise<{ requests: Array<groups.Request>, invitations: Array<groups.Request>; }> {
        const groupsClient = new GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        });

        return Promise.all([
            groupsClient.getCreatedRequests({
                includeClosed: false,
                sortDirection: groups.SortDirection.DESCENDING
            })
                .then((requests) => {
                    return requests;
                }),
            groupsClient.getTargetedRequests({
                includeClosed: false,
                sortDirection: groups.SortDirection.DESCENDING
            })
                .then((requests) => {
                    return requests;
                })
        ])
            .then(([createdRequests, targetedRequests]) => {
                // here we just want to know ... does this user have any
                // pending requests with this group!
                return {
                    requests: createdRequests,
                    invitations: targetedRequests
                };
            });
    }





    // membersAndAdminsToMembers(memberUsernames: Array<string>, adminUsernames: Array<string>, userProfileMap: Map<string, userProfile.UserProfile>): Array<Member> {
    //     return memberUsernames.map((member) => {
    //         const p = userProfileMap.get(member)
    //         if (typeof p === 'undefined') {
    //             throw new Error('Member without profile!')
    //         }
    //         return {
    //             type: MemberType.MEMBER,
    //             user: this.profileToUser(p)
    //         }
    //     }).concat(adminUsernames.map((admin) => {
    //         const p = userProfileMap.get(admin)
    //         if (typeof p === 'undefined') {
    //             throw new Error('Admin without profile')
    //         }
    //         return {
    //             type: MemberType.ADMIN,
    //             user: this.profileToUser(p)
    //         }
    //     }))
    //         .sort((a, b) => {
    //             return a.user.realname.localeCompare(b.user.realname);
    //         })

    //     // return members
    // }

    // getGroupMembers(group: Group, userProfileMap: Map<string, userProfile.UserProfile>): Array<Member> {
    //     return group.members.map((member) => {
    //         const p = userProfileMap.get(member)
    //         if (typeof p === 'undefined') {
    //             throw new Error('Member without profile!')
    //         }
    //         return {
    //             type: MemberType.MEMBER,
    //             user: this.profileToUser(p)
    //         }
    //     }).concat(group.admins.map((admin) => {
    //         const p = userProfileMap.get(admin)
    //         if (typeof p === 'undefined') {
    //             throw new Error('Admin without profile')
    //         }
    //         return {
    //             type: MemberType.ADMIN,
    //             user: this.profileToUser(p)
    //         }
    //     }))
    //         // .concat([
    //         //     {
    //         //         type: MemberType.OWNER,
    //         //         user: this.profileToUser(userProfileMap.get(group.owner)!)
    //         //     }
    //         // ])
    //         .sort((a, b) => {
    //             return a.user.realname.localeCompare(b.user.realname);
    //         })

    //     // return members
    // }


    /*
        Given a set of group ids, return a set of pending group requests.
        Group requests are those targeted to the group. 
        Returned as a map of group to requests.
    */
    getPendingAdminRequests(groupIds: Array<string>): Promise<Map<string, Array<requestModel.Request>>> {
        const requestClient = new requestModel.RequestsModel({
            token: this.params.token, username: this.params.username,
            groupsServiceURL: this.params.groupsServiceURL
        });

        return Promise.all(groupIds.map((id) => {
            return requestClient.getPendingOrganizationRequestsForOrg(id)
                .then((requests) => {
                    return {
                        groupId: id,
                        requests: requests
                    };
                });
        }))
            .then((allRequests) => {
                const pendingRequests = new Map<string, Array<requestModel.Request>>();
                allRequests.forEach(({ groupId, requests }) => {
                    pendingRequests.set(groupId, requests);
                });
                return pendingRequests;
            });
    }

    profileToUser(profile: userProfile.UserProfile): User {
        let jobTitle;
        if (!profile.profile.userdata) {
            return {
                username: profile.user.username,
                realname: profile.user.realname,
                city: null,
                state: null,
                country: null,
                title: null,
                organization: null,
                avatarOption: null,
                gravatarHash: null,
                gravatarDefault: null
            };
        }
        if (profile.profile.userdata.jobTitle === 'Other') {
            jobTitle = profile.profile.userdata.jobTitleOther;
        } else {
            jobTitle = profile.profile.userdata.jobTitle;
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
        };
    }
}




    // Users



    // searchUsers(query: UserQuery): Promise<Array<BriefUser>> {
    //     const userProfileClient = new userProfile.UserProfileClient({
    //         url: this.params.userProfileServiceURL,
    //         token: this.params.token
    //     })

    //     return userProfileClient.searchUsers(query.query)
    //         .then((users) => {
    //             return users
    //                 .filter(({ username }) => {
    //                     return (query.excludedUsers.indexOf(username) === -1)
    //                 })
    //                 .map(({ username, realname }) => {
    //                     return {
    //                         username, realname
    //                     }
    //                 })

    //         })
    // }

