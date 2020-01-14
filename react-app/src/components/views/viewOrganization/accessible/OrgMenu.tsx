import * as React from 'react';
import * as orgModel from '../../../../data/models/organization/model';
import * as requestModel from '../../../../data/models/requests';
import { Button, Tooltip, Menu, Icon, Dropdown } from 'antd';
import { ViewOrgViewModel, SubViews } from '../../../../types';
import './OrgMenu.css';

export interface OrgMenuProps {
    viewModel: ViewOrgViewModel;
    onJoinOrg: () => void;
    onCancelJoinRequest: (requestId: requestModel.RequestID) => void;
    onAcceptInvitation: (requestId: requestModel.RequestID) => void;
    onRejectInvitation: (requestId: requestModel.RequestID) => void;
    onChangeSubView: (subView: SubViews) => void;
}

export interface OrgMenuState {

}

export default class OrgMenu extends React.Component<OrgMenuProps, OrgMenuState> {
    // Event handlers

    onJoinClick() {
        this.props.onJoinOrg();
    }

    onCancelJoinRequest() {
        const relation = this.props.viewModel.relation as orgModel.MembershipRequestPendingRelation;
        this.props.onCancelJoinRequest(relation.requestId);
    }

    onAcceptInvitation() {
        if (!this.props.viewModel.organization) {
            return;
        }
        const relation = this.props.viewModel.relation as orgModel.MembershipRequestPendingRelation;
        this.props.onAcceptInvitation(relation.requestId);
    }

    onRejectInvitation() {
        if (!this.props.viewModel.organization) {
            return;
        }
        const relation = this.props.viewModel.relation as orgModel.MembershipRequestPendingRelation;
        this.props.onRejectInvitation(relation.requestId);
    }

    onMenuClick({ key }: { key: string; }) {
        switch (key) {
            case 'manageMyMembership':
                this.props.onChangeSubView(SubViews.MANAGE_MEMBERSHIP);
                break;
            case 'editOrg':
                this.props.onChangeSubView(SubViews.EDIT_ORGANIZATION);
                break;
            case 'inviteUser':
                this.props.onChangeSubView(SubViews.INVITE_USER);
                break;
            case 'addNarrative':
                this.props.onChangeSubView(SubViews.ADD_NARRATIVE);
                break;
            case 'manageRelatedOrgs':
                this.props.onChangeSubView(SubViews.MANAGE_RELATED_ORGS);
                break;
            case 'addApp':
                this.props.onChangeSubView(SubViews.ADD_APP);
                break;
        }
    }

    // Renderers

    renderOrgMenu() {
        switch (this.props.viewModel.relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                return (
                    <Button
                        type="primary"
                        onClick={this.onJoinClick.bind(this)}>
                        Join this Organization
                        </Button>
                );
            case (orgModel.UserRelationToOrganization.VIEW):
                return (
                    <Button
                        type="primary"
                        onClick={this.onJoinClick.bind(this)}>
                        Join this Organization
                        </Button>
                );
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (
                    <Tooltip
                        placement="bottom"
                        mouseEnterDelay={0.5}
                        title="You have requested to join this Org; you may cancel your join request with this button"
                    >
                        <Button icon="delete" type="danger" onClick={this.onCancelJoinRequest.bind(this)}>Cancel Join Request</Button>
                    </Tooltip>

                );
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (
                    <div className="ViewOrganization-invitationPendingCard">
                        <span>You have been invited to this organization: </span>
                        <Button icon="check" type="default" size="small" onClick={this.onAcceptInvitation.bind(this)}>Accept</Button>
                        <Button icon="stop" type="danger" size="small" onClick={this.onRejectInvitation.bind(this)}>Reject</Button>
                    </div>
                );
            case (orgModel.UserRelationToOrganization.MEMBER):
                const menu = (
                    <Menu onClick={this.onMenuClick.bind(this)}>
                        <Menu.Item key="addApp">
                            <Icon type="appstore" />{' '}Associate Apps
                        </Menu.Item>
                        <Menu.Item key="addNarrative">
                            <Icon type="file" />{' '}Associate Narratives
                        </Menu.Item>
                        <Menu.Item key="manageMyMembership">
                            <Icon type="user" />{' '}Manage My Membership
                        </Menu.Item>

                    </Menu>
                );
                return (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Icon type="setting" theme="filled" className="IconButton OrgMenu-menuButton" />
                    </Dropdown>
                );
            case (orgModel.UserRelationToOrganization.ADMIN):
                const adminMenu = (
                    <Menu onClick={this.onMenuClick.bind(this)}>
                        <Menu.Item key="addApp">
                            <Icon type="appstore" />{' '}Associate Apps
                        </Menu.Item>
                        <Menu.Item key="addNarrative">
                            <Icon type="file" />{' '}Associate Narratives
                        </Menu.Item>
                        <Menu.Item key="editOrg" >
                            <Icon type="edit" />{' '}Edit this Org
                        </Menu.Item>
                        <Menu.Item key="inviteUser">
                            <Icon type="mail" />{' '}Invite User
                        </Menu.Item>
                        <Menu.Item key="manageMyMembership">
                            <Icon type="user" />{' '}Manage My Membership
                        </Menu.Item>
                        <Menu.Item key="manageRelatedOrgs">
                            <Icon type="team" />{' '}Manage Related Orgs
                        </Menu.Item>
                    </Menu>
                );
                return (
                    <Dropdown overlay={adminMenu} trigger={['click']}>
                        <Icon type="setting" theme="filled" className="IconButton OrgMenu-menuButton" />
                    </Dropdown>
                );
            case (orgModel.UserRelationToOrganization.OWNER):
                const ownerMenu = (
                    <Menu onClick={this.onMenuClick.bind(this)}>
                        <Menu.Item key="addApp">
                            <Icon type="appstore" />{' '}Associate Apps
                        </Menu.Item>
                        <Menu.Item key="addNarrative">
                            <Icon type="file" />{' '}Associate Narratives
                        </Menu.Item>
                        <Menu.Item key="editOrg">
                            <Icon type="edit" />{' '}Edit this Org
                        </Menu.Item>
                        <Menu.Item key="inviteUser">
                            <Icon type="mail" />{' '}Invite User
                        </Menu.Item>
                        <Menu.Item key="manageMyMembership">
                            <Icon type="user" />{' '}Manage My Membership
                        </Menu.Item>
                        <Menu.Item key="manageRelatedOrgs">
                            <Icon type="team" />{' '}Manage Related Orgs
                        </Menu.Item>
                    </Menu>
                );
                return (
                    <Dropdown overlay={ownerMenu} trigger={['click']}>
                        <Icon type="setting" theme="filled" className="IconButton OrgMenu-menuButton" />
                    </Dropdown>
                );
        }
    }

    render() {
        return (
            <div className="OrgMenu">
                {this.renderOrgMenu()}
            </div>
        );
    }
}