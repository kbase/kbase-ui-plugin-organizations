export interface ServiceClientParams {
    url: string
    token?: string
}

export interface JSONPayload {
    version: string,
    method: string,
    id: string,
    params: any
}

export interface JSONResponse {
    id: string
    version: string
    result: any
    error: any
}

export class ServiceClient {
    url: string;
    token: string | null;

    static module: string;

    constructor({ url, token }: ServiceClientParams) {
        this.url = url
        this.token = token || null
    }

    makePayload(method: string, param: any): JSONPayload {
        return {
            version: '1.1',
            method: (<typeof ServiceClient>this.constructor).module + '.' + method,
            id: String(Math.random()).slice(2),
            params: [param]
        }
    }

    makeEmptyPayload(method: string): JSONPayload {
        return {
            version: '1.1',
            method: (<typeof ServiceClient>this.constructor).module + '.' + method,
            id: String(Math.random()).slice(2),
            params: []
        }
    }


}

export class AuthorizedServiceClient extends ServiceClient {
    token: string;

    constructor(params: ServiceClientParams) {
        super(params)
        if (!params.token) {
            throw new Error('Authorized client requires token')
        }
        this.token = params.token
    }

    callFunc(func: string, param: any): Promise<JSONResponse> {
        return fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                Authorization: this.token!,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(this.makePayload(func, param))
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Request error: ' + response.status + ', ' + response.statusText)
                }
                return <unknown>response.json() as JSONResponse
            })
    }
}

