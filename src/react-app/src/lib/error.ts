import uuid from 'uuid/v4'

export interface AnError {
    code: string
    message: string
    id: string
    at: Date


    detail?: string
    history?: Array<AnError>
    trace?: Array<string>
    info?: any
}

export function makeError(
    { code, message, detail, history, trace, info }:
        {
            code: string, message: string,
            detail?: string,
            history?: Array<AnError>, trace?: Array<string>, info?: any
        }
) {
    return {
        code, message, detail,
        id: uuid(),
        at: new Date(),
        history, trace, info
    }
}