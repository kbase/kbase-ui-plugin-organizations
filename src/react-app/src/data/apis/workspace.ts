
// export interface User {
//     username: string,
//     realname: string,
//     thumbnail: string
// }

// export interface UserProfile {
//     user: User,
//     profile: any
// }



export interface JSONPayload {
    version: string,
    method: string,
    id: string,
    params: any
}

export class WorkspaceClient {
    url: string;
    token: string

    constructor({ url, token }: { url: string, token: string }) {
        this.url = url
        this.token = token
    }

    makePayload(method: string, param: any): JSONPayload {
        return {
            version: '1.1',
            method: 'Workspace.' + method,
            id: String(Math.random()).slice(2),
            params: [param]
        }
    }

    makeEmptyPayload(method: string): JSONPayload {
        return {
            version: '1.1',
            method: 'Workspace.' + method,
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
            body: JSON.stringify(this.makeEmptyPayload('ver'))
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('User profile request error: ' + response.status + ', ' + response.statusText)
                }
                return response.json()
            })
    }

}