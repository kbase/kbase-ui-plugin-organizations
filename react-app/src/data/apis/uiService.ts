import { DynamicServiceClient, DynamicServiceClientParams } from './dynamicServiceClient';

export interface UIServiceClientParams extends DynamicServiceClientParams { }

export interface CheckImageURLParam {
    url: string;
    timeout: number;
}

export interface CheckImageURLResult {
    is_valid: boolean;
    error: {
        message: string;
        code: string;
        info: any;
    };
}

export interface MethodException {
    message: string;
    type: string;
    code: string;
    info: any;
}

// export interface MethodError {
//     message: string;
//     code: string;
//     info: any;
// }

// type MethodResponse = [CheckImageURLResult, MethodException];

export interface CheckHTMLURLParam {
    url: string;
    timeout: number;
}

export interface CheckHTMLURLResult {
    is_valid: boolean;
    error: {
        code: string;
        info: any;
    };
}

export class UIServiceClient extends DynamicServiceClient {
    static module: string = 'UIService';

    async checkImageURL({ url, timeout }: CheckImageURLParam): Promise<CheckImageURLResult> {
        const [result, err] = await this.callFunc<[CheckImageURLResult, MethodException]>('check_image_url', [
            { url, timeout }
        ]);

        if (err) {
            throw new Error(err.message);
        }

        return result;
    }

    async checkHTMLURL({ url, timeout }: CheckImageURLParam): Promise<CheckHTMLURLResult> {
        const [result, err] = await this.callFunc<[CheckHTMLURLResult, MethodException]>('check_html_url', [
            { url, timeout }
        ]);

        if (err) {
            throw new Error(err.message);
        }

        return result;
    }
}
