import * as React from 'react';
import { Marked } from 'marked-ts';
import { NavLink, Redirect } from 'react-router-dom';
import { ViewOrgViewModel, SubViews } from '../../../../types';
import { Button, Modal, Icon, Tooltip, Card, Dropdown, Menu, Alert, Tabs } from 'antd';
import Header from '../../../Header';
import Members from './members/reduxAdapter';
import Requests from './requests/container';
import BriefOrganizationHeader from './BriefOrganizationHeader';
import RelatedOrganizations from './relatedOrgs/reduxAdapter';
import ManageRelatedOrganizations from './manageRelatedOrganizations/loader';
import InviteUser from './inviteUser/loader';
import Narratives from './narratives/component';
import ManageMembership from './manageMembership/loader';
import EditOrganization from './editOrganization/loader';
import RequestAddNarrative from './requestAddNarrative/loader';
import * as requestModel from '../../../../data/models/requests';
import * as orgModel from '../../../../data/models/organization/model';
import './component.css';
import OrgMenu from './OrgMenu';
import Apps from './apps/component';
import AddApps from './addApps/loader';

enum NavigateTo {
    NONE = 0,
    VIEW_MEMBERS,
    MANAGE_REQUESTS,
    VIEW_ORGANIZATION,
    BROWSER
}

enum AccordionState {
    UP = 0,
    DOWN
}

export interface ViewOrganizationState {
    showInfo: boolean;
    navigateTo: NavigateTo;
    requestAccess: {
        narrative: orgModel.NarrativeResource | null;
    };
    accordionState: AccordionState;
    subView: SubViews;
}

export interface ViewOrganizationProps {
    viewModel: ViewOrgViewModel;
    onViewOrg: (id: string) => void;
    onReloadOrg: (id: string) => void;
    onJoinOrg: () => void;
    onCancelJoinRequest: (requestId: requestModel.RequestID) => void;
    onAcceptInvitation: (requestId: requestModel.RequestID) => void;
    onRejectInvitation: (requestId: requestModel.RequestID) => void;
    onRemoveNarrative: (narrative: orgModel.NarrativeResource) => void;
    onGetViewAccess: (narrative: orgModel.NarrativeResource) => void;
    onAcceptRequest: (requestId: requestModel.RequestID) => void;
    onSortNarratives: (sortBy: string) => void;
    onSearchNarratives: (searchBy: string) => void;
    onRemoveApp: (appId: string) => void;
}

class ViewOrganization extends React.Component<ViewOrganizationProps, ViewOrganizationState> {
    constructor(props: ViewOrganizationProps) {
        super(props);

        this.state = {
            showInfo: false,
            navigateTo: NavigateTo.NONE,
            requestAccess: {
                narrative: null
            },
            accordionState: AccordionState.UP,
            subView: SubViews.NORMAL
        };
    }

    onManageRelatedOrgs() {
        this.setState({ subView: SubViews.MANAGE_RELATED_ORGS });
    }

    onInviteUser() {
        this.setState({ subView: SubViews.INVITE_USER });
    }

    onAssociateApp() {
        this.setState({ subView: SubViews.ADD_APP });
    }

    doAddRelatedOrgs() {
        this.setState({ subView: SubViews.MANAGE_RELATED_ORGS });
    }

    onChangeSubView(subView: SubViews) {
        this.setState({ subView });
    }

    onViewMembers() {}

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

    onRequestAddNarrative() {
        this.setState({ subView: SubViews.ADD_NARRATIVE });
    }

    onRemoveNarrative(narrative: orgModel.NarrativeResource) {
        this.props.onRemoveNarrative(narrative);
    }

    onNarrativeMenu(key: string, narrative: orgModel.NarrativeResource) {
        switch (key) {
            case 'removeNarrative':
                this.props.onRemoveNarrative(narrative);
                break;
        }
    }

    onShowInfo() {
        // this.setState({ showInfo: true })
        Modal.info({
            title: 'View Organization Help',
            width: '50em',
            content: <div>Organization help here...</div>
        });
    }

    onRequestShare(narrative: orgModel.NarrativeResource) {
        // Drawer.
        // Drawer.open({
        //     title: 'Request Access to Narrative',
        //     content: 'Are you sure?'
        // })
        this.setState({ requestAccess: { narrative: narrative } });
        // alert('not yet implemented')
    }

    onCloseRequestAccess() {
        this.setState({ requestAccess: { narrative: null } });
    }

    buildFooter() {
        return (
            <div>
                {this.renderEditRow()}
                {/* <p style={{ textAlign: 'center' }}>
                    You may also  <NavLink to={`/organizations`}><Button type="danger" icon="undo">Return to Orgs</Button></NavLink> to the organizations browser.
                </p> */}
            </div>
        );
    }

    renderEditRow() {
        if (
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.OWNER
        ) {
            return (
                <p style={{ textAlign: 'center' }}>
                    As the owner of this group, you may{' '}
                    <NavLink to={`/editOrganization/${this.props.viewModel.organization!.id}`}>
                        <Button icon="edit">Edit</Button>
                    </NavLink>{' '}
                    it.
                </p>
            );
        }
    }

    renderEditButton() {
        if (
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.OWNER
        ) {
            return (
                <NavLink to={`/editOrganization/${this.props.viewModel.organization!.id}`}>
                    <Button icon="edit">Edit This Organization</Button>
                </NavLink>
            );
        }
    }

    renderOrg() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.viewModel.organization) {
            return;
        }
        return (
            <div className="ViewOrganization-org-description-org scrollable-flex-column">
                <div
                    className="ViewOrganization-org-description"
                    dangerouslySetInnerHTML={{
                        __html: Marked.parse(this.props.viewModel.organization.description || '')
                    }}
                />
            </div>
        );
    }

    // TODO: this should be a component, so we can pick up all the good stuff, which is now commented out...
    renderOwnerInfo(org: orgModel.Organization) {
        return (
            <div className="ownerTable">
                <div className="proprietorCol">
                    <div className="owner">
                        <a href={'/#people/' + org.owner.username} target="_blank">
                            {org.owner.username}
                        </a>{' '}
                        ❨{org.owner.username}❩
                    </div>
                    {/* <div className="profileOrganization">
                        {org.owner.user.organization}
                    </div>
                    <div className="profileOrganization">
                        {org.owner.user.city}, {org.owner.user.state}, {org.owner.user.country}
                    </div> */}
                </div>
            </div>
        );
    }

    renderRelation(relation: orgModel.Relation) {
        switch (relation.type) {
            case orgModel.UserRelationToOrganization.NONE:
                return (
                    <span>
                        <Icon type="stop" />
                        None
                    </span>
                );
            case orgModel.UserRelationToOrganization.VIEW:
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are not a member of this org; you may request membership"
                    >
                        <div>
                            <Icon type="eye" style={{ marginRight: '4px' }} />
                            You are not a member of this Organization
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <Button onClick={this.onJoinClick.bind(this)}>Join this Organization</Button>
                        </div>
                    </Tooltip>
                );
            case orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING:
                return (
                    <div>
                        <div>
                            <Icon type="user" style={{ color: 'orange' }} spin={true} />
                            Your membership <b>request</b> is pending
                        </div>
                        <div>
                            <Button icon="delete" type="danger" onClick={this.onCancelJoinRequest.bind(this)}>
                                Cancel Request
                            </Button>
                        </div>
                    </div>
                );
            case orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING:
                return (
                    <div>
                        <div>
                            <Icon type="user" style={{ color: 'blue' }} />
                            You have been <b>invited</b> to join this Organization
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <Button icon="check" type="default" onClick={this.onAcceptInvitation.bind(this)}>
                                Accept Invitation
                            </Button>
                            <Button icon="stop" type="danger" onClick={this.onRejectInvitation.bind(this)}>
                                Reject Invitation
                            </Button>
                        </div>
                    </div>
                );
            case orgModel.UserRelationToOrganization.MEMBER:
                return (
                    <span>
                        <Icon type="user" />
                        Member
                    </span>
                );
            case orgModel.UserRelationToOrganization.ADMIN:
                return (
                    <span>
                        <Icon type="unlock" />
                        Admin
                    </span>
                );
            case orgModel.UserRelationToOrganization.OWNER:
                return (
                    <Tooltip placement="bottomRight" mouseEnterDelay={0.5} title="You own this org">
                        <span>
                            <Icon type="unlock" theme="filled" style={{ marginRight: '4px' }} />
                            You own this organization
                        </span>
                    </Tooltip>
                );
        }
    }

    isMember(): boolean {
        if (!this.props.viewModel.organization) {
            return false;
        }
        if (
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.OWNER ||
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.MEMBER
        ) {
            return true;
        }
        return false;
    }

    renderMembers() {
        if (!this.isMember()) {
            return <Alert message="Membership is only available to members" type="info" />;
        }
        return (
            <Members
                organization={this.props.viewModel.organization}
                relation={this.props.viewModel.relation}
                onReloadOrg={this.props.onReloadOrg}
            />
        );
    }

    renderGroupRequestsRow() {
        const relation = this.props.viewModel.relation;
        const requests = this.props.viewModel.groupRequests;
        const invitations = this.props.viewModel.groupInvitations;

        if (
            !(
                relation.type === orgModel.UserRelationToOrganization.ADMIN ||
                relation.type === orgModel.UserRelationToOrganization.OWNER
            )
        ) {
            return;
        }
        // TODO: bad. should not get here in this case...
        if (requests === null || invitations === null) {
            return;
        }
        let inner;
        if (requests.length) {
            inner = <div>group has no pending requests</div>;
        } else {
            inner = (
                <div>
                    <div>
                        <Icon type="exclamation-circle" theme="twoTone" twoToneColor="orange" /> group has{' '}
                        <span style={{ fontWeight: 'bold' }}>{requests.length}</span> pending request
                        {requests.length > 1 ? 's' : ''} and{' '}
                        <span style={{ fontWeight: 'bold' }}>{invitations.length}</span> pending request
                        {invitations.length > 1 ? 's' : ''}
                    </div>
                    <div>
                        <NavLink to={'/manageOrganizationRequests/' + this.props.viewModel.organization.id}>
                            <Button>Manage Requests</Button>
                        </NavLink>
                    </div>
                </div>
            );
        }
        return (
            <div className="row">
                <div className="col1">
                    <span className="label">admin</span>
                </div>
                <div className="col2">
                    <div className="relation">{inner}</div>
                </div>
            </div>
        );
    }

    renderGroupRequests(requests: Array<requestModel.Request>, invitations: Array<requestModel.Request>) {
        if (!requests.length) {
            return <div className="message">No pending group requests</div>;
        } else {
            return (
                <div>
                    <div>
                        <Icon type="exclamation-circle" theme="twoTone" twoToneColor="orange" /> There{' '}
                        {requests.length > 1 ? 'are' : 'is'}{' '}
                        <span style={{ fontWeight: 'bold' }}>{requests.length}</span> pending request
                        {requests.length > 1 ? 's' : ''} and{' '}
                        <span style={{ fontWeight: 'bold' }}>{invitations.length}</span> pending invitation
                        {invitations.length > 1 ? 's' : ''}
                    </div>
                    <div>
                        <NavLink to={'/manageOrganizationRequests/' + this.props.viewModel.organization!.id}>
                            <Button>Manage Requests</Button>
                        </NavLink>
                    </div>
                </div>
            );
        }
    }

    renderRelationClass(relation: orgModel.Relation) {
        switch (relation.type) {
            case orgModel.UserRelationToOrganization.NONE:
                return 'infoBox';
            case orgModel.UserRelationToOrganization.VIEW:
                return 'infoBox';
            case orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING:
                return 'infoBox relationRequestPending';
            case orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING:
                return 'infoBox relationInvitationPending';
            case orgModel.UserRelationToOrganization.MEMBER:
                return 'infoBox';
            case orgModel.UserRelationToOrganization.ADMIN:
                return 'infoBox';
            case orgModel.UserRelationToOrganization.OWNER:
                return 'infoBox';
        }
    }

    renderUserRelationship() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        return (
            <form className="infoTable">
                {/* <div className="row">
                    <div className="col1">
                        <span className="label">your relation</span>
                    </div>
                    <div className="col2">
                        <div className='relation'>
                            {this.renderRelation(this.props.organization)}
                        </div>
                    </div>
                </div> */}
                {this.renderGroupRequestsRow()}
            </form>
        );
    }

    renderAdminTasks() {
        const relation = this.props.viewModel.relation;
        if (
            !(
                relation.type === orgModel.UserRelationToOrganization.ADMIN ||
                relation.type === orgModel.UserRelationToOrganization.OWNER
            )
        ) {
            return;
        }
        // TODO: ditto -- silly to test both conditions (this is only to make TS happy btw)
        const { groupRequests, groupInvitations } = this.props.viewModel;
        if (groupInvitations === null || groupRequests === null) {
            return;
        }
        const count = groupRequests.length + groupInvitations.length;
        const title = (
            <span>
                <Icon type="unlock" /> group requests <span className="ViewOrganization-titleCount">({count})</span>
            </span>
        );
        return (
            <div className="ViewOrganization-adminTasksBox">
                <Card
                    className="slimCard ViewOrganization-adminTasksCard"
                    headStyle={{ backgroundColor: 'gray', color: 'white' }}
                    title={title}
                >
                    {this.renderGroupRequests(groupRequests, groupInvitations)}
                </Card>
            </div>
        );
    }

    renderJoinButton() {
        if (!this.props.viewModel.organization) {
            return;
        }
        if (this.props.viewModel.relation.type !== orgModel.UserRelationToOrganization.VIEW) {
            return;
        }
        return <Button onClick={this.onJoinClick.bind(this)}>Join this Organization</Button>;
    }

    renderLoadingHeader() {
        const breadcrumbs = <span>Loading Org...</span>;
        return <Header breadcrumbs={breadcrumbs} />;
    }

    renderMembersTab() {
        return (
            <div className="ViewOrganization-membersCol scrollable-flex-column">
                {this.renderMembersToolbar()}
                {this.renderMembers()}
            </div>
        );
    }

    onAcceptRequest(request: requestModel.Request) {
        this.props.onAcceptRequest(request.id);
    }

    renderMembersToolbar() {
        switch (this.props.viewModel.relation.type) {
            case orgModel.UserRelationToOrganization.NONE:
                return;
            case orgModel.UserRelationToOrganization.MEMBER:
                return;
            case orgModel.UserRelationToOrganization.ADMIN:
            case orgModel.UserRelationToOrganization.OWNER:
                return (
                    <div className="ViewOrganization-tabPaneToolbar">
                        <Tooltip placement="bottomRight" title="Invite one or more users to this organization">
                            <Button size="small" className="Button-important" onClick={this.onInviteUser.bind(this)}>
                                <Icon type="mail" />
                                Invite Users
                            </Button>
                        </Tooltip>
                    </div>
                );
        }
    }

    renderRelatedOrgsToolbar() {
        switch (this.props.viewModel.relation.type) {
            case orgModel.UserRelationToOrganization.NONE:
                return;
            case orgModel.UserRelationToOrganization.MEMBER:
                return;
            case orgModel.UserRelationToOrganization.ADMIN:
            case orgModel.UserRelationToOrganization.OWNER:
                return (
                    <div className="ViewOrganization-tabPaneToolbar">
                        <Tooltip
                            placement="bottomRight"
                            title="Add one or more other organizations as 'related' to this one"
                        >
                            <Button
                                size="small"
                                className="Button-important"
                                onClick={this.doAddRelatedOrgs.bind(this)}
                            >
                                <Icon type="team" />
                                Add Related Orgs
                            </Button>
                        </Tooltip>
                    </div>
                );
        }
    }

    renderToolbarButtons() {
        switch (this.props.viewModel.relation.type) {
            case orgModel.UserRelationToOrganization.NONE:
                return;
            case orgModel.UserRelationToOrganization.MEMBER:
                return;
            case orgModel.UserRelationToOrganization.ADMIN:
                return (
                    <React.Fragment>
                        <Tooltip placement="bottomRight" title="Invite a user to this organization">
                            <Button size="small" onClick={this.onInviteUser.bind(this)}>
                                <Icon type="mail" />
                            </Button>
                        </Tooltip>
                    </React.Fragment>
                );
            case orgModel.UserRelationToOrganization.OWNER:
                return (
                    <React.Fragment>
                        <Tooltip placement="bottomRight" title="Invite a user to this organization">
                            <Button size="small" onClick={this.onInviteUser.bind(this)}>
                                <Icon type="mail" />
                            </Button>
                        </Tooltip>
                    </React.Fragment>
                );
        }
    }

    renderCombo() {
        const isAdmin =
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.OWNER;

        const isMember = this.props.viewModel.organization.isMember;

        // if (!isMember) {
        //     return (
        //         <p style={{ fontStyle: 'italic' }}>
        //             The membership list is only available to members.
        //         </p>
        //     )
        // }

        const tabs = [];

        let memberCount;
        if (this.props.viewModel.organization.memberCount - 1) {
            memberCount = String(this.props.viewModel.organization.memberCount - 1);
        } else {
            memberCount = 'Ø';
        }
        tabs.push(
            <Tabs.TabPane
                tab={
                    <span>
                        <Icon type="team" />
                        Members <span className="ViewOrganization-tabCount">({memberCount})</span>
                    </span>
                }
                key="members"
                style={{ flexDirection: 'column' }}
            >
                {this.renderMembersTab()}
            </Tabs.TabPane>
        );

        if (isMember) {
            if (isAdmin) {
                const totalRequestCount =
                    this.props.viewModel.requestInbox.length + this.props.viewModel.requestOutbox.length;
                const totalRequests = <span className="ViewOrganization-tabCount">({totalRequestCount || 'Ø'})</span>;
                tabs.push(
                    <Tabs.TabPane
                        tab={
                            <span>
                                <Icon type="inbox" />
                                Requests {totalRequests}{' '}
                            </span>
                        }
                        key="inbox"
                        style={{ flexDirection: 'column' }}
                    >
                        <Requests
                            inbox={this.props.viewModel.requestInbox}
                            outbox={this.props.viewModel.requestOutbox}
                            relation={this.props.viewModel.relation}
                        />
                    </Tabs.TabPane>
                );
            } else {
                const outboxSize = this.props.viewModel.requestOutbox.length;
                let titleCount;
                if (outboxSize) {
                    titleCount = String(outboxSize);
                } else {
                    titleCount = 'Ø';
                }
                tabs.push(
                    <Tabs.TabPane
                        tab={
                            <span>
                                <Icon type="inbox" />
                                Requests <span className="ViewOrganization-tabCount">({titleCount})</span>
                            </span>
                        }
                        key="outbox"
                        style={{ flexDirection: 'column' }}
                    >
                        <Requests
                            inbox={[]}
                            outbox={this.props.viewModel.requestOutbox}
                            relation={this.props.viewModel.relation}
                        />
                    </Tabs.TabPane>
                );
            }
        }

        const relatedOrgCount = this.props.viewModel.organization.relatedOrganizations.length;
        const relatedOrgTab = (
            <span>
                <Icon type="team" />
                Related Orgs <span className="ViewOrganization-tabCount">({relatedOrgCount})</span>
            </span>
        );
        tabs.push(
            <Tabs.TabPane tab={relatedOrgTab} key="relatedorgs" style={{ flexDirection: 'column' }}>
                {this.renderRelatedOrgsToolbar()}
                <RelatedOrganizations
                    relatedOrganizations={this.props.viewModel.organization.relatedOrganizations}
                    organization={this.props.viewModel.organization}
                    onManageRelatedOrgs={() => {
                        this.onManageRelatedOrgs();
                    }}
                />
            </Tabs.TabPane>
        );

        return (
            <Tabs
                defaultActiveKey="members"
                className="ViewOrganization-tabs"
                animated={false}
                size="small"
                tabPosition="top"
            >
                {tabs}
            </Tabs>
        );
    }

    renderMenuButtons() {
        return (
            <span className="ButtonSet">
                <span className="ButtonSet-button">
                    <div className="IconButton" onClick={this.onNavigateToBrowser.bind(this)}>
                        <Icon type="close" />
                    </div>
                    {/* <Button type="default" onClick={this.onNavigateToBrowser.bind(this)} >
                        <Icon type="close" />{' '}Back
                    </Button> */}
                </span>
            </span>
        );
    }

    onNavigateToBrowser() {
        this.setState({ navigateTo: NavigateTo.BROWSER });
    }

    onMenuClick({ key }: { key: string }) {
        switch (key) {
            case 'manageMyMembership':
                this.setState({ subView: SubViews.MANAGE_MEMBERSHIP });
                break;
            case 'viewMembers':
                this.setState({ navigateTo: NavigateTo.VIEW_MEMBERS });
                break;
            case 'editOrg':
                this.setState({ subView: SubViews.EDIT_ORGANIZATION });
                break;
            case 'inviteUser':
                this.setState({ subView: SubViews.INVITE_USER });
                break;
            case 'manageRequests':
                this.setState({ navigateTo: NavigateTo.MANAGE_REQUESTS });
                break;
            case 'addNarrative':
                this.setState({ subView: SubViews.ADD_NARRATIVE });
                break;
            case 'addApp':
                this.setState({ subView: SubViews.ADD_APP });
                break;
            case 'manageRelatedOrgs':
                this.setState({ subView: SubViews.MANAGE_RELATED_ORGS });
                break;
        }
    }

    toggleAccordion() {
        this.setState({
            accordionState: this.state.accordionState === AccordionState.UP ? AccordionState.DOWN : AccordionState.UP
        });
    }

    renderAccordionControl() {
        let iconType;
        if (this.state.accordionState === AccordionState.UP) {
            iconType = 'caret-down';
        } else {
            iconType = 'caret-up';
        }
        return (
            <div className="ViewOrganization-accordion" onClick={this.toggleAccordion.bind(this)}>
                <div className="ViewOrganization-accordionCol1">
                    <div className="ViewOrganization-accordionRow1" />
                    <div className="ViewOrganization-accordionRow2" />
                    <div className="ViewOrganization-accordionRow3" />
                </div>
                <div className="ViewOrganization-accordionCol2">
                    <div className="ViewOrganization-accordionRow1" />
                    <div className="ViewOrganization-accordionRow2">
                        <Icon type={iconType} />
                    </div>
                    <div className="ViewOrganization-accordionRow3" />
                    {/* <div className="ViewOrganization-accordionIcon">
                        <Icon type={iconType} />
                    </div> */}
                </div>
                <div className="ViewOrganization-accordionCol3">
                    <div className="ViewOrganization-accordionRow1" />
                    <div className="ViewOrganization-accordionRow2" />
                    <div className="ViewOrganization-accordionRow3" />
                </div>
            </div>
        );
    }

    renderDescriptionTab() {
        if (!this.props.viewModel.organization) {
            return;
        }
        return (
            <div className="ViewOrganization-org-description-org scrollable-flex-column">
                <div
                    className="ViewOrganization-org-description"
                    dangerouslySetInnerHTML={{
                        __html: Marked.parse(this.props.viewModel.organization.description || '')
                    }}
                />
            </div>
        );
    }

    renderNarrativesTab() {
        return (
            <Narratives
                organization={this.props.viewModel.organization}
                narratives={this.props.viewModel.narratives.narratives}
                relation={this.props.viewModel.relation}
                sortNarrativesBy={this.props.viewModel.narratives.sortBy}
                searchNarrativesBy={this.props.viewModel.narratives.searchBy}
                onSortNarratives={this.props.onSortNarratives}
                onSearchNarratives={this.props.onSearchNarratives}
                onRemoveNarrative={this.props.onRemoveNarrative}
                onGetViewAccess={this.props.onGetViewAccess}
                onRequestAddNarrative={this.onRequestAddNarrative.bind(this)}
            />
        );
    }

    renderAppsTab() {
        return (
            <Apps
                organization={this.props.viewModel.organization}
                apps={this.props.viewModel.apps}
                onAssociateApp={this.onAssociateApp.bind(this)}
                onRemoveApp={this.props.onRemoveApp.bind(this)}
            />
        );
    }

    renderMainTabs() {
        const tabs = [];

        const aboutTabTitle = (
            <span>
                <Icon type="info-circle" />
                About
            </span>
        );
        tabs.push(
            <Tabs.TabPane tab={aboutTabTitle} key="about" style={{ flexDirection: 'column' }}>
                {this.renderDescriptionTab()}
            </Tabs.TabPane>
        );

        const narrativeCount = this.props.viewModel.narratives.narratives.length;
        const narrativesTabTitle = (
            <span>
                <Icon type="file" />
                Narratives <span className="ViewOrganization-tabCount">({narrativeCount})</span>
            </span>
        );

        tabs.push(
            <Tabs.TabPane tab={narrativesTabTitle} key="narratives" style={{ flexDirection: 'column' }}>
                {this.renderNarrativesTab()}
            </Tabs.TabPane>
        );

        const appCount = this.props.viewModel.organization.appCount;
        const appsTabTitle = (
            <span>
                <Icon type="appstore" />
                Apps <span className="ViewOrganization-tabCount">({appCount})</span>
            </span>
        );
        tabs.push(
            <Tabs.TabPane tab={appsTabTitle} key="apps" style={{ flexDirection: 'column' }}>
                {this.renderAppsTab()}
            </Tabs.TabPane>
        );

        let defaultActiveKey: string;
        if (this.props.viewModel.organization.isMember) {
            defaultActiveKey = 'narratives';
        } else {
            defaultActiveKey = 'about';
        }

        return (
            <Tabs
                defaultActiveKey={defaultActiveKey}
                className="ViewOrganization-tabs"
                animated={false}
                size="small"
                tabPosition="top"
            >
                {tabs}
            </Tabs>
        );
    }

    renderNormalView() {
        return (
            <div className="ViewOrganization-mainRow scrollable-flex-column">
                <div className="ViewOrganization-mainColumn  scrollable-flex-column">{this.renderMainTabs()}</div>
                <div className="ViewOrganization-infoColumn">{this.renderCombo()}</div>
            </div>
        );
    }

    renderManageRelatedOrgsView() {
        const onFinish = () => {
            this.setState({
                subView: SubViews.NORMAL
            });
        };
        return (
            <ManageRelatedOrganizations
                // organization={this.props.viewModel.organization}
                // relatedOrganizations={[]}
                // relation={this.props.viewModel.relation}
                onFinish={onFinish}
            />
        );
    }

    renderInviteUsersView() {
        const onFinish = () => {
            this.setState({
                subView: SubViews.NORMAL
            });
        };
        return <InviteUser onFinish={onFinish} organizationId={this.props.viewModel.organization.id} />;
    }

    renderManageMembership() {
        const onFinish = () => {
            this.setState({
                subView: SubViews.NORMAL
            });
        };
        return <ManageMembership onFinish={onFinish} organizationId={this.props.viewModel.organization.id} />;
    }

    renderEditOrganization() {
        const onFinish = () => {
            this.setState({
                subView: SubViews.NORMAL
            });
        };
        return <EditOrganization onFinish={onFinish} organizationId={this.props.viewModel.organization.id} />;
    }

    renderAddNarrative() {
        const onFinish = () => {
            this.setState({
                subView: SubViews.NORMAL
            });
        };
        return <RequestAddNarrative onFinish={onFinish} organizationId={this.props.viewModel.organization.id} />;
    }

    renderAddApp() {
        const onFinish = () => {
            this.setState({
                subView: SubViews.NORMAL
            });
        };
        return <AddApps onFinish={onFinish} />;
    }

    getSubView() {
        switch (this.state.subView) {
            case SubViews.MANAGE_RELATED_ORGS:
                return this.renderManageRelatedOrgsView();
            case SubViews.INVITE_USER:
                return this.renderInviteUsersView();
            case SubViews.MANAGE_MEMBERSHIP:
                return this.renderManageMembership();
            case SubViews.EDIT_ORGANIZATION:
                return this.renderEditOrganization();
            case SubViews.ADD_NARRATIVE:
                return this.renderAddNarrative();
            case SubViews.ADD_APP:
                return this.renderAddApp();
            case SubViews.NORMAL:
            default:
                return this.renderNormalView();
        }
    }

    render() {
        switch (this.state.navigateTo) {
            case NavigateTo.BROWSER:
                return <Redirect push to={'/organizations'} />;
            case NavigateTo.NONE:
            default:
            // do nothing.
        }

        const uorg = this.props.viewModel.organization as unknown;
        const borg = uorg as orgModel.BriefOrganization;

        // TODO: only doing this here so I don't have to do a redux adapter for the menu today...

        const orgMenu = (
            <OrgMenu
                viewModel={this.props.viewModel}
                onJoinOrg={this.props.onJoinOrg}
                onCancelJoinRequest={this.props.onCancelJoinRequest}
                onAcceptInvitation={this.props.onAcceptInvitation}
                onRejectInvitation={this.props.onRejectInvitation}
                onChangeSubView={this.onChangeSubView.bind(this)}
            />
        );

        return (
            <div className="ViewOrganization  scrollable-flex-column">
                <div className="ViewOrganization-organizationBox">
                    <BriefOrganizationHeader
                        organization={borg}
                        openRequestsStatus={this.props.viewModel.openRequest}
                        orgMenu={orgMenu}
                        onNavigateToBrowser={this.onNavigateToBrowser.bind(this)}
                    />
                </div>
                {this.getSubView()}
            </div>
        );
    }
}

export default ViewOrganization;
