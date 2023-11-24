import {
    AuthorizedServiceClient,
    AuthorizedServiceClientParams
} from "./serviceClientBase";


export interface ObjectIdentity {
    workspace?: string;
    wsid?: number;
    name?: string;
    objid?: string;
    ver?: number;
    ref?: string;
}

export interface WorkspaceIdentity {
    workspace?: string;
    id?: number;
}

export interface ObjectSpecification {
    workspace?: string;
    wsid?: number;
    name?: string;
    objid?: number;
    ver?: number;
    ref?: string;
    obj_path?: Array<ObjectIdentity>;
    obj_ref_path?: Array<string>;
    to_obj_path?: Array<ObjectIdentity>;
    to_obj_ref_path?: Array<string>;
    find_reference_path?: number; // bool 
    included?: string;
    strict_maps?: number; // bool
    strict_arrays?: number; // bool
}

export interface GetObjectInfo3Params {
    objects: Array<ObjectSpecification>;
    includeMetadata: number; // bool
    ignoreErrors: number; // bool
}

export type ObjectInfo = [
    number, // objid
    string, // object name
    string, // object type
    string, // save date timestamp YYYY-MM-DDThh:mm:ssZ
    number, // object version
    string, // saved by
    number, // workspace id
    string, // workspace name
    string, // md5 checksum
    number, // size in bytes
    Map<string, string> // metadata
];

export type WorkspaceInfo = [
    number, // workspace id
    string, // workspace name
    string, // workspace owner (username)
    string, // modification timestamp (iso 8601)
    number, // last object id
    string, // user permission (one char)
    string, // global permission (one char)
    string, // lock status
    Map<string, string>  // metadata
];

export interface GetObjectInfo3Result {
    infos: Array<ObjectInfo>;
    paths: Array<Array<string>>;
}

export interface GetWorkspaceInfoParams extends WorkspaceIdentity {
}

export interface GetWorkspaceInfoResult {

}

export interface WorkspaceClientParams extends AuthorizedServiceClientParams {
}


export class WorkspaceClient extends AuthorizedServiceClient {
    static module: string = 'Workspace';



    // TODO: should be void not null
    async getVersion(): Promise<string> {
        return this.callFunc<null, string>('ver', null);
    }

    async getObjectInfo3(params: GetObjectInfo3Params): Promise<GetObjectInfo3Result> {
        const objectInfo = this.callFunc<GetObjectInfo3Params, GetObjectInfo3Result>('get_object_info3', params);
        return objectInfo;
    }

    async getWorkspaceInfo(params: GetWorkspaceInfoParams): Promise<WorkspaceInfo> {
        return this.callFunc<GetWorkspaceInfoParams, WorkspaceInfo>('get_workspace_info', params);
    }

}