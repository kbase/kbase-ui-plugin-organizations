import { Alert, Button, Card, Modal, Tabs, Tooltip } from "antd";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { Component } from "react";

import {
  AppstoreOutlined,
  CloseOutlined,
  ExclamationCircleTwoTone,
  FileOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  MailOutlined,
  TeamOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import * as orgModel from "../../../../../../data/models/organization/model";
import * as requestModel from "../../../../../../data/models/requests";
import {
  SubViewKind,
  ViewAccessibleOrgViewModel,
} from "../../../../../../redux/store/types/views/Main/views/ViewOrg";
import Header from "../../../../../Header";
import UILink from '../../../../../UILink';
import Apps from "../../apps/component";
import Members from "../../members/reduxAdapter";
import Narratives from "../../narratives/component";
import Requests from "../../requests";
import "./component.css";
import RelatedOrganizations from "./tabs/RelatedOrganizations";

export interface OrgViewState {}

export interface OrgViewProps {
  viewModel: ViewAccessibleOrgViewModel;

  // Actions
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
  onSearchApps: (searchBy: string) => void;
  onSortApps: (sortBy: string) => void;

  // Navigation
  openSubview: (subView: SubViewKind) => void;
  navigateToBrowser: () => void;
}

class OrganizationView extends Component<OrgViewProps, OrgViewState> {
  constructor(props: OrgViewProps) {
    super(props);

    this.state = {};
  }

  onManageRelatedOrgs() {
    this.props.openSubview(SubViewKind.MANAGE_RELATED_ORGS);
    // this.setState({ subView: SubViewKind.MANAGE_RELATED_ORGS });
  }

  onInviteUser() {
    this.props.openSubview(SubViewKind.INVITE_USER);
    // this.setState({ subView: SubViewKind.INVITE_USER });
  }

  onAssociateApp() {
    this.props.openSubview(SubViewKind.ADD_APP);
    // this.setState({ subView: SubViewKind.ADD_APP });
  }

  doAddRelatedOrgs() {
    this.props.openSubview(SubViewKind.MANAGE_RELATED_ORGS);
    // this.setState({ subView: SubViewKind.MANAGE_RELATED_ORGS });
  }

  onRequestAddNarrative() {
    this.props.openSubview(SubViewKind.ADD_NARRATIVE);
    // this.setState({ subView: SubViewKind.ADD_NARRATIVE });
  }

  onViewMembers() {}

  onJoinClick() {
    this.props.onJoinOrg();
  }

  onCancelJoinRequest() {
    const relation = this.props.viewModel
      .relation as orgModel.MembershipRequestPendingRelation;
    this.props.onCancelJoinRequest(relation.requestId);
  }

  onAcceptInvitation() {
    if (!this.props.viewModel.organization) {
      return;
    }
    const relation = this.props.viewModel
      .relation as orgModel.MembershipRequestPendingRelation;
    this.props.onAcceptInvitation(relation.requestId);
  }

  onRejectInvitation() {
    if (!this.props.viewModel.organization) {
      return;
    }
    const relation = this.props.viewModel
      .relation as orgModel.MembershipRequestPendingRelation;
    this.props.onRejectInvitation(relation.requestId);
  }

  onRemoveNarrative(narrative: orgModel.NarrativeResource) {
    this.props.onRemoveNarrative(narrative);
  }

  onNarrativeMenu(key: string, narrative: orgModel.NarrativeResource) {
    switch (key) {
      case "removeNarrative":
        this.props.onRemoveNarrative(narrative);
        break;
    }
  }

  onShowInfo() {
    Modal.info({
      title: "View Organization Help",
      width: "50em",
      content: <div>Organization help here...</div>,
    });
  }

  isMember(): boolean {
    if (!this.props.viewModel.organization) {
      return false;
    }
    if (
      this.props.viewModel.relation.type ===
        orgModel.UserRelationToOrganization.OWNER ||
      this.props.viewModel.relation.type ===
        orgModel.UserRelationToOrganization.ADMIN ||
      this.props.viewModel.relation.type ===
        orgModel.UserRelationToOrganization.MEMBER
    ) {
      return true;
    }
    return false;
  }

  renderMembers() {
    if (!this.isMember()) {
      return (
        <Alert message="Membership is only available to members" type="info" />
      );
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
            <ExclamationCircleTwoTone twoToneColor="orange" /> group has{" "}
            <span style={{ fontWeight: "bold" }}>{requests.length}</span>{" "}
            pending request
            {requests.length > 1 ? "s" : ""} and{" "}
            <span style={{ fontWeight: "bold" }}>{invitations.length}</span>{" "}
            pending request
            {invitations.length > 1 ? "s" : ""}
          </div>
          <div>
            <UILink hashPath={{hash: `manageOrganizationRequests/${this.props.viewModel.organization.id}`}}>
              <Button>Manage Requests</Button>
            </UILink>
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

  renderGroupRequests(
    requests: Array<requestModel.Request>,
    invitations: Array<requestModel.Request>
  ) {
    if (!requests.length) {
      return <div className="message">No pending group requests</div>;
    } else {
      return (
        <div>
          <div>
            <ExclamationCircleTwoTone twoToneColor="orange" /> There{" "}
            {requests.length > 1 ? "are" : "is"}{" "}
            <span style={{ fontWeight: "bold" }}>{requests.length}</span>{" "}
            pending request
            {requests.length > 1 ? "s" : ""} and{" "}
            <span style={{ fontWeight: "bold" }}>{invitations.length}</span>{" "}
            pending invitation
            {invitations.length > 1 ? "s" : ""}
          </div>
          <div>
            <UILink hashPath={{hash: `manageOrganizationRequests/${this.props.viewModel.organization.id}`}}>
              <Button>Manage Requests</Button>
            </UILink>
          </div>
        </div>
      );
    }
  }

  renderRelationClass(relation: orgModel.Relation) {
    switch (relation.type) {
      case orgModel.UserRelationToOrganization.NONE:
        return "infoBox";
      case orgModel.UserRelationToOrganization.VIEW:
        return "infoBox";
      case orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING:
        return "infoBox relationRequestPending";
      case orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING:
        return "infoBox relationInvitationPending";
      case orgModel.UserRelationToOrganization.MEMBER:
        return "infoBox";
      case orgModel.UserRelationToOrganization.ADMIN:
        return "infoBox";
      case orgModel.UserRelationToOrganization.OWNER:
        return "infoBox";
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
        <UnlockOutlined /> group requests{" "}
        <span className="OrganizationView-titleCount">({count})</span>
      </span>
    );
    return (
      <div className="OrganizationView-adminTasksBox">
        <Card
          className="slimCard"
          headStyle={{ backgroundColor: "gray", color: "white" }}
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
    if (
      this.props.viewModel.relation.type !==
      orgModel.UserRelationToOrganization.VIEW
    ) {
      return;
    }
    return (
      <Button onClick={this.onJoinClick.bind(this)}>
        Join this Organization
      </Button>
    );
  }

  renderLoadingHeader() {
    const breadcrumbs = <span>Loading Org...</span>;
    return <Header breadcrumbs={breadcrumbs} />;
  }

  renderMembersTab() {
    return (
      <div className="OrganizationView-membersCol scrollable-flex-column">
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
          <div className="OrganizationView-tabPaneToolbar">
            <Tooltip
              placement="bottomRight"
              title="Invite one or more users to this organization"
            >
              <Button
                size="small"
                className="Button-important"
                onClick={this.onInviteUser.bind(this)}
              >
                <MailOutlined />
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
          <div className="OrganizationView-tabPaneToolbar">
            <Tooltip
              placement="bottomRight"
              title="Add one or more other organizations as 'related' to this one"
            >
              <Button
                size="small"
                className="Button-important"
                onClick={this.doAddRelatedOrgs.bind(this)}
              >
                <TeamOutlined />
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
          <>
            <Tooltip
              placement="bottomRight"
              title="Invite a user to this organization"
            >
              <Button size="small" onClick={this.onInviteUser.bind(this)}>
                <MailOutlined />
              </Button>
            </Tooltip>
          </>
        );
      case orgModel.UserRelationToOrganization.OWNER:
        return (
          <>
            <Tooltip
              placement="bottomRight"
              title="Invite a user to this organization"
            >
              <Button size="small" onClick={this.onInviteUser.bind(this)}>
                <MailOutlined />
              </Button>
            </Tooltip>
          </>
        );
    }
  }

  renderCombo() {
    const isAdmin =
      this.props.viewModel.relation.type ===
        orgModel.UserRelationToOrganization.ADMIN ||
      this.props.viewModel.relation.type ===
        orgModel.UserRelationToOrganization.OWNER;

    const isMember = this.props.viewModel.organization.isMember;

    const tabItems = [];

    let memberCount;
    if (this.props.viewModel.organization.memberCount - 1) {
      memberCount = String(this.props.viewModel.organization.memberCount - 1);
    } else {
      memberCount = "Ø";
    }

    tabItems.push({
      key: "members",
      label: (
        <span>
          <TeamOutlined />
          Members{" "}
          <span className="OrganizationView-tabCount">({memberCount})</span>
        </span>
      ),
      children: this.renderMembersTab(),
    });

    if (isMember) {
      if (isAdmin) {
        const totalRequestCount =
          this.props.viewModel.requestInbox.length +
          this.props.viewModel.requestOutbox.length;
        const totalRequests = (
          <span className="OrganizationView-tabCount">
            ({totalRequestCount || "Ø"})
          </span>
        );
        tabItems.push({
          key: "inbox",
          label: (
            <span>
              <InboxOutlined />
              Requests {totalRequests}{" "}
            </span>
          ),
          children: (
            <Requests
              inbox={this.props.viewModel.requestInbox}
              outbox={this.props.viewModel.requestOutbox}
              relation={this.props.viewModel.relation}
            />
          ),
        });
      } else {
        const outboxSize = this.props.viewModel.requestOutbox.length;
        let titleCount;
        if (outboxSize) {
          titleCount = String(outboxSize);
        } else {
          titleCount = "Ø";
        }
        tabItems.push({
          key: "outbox",
          label: (
            <span>
              <InboxOutlined />
              Requests{" "}
              <span className="OrganizationView-tabCount">({titleCount})</span>
            </span>
          ),
          children: (
            <Requests
              inbox={[]}
              outbox={this.props.viewModel.requestOutbox}
              relation={this.props.viewModel.relation}
            />
          ),
        });
      }
    }

    const relatedOrgCount =
      this.props.viewModel.organization.relatedOrganizations.length;
    // const relatedOrgTab = (
    //   <span>
    //     <TeamOutlined />
    //     Related Orgs{" "}
    //     <span className="OrganizationView-tabCount">({relatedOrgCount})</span>
    //   </span>
    // );
    tabItems.push({
      key: "relatedorgs",
      label: (
        <span>
          <TeamOutlined />
          Related Orgs{" "}
          <span className="OrganizationView-tabCount">({relatedOrgCount})</span>
        </span>
      ),
      children: (
        <>
          {this.renderRelatedOrgsToolbar()}
          <RelatedOrganizations
            relatedOrganizations={
              this.props.viewModel.organization.relatedOrganizations
            }
            organization={this.props.viewModel.organization}
            onManageRelatedOrgs={() => {
              this.onManageRelatedOrgs();
            }}
          />
        </>
      ),
    });

    return (
      <Tabs
        defaultActiveKey="members"
        className="OrganizationView-tabs FullHeightTabs"
        animated={false}
        size="small"
        tabPosition="top"
        items={tabItems}
      />
    );
  }

  renderMenuButtons() {
    return (
      <span className="ButtonSet">
        <span className="ButtonSet-button">
          <div
            className="IconButton"
            onClick={this.onNavigateToOrgsBrowser.bind(this)}
          >
            <CloseOutlined />
          </div>
        </span>
      </span>
    );
  }

  onNavigateToOrgsBrowser() {
    this.props.navigateToBrowser();
  }

  renderDescriptionTab() {
    if (!this.props.viewModel.organization) {
      return;
    }
    return (
      <div className="OrganizationView-org-description-org scrollable-flex-column">
        <div
          className="OrganizationView-org-description"
          // xss safe
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              marked.parse(this.props.viewModel.organization.description || "")
            ),
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
        relation={this.props.viewModel.relation}
        onAssociateApp={this.onAssociateApp.bind(this)}
        onRemoveApp={this.props.onRemoveApp}
        onSearchApps={this.props.onSearchApps}
        onSortApps={this.props.onSortApps}
      />
    );
  }

  renderMainTabs() {
    const tabList = [];

    const aboutTabTitle = (
      <span>
        <InfoCircleOutlined />
        About
      </span>
    );
    tabList.push({
      key: "about",
      label: aboutTabTitle,
      children: this.renderDescriptionTab(),
    });

    const narrativeCount = this.props.viewModel.narratives.narratives.length;
    const narrativesTabTitle = (
      <span>
        <FileOutlined />
        Narratives{" "}
        <span className="OrganizationView-tabCount">({narrativeCount})</span>
      </span>
    );

    tabList.push({
      key: "narratives",
      label: narrativesTabTitle,
      children: this.renderNarrativesTab(),
    });

    const appCount = this.props.viewModel.organization.appCount;
    const appsTabTitle = (
      <span>
        <AppstoreOutlined />
        Apps <span className="OrganizationView-tabCount">({appCount})</span>
      </span>
    );
    tabList.push({
      key: "apps",
      label: appsTabTitle,
      children: this.renderAppsTab(),
    });

    let defaultActiveKey: string;
    if (this.props.viewModel.organization.isMember) {
      defaultActiveKey = "narratives";
    } else {
      defaultActiveKey = "about";
    }

    return (
      <Tabs
        defaultActiveKey={defaultActiveKey}
        className="OrganizationView-tabs FullHeightTabs"
        animated={false}
        size="small"
        tabPosition="top"
        items={tabList}
      />
    );
  }

  render() {
    return (
      <div className="OrganizationView-mainRow xscrollable-flex-column">
        <div className="OrganizationView-mainColumn  scrollable-flex-column">
          {this.renderMainTabs()}
        </div>
        <div className="OrganizationView-infoColumn">{this.renderCombo()}</div>
      </div>
    );
  }
}

export default OrganizationView;
