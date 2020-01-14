
import * as orgModel from './organization/model';
import * as requestModel from './requests';
import * as workspaceApi from '../apis/workspaceUtils';
import * as userModel from './user';
import { WorkspaceClient } from '../apis/workspace';
import { NarrativeServiceClient } from '../apis/narrativeService';

export enum NarrativeState {
    NONE = 0,
    ASSOCIATED,
    REQUESTED
}

export type NarrativeID = number;

export type WorkspaceID = number;
export type ObjectID = number;

export enum NarrativeAccess {
    NONE = 0,
    VIEW,
    EDIT,
    ADMIN,
    OWNER
}

export interface NarrativeBase {
    workspaceId: WorkspaceID,
    access: NarrativeAccess;
}

export interface InaccessibleNarrative extends NarrativeBase {
    access: NarrativeAccess.NONE;
}

export interface AccessibleNarrative extends NarrativeBase {
    access: NarrativeAccess.VIEW | NarrativeAccess.EDIT | NarrativeAccess.ADMIN | NarrativeAccess.OWNER;
    isPublic: boolean;
    objectId: ObjectID;
    title: string;
    // description?: string
    owner: userModel.Username;
    // creator: userModel.Username
    // createdAt: Date
    lastSavedAt: Date;
    lastSavedBy: userModel.Username;
}

export type Narrative = AccessibleNarrative | InaccessibleNarrative;

// export interface OrganizationNarrativex {
//     workspaceId: WorkspaceID
//     objectId: ObjectID
//     title: string
//     status: NarrativeState
//     // inOrganization: boolean
//     // createdAt: Date
//     owner: userModel.Username
//     modifiedAt: Date
// }

export interface OrganizationNarrative {
    status: NarrativeState;
    narrative: AccessibleNarrative;
}

export interface NarrativeWorkspaceInfo extends workspaceApi.WorkspaceInfo {
    metadata: {
        narrative_nice_name: string;
        narrative: string;
        is_temporary: string;
    };
}
// export interface GetOwnNarrativesResult {
//     workspaceInfo: WorkspaceInfo
//     objectInfo: ObjectInfo
// }

export enum Sort {
    TITLE = 'TITLE',
    LAST_SAVED = 'LAST_SAVED'
}

interface NarrativeModelParams {
    workspaceServiceURL: string;
    serviceWizardURL: string;
    groupsServiceURL: string;
    userProfileServiceURL: string;
    username: string;
    token: string;
}

export class NarrativeModel {

    params: NarrativeModelParams;

    constructor(params: NarrativeModelParams) {
        this.params = params;
    }

    // Narratives

    async getOwnNarratives(organizationId: string): Promise<Array<OrganizationNarrative>> {
        const narrativeServiceClient = new NarrativeServiceClient({
            url: this.params.serviceWizardURL,
            token: this.params.token,
            timeout: 10000,
        });

        const groupsClient = new orgModel.OrganizationModel({
            token: this.params.token,
            username: this.params.username,
            groupsServiceURL: this.params.groupsServiceURL,
            userProfileServiceURL: this.params.userProfileServiceURL
        });


        const requestClient = new requestModel.RequestsModel({
            token: this.params.token,
            username: this.params.username,
            groupsServiceURL: this.params.groupsServiceURL
        });

        const [narrativesResult, organization, pendingRequests] = await Promise.all([
            narrativeServiceClient.listNarratives('mine'),
            groupsClient.getOrg(organizationId),
            requestClient.getPendingRequestsForOrg(organizationId)
        ]);

        if (organization.kind === orgModel.OrganizationKind.INACCESSIBLE_PRIVATE) {
            throw new Error('Cannot get own narratives for private inaccessible organization');
        }

        const workspacesInOrg = organization.narratives.map((narrative) => {
            return narrative.workspaceId;
        });

        return narrativesResult.narratives
            .map((nar) => {
                return {
                    workspaceInfo: (workspaceApi.workspaceInfoToObject(nar.ws) as unknown) as NarrativeWorkspaceInfo,
                    objectInfo: workspaceApi.objectInfoToObject(nar.nar)
                };
            })
            .filter((nar) => {
                return (nar.workspaceInfo.metadata.is_temporary === 'false');
            })
            .map((narrative) => {
                let status: NarrativeState;

                if (workspacesInOrg.indexOf(narrative.workspaceInfo.id) !== -1) {
                    status = NarrativeState.ASSOCIATED;
                } else if (pendingRequests.find((request) => {
                    // TODO: these requests should have already been converted to 
                    // model-friendly requests (typed!)
                    return (request.resourceType === requestModel.RequestResourceType.WORKSPACE &&
                        request.narrativeId === String(narrative.workspaceInfo.id));
                })) {
                    status = NarrativeState.REQUESTED;
                } else {
                    status = NarrativeState.NONE;
                }
                return {
                    status: status,
                    narrative: {
                        access: NarrativeAccess.OWNER,
                        isPublic: narrative.workspaceInfo.globalReadPermission,
                        workspaceId: narrative.workspaceInfo.id,
                        objectId: narrative.objectInfo.id,
                        title: narrative.workspaceInfo.metadata.narrative_nice_name,
                        owner: narrative.workspaceInfo.owner,
                        lastSavedAt: narrative.objectInfo.savedAt,
                        lastSavedBy: narrative.objectInfo.savedBy
                    } as AccessibleNarrative

                };
            })
            .sort((a, b) => {
                return (a.narrative.title.localeCompare(b.narrative.title));
            });
    }

    // async workspaceToNarrative(workspaceId: WorkspaceID): Promise<orgModel.NarrativeResource | null> {
    //     const workspaceClient = new AuthorizedGenericClient({
    //         module: 'Workspace',
    //         url: this.params.workspaceServiceURL,
    //         token: this.params.token
    //     })
    //     try {
    //         const [[[rawObjectInfo], rawObjectInfoError], [[rawWorkspaceInfo], rawWorkspaceInfoError]] = await Promise.all([
    //             workspaceClient.callFunc('get_object_info3', [{
    //                 objects: [{
    //                     wsid: workspaceId,
    //                     // TODO: fix this!!
    //                     objid: 1
    //                 }],
    //                 includeMetadata: 1,
    //                 ignoreErrors: 0
    //             }]),
    //             workspaceClient.callFunc('get_workspace_info', [{
    //                 id: workspaceId
    //             }])
    //         ])

    //         if (rawObjectInfoError || rawWorkspaceInfoError) {
    //             // console.warn('narrative not accessible', rawObjectInfoError, rawWorkspaceInfoError)
    //             return null
    //         }

    //         const workspaceInfo: NarrativeWorkspaceInfo = workspaceApi.workspaceInfoToObject(rawWorkspaceInfo) as NarrativeWorkspaceInfo

    //         return {
    //             workspaceId: workspaceInfo.id,
    //             title: workspaceInfo.metadata.narrative_nice_name || 'Unknown',
    //             permission: orgModel.userPermissionToWorkspacePermission(workspaceInfo.userPermission, workspaceInfo.owner === this.params.username),
    //             isPublic: workspaceInfo.globalReadPermission
    //         }

    //     } catch (ex) {
    //         // assume it is an inaccessible workspace
    //         // console.warn('narrative not accessible', ex)
    //         return null
    //     }
    // }

    getSorter(sort: Sort) {
        switch (sort) {
            case Sort.TITLE:
                return (a: OrganizationNarrative, b: OrganizationNarrative) => {
                    return a.narrative.title.localeCompare(b.narrative.title);
                };
            case Sort.LAST_SAVED:
                return (a: OrganizationNarrative, b: OrganizationNarrative) => {
                    return b.narrative.lastSavedAt.getTime() - a.narrative.lastSavedAt.getTime();
                };
            default:
                throw new Error('invalid sort spec');
        }
    }

    // sortNarratives(narratives: Array<AccessibleNarrative>, sort: Sort): Array<AccessibleNarrative> {
    //     let sorter = this.getSorter(sort)

    //     return narratives.sort(sorter)
    // }

    sortOrganizationNarratives(narratives: Array<OrganizationNarrative>, sort: Sort): Array<OrganizationNarrative> {
        let sorter = this.getSorter(sort);

        return narratives.sort(sorter).slice(0);
    }

    /*
    getNarrative fetches the requested narrative and returns a Narrative object if found 
    and null otherwise. Note that this ignores the narrative state vis-a-vis any organization.
    It also caches narratives.
    */
    async getNarrative(workspaceId: WorkspaceID): Promise<Narrative> {
        const wsClient = new WorkspaceClient({
            url: this.params.workspaceServiceURL,
            token: this.params.token
        });

        try {
            const rawWorkspaceInfo = await wsClient.getWorkspaceInfo({
                id: workspaceId
            });

            // if (rawWorkspaceInfoError) {
            //     return {
            //         workspaceId: workspaceId,
            //         access: NarrativeAccess.NONE
            //     }
            // }

            const workspaceInfo: NarrativeWorkspaceInfo = workspaceApi.workspaceInfoToObject(rawWorkspaceInfo) as NarrativeWorkspaceInfo;

            const narrativeId = workspaceInfo.metadata.narrative;
            if (!narrativeId) {
                return {
                    workspaceId: workspaceId,
                    access: NarrativeAccess.NONE
                };
            }
            const objectId = parseInt(narrativeId, 10);

            let rawObjectInfo;
            try {
                rawObjectInfo = await wsClient.getObjectInfo3({
                    objects: [{
                        wsid: workspaceId,
                        objid: objectId
                    }],
                    includeMetadata: 1,
                    ignoreErrors: 0
                });
            } catch (ex) {
                // TODO: actually detect the error condition?
                return {
                    workspaceId: workspaceId,
                    access: NarrativeAccess.NONE
                };
            }

            const objectInfo: workspaceApi.ObjectInfo = workspaceApi.objectInfoToObject(rawObjectInfo.infos[0]);

            let access: NarrativeAccess.VIEW | NarrativeAccess.EDIT | NarrativeAccess.ADMIN | NarrativeAccess.OWNER;
            switch (workspaceInfo.userPermission) {
                case 'n':
                    if (workspaceInfo.globalReadPermission) {
                        access = NarrativeAccess.VIEW;
                        break;
                    } else {
                        throw new Error('Cannot have no access and no global read permission!');
                    }
                case 'r':
                    access = NarrativeAccess.VIEW;
                    break;
                case 'w':
                    access = NarrativeAccess.EDIT;
                    break;
                case 'a':
                    if (workspaceInfo.owner === this.params.username) {
                        access = NarrativeAccess.OWNER;
                    } else {
                        access = NarrativeAccess.ADMIN;
                    }
                    break;
                default:
                    throw new Error('Unknown workspace permission: ' + workspaceInfo.userPermission);
            }

            return {
                workspaceId: workspaceInfo.id,
                access: access,
                isPublic: workspaceInfo.globalReadPermission,
                objectId: objectInfo.id,
                title: workspaceInfo.metadata.narrative_nice_name || 'Unknown',
                owner: workspaceInfo.owner,
                lastSavedAt: objectInfo.savedAt,
                lastSavedBy: objectInfo.savedBy
            };
        } catch (ex) {
            console.error('Error fetching narrative!', ex);
            throw ex;
        }
    }
}
