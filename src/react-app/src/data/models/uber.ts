import * as requestModel from './requests'
import * as orgModel from './organization/model'
import { RequestType } from '../../types';

export interface UberOrganization {
    organization: orgModel.Organization | orgModel.InaccessiblePrivateOrganization
    request: requestModel.UserRequest | null
    invitation: requestModel.UserInvitation | null
    relation: orgModel.Relation,
    groupRequests: Array<requestModel.Request> | null
}

interface UberModelParams {
    token: string
    username: string
    groupsServiceURL: string
    userProfileServiceURL: string
    workspaceServiceURL: string
    serviceWizardURL: string
}

export class UberModel {

    params: UberModelParams

    constructor(params: UberModelParams) {
        this.params = params
    }

    async getOrganizationForUser(organizationId: string): Promise<UberOrganization> {
        // const {
        //     auth: { authorization: { token, username } },
        //     app: { config }
        // } = getState()

        const orgClient = new orgModel.OrganizationModel({
            token: this.params.token, username: this.params.username,
            groupsServiceURL: this.params.groupsServiceURL
        })

        const requestClient = new requestModel.RequestsModel({
            token: this.params.token, username: this.params.username,
            groupsServiceURL: this.params.groupsServiceURL
        })

        // get org
        const organization = await orgClient.getOrg(organizationId)

        // get pending requests
        const request = await requestClient.getUserRequestForOrg(organizationId) as requestModel.UserRequest | null

        const invitation = await requestClient.getUserInvitationForOrg(organizationId) as requestModel.UserInvitation | null

        // LEFT OFF HERE ... we should probably just keep the request ids rather than try to keep the whole request
        // and refactor the calls for the request events, which I just refactored (not much work) to use the 
        // whole request structure rather than just the id, to use the request id + the org id...
        const relation = orgModel.determineRelation(organization, this.params.username, request, invitation)

        let groupRequests
        if (relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            relation.type === orgModel.UserRelationToOrganization.OWNER) {
            groupRequests = await requestClient.getPendingOrganizationRequestsForOrg(organizationId)
        } else {
            groupRequests = null
        }

        return {
            organization, request, invitation, relation, groupRequests
        }
    }

    // async getOrganizationsForUser(): Promise<Array<UberOrganization>> {
    //     // const {
    //     //     auth: { authorization: { token, username } },
    //     //     app: { config }
    //     // } = getState()

    //     const orgClient = new orgModel.OrganizationModel({
    //         token: this.params.token, username: this.params.username,
    //         groupsServiceURL: this.params.groupsServiceURL
    //     })

    //     const requestClient = new requestModel.RequestsModel({
    //         token: this.params.token, username: this.params.username,
    //         groupsServiceURL: this.params.groupsServiceURL
    //     })

    //     const orgs = await orgClient.getOwnOrgs()

    //     const requestOutbox = await requestClient.getOutboundRequests()
    //     const requestInbox = await requestClient.getInboundRequests()

    //     return await Promise.all(orgs.map(async (organization) => {
    //         const request = requestOutbox.find((request) => {
    //             if (request.organizationId === organization.id) {
    //                 if (request.type === RequestType.REQUEST &&
    //                     request.resourceType === requestModel.RequestResourceType.USER) {
    //                     return true
    //                 }
    //             }
    //             return false
    //         }) as requestModel.UserRequest

    //         const invitation = requestInbox.find((request) => {
    //             if (request.organizationId === organization.id) {
    //                 if (request.type === RequestType.INVITATION &&
    //                     request.resourceType === requestModel.RequestResourceType.USER) {
    //                     return true
    //                 }
    //             }
    //             return false
    //         }) as requestModel.UserInvitation

    //         const relation = orgModel.determineRelation(organization, this.params.username, request || null, invitation)

    //         let groupRequests
    //         if (relation.type === orgModel.UserRelationToOrganization.ADMIN ||
    //             relation.type === orgModel.UserRelationToOrganization.OWNER) {
    //             groupRequests = await requestClient.getPendingOrganizationRequestsForOrg(organization.id)
    //         } else {
    //             groupRequests = null
    //         }

    //         return {
    //             organization, request, invitation, relation, groupRequests
    //         }
    //     }))
    // }
}