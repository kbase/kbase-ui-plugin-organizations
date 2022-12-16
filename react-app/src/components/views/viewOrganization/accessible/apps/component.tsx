import {
  AppstoreOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Alert, Button, Dropdown, Input, Menu, Modal, Select } from "antd";
import { Component, Fragment } from "react";
import * as orgModel from "../../../../../data/models/organization/model";
import { View } from "../../../../entities/app/component";
import App from "../../../../entities/app/loader";
import "./component.css";

export interface AppsProps {
  organization: orgModel.Organization;
  apps: { sortBy: string; searchBy: string; apps: Array<orgModel.AppResource> };

  relation: orgModel.Relation;
  onAssociateApp: () => void;
  onRemoveApp: (appId: string) => void;
  onSearchApps: (searchBy: string) => void;
  onSortApps: (sortBy: string) => void;
}

interface AppsState {}

export default class Apps extends Component<AppsProps, AppsState> {
  doRemoveApp(appId: string) {
    const confirmed = () => {
      this.props.onRemoveApp(appId);
    };
    const message = (
      <Fragment>
        <p>Please confirm the removal of this App from this Organization.</p>
        {/* <p>
                    All Organization members and the App authors will receive a notification.
                </p> */}
      </Fragment>
    );
    Modal.confirm({
      title: "Confirm",
      content: message,
      width: "50em",
      okText: "Confirm",
      onOk: () => {
        confirmed();
      },
    });
  }

  renderButtonRow() {
    if (
      this.props.organization.isAdmin ||
      this.props.organization.isOwner ||
      this.props.organization.isMember
    ) {
      return (
        <Button
          size="small"
          className="Button-important"
          onClick={this.props.onAssociateApp.bind(this)}
        >
          <AppstoreOutlined type="appstore" />
          Associate Apps
        </Button>
      );
    }
  }

  renderSearchRow() {
    const doChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onSearchApps(e.target.value);
    };
    const handleSelect = (value: string) => {
      this.props.onSortApps(value);
    };
    return (
      <Fragment>
        <div className="Apps-searchInput">
          <Input
            allowClear
            placeholder="Filter apps by title or author"
            onChange={doChange}
          />
        </div>
        <div className="Apps-searchControls">
          <span className="field-label">sort</span>
          <Select
            style={{ width: "11em" }}
            dropdownMatchSelectWidth={true}
            defaultValue="dateAdded"
            onChange={handleSelect}
          >
            <Select.Option key="dateAdded" value="dateAdded">
              Date Added
            </Select.Option>
            <Select.Option key="name" value="name">
              Name
            </Select.Option>
          </Select>
        </div>
      </Fragment>
    );
  }

  renderAppMenu(app: orgModel.AppResource) {
    const relation = this.props.relation;
    let menu;
    switch (relation.type) {
      case orgModel.UserRelationToOrganization.NONE:
        // should never occur
        return;
      case orgModel.UserRelationToOrganization.VIEW:
      case orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING:
      case orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING:
      case orgModel.UserRelationToOrganization.MEMBER:
        return;
      case orgModel.UserRelationToOrganization.ADMIN:
      case orgModel.UserRelationToOrganization.OWNER:
        menu = (
          <Menu>
            <Menu.Item
              key="removeApp"
              onClick={() => this.doRemoveApp(app.appId)}
            >
              <DeleteOutlined style={{ color: "red" }} /> Remove App from
              Organization
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <EllipsisOutlined className="IconButton-hover" />
          </Dropdown>
        );
    }
  }

  renderBrowseRows() {
    if (this.props.apps.apps.length === 0) {
      return (
        <Alert
          type="info"
          message="No Apps are associated with this Organization"
        />
      );
    }

    const apps = this.props.apps.apps
      .filter((app) => {
        return app.isVisible;
      })
      .map((app, index) => {
        const menu = this.renderAppMenu(app);
        return (
          <div key={String(index)} className="Apps-appRow SimpleCard">
            <div className="Apps-appColumn">
              <App appId={app.appId} initialView={View.COMPACT} />
            </div>
            <div className="Apps-menuColumn">{menu}</div>
          </div>
        );
      });
    return <Fragment>{apps}</Fragment>;
  }

  render() {
    return (
      <div className="Apps">
        <div className="Apps-buttonRow">{this.renderButtonRow()}</div>
        <div className="Apps-searchRow">{this.renderSearchRow()}</div>
        <div className="Apps-browseRow">{this.renderBrowseRows()}</div>
      </div>
    );
  }
}
