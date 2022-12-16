import {
  DeleteOutlined,
  EllipsisOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Dropdown, Input, Menu, Modal, Select } from "antd";
import { Component, Fragment } from "react";
import * as orgModel from "../../../../../data/models/organization/model";
import Member from "../../../../entities/MemberContainer";
import "./component.css";

export interface MembersProps {
  organization: orgModel.Organization;
  relation: orgModel.Relation;
  searchMembersBy: string;
  sortMembersBy: string;
  members: Array<orgModel.Member>;
  onPromoteMemberToAdmin: (username: string) => void;
  onRemoveMember: (username: string) => void;
  onDemoteAdminToMember: (username: string) => void;
  onSearchMembers: (searchBy: string) => void;
  onSortMembers: (sortBy: string) => void;
  onReloadOrg: (id: string) => void;
}

interface MembersState {
  confirmMemberRemoval: {
    member: orgModel.Member;
  } | null;
}

export default class Members extends Component<MembersProps, MembersState> {
  constructor(props: MembersProps) {
    super(props);
    this.state = {
      confirmMemberRemoval: null,
    };
  }

  onConfirmRemoveMember(member: orgModel.Member) {
    this.setState({
      confirmMemberRemoval: {
        member: member,
      },
    });
  }

  renderConfirmMemberRemoval() {
    if (!this.state.confirmMemberRemoval) {
      return;
    }
    const member = this.state.confirmMemberRemoval.member;
    const confirmed = () => {
      this.props.onRemoveMember(member.username);
      this.setState({
        confirmMemberRemoval: null,
      });
    };
    const canceled = () => {
      this.setState({
        confirmMemberRemoval: null,
      });
    };
    const title = "Confirm Removal of Member";
    const content = (
      <Fragment>
        <p>Please confirm removal of this member from this organization.</p>
        <div className="SimpleCard" style={{ marginBottom: "1em" }}>
          <Member member={member} avatarSize={20} />
        </div>
        <p>
          This user as well as members of this organization will receive a
          notification of the removal.
        </p>
        <p>
          Any Narratives associated by this member with this Organization will
          be unaffected. This member will also retain any Narrative permissions
          granted through this Organization.
        </p>
      </Fragment>
    );
    return (
      <Modal
        title={title}
        width="50em"
        visible={true}
        onOk={() => {
          confirmed();
        }}
        onCancel={() => {
          canceled();
        }}
        okText="Confirm"
      >
        {content}
      </Modal>
    );
  }

  onMemberMenu(key: React.Key, member: orgModel.Member) {
    switch (key) {
      case "promoteToAdmin":
        this.props.onPromoteMemberToAdmin(member.username);
        break;
      case "removeMember":
        this.onConfirmRemoveMember(member);
        break;
    }
  }

  onAdminMenu(key: React.Key, member: orgModel.Member) {
    switch (key) {
      case "demoteToMember":
        this.props.onDemoteAdminToMember(member.username);
        break;
    }
  }

  renderMemberMenu(member: orgModel.Member) {
    const menu = (
      <Menu
        onClick={({ key }) => {
          this.onMemberMenu.call(this, key, member);
        }}
      >
        <Menu.Item key="promoteToAdmin">
          <UnlockOutlined />
          Promote to Admin
        </Menu.Item>
        <Menu.Item key="removeMember">
          <DeleteOutlined />
          Remove Member
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

  renderAdminMenu(member: orgModel.Member) {
    const menu = (
      <Menu
        onClick={({ key }) => {
          this.onAdminMenu.call(this, key, member);
        }}
      >
        <Menu.Item key="demoteToMember">
          <UserOutlined />
          Demote to Member
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

  renderOwnerMenu(member: orgModel.Member) {
    return <div></div>;
  }

  renderMemberOptions(member: orgModel.Member) {
    if (
      !(
        this.props.relation.type ===
          orgModel.UserRelationToOrganization.OWNER ||
        this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN
      )
    ) {
      return;
    }

    switch (member.type) {
      case orgModel.MemberType.OWNER:
        return this.renderOwnerMenu(member);
      case orgModel.MemberType.ADMIN:
        return this.renderAdminMenu(member);
      case orgModel.MemberType.MEMBER:
        return this.renderMemberMenu(member);
    }
  }

  renderMembers() {
    let members: JSX.Element | Array<JSX.Element>;
    const message = (
      <div style={{ fontStyle: "italic", textAlign: "center" }}>No members</div>
    );

    if (this.props.members.length === 0) {
      members = <Alert type="info" message={message} />;
    } else {
      members = this.props.members
        .filter((member) => {
          return member.isVisible;
        })
        .map((member) => {
          let isNew: boolean;
          if (this.props.organization.lastVisitedAt === null) {
            isNew = false;
          } else {
            isNew =
              this.props.organization.lastVisitedAt.getTime() <
              member.joinedAt.getTime();
          }
          const classNames = ["Members-row", "SimpleCard"];
          if (isNew) {
            classNames.push("Members-newMember");
          }
          return (
            <div className={classNames.join(" ")} key={member.username}>
              <div className="Members-member">
                <Member member={member} avatarSize={50} />
              </div>
              <div className="Members-menu">
                {this.renderMemberOptions(member)}
              </div>
            </div>
          );
        });
    }

    return <div className="infoTable">{members}</div>;
  }

  renderSearchBar() {
    const doChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onSearchMembers(e.target.value);
    };
    return (
      <div style={{ paddingRight: "6px" }}>
        <Input
          allowClear
          style={{ width: "100%", marginRight: "6px" }}
          placeholder="Filter members by name"
          onChange={doChange}
        />
      </div>
    );
  }

  renderSortBar() {
    const handleSelect = (value: string) => {
      this.props.onSortMembers(value);
    };
    return (
      <Fragment>
        <span className="field-label">sort</span>
        <Select
          onChange={handleSelect}
          style={{ width: "10em" }}
          dropdownMatchSelectWidth={true}
          defaultValue={this.props.sortMembersBy}
        >
          <Select.Option value="name" key="name">
            Name
          </Select.Option>
          <Select.Option value="added" key="added">
            Date Joined
          </Select.Option>
        </Select>
      </Fragment>
    );
  }

  renderHeader() {
    return (
      <div className="ViewOrganizationMembers-headerRow">
        <div className="ViewOrganizationMembers-searchCol">
          {this.renderSearchBar()}
        </div>
        <div className="ViewOrganizationMembers-sortCol">
          {this.renderSortBar()}
        </div>
      </div>
    );
  }

  render() {
    let confirm;
    if (this.state.confirmMemberRemoval) {
      confirm = this.renderConfirmMemberRemoval();
    }
    return (
      <Fragment>
        <div className="ViewOrganizationMembers scrollable-flex-column">
          <div className="ViewOrganizationMembers-header">
            {this.renderHeader()}
          </div>
          <div className="ViewOrganizationMembers-body scrollable-flex-column">
            {this.renderMembers()}
          </div>
        </div>
        {confirm}
      </Fragment>
    );
  }
}
