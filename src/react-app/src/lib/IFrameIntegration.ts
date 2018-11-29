export interface IFrameParams {
    channelId: string
    frameId: string
    params: {
        groupsServiceURL: string
        userProfileServiceURL: string
        workspaceServiceURL: string
        serviceWizardURL: string
    },
    parentHost: string
}

export class IFrameIntegration {
    getParamsFromIFrame() {
        if (!window.frameElement) {
            return null
        }
        if (!window.frameElement.hasAttribute('data-params')) {
            // throw new Error('No params found in window!!');
            return null
        }
        const params = window.frameElement.getAttribute('data-params');
        if (params === null) {
            // throw new Error('No params found in window!')
            return null
        }
        return JSON.parse(decodeURIComponent(params)) as IFrameParams
    }
}