import { DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Alert, Button, Dropdown, Menu } from "antd";
import { Component } from "react";
import * as orgModel from "../../../../../../../../data/models/organization/model";
import OrganizationEntity from "../../../../../../../entities/organization/loader";
import "./component.css";

export interface RelatedOrganizationsProps {
  organization: orgModel.Organization;
  relatedOrganizations: Array<orgModel.OrganizationID>;
  onManageRelatedOrgs: () => void;
  onRemoveRelatedOrganization: (
    organizationId: orgModel.OrganizationID,
    relatedOrganizationId: orgModel.OrganizationID
  ) => void;
}

interface RelatedOrganizationsState {}

export default class RelatedOrganizations extends Component<
  RelatedOrganizationsProps,
  RelatedOrganizationsState
> {
  onManageRelatedOrgs() {
    this.props.onManageRelatedOrgs();
  }

  renderToolbar() {
    return (
      <div className="RelatedOrganizations-toolbar">
        <Button onClick={this.onManageRelatedOrgs.bind(this)}>
          Add Related Org
        </Button>
      </div>
    );
  }

  onAdminMenu(key: React.Key, organizationId: orgModel.OrganizationID) {
    switch (key) {
      case "removeRelation":
        // this.props.onDemoteAdminToMember(member.username)
        this.props.onRemoveRelatedOrganization(
          this.props.organization.id,
          organizationId
        );
        // window.alert('will remove relation for org: ' + organizationId)
        break;
    }
  }

  renderControls(organizationId: orgModel.OrganizationID) {
    if (!this.props.organization.isAdmin) {
      return;
    }
    const menu = (
      <Menu
        onClick={({ key }) => {
          this.onAdminMenu.call(this, key, organizationId);
        }}
      >
        <Menu.Item key="removeRelation">
          <DeleteOutlined />
          Remove
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <EllipsisOutlined className="IconButton-hover" />
        </Dropdown>
      </div>
    );
  }

  renderBody() {
    if (this.props.relatedOrganizations.length === 0) {
      const message = <p>No related organizations</p>;
      return <Alert type="info" message={message} />;
    }
    // const Wrapped = withRouter<any, any>(OrganizationEntity);
    const relatedOrgs = this.props.relatedOrganizations.map(
      (organizationId: string) => {
        return (
          <div
            key={organizationId}
            className="RelatedOrganizations-orgRow SimpleCard"
          >
            {/* <RelatedOrganization organizationId={org} /> */}

            <div className="RelatedOrganizations-orgCol">
              <OrganizationEntity organizationId={organizationId} />
            </div>
            <div className="RelatedOrganizations-controlCol">
              {this.renderControls(organizationId)}
            </div>
          </div>
        );
      }
    );
    return (
      <div className="RelatedOrganizations-organizations">{relatedOrgs}</div>
    );
  }

  render() {
    return (
      <div className="RelatedOrganizations scrollable-flex-column">
        {/* <div className="RelatedOrganizations-toolbarRow">
                    {this.renderToolbar()}
                </div> */}
        <div className="RelatedOrganizations-bodyRow scrollable-flex-column">
          {this.renderBody()}
        </div>
      </div>
    );
  }
}
