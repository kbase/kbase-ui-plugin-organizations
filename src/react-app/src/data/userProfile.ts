export interface User {
    username: string,
    realname: string,
    thumbnail: string
}

export interface UserProfile {
    user: User,
    profile: {
        synced: {
            gravatarHash: string
        },
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
    }
}

export interface JSONPayload {
    version: string,
    method: string,
    id: string,
    params: any
}

export class UserProfileClient {
    url: string;
    token: string

    constructor({ url, token }: { url: string, token: string }) {
        this.url = url
        this.token = token
    }

    makePayload(method: string, param: any): JSONPayload {
        return {
            version: '1.1',
            method: 'UserProfile.' + method,
            id: String(Math.random()).slice(2),
            params: [param]
        }
    }

    makeEmptyPayload(method: string): JSONPayload {
        return {
            version: '1.1',
            method: 'UserProfile.' + method,
            id: String(Math.random()).slice(2),
            params: []
        }
    }

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

    getUserProfile(username: string): Promise<UserProfile> {
        return fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                Authorization: this.token,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(this.makePayload('get_user_profile', [username]))
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('User profile request error: ' + response.status + ', ' + response.statusText)
                }
                return response.json()
            })
            .then((result) => {
                return result.result[0][0] as UserProfile
            })
    }

    getUserProfiles(usernames: Array<string>): Promise<Array<UserProfile>> {
        return fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                Authorization: this.token,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(this.makePayload('get_user_profile', usernames))
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('User profile request error: ' + response.status + ', ' + response.statusText)
                }
                return response.json()
            })
            .then((result) => {
                console.log('profiles', result.result[0])
                return result.result[0] as Array<UserProfile>
            })
    }

    getAllUsers(): Promise<Array<User>> {
        return fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                Authorization: this.token,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(this.makePayload('filter_users', { filter: '' }))
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('User profile request error: ' + response.status + ', ' + response.statusText)
                }
                return response.json()
            })
            .then((result) => {
                console.log('profiles', result.result[0])
                return result.result[0] as Array<User>
            })
    }

    searchUsers(query: string): Promise<Array<User>> {
        let start = new Date()
        return fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                Authorization: this.token,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(this.makePayload('filter_users', { filter: query }))
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('User profile request error: ' + response.status + ', ' + response.statusText)
                }
                console.log('user profile 1', new Date().getTime() - start.getTime())
                start = new Date()
                return response.json()
            })
            .then((result) => {
                console.log('user profile 2', new Date().getTime() - start.getTime())
                return result.result[0] as Array<User>
            })
    }
}