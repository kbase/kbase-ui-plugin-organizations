import * as React from 'react'

import './component.css'

import { Button, Modal, Icon, Alert } from 'antd'
import Header from '../../../Header'
import * as orgModel from '../../../../data/models/organization/model'
import * as requestModel from '../../../../data/models/requests'

enum NavigateTo {
    NONE = 0,
    REQUEST_ADD_NARRATIVE
}

export interface ViewOrganizationState {
    showInfo: boolean
    navigateTo: NavigateTo
    requestAccess: {
        narrative: orgModel.NarrativeResource | null
    }
}

export interface ViewOrganizationProps {
    organization: orgModel.InaccessiblePrivateOrganization
    relation: orgModel.Relation
    requestOutbox: Array<requestModel.Request>
    onJoinOrg: () => void
    onCancelJoinRequest: (requestId: string) => void
    onAcceptInvitation: (requestId: string) => void
    onRejectInvitation: (requestId: string) => void
}

class ViewOrganization extends React.Component<ViewOrganizationProps, ViewOrganizationState> {
    constructor(props: ViewOrganizationProps) {
        super(props)

        this.state = {
            showInfo: false,
            navigateTo: NavigateTo.NONE,
            requestAccess: {
                narrative: null
            }
        }
    }

    onShowInfo() {
        // this.setState({ showInfo: true })
        Modal.info({
            title: 'View Organization Help',
            width: '50em',
            content: (
                <div>
                    <p>This organization is <b>private</b>.</p>
                    <p>Nothing about this organization may be revealed to non-members.</p>
                    <p>You may request membership</p>
                    <p>Upon requesting membership, the organization administrators may grant you membership</p>
                    <p>When your request is either accepted or denied, you will received a notification in your KBase Feed.</p>
                </div>
            )
        })
    }

    onJoinClick() {
        this.props.onJoinOrg()
    }

    onCancelJoinRequest() {
        const relation = this.props.relation as orgModel.MembershipRequestPendingRelation
        this.props.onCancelJoinRequest(relation.requestId)
    }

    onAcceptInvitation() {
        if (!this.props.organization) {
            return
        }
        const relation = this.props.relation as orgModel.MembershipRequestPendingRelation
        this.props.onAcceptInvitation(relation.requestId)
    }

    onRejectInvitation() {
        if (!this.props.organization) {
            return
        }
        const relation = this.props.relation as orgModel.MembershipRequestPendingRelation
        this.props.onRejectInvitation(relation.requestId)
    }

    renderMessage() {
        switch (this.props.relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                return (
                    <React.Fragment>
                        <p>This organization is <b>private</b> and you are not a member.</p>
                        <p>Nothing about a private organization may be revealed to a non-member.</p>
                        <p>However, you may request membership</p>
                        <p>Upon requesting membership, the organization administrators will be notified.</p>
                        <p>When your request is either accepted or denied, you will received a notification in your KBase Feed.</p>
                    </React.Fragment>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (
                    <React.Fragment>
                        <p>Your membership request to this private organization is pending.</p>
                    </React.Fragment>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (
                    <React.Fragment>
                        <p>You have been invited to this private organization.</p>
                    </React.Fragment>
                )
            default:
                return (
                    <div>
                        Weird, {this.props.relation.type}.
                    </div>
                )
        }
    }

    renderOrg() {
        const message = (
            <span>
                Private Organization
            </span>
        )
        const description = (
            <React.Fragment>
                {this.renderMessage()}

                <div>
                    {this.renderJoinButton()}
                </div>
            </React.Fragment>
        )
        return (
            <Alert
                message={message}
                description={description}
                type="info"
                style={{ width: '50em', margin: '20px auto' }}
                className="ViewInaccessiblePrivateOrganization-message" />
        )
    }

    renderRelationClass(relation: orgModel.Relation) {
        switch (relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                return 'infoBox'
            case (orgModel.UserRelationToOrganization.VIEW):
                return 'infoBox'
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return 'infoBox relationRequestPending'
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return 'infoBox relationInvitationPending'
            case (orgModel.UserRelationToOrganization.MEMBER):
                return 'infoBox'
            case (orgModel.UserRelationToOrganization.ADMIN):
                return 'infoBox'
            case (orgModel.UserRelationToOrganization.OWNER):
                return 'infoBox'
        }
    }

    renderJoinButton() {
        switch (this.props.relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                return (
                    <Button
                        onClick={this.onJoinClick.bind(this)}
                    >
                        Join this Organization
                    </Button>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (
                    <div>
                        <div><Button
                            icon="delete"
                            type="danger"
                            onClick={this.onCancelJoinRequest.bind(this)}>Cancel Request</Button>
                        </div>
                    </div>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (
                    <div>
                        <Button icon="check" type="default" onClick={this.onAcceptInvitation.bind(this)}>Accept Invitation</Button>
                        {' '}
                        <Button icon="stop" type="danger" onClick={this.onRejectInvitation.bind(this)}>Reject Invitation</Button>
                    </div>
                )
            default:
                return (
                    <div>
                        Weird, {this.props.relation.type}.
                    </div>
                )
        }
    }

    renderHeader() {
        const breadcrumbs = (
            <div style={{ flex: '0 0 auto' }}>
            </div>
        )
        const buttons = (
            <React.Fragment>

                <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
            </React.Fragment>
        )
        return (
            <Header breadcrumbs={breadcrumbs} buttons={buttons} />
        )
    }

    render() {
        return (
            <div className="ViewInaccessiblePrivateOrganization  scrollable-flex-column">
                {this.renderHeader()}
                {this.renderOrg()}
            </div>
        )
    }
}

export default ViewOrganization