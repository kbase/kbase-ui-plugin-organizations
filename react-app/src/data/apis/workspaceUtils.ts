export type Metadata = {};

export type RawObjectInfo = [
    number, // objid - object id
    string, // name - object name
    string, // type - object type
    string, // save_date - iso8601 timestamp when last saved
    number, // ver - object version
    string, // saved_by - username who saved it last
    number, // wsid - workspace id
    string, // workspace - workspace name,
    string, // chsum - checksum of the object
    number, // size - size of the object (bytes)
    Metadata   // meta - string to string object of stuff
];

export type RawWorkspaceInfo = [
    number, // id - workspace id
    string, // workspace - workspace name
    string, // owner - username who owns it
    string, // moddate - iso8601 timestamp when last modified
    number, // max_objid - last object id assigned to object in workspace
    string, // user_permission - permission of user who made reqeust wrt workspace
    string, // globalread - int bool whether this workspace is shared globally
    string, // lockstat - status of the workspace lock
    Metadata // metadata
];

export interface WorkspaceInfo {
    id: number;
    name: string;
    owner: string;
    modifiedAt: Date;
    objectCount: number;
    userPermission: string;
    globalReadPermission: boolean;
    lockStatus: string;
    metadata: Metadata;
}

export interface ObjectInfo {
    id: number;
    name: string;
    type: {
        module: string;
        name: string;
        majorVersion: number;
        minorVersion: number;
        id: string;
    };
    version: number;
    savedAt: Date;
    savedBy: string;
    workspaceId: number;
    workspaceName: string;
    checksum: string;
    size: number;
    ref: string;
    metadata: Metadata;
}

function iso8601ToDate(dateString: string) {
    const isoRE = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([+-])(\d\d)(:?[:]*)(\d\d)/;
    const dateParts = isoRE.exec(dateString);
    if (!dateParts) {
        throw new TypeError('Invalid Date Format for ' + dateString);
    }
    // This is why we do this -- JS insists on the colon in the tz offset.
    const offset = dateParts[7] + dateParts[8] + ':' + dateParts[10];
    const newDateString = dateParts[1] + '-' + dateParts[2] + '-' + dateParts[3] + 'T' + dateParts[4] + ':' + dateParts[5] + ':' + dateParts[6] + offset;
    return new Date(newDateString);
}

export function workspaceInfoToObject(wsInfo: RawWorkspaceInfo): WorkspaceInfo {
    return {
        id: wsInfo[0],
        name: wsInfo[1],
        owner: wsInfo[2],
        modifiedAt: iso8601ToDate(wsInfo[3]),
        objectCount: wsInfo[4],
        userPermission: wsInfo[5],
        globalReadPermission: wsInfo[6] === 'r' ? true : false,
        lockStatus: wsInfo[7],
        metadata: wsInfo[8]
    };
}

export function objectInfoToObject(data: RawObjectInfo): ObjectInfo {
    const type = data[2].split(/[-.]/);

    return {
        id: data[0],
        name: data[1],
        // type: data[2],
        type: {
            id: data[2],
            module: type[0],
            name: type[1],
            majorVersion: parseInt(type[2], 10),
            minorVersion: parseInt(type[3], 10)
        },
        savedAt: iso8601ToDate(data[3]),
        version: data[4],
        savedBy: data[5],
        workspaceId: data[6],
        workspaceName: data[7],
        checksum: data[8],
        size: data[9],
        metadata: data[10],
        ref: data[6] + '/' + data[0] + '/' + data[4]
    };
}

