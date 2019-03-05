import {
    ServiceClientParams,
    AuthorizedServiceClient
} from "./serviceClient";

export interface User {
    username: string,
    realname: string,
    thumbnail: string
}

export type OrganizationSetting = {
    settings: {
        lastVisitedAt: Date | null
    }
}

export type OrganizationsSettings = {
    orgSettings: any //Map<string, OrganizationSetting>
}

export interface UserProfile {
    user: User,
    profile: {
        synced: {
            gravatarHash: string
        }
        userdata: {
            jobTitle: string,
            jobTitleOther: string,
            organization: string
            city: string
            state: string
            country: string
            avatarOption: string
            gravatarDefault: string
        }
        metadata: {
            createdBy: string
            created: string
        }
        plugins: {
            organizations?: OrganizationsSettings
        }
    }
}

// Note that we are only supporting updating of the orgs plugin settings, 
// so make this strict-ish.
export interface UserProfileUpdate {
    user: User,
    profile: {
        plugins: {
            organizations: OrganizationsSettings
        }
    }
}

export interface JSONPayload {
    version: string,
    method: string,
    id: string,
    params: any
}


export interface UserProfileClientParams extends ServiceClientParams {
}

export class UserProfileClient extends AuthorizedServiceClient {
    static module: string = 'UserProfile'
    static profileCache: Map<string, UserProfile> = new Map()

    constructor(params: UserProfileClientParams) {
        super(params)
    }

    // makePayload(method: string, param: any): JSONPayload {
    //     return {
    //         version: '1.1',
    //         method: 'UserProfile.' + method,
    //         id: String(Math.random()).slice(2),
    //         params: [param]
    //     }
    // }

    // makeEmptyPayload(method: string): JSONPayload {
    //     return {
    //         version: '1.1',
    //         method: 'UserProfile.' + method,
    //         id: String(Math.random()).slice(2),
    //         params: []
    //     }
    // }

    getVersion(): Promise<any> {
        return fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                Authorization: this.token,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(this.makeEmptyPayload('version'))
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('User profile request error: ' + response.status + ', ' + response.statusText)
                }
                return response.json()
            })
    }

    async getUserProfile(username: string): Promise<UserProfile> {
        if (UserProfileClient.profileCache.has(username)) {
            return Promise.resolve(UserProfileClient.profileCache.get(username)!)
        }

        return this.callFunc('get_user_profile', [username])
            .then((result) => {
                return result.result[0][0] as UserProfile
            })
    }

    async updateUserProfile(update: UserProfileUpdate): Promise<void> {
        // TODO: update user profile cache here...
        UserProfileClient.profileCache.delete(update.user.username)
        return this.callFunc('update_user_profile', { profile: update })
            .then(() => {
                return
            })
    }

    // async setUserProfile(username: string, profile: UserProfile): Promise<void> {
    //     // TODO: update user profile cache here...
    //     this.callFunc('update_user_profile', profile)
    // }

    async getUserProfiles(usernames: Array<string>): Promise<Array<UserProfile>> {
        return this.callFunc('get_user_profile', usernames)
            .then((result) => {
                return result.result[0] as Array<UserProfile>
            })
    }

    async getAllUsers(): Promise<Array<User>> {
        return this.callFunc('filter_users', { filter: '' })
            .then((result) => {
                return result.result[0] as Array<User>
            })
    }

    async searchUsers(query: string): Promise<Array<User>> {
        return this.callFunc('filter_users', { filter: query })
            .then((result) => {
                return result.result[0] as Array<User>
            })
    }
}