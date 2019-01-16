import { string } from "prop-types";
import { AppException } from "../../types";

/*
{
    "id": string - a unique id for the notification,
    "actor": string - the actor who triggered the notification,
    "verb": string - the action represented by this notification (see list of verbs below),
    "object": string - the object of the notification,
    "target": list - the target(s) of the notification,
    "source": string - the source service that created the notification,
    "level": string, one of alert, error, warning, request,
    "seen": boolean, if true, then this has been seen before,
    "created": int - number of milliseconds since the epoch, when the notification was created,
    "expires": int - number of milliseconds since the epoch, when the notification will expire, and will no longer be seen.
    "external_key": string - (optional) a external key that has meaning for the service that created the notification. Meant for use by other services.
    "context": structure - (optional) a (mostly) freely open structure with meaning for the service that created it. The special keys `text` and `link` are intended to be used by the front end viewers. A `link` becomes a hyperlink that would link to some relevant place. `text` gets interpreted as the intended text of the notification, instead of automatically generating it.
}
*/

export interface Resource {
    id: string
    name: string
    type: string
}
export interface Notification {
    id: string
    actor: Resource
    verb: string
    object: Resource
    target: Array<Resource>
    source: string
    level: string
    seen: boolean
    created: number
    expires: number
    external_key?: string
    context?: {
        resourcetype?: string
        groupid?: string
        requestid?: string
    }
}

export interface GetNotificationsResult {
    group: {
        feed: Array<Notification>
        unseen: number
    }
    user: {
        feed: Array<Notification>
        unseen: number
    }
}


export interface FeedsError {
    message: string
}


export class FeedsException extends AppException {
    originalError: FeedsError
    constructor(error: FeedsError) {
        super({
            code: 'feeds-exception',
            message: error.message,
            detail: error.message,
            info: new Map<string, any>()
        })
        this.name = 'FeedsException'
        this.originalError = error
    }
}

export class ServerException extends AppException {
    constructor(detail: string) {
        super({ code: 'server-exception', message: 'Server Exception', detail: detail })
        this.name = 'ServerException'
    }
}

export interface FeedsClientParams {
    token: string
    url: string
}

interface APIResponse { }

export class FeedsClient {
    params: FeedsClientParams


    constructor(params: FeedsClientParams) {
        this.params = params
    }

    async put<T>(path: Array<string>, body: any): Promise<T> {
        const url = (this.baseURLPath().concat(path)).join('/')
        return fetch(url, {
            headers: {
                Authorization: this.params.token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'PUT',
            body: JSON.stringify(body)
        })
            .then((response) => {
                if (response.status === 500) {
                    switch (response.headers.get('Content-Type')) {
                        case 'application/json':
                            return response.json()
                                .then((result) => {
                                    throw new FeedsException(result)
                                })
                        case 'text/plain':
                            return response.text()
                                .then((result) => {
                                    throw new ServerException(result)
                                })
                        default:
                            throw new Error('Unexpected content type: ' + response.headers.get('Content-Type'))
                    }
                } else if (response.status !== 200) {
                    throw new Error('Unexpected response: ' + response.status + ' : ' + response.statusText)
                } else {
                    return response.json()
                        .then((result) => {
                            return result as T
                        })
                }
            })
    }

    async post<T>(path: Array<string>, body: any): Promise<T | null> {
        const url = (this.baseURLPath().concat(path)).join('/')
        const response = await fetch(url, {
            headers: {
                Authorization: this.params.token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'POST',
            body: body ? JSON.stringify(body) : ''
        })

        if (response.status === 500) {
            switch (response.headers.get('Content-Type')) {
                case 'application/json':
                    const result = await response.json()
                    throw new FeedsException(result)
                case 'text/plain':
                    const errorText = await response.text()
                    throw new ServerException(errorText)
                default:
                    throw new Error('Unexpected content type: ' + response.headers.get('Content-Type'))
            }
        } else if (response.status === 200) {
            return await response.json() as T
        } else if (response.status === 204) {
            return null
        } else {
            throw new Error('Unexpected response: ' + response.status + ' : ' + response.statusText)
        }
    }

    async postWithResult<T>(path: Array<string>, body: any): Promise<T> {
        const url = (this.baseURLPath().concat(path)).join('/')
        const response = await fetch(url, {
            headers: {
                Authorization: this.params.token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'POST',
            body: body ? JSON.stringify(body) : ''
        })

        if (response.status === 500) {
            switch (response.headers.get('Content-Type')) {
                case 'application/json':
                    const result = await response.json()
                    throw new FeedsException(result)
                case 'text/plain':
                    const errorText = await response.text()
                    throw new ServerException(errorText)
                default:
                    throw new Error('Unexpected content type: ' + response.headers.get('Content-Type'))
            }
        } else if (response.status === 200) {
            return await response.json() as T
        } else {
            throw new Error('Unexpected response: ' + response.status + ' : ' + response.statusText)
        }
    }

    async get<T>(path: Array<string>, query: Map<string, string>): Promise<T> {
        const queryString = Array.from(query.entries()).map(([k, v]) => {
            return [
                k, encodeURIComponent(v)
            ].join('=')
        }).join('&')
        const url = (this.baseURLPath().concat(path)).join('/') + '?' + queryString
        // const url = ([this.url].concat(path)).join('/')
        const response = await fetch(url, {
            headers: {
                Authorization: this.params.token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'GET'
        })

        if (response.status === 500) {
            switch (response.headers.get('Content-Type')) {
                case 'application/json':
                    const result = await response.json()
                    throw new FeedsException(result)
                case 'text/plain':
                    const errorText = await response.text()
                    throw new ServerException(errorText)
                default:
                    throw new Error('Unexpected content type: ' + response.headers.get('Content-Type'))
            }
        } else if (response.status === 200) {
            return await response.json() as T
        } else {
            throw new Error('Unexpected response: ' + response.status + ' : ' + response.statusText)
        }
    }

    // async get(path: Array<string>, query: Map<string, string>): Promise<APIResponse> {
    //     const queryString = Array.from(query.entries()).map(([k, v]) => {
    //         return [
    //             k, encodeURIComponent(v)
    //         ].join('=')
    //     }).join('&')
    //     const url = [this.params.url, 'api', 'V1'].concat(path).join('/') + '?' + queryString
    //     const response = await fetch(url, {
    //         headers: {
    //             Authorization: this.params.token,
    //             Accept: 'application/json'
    //         },
    //         mode: 'cors'
    //     })

    //     if (response.headers.get('Content-Type') === 'application/json') {
    //         if (response.status === 200) {
    //             const result = await response.json()
    //             return result
    //         }
    //         throw new Error('Non-success response: ' + response.status + ': ' + response.statusText)
    //     } else {
    //         const textResult = await response.text()
    //         throw new Error('Non-JSON response' + textResult)
    //     }
    // }

    baseURLPath() {
        return [this.params.url, 'api', 'V1']
    }

    // async post(path: Array<string>, body: Map<string, string>): Promise<APIResponse> {
    //     // const queryString = Array.from(query.entries()).map(([k, v]) => {
    //     //     return [
    //     //         k, encodeURIComponent(v)
    //     //     ].join('=')
    //     // }).join('&')
    //     const url = this.baseURLPath().concat(path).join('/') //  + '?' + queryString
    //     const response = await fetch(url, {
    //         headers: {
    //             Authorization: this.params.token,
    //             Accept: 'application/json'
    //         },
    //         mode: 'cors'
    //     })

    //     if (response.headers.get('Content-Type') === 'application/json') {
    //         if (response.status === 200) {
    //             const result = await response.json()
    //             return result
    //         }
    //         throw new Error('Non-success response: ' + response.status + ': ' + response.statusText)
    //     } else {
    //         const textResult = await response.text()
    //         throw new Error('Non-JSON response' + textResult)
    //     }
    // }

    async getNotifications({ count }: { count: number }): Promise<GetNotificationsResult> {
        const options = new Map<string, string>()
        options.set('n', String(count))
        return await this.get<GetNotificationsResult>(['notifications'], options)
        // return notifications as GetNotificationsResult
    }

    async seeNotifications(param: SeeNotificationsParam): Promise<SeeNotificationsResult> {
        return this.postWithResult<SeeNotificationsResult>(['notifications', 'see'], param)
    }
}

export interface SeeNotificationsParam {
    note_ids: Array<string>
}

export interface SeeNotificationsResult {
    seen_notes: Array<string>,
    unauthorized_notes: Array<string>
}

export default FeedsClient