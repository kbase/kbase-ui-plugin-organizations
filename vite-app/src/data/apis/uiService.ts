import { DynamicServiceClient, DynamicServiceClientParams } from '@kbase/ui-lib/lib/comm/JSONRPC11/DynamicServiceClient';
import { JSONObject, JSONValue } from '@kbase/ui-lib/lib/json';

export interface UIServiceClientParams extends DynamicServiceClientParams { }

export interface CheckImageURLParam extends JSONObject {
    url: string;
    timeout: number;
}

export interface CheckImageURLResultBase extends JSONObject {
    is_valid: boolean;
}

export interface CheckImageURLResultValid extends CheckImageURLResultBase {
    is_valid: true;
}

export interface CheckImageURLResultInvalid extends CheckImageURLResultBase {
    is_valid: false, 
    error: {
        message: string;
        code: string;
        info: JSONObject;
    };
}

export type CheckImageURLResult = CheckImageURLResultValid | CheckImageURLResultInvalid;


export interface MethodError extends JSONObject {
    message: string;
    type: string;
    code: string;
    info: JSONValue;
}

// export interface MethodError {
//     message: string;
//     code: string;
//     info: any;
// }

// type MethodResponse = [CheckImageURLResult, MethodException];

export interface CheckHTMLURLParam extends JSONObject {
    url: string;
    timeout: number;
}

export interface CheckHTMLURLResultBase extends JSONObject {
    is_valid: boolean;
}

export interface CheckHTMLURLResultValid extends CheckHTMLURLResultBase {
    is_valid: true;
}

export interface CheckHTMLURLResultInvalid extends CheckHTMLURLResultBase {
    is_valid: false, 
    error: {
        code: string;
        info: JSONObject;
    };
}

export type CheckHTMLURLResult = CheckHTMLURLResultValid | CheckHTMLURLResultInvalid;



export class UIServiceClient extends DynamicServiceClient {
    module: string = 'UIService';

    async checkImageURL({ url, timeout }: CheckImageURLParam): Promise<CheckImageURLResult> {
        const [result] = await this.callFunc<[CheckImageURLParam], [CheckImageURLResult]>('check_image_url', [
            { url, timeout }
        ]);

        // if (err) {
        //     throw new Error(err.message);
        // }

        return result as unknown as CheckImageURLResult;
    }

    async checkHTMLURL({ url, timeout }: CheckImageURLParam): Promise<CheckHTMLURLResult> {
        const [result] = await this.callFunc<[CheckHTMLURLParam], [CheckHTMLURLResult]>('check_html_url', [
            { url, timeout }
        ]);

        // if (err) {
        //     throw new Error(err.message);
        // }

        return result as unknown as CheckHTMLURLResult;
    }
}
