
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

export interface Notification {
    id: string
    actor: string
    verb: string
    object: string
    target: Array<string>
    source: string
    level: string
    seen: boolean
    created: number
    expires: number
    external_key?: string
    context?: {}
}

export interface GetNotificationsResult {
    group: Array<Notification>
    user: Array<Notification>
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

    async get(path: Array<string>): Promise<APIResponse> {
        const url = [this.params.url, 'api', 'V1'].concat(path).join('/')
        const response = await fetch(url, {
            headers: {
                Authorization: this.params.token,
                Accept: 'application/json'
            },
            mode: 'cors'
        })

        if (response.headers.get('Content-Type') === 'application/json') {
            if (response.status === 200) {
                const result = await response.json()
                return result
            }
            throw new Error('Non-success response: ' + response.status + ': ' + response.statusText)
        } else {
            const textResult = await response.text()
            throw new Error('Non-JSON response' + textResult)
        }
    }

    async getNotifications(): Promise<GetNotificationsResult> {
        const notifications = await this.get(['notifications'])
        return notifications as GetNotificationsResult
    }
}

export default FeedsClient