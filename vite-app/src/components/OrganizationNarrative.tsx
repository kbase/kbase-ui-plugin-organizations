import { GlobalOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Drawer, Tooltip } from 'antd';
import { Component, Fragment } from 'react';
import * as orgModel from '../data/models/organization/model';
import NiceElapsedTime from './NiceElapsedTime';
import './OrganizationNarrative.css';
import UILink from './UILink';
import Narrative from './entities/narrative/reduxAdapter';

export interface Props {
    organization: orgModel.Organization;
    narrative: orgModel.NarrativeResource;
    onGetViewAccess: (narrative: orgModel.NarrativeResource) => void;
}

interface State {
    requestAccess: boolean;
}

export default class OrganizationNarrative extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            requestAccess: false
        };
    }

    onGetViewAccess() {
        this.props.onGetViewAccess(this.props.narrative);
    }

    onRequestAccess() {
        this.setState({ requestAccess: true });
    }

    onCloseRequestAccess() {
        this.setState({ requestAccess: false });
    }

    renderNarrativePermission(narrative: orgModel.NarrativeResource) {
        let label;
        let shareButton;
        let permissionTooltip;
        let buttonTooltip;
        switch (narrative.permission) {
            case orgModel.UserWorkspacePermission.NONE:
                if (narrative.isPublic) {
                    permissionTooltip = "You have View access to this narrative narrative because it is shared publicly; you may view it, but not edit, run, or share it";
                    label = (
                        <span>
                            View Only (public)
                        </span>
                    );
                    buttonTooltip = 'Although you have View-Only access to this Narrative due to it being shared globally, you may obtain personal View-Only access by clicking this button';
                    shareButton = (
                        <Button size="small" onClick={() => { this.onGetViewAccess.call(this); }}>
                            Click for View Access
                        </Button>
                    );
                } else {
                    permissionTooltip = "You have No access to this narrative narrative; you may not view, edit, run, or share it";
                    label = (
                        <span>
                            No Access
                        </span>
                    );
                    buttonTooltip = 'You cannot access this Narrative; in order to immediately obtain View-Only access click this button.';
                    shareButton = (
                        <Button size="small" onClick={() => { this.onGetViewAccess.call(this); }}>
                            Click for View Access
                        </Button>
                    );
                }
                break;
            case orgModel.UserWorkspacePermission.VIEW:
                permissionTooltip = "You have View access to this narrative narrative; you may view it, but not edit, run, or share it";
                label = (
                    <span>
                        View Only
                    </span>
                );
                buttonTooltip = 'You already have View-Only access to this Narrative, but may request additional access';
                shareButton = (
                    <Button size="small" onClick={() => { this.onRequestAccess.call(this); }}>
                        Request Additional Access
                    </Button>
                );
                break;
            case orgModel.UserWorkspacePermission.EDIT:
                permissionTooltip = "You have Edit access to this Narrative; you may view, edit, and run, but not share it";
                label = (
                    <span>
                        Edit
                    </span>
                );
                buttonTooltip = 'You already have Edit access to this Narrative, but may request additional access by clicking this button';
                shareButton = (
                    <Button size="small" onClick={() => { this.onRequestAccess.call(this); }}>
                        Request Admin Access
                    </Button>
                );
                break;
            case orgModel.UserWorkspacePermission.ADMIN:
                permissionTooltip = "You have Admin access to this narrative narrative; you may view, edit, run, and share it";
                label = (
                    <span>
                        Admin
                    </span>
                );
                break;
            case orgModel.UserWorkspacePermission.OWNER:
                permissionTooltip = "You are the Owner of this narrative; you may view, edit, run, and share it";
                label = (
                    <span>
                        Owner
                    </span>
                );
                break;
            default:
                label = (
                    <span>
                        Unknown
                    </span>
                );
        }

        return (
            <Fragment>
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
            </Fragment>
        );
    }

    renderPublicPermission(narrative: orgModel.NarrativeResource) {
        if (narrative.isPublic) {
            return (
                <Tooltip title="This narrative is viewable by all KBase users" placement="right">
                    <span style={{ cursor: 'help' }}>
                        <GlobalOutlined /> Public Narrative
                    </span>
                </Tooltip>
            );
        } else {
            return (
                <Tooltip title="This narrative is only accessible to those with whom it is directly shared" placement="right">
                    <span style={{ cursor: 'help' }}>
                        <LockOutlined /> Private Narrative
                    </span>
                </Tooltip>
            );
        }
    }

    renderNarrative() {
        const narrative = this.props.narrative;
        if (this.props.organization.isMember) {
            if (narrative.permission === orgModel.UserWorkspacePermission.NONE &&
                !narrative.isPublic) {
                return (
                    <Fragment>
                        <UILink hashPath={{pathname: `narrative/${narrative.workspaceId}`}}
                            newWindow={true}
                            className="title"
                        >
                            {narrative.title}
                        </UILink>
                        <div>{this.renderNarrativePermission(narrative)}</div>
                    </Fragment>
                );
            }
            return (
                <Narrative workspaceId={narrative.workspaceId} />
            );
        }
        return (
            <Narrative workspaceId={narrative.workspaceId} />
        );
    }

    renderResource() {
        return (
            <div>
                <div>
                    <span className="field-label">added</span>
                    <span>
                        <NiceElapsedTime time={this.props.narrative.createdAt} />
                    </span>
                </div>
            </div>
        );
    }

    render() {
        let accessModal;
        if (this.state.requestAccess) {
            // TODO: replace with our own implementation...n
            accessModal = (
                <Drawer title="Request Access to Narrative"
                    placement="right"
                    closable={true}
                    visible={true}
                    onClose={() => { this.onCloseRequestAccess.call(this); }}
                >
                    Requesting access...
                </Drawer>
            );
        }

        return (
            <div className="OrganizationNarrative">
                <div className="OrganizationNarrative-narrativeCol">
                    {this.renderNarrative()}
                </div>
                {/* <div className="OrganizationNarrative-resourceCol">
                    {this.renderResource()}
                </div> */}
                {accessModal}
            </div>
        );
    }
}