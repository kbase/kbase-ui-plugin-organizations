import { AuthorizedServiceClient, ServiceClientParams } from './serviceClient'

// types from module

export interface Service {
    module_name: string
    version: string | null
}

export interface ServiceStatus {
    module_name: string
    version: string
    git_commit_hash: string
    release_tags: Array<string>
    hash: string
    url: string
    up: number // aka boolean
    status: string
    health: string
}

// impl

export interface ServiceWizardClientParams extends ServiceClientParams {

}

export interface GetServiceStatusParams extends Service { }

export interface GetServiceStatusResult extends ServiceStatus { }

export class ServiceWizardClient extends AuthorizedServiceClient {

    static module: string = 'ServiceWizard'

    constructor(params: ServiceWizardClientParams) {
        super(params)
    }

    async getServiceStatus(params: GetServiceStatusParams): Promise<GetServiceStatusResult> {
        const result = await this.callFunc('get_service_status', params)

        if (result.result &&
            result.result.length > 0) {
            const theResult = result.result[0]
            if (!theResult) {
                throw new Error('Crazy at it seems, no result')
            }
            return theResult as GetServiceStatusResult
        } else {
            throw new Error('Crazy at it seems, no result')
        }
    }

}