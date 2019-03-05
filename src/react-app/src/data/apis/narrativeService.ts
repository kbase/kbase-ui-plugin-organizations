// import { AuthorizedServiceClient, ServiceClientParams, JSONPayload } from './serviceClient'

import { DynamicServiceClient, DynamicServiceClientParams } from './dynamicServiceClient'

import { RawObjectInfo, RawWorkspaceInfo, WorkspaceInfo, ObjectInfo, workspaceInfoToObject, objectInfoToObject } from './workspaceUtils'

export interface NarrativeServiceClientParams extends DynamicServiceClientParams {

}

export interface ListNarrativesParams {
    type: string
}

type Metadata = {}

/* Information about an object, including user provided metadata.

       obj_id objid - the numerical id of the object.
       obj_name name - the name of the object.
       type_string type - the type of the object.
       timestamp save_date - the save date of the object.
       obj_ver ver - the version of the object.
       username saved_by - the user that saved or copied the object.
       ws_id wsid - the workspace containing the object.
       ws_name workspace - the workspace containing the object.
       string chsum - the md5 checksum of the object.
       int size - the size of the object in bytes.
       usermeta meta - arbitrary user-supplied metadata about
           the object.
   */

export interface ListNarrativesResult {
    narratives: Array<{
        ws: RawWorkspaceInfo
        nar: RawObjectInfo
    }>
}

export class NarrativeServiceClient extends DynamicServiceClient {
    static module: string = 'NarrativeService'

    constructor(params: NarrativeServiceClientParams) {
        super(params)
    }

    async listNarratives(type: string): Promise<ListNarrativesResult> {
        // note usage of unknown below -- Bluebird and native Promise!
        const [result] = await this.callFunc('list_narratives', [{
            type: type
        }])
        return result
    }
}