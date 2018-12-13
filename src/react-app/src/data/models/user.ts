import { UserProfileClient, UserProfile } from '../apis/userProfile'


export type Username = string

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


function profileToUser(profile: UserProfile): User {
    let jobTitle
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
        }
    }
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

export interface UserQuery {
    query: string
    excludedUsers: Array<string>
}

export interface BriefUser {
    username: string
    realname: string
}




interface UserModelParams {
    userProfileServiceURL: string
    token: string
}

export class UserModel {

    params: UserModelParams
    userProfileClient: UserProfileClient

    cache: Map<Username, User>

    constructor(params: UserModelParams) {
        this.params = params
        this.userProfileClient = new UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })
        this.cache = new Map<Username, User>()
    }

    async getUser(username: Username): Promise<User> {
        if (this.cache.has(username)) {
            return this.cache.get(username)!
        }

        const userProfile = await this.userProfileClient.getUserProfile(username)
        const user = profileToUser(userProfile)
        this.cache.set(username, user)
        return user
    }

    async getUsers(usernames: Array<Username>): Promise<Map<Username, User>> {
        const result: Map<Username, User> = new Map()

        const toFetch: Array<Username> = []

        usernames.forEach((username) => {
            if (this.cache.has(username)) {
                result.set(username, this.cache.get(username)!)
            } else {
                toFetch.push(username)
            }
        })

        const userProfiles = await this.userProfileClient.getUserProfiles(toFetch)
        const users = userProfiles.map((profile) => {
            return profileToUser(profile)
        })

        userProfiles.forEach((userProfile) => {
            const user = profileToUser(userProfile)
            this.cache.set(user.username, user)
            result.set(user.username, user)
        })

        return result
    }

    async searchUsers(query: UserQuery): Promise<Array<BriefUser>> {
        const users = await this.userProfileClient.searchUsers(query.query)
        return users
            .filter(({ username }) => {
                return (query.excludedUsers.indexOf(username) === -1)
            })
            .map(({ username, realname }) => {
                return {
                    username, realname
                }
            })
    }

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

    // getUser(username: string): Promise<User> {
    //     const userProfileClient = new userProfile.UserProfileClient({
    //         url: this.params.userProfileServiceURL,
    //         token: this.params.token
    //     })

    //     return userProfileClient.getUserProfile(username)
    //         .then((userProfile) => {
    //             return this.profileToUser(userProfile)
    //         })
    // }
}