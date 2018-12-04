export interface GenericClientParams {
    url: string
    module: string
    token?: string
}

export interface JSONPayload {
    version: string,
    method: string,
    id: string,
    params: any
}

export class GenericClient {
    url: string;
    token: string | null
    module: string

    constructor({ url, token, module }: GenericClientParams) {
        this.url = url
        this.token = token || null
        this.module = module
    }

    makePayload(method: string, param: any): JSONPayload {
        return {
            version: '1.1',
            method: this.module + '.' + method,
            id: String(Math.random()).slice(2),
            params: param
        }
    }

    makeEmptyPayload(method: string): JSONPayload {
        return {
            version: '1.1',
            method: this.module + '.' + method,
            id: String(Math.random()).slice(2),
            params: []
        }
    }
}

export class AuthorizedGenericClient extends GenericClient {
    token: string;

    constructor(params: GenericClientParams) {
        super(params)
        if (!params.token) {
            throw new Error('Authorized client requires token')
        }
        this.token = params.token
    }

    async callFunc(func: string, param: any) {
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
                if (response.status === 200) {
                    return response.json()
                        .then(({ result, error }) => {
                            if (result) {
                                return [result, null]
                            } else {
                                return [null, error]
                            }
                        })
                } else if (response.status === 204) {
                    return [null, null]
                }
                if (response.status === 500) {
                    if (response.headers.get('Content-Type') === 'application/json') {
                        response.json()
                            .then((result) => {
                                if (result.error) {
                                    return [null, result.error]
                                } else {
                                    return [null, result]
                                }
                            })
                    } else {
                        return response.text()
                            .then((text) => {
                                return [null, text]
                            })
                        // return Promise.all([null, response.text()])
                    }
                }
                throw new Error('Unexpected response: ' + response.status + ', ' + response.statusText)
            })
    }
}

