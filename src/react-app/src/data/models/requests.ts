import * as groupsApi from '../apis/groups'
import * as orgModel from './organization/model'

export type Username = string

export type RequestID = string

export enum RequestType {
    REQUEST = 0,
    INVITATION
}

export enum RequestResourceType {
    USER = 0,
    WORKSPACE,
    APP
}

export enum RequestStatus {
    OPEN = 0,
    CANCELED,
    EXPIRED,
    ACCEPTED,
    DENIED
}

export interface BaseRequest {
    id: string
    organizationId: string
    requester: Username
    type: RequestType
    status: RequestStatus
    resourceType: RequestResourceType
    createdAt: Date
    expireAt: Date
    modifiedAt: Date
}

export interface UserRequest extends BaseRequest {
    resourceType: RequestResourceType.USER
    type: RequestType.REQUEST
    user: Username
}

export interface UserInvitation extends BaseRequest {
    resourceType: RequestResourceType.USER
    type: RequestType.INVITATION
    user: Username
}

export interface WorkspaceRequest extends BaseRequest {
    resourceType: RequestResourceType.WORKSPACE
    type: RequestType.REQUEST
    narrativeId: string,
}

export interface WorkspaceInvitation extends BaseRequest {
    resourceType: RequestResourceType.WORKSPACE
    type: RequestType.INVITATION
    narrativeId: string
}

export interface AppRequest extends BaseRequest {
    resourceType: RequestResourceType.APP
    type: RequestType.REQUEST
    appId: string
}

export interface AppInvitation extends BaseRequest {
    resourceType: RequestResourceType.APP
    type: RequestType.INVITATION
    appId: string
}

export type Request = UserRequest | UserInvitation | WorkspaceRequest | WorkspaceInvitation | AppRequest | AppInvitation


function stringToRequestType(type: string): RequestType {
    switch (type) {
        case 'Invite':
            return RequestType.INVITATION
        case 'Request':
            return RequestType.REQUEST
        default:
            throw new Error('unknown request type: ' + type)
    }
}

function stringToResourceType(type: string) {
    switch (type) {
        case 'user':
            return RequestResourceType.USER
        case 'workspace':
            return RequestResourceType.WORKSPACE
        case 'catalogmethod':
            return RequestResourceType.APP
        default:
            throw new Error('unknown resource type: ' + type)
    }
}

function stringToRequestStatus(status: string): RequestStatus {
    return RequestStatus.OPEN
}

export function groupRequestToOrgRequest(request: groupsApi.Request): Request {

    const requestType = stringToRequestType(request.type)
    const resourceType = stringToResourceType(request.resourcetype)
    const requestStatus = stringToRequestStatus(request.status)

    switch (resourceType) {
        case RequestResourceType.USER:
            if (requestType === RequestType.REQUEST) {
                return {
                    id: request.id,
                    organizationId: request.groupid,
                    resourceType: resourceType,
                    requester: request.requester,
                    type: requestType,
                    status: requestStatus,
                    user: request.resource as Username,
                    createdAt: new Date(request.createdate),
                    expireAt: new Date(request.expiredate),
                    modifiedAt: new Date(request.moddate)
                } as UserRequest
            } else {
                return {
                    id: request.id,
                    organizationId: request.groupid,
                    resourceType: resourceType,
                    requester: request.requester,
                    type: requestType,
                    status: requestStatus,
                    user: request.resource as Username,
                    createdAt: new Date(request.createdate),
                    expireAt: new Date(request.expiredate),
                    modifiedAt: new Date(request.moddate)
                } as UserInvitation
            }

        case RequestResourceType.WORKSPACE:
            if (requestType === RequestType.REQUEST) {
                return {
                    id: request.id,
                    organizationId: request.groupid,
                    resourceType: resourceType,
                    requester: request.requester,
                    type: requestType,
                    status: requestStatus,
                    narrativeId: request.resource,
                    createdAt: new Date(request.createdate),
                    expireAt: new Date(request.expiredate),
                    modifiedAt: new Date(request.moddate)
                } as WorkspaceRequest
            } else {
                return {
                    id: request.id,
                    organizationId: request.groupid,
                    resourceType: resourceType,
                    requester: request.requester,
                    type: requestType,
                    status: requestStatus,
                    narrativeId: request.resource,
                    createdAt: new Date(request.createdate),
                    expireAt: new Date(request.expiredate),
                    modifiedAt: new Date(request.moddate)
                } as WorkspaceInvitation
            }

        case RequestResourceType.APP:
            if (requestType === RequestType.REQUEST) {
                return {
                    id: request.id,
                    organizationId: request.groupid,
                    resourceType: resourceType,
                    requester: request.requester,
                    type: requestType,
                    status: requestStatus,
                    appId: request.resource,
                    createdAt: new Date(request.createdate),
                    expireAt: new Date(request.expiredate),
                    modifiedAt: new Date(request.moddate)
                } as AppRequest
            } else {
                return {
                    id: request.id,
                    organizationId: request.groupid,
                    resourceType: resourceType,
                    requester: request.requester,
                    type: requestType,
                    status: requestStatus,
                    appId: request.resource,
                    createdAt: new Date(request.createdate),
                    expireAt: new Date(request.expiredate),
                    modifiedAt: new Date(request.moddate)
                } as AppInvitation
            }
        default:
            throw new Error('resource type not handled yet: ' + request.resourcetype)
    }
}

interface RequestsModelParams {
    groupsServiceURL: string
    token: string
    username: Username
}

export class RequestsModel {

    params: RequestsModelParams
    groupsClient: groupsApi.GroupsClient
    cache: Map<RequestID, Request>

    constructor(params: RequestsModelParams) {
        this.params = params
        this.groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })
        this.cache = new Map()
    }

    async getRequest(requestId: RequestID): Promise<Request> {
        if (this.cache.has(requestId)) {
            return this.cache.get(requestId)!
        }

        const grequest = await this.groupsClient.getRequest(requestId)
        const request = groupRequestToOrgRequest(grequest)

        this.cache.set(request.id, request)
        return request
    }

    async getUserRequests(): Promise<Array<Request>> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const grequests = await groupsClient.getCreatedRequests({
            includeClosed: false,
            sortDirection: groupsApi.SortDirection.DESCENDING
        })

        const requests = grequests.map((request) => {
            return groupRequestToOrgRequest(request)
        })

        requests.forEach((request) => {
            if (!this.cache.has(request.id)) {
                this.cache.set(request.id, request)
            }
        })

        return requests
    }

    async getUserRequestForOrg(organizationId: orgModel.OrganizationID): Promise<UserRequest | null> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const grequests = await groupsClient.getCreatedRequests({
            includeClosed: false,
            sortDirection: groupsApi.SortDirection.DESCENDING
        })

        // TODO should work in synchrony with above...
        const grequest = grequests.find((r) => {
            return r.groupid === organizationId
        })

        if (!grequest) {
            return null
        }

        return groupRequestToOrgRequest(grequest) as UserRequest
    }

    async getPendingRequestsForOrg(organizationId: orgModel.OrganizationID): Promise<Array<Request>> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const grequests = await groupsClient.getCreatedRequests({
            includeClosed: false,
            sortDirection: groupsApi.SortDirection.DESCENDING
        })

        // TODO should work in synchrony with above...
        return grequests
            .filter((r) => {
                return r.groupid === organizationId
            })
            .map((r) => {
                return groupRequestToOrgRequest(r)
            })
    }

    async getOrganizationInvitations(): Promise<Array<Request>> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const grequests = await groupsClient.getCreatedRequests({
            includeClosed: false,
            sortDirection: groupsApi.SortDirection.DESCENDING
        })

        const requests = grequests.map((request) => {
            return groupRequestToOrgRequest(request)
        }).filter((request) => {
            return (request.type === RequestType.INVITATION)
        })

        requests.forEach((request) => {
            if (!this.cache.has(request.id)) {
                this.cache.set(request.id, request)
            }
        })

        return requests
    }

    async getOrganizationInvitationsForOrg(organizationId: orgModel.OrganizationID): Promise<Array<Request>> {
        const invitations = await this.getOrganizationInvitations()
        return invitations.filter((invitation) => {
            return (invitation.organizationId === organizationId)
        })
    }

    async getUserInvitations(): Promise<Array<Request>> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const grequests = await groupsClient.getTargetedRequests({
            includeClosed: false,
            sortDirection: groupsApi.SortDirection.DESCENDING
        })

        const requests = grequests.map((request) => {
            return groupRequestToOrgRequest(request)
        })

        requests.forEach((request) => {
            if (!this.cache.has(request.id)) {
                this.cache.set(request.id, request)
            }
        })

        return requests
    }

    async getUserInvitationForOrg(organizationId: orgModel.OrganizationID): Promise<UserInvitation | null> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const grequests = await groupsClient.getTargetedRequests({
            includeClosed: false,
            sortDirection: groupsApi.SortDirection.DESCENDING
        })

        // TODO should work in synchrony with above...
        const grequest = grequests.find((r) => {
            return (r.groupid === organizationId)
        })

        if (!grequest) {
            return null
        }

        return groupRequestToOrgRequest(grequest) as UserInvitation
    }

    async getPendingOrganizationRequestsForOrg(organizationId: orgModel.OrganizationID): Promise<Array<Request>> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const groupRequests = await groupsClient.getGroupRequests(organizationId, {
            includeClosed: false,
            sortDirection: groupsApi.SortDirection.DESCENDING
        })

        return groupRequests.map((request) => {
            return groupRequestToOrgRequest(request)
        })

        // const [groupRequests, adminRequests] = await Promise.all([
        //     groupsClient.getGroupRequests(groupId, {
        //         includeClosed: false,
        //         sortDirection: groupsApi.SortDirection.DESCENDING
        //     }),
        //     groupsClient.getCreatedRequests({
        //         includeClosed: false,
        //         sortDirection: groupsApi.SortDirection.DESCENDING
        //     })
        // ])
        // const groupAdminRequests = adminRequests.filter((request) => {
        //     return (request.groupid === groupId)
        // })

        // return Promise.all(groupRequests.concat(groupAdminRequests).map((request) => {
        //     return groupRequestToOrgRequest(request)
        // }))
    }

    async getPendingOrganizationRequests(groupIds: Array<string>): Promise<Array<Request>> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const groupRequests = await Promise.all(groupIds.map((groupId) => {
            return groupsClient.getGroupRequests(groupId, {
                includeClosed: false,
                sortDirection: groupsApi.SortDirection.DESCENDING
            })
        }))

        const allRequests = groupRequests.reduce((allRequests, requests) => {
            return allRequests.concat(requests)
        }, [])

        return allRequests.map((request) => {
            return groupRequestToOrgRequest(request)
        })
    }

    async cancelRequest(requestId: string): Promise<Request> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const request = await groupsClient.cancelRequest({
            requestId
        })
        return groupRequestToOrgRequest(request)
    }

    async acceptRequest(requestId: string): Promise<Request> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const request = await groupsClient.acceptRequest({
            requestId
        })
        return groupRequestToOrgRequest(request)
    }

    async denyRequest(requestId: string): Promise<Request> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const request = await groupsClient.denyRequest({
            requestId
        })
        return groupRequestToOrgRequest(request)
    }

    async acceptJoinInvitation(requestId: string): Promise<Request> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const request = await groupsClient.acceptRequest({
            requestId
        })
        return groupRequestToOrgRequest(request)
    }

    async rejectJoinInvitation(requestId: string): Promise<Request> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        const request = await groupsClient.denyRequest({
            requestId
        })
        return groupRequestToOrgRequest(request)
    }

    async inviteUserToJoinOrg(groupId: string, username: string): Promise<Request> {
        const groupsClient = new groupsApi.GroupsClient({
            url: this.params.groupsServiceURL,
            token: this.params.token
        })

        return groupsClient.inviteUserToGroup({
            groupId,
            username
        })
            .then((request) => {
                return groupRequestToOrgRequest(request)
            })
    }
}