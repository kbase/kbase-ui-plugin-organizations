import { ExclamationCircleTwoTone, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Modal, Tooltip } from "antd";
import { Component } from "react";
import * as orgModel from "../../../../data/models/organization/model";
import * as requestModel from "../../../../data/models/requests";
import {
  SubViewKind, ViewAccessibleOrgViewModel
} from "../../../../redux/store/types/views/Main/views/ViewOrg";
import { redirect } from "../../../../ui/utils";
import UILink from '../../../UILink';
import BriefOrganizationHeader from "./BriefOrganizationHeader";
import OrgMenu from "./OrgMenu";
import "./component.css";
import ManageRelatedOrganizations from "./manageRelatedOrganizations";
import Members from "./members/reduxAdapter";
import AddApps from "./views/AddApps";
import EditOrganization from "./views/EditOrganization";
import InviteUser from "./views/InviteUser/loader";
import ManageMembership from "./views/ManageMembership/loader";
import OrganizationView from "./views/OrganizationView/component";
import RequestAddNarrative from "./views/requestAddNarrative/loader";

enum NavigateTo {
  NONE = 0,
  VIEW_MEMBERS,
  MANAGE_REQUESTS,
  VIEW_ORGANIZATION,
  BROWSER,
}

export interface ViewOrganizationState {
  showInfo: boolean;
  navigateTo: NavigateTo;
  requestAccess: {
    narrative: orgModel.NarrativeResource | null;
  };
  subView: SubViewKind;
}

export interface ViewOrganizationProps {
  viewModel: ViewAccessibleOrgViewModel;
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
  subView: (subView: SubViewKind) => void;
  onSearchApps: (searchBy: string) => void;
  onSortApps: (sortBy: string) => void;
}

class ViewOrganization extends Component<
  ViewOrganizationProps,
  ViewOrganizationState
> {
  constructor(props: ViewOrganizationProps) {
    super(props);

    this.state = {
      showInfo: false,
      navigateTo: NavigateTo.NONE,
      requestAccess: {
        narrative: null,
      },
      subView: SubViewKind.NORMAL,
    };
  }

  onManageRelatedOrgs() {
    this.props.subView(SubViewKind.MANAGE_RELATED_ORGS);
  }

  onInviteUser() {
    this.props.subView(SubViewKind.INVITE_USER);
  }

  onAssociateApp() {
    this.props.subView(SubViewKind.ADD_APP);
  }

  doAddRelatedOrgs() {
    this.setState({ subView: SubViewKind.MANAGE_RELATED_ORGS });
  }

  onChangeSubView(subView: SubViewKind) {
    this.props.subView(subView);
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

  onRequestAddNarrative() {
    this.props.subView(SubViewKind.ADD_NARRATIVE);
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

  onRequestShare(narrative: orgModel.NarrativeResource) {
    this.setState({ requestAccess: { narrative: narrative } });
  }

  onCloseRequestAccess() {
    this.setState({ requestAccess: { narrative: null } });
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

  navigateToBrowser() {
    redirect("orgs");
    // this.setState({ navigateTo: NavigateTo.BROWSER });
  }

  navigateTo(navigateTo: NavigateTo) {
    this.setState({ navigateTo });
  }

  onFinishSubview() {
    this.props.subView(SubViewKind.NORMAL);
  }

  renderManageRelatedOrgsView() {
    return (
      <ManageRelatedOrganizations
        // organization={this.props.viewModel.organization}
        // relatedOrganizations={[]}
        // relation={this.props.viewModel.relation}
        onFinish={this.onFinishSubview.bind(this)}
      />
    );
  }

  renderInviteUsersView() {
    return (
      <InviteUser
        onFinish={this.onFinishSubview.bind(this)}
        organizationId={this.props.viewModel.organization.id}
      />
    );
  }

  renderManageMembership() {
    return (
      <ManageMembership
        onFinish={this.onFinishSubview.bind(this)}
        organizationId={this.props.viewModel.organization.id}
      />
    );
  }

  renderEditOrganization() {
    return (
      <EditOrganization
        onFinish={this.onFinishSubview.bind(this)}
        organizationId={this.props.viewModel.organization.id}
      />
    );
  }

  renderAddNarrative() {
    return (
      <RequestAddNarrative
        onFinish={this.onFinishSubview.bind(this)}
        organizationId={this.props.viewModel.organization.id}
      />
    );
  }

  renderAddApp() {
    return <AddApps onFinish={this.onFinishSubview.bind(this)} />;
  }

  renderOrganizationView() {
    return (
      <OrganizationView
        viewModel={this.props.viewModel}
        onAcceptInvitation={this.props.onAcceptInvitation}
        onAcceptRequest={this.props.onAcceptRequest}
        onCancelJoinRequest={this.props.onCancelJoinRequest}
        onGetViewAccess={this.props.onGetViewAccess}
        onJoinOrg={this.props.onJoinOrg}
        onRejectInvitation={this.props.onRejectInvitation}
        onReloadOrg={this.props.onReloadOrg}
        onRemoveApp={this.props.onRemoveApp}
        onRemoveNarrative={this.props.onRemoveNarrative}
        onSearchNarratives={this.props.onSearchNarratives}
        onSortNarratives={this.props.onSortNarratives}
        onSortApps={this.props.onSortApps}
        onSearchApps={this.props.onSearchApps}
        // openSubview={this.onChangeSubView.bind(this)}
        openSubview={this.props.subView}
        navigateToBrowser={this.navigateToBrowser.bind(this)}
      />
    );
  }

  renderSubView() {
    switch (this.props.viewModel.subView.kind) {
      case SubViewKind.MANAGE_RELATED_ORGS:
        return this.renderManageRelatedOrgsView();
      case SubViewKind.INVITE_USER:
        return this.renderInviteUsersView();
      case SubViewKind.ADD_NARRATIVE:
        return this.renderAddNarrative();
      case SubViewKind.ADD_APP:
        return this.renderAddApp();
      case SubViewKind.EDIT_ORGANIZATION:
        return this.renderEditOrganization();
      case SubViewKind.MANAGE_MEMBERSHIP:
        return this.renderManageMembership();
      case SubViewKind.NORMAL:
      default:
        return this.renderOrganizationView();
    }
  }

  render() {
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
            onNavigateToBrowser={this.navigateToBrowser.bind(this)}
          />
        </div>
        {this.renderSubView()}
      </div>
    );
  }
}

export default ViewOrganization;
