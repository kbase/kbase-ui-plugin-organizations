import { string } from "prop-types";

export interface GroupsServiceInfo {
    servname: string;
    version: string;
    servertime: number;
    gitcommithash: string
}

export interface BriefGroup {
    id: string;
    name: string;
    owner: string;
    type: string;
    // createdAt: number;
    // modifiedAt: number
}

export type GroupList = Array<BriefGroup>

export type Username = string;

export interface WorkspaceInfo {
    wsid: number
    name: string
    narrname: string
    public: boolean
    admin: boolean
}

export interface Group {
    id: string
    name: string
    owner: Username
    type: string
    admins: Array<Username>
    members: Array<Username>
    description: string
    createdate: number
    moddate: number
    workspaces: Array<WorkspaceInfo>
}

export interface NewGroup {
    id: string
    name: string
    type: string
    description: string
}

export interface Request {
    id: string
    groupid: string
    requester: Username
    type: string
    status: string
    targetuser: Username
    targetws: number
    createddate: number
    expireddate: number
    moddate: number
}

export interface ErrorInfo {
    appcode: number
    apperror: string
    callid: string
    httpcode: number
    httpstatus: string
    message: string
    time: number
}

export interface ErrorResult {
    error: ErrorInfo
}

// Error types: (appcode)
// 10000	Authentication failed
// 10010	No authentication token
// 10020	Invalid token
// 20000	Unauthorized
// 30000	Missing input parameter
// 30001	Illegal input parameter
// 30010	Illegal user name
// 40000	Group already exists
// 40010	Request already exists
// 40020	User already group member
// 40030	Workspace already in group
// 50000	No such group
// 50010	No such request
// 50020	No such user
// 50030	No such workspace
// 60000	Unsupported operation

export class GroupsClient {
    token: string;
    url: string;

    constructor({ token, url }: { token: string, url: string }) {
        this.token = token
        this.url = url
    }

    getInfo(): Promise<GroupsServiceInfo> {
        return fetch(this.url + '/', {
            headers: {
                Authorization: this.token,
                Accept: 'application/json'
            },
            mode: 'cors'
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                return result as GroupsServiceInfo;
            });
    }

    getGroups(): Promise<GroupList> {
        return fetch(this.url + '/group', {
            headers: {
                Authorization: this.token,
                Accept: 'application/json'
            },
            mode: 'cors'
        })
            .then((response) => {
                return response.json()
            })
            .then((result: GroupList) => {
                return result.filter(({ type }) => type === 'Organization')
            })
    }

    getGroupById(id: string): Promise<Group> {
        return fetch(this.url + '/group/' + id, {
            headers: {
                Authorization: this.token,
                Accept: 'application/json'
            },
            mode: 'cors'
        })
            .then((response) => {
                if (response.status === 404) {
                    return null
                }
                return response.json()
            })
            .then((result) => {
                return result as Group
            })
    }

    createGroup(newGroup: NewGroup): Promise<Group> {
        return fetch(this.url + '/group/' + newGroup.id, {
            headers: {
                Authorization: this.token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'PUT',
            body: JSON.stringify({
                name: newGroup.name,
                type: newGroup.type,
                description: newGroup.description
            })
        })
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                return result as Group
            })
    }
}