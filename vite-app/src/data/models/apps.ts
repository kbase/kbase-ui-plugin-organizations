import * as narrativeMethodStoreAPI from '../apis/narrativeMethodStore'
import * as userModel from './user'

export type AppID = string

export type KBaseDataType = string // for now!

export interface AppBriefInfo {
    id: string
    moduleName: string
    gitCommitHash: string
    name: string
    version: string
    subtitle: string
    tooltip: string
    iconURL: string | null
    categories: Array<string>
    loadingError: string
    authors: Array<userModel.Username>
    inputTypes: Array<KBaseDataType>
    outputTypes: Array<KBaseDataType>
    appType: AppType
}

export enum AppType {
    APP = 'app',
    VIEWER = 'viewer',
    EDITOR = 'editor',
    ADVANCED_VIEWER = 'advanced_viewer'
}

export type EMail = string

export interface Suggestions {
    relatedMethods: Array<AppID>
    nextMethods: Array<AppID>
    relatedApps: Array<AppID>
    nextApps: Array<AppID>
}

export type Url = string

export interface Icon {
    url: Url | null
}

export interface ScreenShot {
    url: Url | null
}

export interface Publication {
    pubMedID: string
    displayText: string
    link: Url
}

export interface AppFullInfo {
    id: string
    moduleName: string
    gitCommitHash: string
    name: string
    version: string
    authors: Array<userModel.Username>
    kbaseContributors: Array<userModel.Username>
    contact: EMail

    subtitle: string
    tooltip: string
    description: string
    technicalDescription: string

    appType: AppType

    suggestions: Suggestions
    icon: Icon

    categories: Array<string>
    screenshots: Array<ScreenShot>
    publications: Array<Publication>

}

export enum SortBy {
    NAME = 'name',
    MODULE = 'module'
}

const convertIcon = (icon: narrativeMethodStoreAPI.Icon): Icon => {
    if (!icon) {
        return {
            url: null
        }
    }
    return icon
}

const convertAppType = (app_type: string): AppType => {
    switch (app_type) {
        case 'app':
            return AppType.APP
        case 'editor':
            return AppType.EDITOR
        case 'viewer':
            return AppType.VIEWER
        case 'advanced_viewer':
            return AppType.ADVANCED_VIEWER
        default:
            throw new Error('Invalid app type: ' + app_type)
    }
}

const convertSuggestions = (suggestions: narrativeMethodStoreAPI.Suggestions): Suggestions => {
    return {
        relatedMethods: suggestions.related_methods,
        nextMethods: suggestions.next_methods,
        relatedApps: suggestions.related_apps,
        nextApps: suggestions.next_apps
    }
}

const convertPublications = (publications: Array<narrativeMethodStoreAPI.Publication>): Array<Publication> => {
    return publications.map((publication) => {
        return {
            pubMedID: publication.pmid,
            displayText: publication.display_text,
            link: publication.link
        }
    })
}

export function methodFullInfoToApp(from: narrativeMethodStoreAPI.MethodFullInfo): AppFullInfo {

    const {
        id, module_name, git_commit_hash, name, ver,
        authors, kb_contributors, contact,
        subtitle, tooltip, description, technical_description, app_type,
        suggestions, icon, categories, screenshots, publications
    } = from




    return {
        id, moduleName: module_name, gitCommitHash: git_commit_hash, name, version: ver,
        authors, kbaseContributors: kb_contributors, contact,
        subtitle, tooltip, description, technicalDescription: technical_description,
        appType: convertAppType(app_type),
        suggestions: convertSuggestions(suggestions), icon: convertIcon(icon),
        categories, screenshots, publications: convertPublications(publications)
    }
}

export function methodBriefInfoToAppBriefInfo(from: narrativeMethodStoreAPI.MethodBriefInfo): AppBriefInfo {
    const {
        id, module_name, git_commit_hash, name, ver, subtitle, tooltip,
        icon, categories, loading_error, authors, input_types, output_types, app_type
    } = from

    let iconURL
    if (!icon) {
        iconURL = null
    } else {
        iconURL = icon.url
    }

    return {
        id, moduleName: module_name, gitCommitHash: git_commit_hash, name, version: ver, subtitle,
        tooltip, iconURL, categories, loadingError: loading_error,
        authors, inputTypes: input_types, outputTypes: output_types, appType: convertAppType(app_type)
    }
}

export interface AppClientParams {
    token: string,
    narrativeMethodStoreURL: string
}

export class AppClient {
    token: string
    narrativeMethodStoreURL: string
    constructor(params: AppClientParams) {
        this.token = params.token
        this.narrativeMethodStoreURL = params.narrativeMethodStoreURL
    }

    async getApp(appId: AppID): Promise<AppFullInfo> {
        const client = new narrativeMethodStoreAPI.NarrativeMethodStoreClient({
            url: this.narrativeMethodStoreURL,
            token: this.token
        })

        const [methodInfo] = await client.get_method_full_info({
            ids: [appId],
            tag: 'release'
        })

        return methodFullInfoToApp(methodInfo)
    }


}