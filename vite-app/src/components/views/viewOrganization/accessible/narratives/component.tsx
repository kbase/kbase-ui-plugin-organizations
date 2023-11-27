import {
  DeleteOutlined,
  EllipsisOutlined,
  FolderOpenOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Alert, Button, Dropdown, Input, MenuProps, Modal, Select } from "antd";
import { Component, Fragment } from "react";
import * as orgModel from "../../../../../data/models/organization/model";
import OrganizationNarrative from "../../../../OrganizationNarrative";
import "./component.css";

export interface NarrativesProps {
  organization: orgModel.Organization;
  narratives: Array<orgModel.NarrativeResource>;
  relation: orgModel.Relation;
  sortNarrativesBy: string;
  searchNarrativesBy: string;
  onSortNarratives: (sortBy: string) => void;
  onSearchNarratives: (searchBy: string) => void;
  onRemoveNarrative: (narrative: orgModel.NarrativeResource) => void;
  onGetViewAccess: (narrative: orgModel.NarrativeResource) => void;
  onRequestAddNarrative: () => void;
}

interface NarrativesState {}

export default class Narratives extends Component<
  NarrativesProps,
  NarrativesState
> {
  onRequestAddNarrative() {
    this.props.onRequestAddNarrative();
  }

  onRemoveNarrative(narrative: orgModel.NarrativeResource) {
    const confirmed = () => {
      this.props.onRemoveNarrative(narrative);
    };
    const message = (
      <Fragment>
        <p>
          Please confirm the removal of this Narrative from this Organization.
        </p>
        <p>
          Any view permission granted to organization members will be unaffected
          by removing the Narrative.
        </p>
        {/* <p>
                    All Organization members and the Narrative owner will receive a notification.
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

  renderNarrativeMenu(narrative: orgModel.NarrativeResource) {
    const relation = this.props.relation;
    const items: MenuProps['items'] = [];
    switch (relation.type) {
      case orgModel.UserRelationToOrganization.NONE:
        // should never occur
        break;
      case orgModel.UserRelationToOrganization.VIEW:
      case orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING:
      case orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING:
      case orgModel.UserRelationToOrganization.MEMBER:
        break;
      case orgModel.UserRelationToOrganization.ADMIN:
      case orgModel.UserRelationToOrganization.OWNER:
        items.push({
          key: "removeNarrative",
          label: <span><DeleteOutlined style={{ color: "#f5222d" }} /> Remove Narrative from Organization</span>,
          onClick: () => {
            this.onRemoveNarrative(narrative);
          }
        })
    }
    if (items.length === 0) {
      return;
    }
    return (
      <Dropdown menu={{items}} trigger={["click"]}>
        <EllipsisOutlined className="IconButton-hover" />
      </Dropdown>
    );
  }

  renderSearchBar() {
    const doChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onSearchNarratives(e.target.value);
    };
    return (
      <div style={{ paddingRight: "6px" }}>
        <Input
          allowClear
          style={{ width: "100%", marginRight: "6px" }}
          placeholder="Filter narratives by title"
          onChange={doChange}
        />
      </div>
    );
  }

  renderSortBar() {
    const handleSelect = (value: string) => {
      this.props.onSortNarratives(value);
    };

    return (
      <Fragment>
        <span className="field-label">sort</span>
        <Select
          onChange={handleSelect}
          style={{ width: "11em" }}
          dropdownMatchSelectWidth={true}
          defaultValue={this.props.sortNarrativesBy}
        >
          <Select.Option value="name" key="name">
            Name
          </Select.Option>
          <Select.Option value="added" key="added">
            Date Added
          </Select.Option>
          <Select.Option value="changed" key="changed">
            Last Changed
          </Select.Option>
        </Select>
      </Fragment>
    );
  }

  renderMemberNarrativeRow(narrative: orgModel.NarrativeResource) {
    const lastOrgVisitAt = this.props.organization.lastVisitedAt;
    const addedAt = narrative.addedAt;
    let isNew;
    if (lastOrgVisitAt === null) {
      if (addedAt === null) {
        isNew = false;
      } else {
        isNew = false;
      }
    } else {
      if (addedAt === null) {
        isNew = false;
      } else {
        isNew = lastOrgVisitAt.getTime() < addedAt.getTime();
      }
    }
    const classNames = ["ViewOrganization-Narratives-narrative", "SimpleCard"];
    if (isNew) {
      classNames.push("ViewOrganization-Narratives-newNarrative");
    }
    return (
      <div className={classNames.join(" ")} key={String(narrative.workspaceId)}>
        <div className="ViewOrganization-Narratives-dataCol">
          <OrganizationNarrative
            narrative={narrative}
            organization={this.props.organization}
            onGetViewAccess={this.props.onGetViewAccess}
          />
        </div>
        <div className="ViewOrganization-Narratives-buttonCol">
          {this.renderNarrativeMenu(narrative)}
        </div>
      </div>
    );
  }

  renderMemberNarratives() {
    const extras = [
      <Button
        key="addNarrative"
        size="small"
        className="Button-important"
        onClick={this.onRequestAddNarrative.bind(this)}
      >
        <PlusOutlined /> Associate Narratives
      </Button>,
    ];

    // const rowRenderer: (props: ListRowProps) => React.ReactNode = ({
    //     key,
    //     index,
    //     isScrolling,
    //     isVisible,
    //     style
    // }: ListRowProps) => {
    //     return this.renderMemberNarrativeRow(this.props.narratives[index]);
    // };

    let narrativesTable;
    if (this.props.narratives.length === 0) {
      narrativesTable = (
        <Alert
          type="info"
          message="No Narratives are yet associated with this Organization"
        />
      );
    } else {
      narrativesTable = this.props.narratives
        .filter((narrative) => {
          return narrative.isVisible;
        })
        .map((narrative) => {
          return this.renderMemberNarrativeRow(narrative);
        });
    }

    return (
      <div className="ViewOrganization-Narratives scrollable-flex-column">
        <div className="ViewOrganization-Narratives-header">
          <div className="ViewOrganization-Narratives-headerCol1">{extras}</div>
        </div>
        <div className="ViewOrganization-Narratives-toolbar">
          <div className="ViewOrganization-Narratives-toolbar-searchCol">
            {this.renderSearchBar()}
          </div>
          <div className="ViewOrganization-Narratives-toolbar-sortCol">
            {this.renderSortBar()}
          </div>
        </div>
        <div className="ViewOrganization-Narratives-narrativesList">
          <div className="ViewOrganization-Narratives-narrativesTable">
            {narrativesTable}
          </div>
        </div>
      </div>
    );
  }

  renderNonMemberNarratives() {
    let alert;
    const narrativesToShow = this.props.organization.narratives.length;
    const hiddenNarrativeCount =
      this.props.organization.narrativeCount -
      this.props.organization.narratives.length;
    const alertStyle = {
      marginBottom: "10px",
    };
    if (narrativesToShow) {
      if (hiddenNarrativeCount) {
        const message = (
          <Fragment>
            <p>
              Since you are not a member of this Organization, only public
              Narratives are displayed.
            </p>
            <p>
              {hiddenNarrativeCount} private Narrative
              {hiddenNarrativeCount !== 1 ? "s have " : " has "} been hidden.
            </p>
          </Fragment>
        );
        alert = <Alert type="info" message={message} style={alertStyle} />;
      }
    } else {
      if (hiddenNarrativeCount) {
        const message = (
          <Fragment>
            <p>
              Since you are not a member of this Organization, only public
              Narratives would be displayed, but this Organization has none.
            </p>
            <p>
              {hiddenNarrativeCount} private Narrative
              {hiddenNarrativeCount !== 1 ? "s have " : " has "} been hidden.
            </p>
          </Fragment>
        );
        alert = <Alert type="info" message={message} style={alertStyle} />;
      } else {
        alert = (
          <Alert
            type="info"
            message="No Narratives are yet associated with this Organization"
            style={alertStyle}
          />
        );
      }
    }

    let narrativesTable;
    if (narrativesToShow) {
      narrativesTable = this.props.narratives
        .filter((narrative) => {
          return narrative.isVisible;
        })
        .map((narrative) => {
          // create buttons or not, depending on being an admin
          return (
            <div
              className="ViewOrganization-Narratives-narrative SimpleCard"
              key={String(narrative.workspaceId)}
            >
              <div className="ViewOrganization-Narratives-dataCol">
                <OrganizationNarrative
                  narrative={narrative}
                  organization={this.props.organization}
                  onGetViewAccess={this.props.onGetViewAccess}
                />
              </div>
              <div className="ViewOrganization-Narratives-buttonCol">
                {this.renderNarrativeMenu(narrative)}
              </div>
            </div>
          );
        });
    }

    // const narrativeCount = this.props.narratives.length
    const title = (
      <span className="ViewOrganization-Narratives-title">
        <FolderOpenOutlined style={{ marginRight: "8px" }} />
        Narratives{" "}
        <span className="ViewOrganization-Narratives-titleCount">
          ({this.props.organization.narrativeCount})
        </span>
      </span>
    );
    return (
      <div className="ViewOrganization-Narratives scrollable-flex-column">
        <div className="ViewOrganization-Narratives-header">
          <div className="ViewOrganization-Narratives-headerCol1">{title}</div>
          <div className="ViewOrganization-Narratives-headerCol2" />
        </div>
        <div className="ViewOrganization-Narratives-toolbar">
          <div className="ViewOrganization-Narratives-toolbar-searchCol">
            {this.renderSearchBar()}
          </div>
          <div className="ViewOrganization-Narratives-toolbar-sortCol">
            {this.renderSortBar()}
          </div>
        </div>
        <div className="ViewOrganization-Narratives-narrativesList">
          <div className="ViewOrganization-Narratives-table">
            {alert}
            {narrativesTable}
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.organization.isMember) {
      return this.renderMemberNarratives();
    } else {
      return this.renderNonMemberNarratives();
    }
  }
}
