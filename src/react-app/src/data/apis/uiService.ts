import { DynamicServiceClient, DynamicServiceClientParams } from './dynamicServiceClient'

export interface UIServiceClientParams extends DynamicServiceClientParams {

}

export interface CheckImageURLParam {
    url: string,
    timeout: number
}

export interface CheckImageURLResult {
    is_valid: boolean
    error: {
        code: string
        info: any
    }
}

export class UIServiceClient extends DynamicServiceClient {

    static module: string = 'UIService'

    constructor(params: UIServiceClientParams) {
        super(params)
    }

    async checkImageURL({ url, timeout }: CheckImageURLParam): Promise<CheckImageURLResult> {
        const [[result, err], serverError] = await this.callFunc('check_image_url', [
            { url, timeout }
        ])

        if (serverError) {
            throw new Error(serverError.message)
        }

        if (err) {
            throw new Error(err['message'])
        }

        return result as CheckImageURLResult
    }

    async checkHTMLURL({ url, timeout }: CheckImageURLParam): Promise<CheckImageURLResult> {
        const [[result, err], serverError] = await this.callFunc('check_html_url', [
            { url, timeout }
        ])

        if (serverError) {
            throw new Error(serverError.message)
        }

        if (err) {
            throw new Error(err['message'])
        }

        return result as CheckImageURLResult
    }

}