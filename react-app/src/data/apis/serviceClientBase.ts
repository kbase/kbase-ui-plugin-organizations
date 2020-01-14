export interface ServiceClientParams {
    url: string;
    token?: string;
}

export interface JSONPayload {
    version: string,
    method: string,
    id: string,
    params: any;
}

export interface JSONRPCError {
    name: string;
    code: number;
    message: string;
    error: string;
}

export interface MethodSuccessResult<T> {
    result: T;
    error: null;
}

export interface MethodErrorResult {
    result: null;
    error: JSONRPCError;
}

export type MethodResponse<T> = MethodSuccessResult<T> | MethodErrorResult;

export interface JSONRPCResponse<T> {
    version: string;
    id: string;
    result: [T, ...any[]];
    error: JSONRPCError | null;
}


export class JSONRPCException extends Error {
    name: string;
    code: number;
    // message: string
    error: string;
    constructor({ name, code, message, error }: JSONRPCError) {
        super(message);
        this.name = name;
        this.code = code;
        this.error = error;
    }
}

export class classJSONRPCServerException extends Error {
}

export class ServiceClient {
    url: string;
    token: string | null;

    static module: string;

    constructor({ url, token }: ServiceClientParams) {
        this.url = url;
        this.token = token || null;
    }

    makePayload<T>(method: string, param: T): JSONPayload {
        return {
            version: '1.1',
            method: (this.constructor as typeof ServiceClient).module + '.' + method,
            id: String(Math.random()).slice(2),
            params: [param]
        };
    }

    makeEmptyPayload(method: string): JSONPayload {
        return {
            version: '1.1',
            method: (this.constructor as typeof ServiceClient).module + '.' + method,
            id: String(Math.random()).slice(2),
            params: []
        };
    }

    async processResponse<T>(response: Response): Promise<T> {
        if (response.status === 200) {
            const { result: [methodResult] } = await response.json() as JSONRPCResponse<T>;
            return methodResult as T;
        } else if (response.status === 204) {
            // The SDK has a weird edge case in which a method can specify no
            // result, which is translated to a 204 response and no content.
            // IMO it should return a valid json value, like null so we don't
            // have to work around it.
            // const result = null
            // result as unknown as T
            const result: unknown = undefined;
            return result as T;
        }
        if (response.status === 500) {
            if (response.headers.get('Content-Type') === 'application/json') {
                const { error } = await response.json();
                throw new JSONRPCException(error);
            } else {
                const text = await response.text();
                throw new classJSONRPCServerException(text);
            }
        }
        throw new Error('Unexpected response: ' + response.status + ', ' + response.statusText);
    }

    async callFunc<Tinput, Toutput>(func: string, param: Tinput): Promise<Toutput> {
        const headers: Headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        if (this.token) {
            headers.set('Authorization', this.token);
        }
        const response = await fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers,
            body: JSON.stringify(this.makePayload<Tinput>(func, param))
        });
        // The response may be a 200 success, a 200 with method error,
        // an sdk 500 error, an internal 500 server error, 
        // or any other http error code.
        return this.processResponse<Toutput>(response);
    }
}

export interface AuthorizedServiceClientParams {
    url: string;
    token: string;
}

export class AuthorizedServiceClient extends ServiceClient {
    token: string;

    constructor(params: AuthorizedServiceClientParams) {
        super(params);
        if (!params.token) {
            throw new Error('Authorized client requires token');
        }
        this.token = params.token;
    }

    async callFunc<Tinput, Toutput>(func: string, param: Tinput): Promise<Toutput> {
        const response = await fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                Authorization: this.token,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(this.makePayload<Tinput>(func, param))
        });
        return this.processResponse<Toutput>(response);
    }
}

