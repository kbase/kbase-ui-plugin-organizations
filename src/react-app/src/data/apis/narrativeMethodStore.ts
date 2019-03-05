import {
    AuthorizedServiceClientParams,
    AuthorizedServiceClient
} from './serviceClientBase'

export interface Icon {
    url: string
}

export type Username = string

export type EMail = string

export interface Suggestions {
    related_methods: Array<string>
    next_methods: Array<string>
    related_apps: Array<string>
    next_apps: Array<string>
}

export type Url = string

export interface ScreenShot {
    url: Url
}

export interface Publication {
    pmid: string
    display_text: string
    link: Url
}

export interface MethodBriefInfo {
    id: string
    module_name: string
    git_commit_hash: string
    name: string
    ver: string
    subtitle: string
    tooltip: string
    icon: Icon
    categories: Array<string>
    loading_error: string
    authors: Array<Username>
    input_types: Array<string>
    output_types: Array<string>
    app_type: string
}

export interface MethodFullInfo {
    id: string
    module_name: string
    git_commit_hash: string
    name: string
    ver: string
    authors: Array<Username>
    kb_contributors: Array<Username>
    contact: EMail

    subtitle: string
    tooltip: string
    description: string
    technical_description: string
    app_type: string

    suggestions: Suggestions

    icon: Icon
    categories: Array<string>
    screenshots: Array<ScreenShot>
    publications: Array<Publication>
}

// Method Params

export interface ListMethodsParams {
    limit?: number
    offset?: number
    tag?: string
}

export type ListMethodResult = Array<MethodBriefInfo>

export interface GetMethodFullInfoParams {
    ids: Array<string>
    tag?: string
}

export type GetMethodFullInfoResult = Array<MethodFullInfo>

// Client

export interface NarrativeMethodStoreClientParams extends AuthorizedServiceClientParams {
}


export class NarrativeMethodStoreClient extends AuthorizedServiceClient {
    static module: string = 'NarrativeMethodStore'

    constructor(params: NarrativeMethodStoreClientParams) {
        super(params)
    }

    async version(): Promise<string> {
        return await this.callFunc<undefined, string>('version', undefined)
    }

    async list_methods(params: ListMethodsParams): Promise<ListMethodResult> {
        return await this.callFunc<ListMethodsParams, ListMethodResult>('list_methods', params)
    }

    async get_method_full_info(params: GetMethodFullInfoParams): Promise<GetMethodFullInfoResult> {
        return await this.callFunc<GetMethodFullInfoParams, GetMethodFullInfoResult>('get_method_full_info', params)
    }
}