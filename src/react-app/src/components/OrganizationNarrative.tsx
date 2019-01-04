import * as React from 'react'
import * as orgModel from '../data/models/organization/model'
import { Button, Tooltip, Icon, Drawer } from 'antd';
import Narrative from './entities/narrative/reduxAdapter';

export interface Props {
    narrative: orgModel.NarrativeResource
    onGetViewAccess: (narrative: orgModel.NarrativeResource) => void
}

interface State {
    requestAccess: boolean
}

export default class OrganizationNarrative extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            requestAccess: false
        }
    }

    onGetViewAccess() {
        this.props.onGetViewAccess(this.props.narrative)
    }

    onRequestAccess() {
        this.setState({ requestAccess: true })
    }

    onCloseRequestAccess() {
        this.setState({ requestAccess: false })
    }

    renderNarrativePermission(narrative: orgModel.NarrativeResource) {
        let label
        let shareButton
        let permissionTooltip
        let buttonTooltip
        switch (narrative.permission) {
            case orgModel.UserWorkspacePermission.NONE:
                if (narrative.isPublic) {
                    permissionTooltip = "You have View access to this narrative narrative because it is shared publicly; you may view it, but not edit, run, or share it"
                    label = (
                        <span>
                            View Only (public)
                        </span>
                    )
                    buttonTooltip = 'Although you have View-Only access to this Narrative due to it being shared globally, you can obtain personal View-Only access by clicking this button'
                    shareButton = (
                        <Button size="small" onClick={() => { this.onGetViewAccess.call(this) }}>
                            Click for Access
                        </Button>
                    )
                } else {
                    permissionTooltip = "You have No access to this narrative narrative; you may not view, edit, run, or share it"
                    label = (
                        <span>
                            No Access
                        </span>
                    )
                    buttonTooltip = 'You cannot access this Narrative; in order to immediately obtain View-Only access click this button.'
                    shareButton = (
                        <Button size="small" onClick={() => { this.onGetViewAccess.call(this) }}>
                            Click for Access
                        </Button>
                    )
                }
                break
            case orgModel.UserWorkspacePermission.VIEW:
                permissionTooltip = "You have View access to this narrative narrative; you may view it, but not edit, run, or share it"
                label = (
                    <span>
                        View Only
                    </span>
                )
                buttonTooltip = 'You already have View-Only access to this Narrative, but may request additional access'
                shareButton = (
                    <Button size="small" onClick={() => { this.onRequestAccess.call(this) }}>
                        Request Additional Access
                    </Button>
                )
                break
            case orgModel.UserWorkspacePermission.EDIT:
                permissionTooltip = "You have Edit access to this Narrative; you may view, edit, and run, but not share it"
                label = (
                    <span>
                        Edit
                    </span>
                )
                buttonTooltip = 'You already have Edit access to this Narrative, but may request additional access by clicking this button'
                shareButton = (
                    <Button size="small" onClick={() => { this.onRequestAccess.call(this) }}>
                        Request Admin Access
                    </Button>
                )
                break
            case orgModel.UserWorkspacePermission.ADMIN:
                permissionTooltip = "You have Admin access to this narrative narrative; you may view, edit, run, and share it"
                label = (
                    <span>
                        Admin
                    </span>
                )
                break
            case orgModel.UserWorkspacePermission.OWNER:
                permissionTooltip = "You are the Owner of this narrative; you may view, edit, run, and share it"
                label = (
                    <span>
                        Owner
                    </span>
                )
                break
            default:
                label = (
                    <span>
                        Unknown
                    </span>
                )
        }

        return (
            <React.Fragment>
                <Tooltip title={permissionTooltip} placement="right">
                    <span style={{ cursor: 'help' }}>
                        <span className="field-label">your permission</span>
                        {label}
                    </span>
                </Tooltip>
                {' '}
                <Tooltip title={buttonTooltip} placement="right">
                    {shareButton}
                </Tooltip>
            </React.Fragment>
        )
    }

    renderPublicPermission(narrative: orgModel.NarrativeResource) {
        if (narrative.isPublic) {
            return (
                <Tooltip title="This narrative is viewable by all KBase users" placement="right">
                    <span style={{ cursor: 'help' }}>
                        <Icon type="globe" /> Public Narrative
                    </span>
                </Tooltip>
            )
        } else {
            return (
                <Tooltip title="This narrative is only accessible to those with whom it is directly shared" placement="right">
                    <span style={{ cursor: 'help' }}>
                        <Icon type="lock" /> Private Narrative
                    </span>
                </Tooltip>
            )
        }
    }

    renderNarrative() {
        const narrative = this.props.narrative
        if (narrative.permission === orgModel.UserWorkspacePermission.NONE) {
            return (
                <React.Fragment>
                    <div className="title">{narrative.title}</div>
                    {/* <div>{this.renderPublicPermission(narrative)}</div> */}
                    <div>{this.renderNarrativePermission(narrative)}</div>
                </React.Fragment>
            )
        } else {
            return (
                <Narrative workspaceId={narrative.workspaceId} />
                // <React.Fragment>
                //     <div className="title"><a href={'https://ci.kbase.us/narrative/ws.' + narrative.workspaceId + '.obj.' + '1'} target="_blank">{narrative.title}</a></div>
                //     <div>{this.renderPublicPermission(narrative)}</div>
                //     <div>{this.renderNarrativePermission(narrative)}</div>

                //     <div>
                //         <Narrative workspaceId={narrative.workspaceId} />
                //     </div>
                // </React.Fragment>
            )
        }
    }

    render() {
        let accessModal
        if (this.state.requestAccess) {
            // TODO: replace with our own implementation...n
            accessModal = (
                <Drawer title="Request Access to Narrative"
                    placement="right"
                    closable={true}
                    visible={true}
                    onClose={() => { this.onCloseRequestAccess.call(this) }}
                >
                    Requesting access...
                </Drawer>
            )
        }

        return (
            <div>
                {this.renderNarrative()}
                {accessModal}
            </div>
        )
    }
}