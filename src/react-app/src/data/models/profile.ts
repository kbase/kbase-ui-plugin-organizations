import * as userProfileAPI from "../apis/userProfile";
import { Props, getProp } from '../../lib/props'

// User Profile Model

export interface User {
    username: string
    realname: string
    avatar: string
}

export interface Profile {
    user: User,
    profile: {
        userdata: any
    }
}

export interface UserProfileParams {
    userProfileServiceURL: string
    token: string
    username: string
}

export class UserProfile {

    params: UserProfileParams
    userProfileClient: userProfileAPI.UserProfileClient

    constructor(params: UserProfileParams) {
        this.params = params
        this.userProfileClient = new userProfileAPI.UserProfileClient({
            url: this.params.userProfileServiceURL,
            token: this.params.token
        })
    }

    async getProfile(username: string): Promise<userProfileAPI.UserProfile> {
        return this.userProfileClient.getUserProfile(username)
    }

    async setLastVisitedAt(organizationId: string, lastVisitedAt: Date): Promise<void> {
        // For now, do all the work here...

        const profile = await this.getProfile(this.params.username)

        // const newProfile =  new Props({
        //     ...profile.user,
        //     profile: {
        //         ...profile.profile.plugins
        //     }
        // })

        const newProfile = new Props({
            user: profile.user,
            profile: {
                plugins: getProp(profile, 'profile.plugins', {})
            }
        })

        newProfile.setItem('profile.plugins.organizations.orgSettings.' + organizationId, {
            settings: {
                lastVisitedAt: lastVisitedAt.toISOString()
            }
        })

        await this.userProfileClient.updateUserProfile(newProfile.toJSON())

        return
    }

}