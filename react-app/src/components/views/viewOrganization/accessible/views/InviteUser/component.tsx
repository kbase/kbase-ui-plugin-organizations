import { CrownOutlined, InboxOutlined, LockOutlined, MailOutlined, RollbackOutlined, SearchOutlined, StopOutlined, UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Tooltip } from 'antd';
import { Component, createRef } from 'react';
import * as orgModel from '../../../../../../data/models/organization/model';
import * as userModel from '../../../../../../data/models/user';
import { OrganizationUser, User } from '../../../../../../redux/store/types/common';
import { InviteUserViewState } from '../../../../../../redux/store/types/views/Main/views/ViewOrg/views/InviteUser';
import Avatar from '../../../../../entities/Avatar';
import UserEntityComponent from '../../../../../entities/UserWrappedContainer';
import MainMenu from '../../../../../menu/component';
import UserComponent from '../../../../../User';
import './component.css';

export interface InviteUserProps {
    organization: orgModel.Organization,
    selectedUser: {
        user: User,
        relation: orgModel.UserRelationToOrganization;
    } | null;
    editState: InviteUserViewState,
    users: Array<OrganizationUser> | null;
    onSearchUsers: (query: userModel.UserQuery) => void,
    onSelectUser: (username: string) => void,
    onSendInvitation: () => void;
    onFinish: () => void;
}

interface InviteUserState {
    autocompleteMessage: string;
}
class InviteUser extends Component<InviteUserProps, InviteUserState> {

    lastSearchAt: Date | null;

    static searchDebounce: number = 200;

    searchInput: React.RefObject<HTMLInputElement>;
    searchButton: React.RefObject<HTMLButtonElement>;

    constructor(props: InviteUserProps) {
        super(props);

        this.lastSearchAt = null;
        this.searchInput = createRef();
        this.searchButton = createRef();

        this.state = {
            autocompleteMessage: ''
        };
    }

    onClickCancelToViewer() {
        this.props.onFinish();
    }

    onSendInvitation() {
        this.props.onSendInvitation();
    }

    canSave() {
        if (this.props.selectedUser) {
            return true;
        }
        return false;
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let currentSearchInputValue;
        if (this.searchInput.current) {
            currentSearchInputValue = this.searchInput.current.value;
        } else {
            currentSearchInputValue = '';
        }
        this.doSearchUsers(currentSearchInputValue);
    }

    // TODO: disabled, but...
    onSearchInputChange() {
        // let currentSearchInputValue;
        // if (this.searchInput.current) {
        //     currentSearchInputValue = this.searchInput.current.value
        // } else {
        //     currentSearchInputValue = ''
        // }
        // // this.doSearchUsers(currentSearchInputValue)
    }

    doSearchUsers(value: string) {
        // if (value.length < 3) {
        //     this.setState({ autocompleteMessage: 'Search begins after 3 or more characters' })
        //     return
        // }
        // this.setState({ autocompleteMessage: '' })
        // build up list of users already owning, members of, or with membership pending.

        if (this.lastSearchAt === null ||
            (new Date().getTime() - this.lastSearchAt.getTime() > InviteUser.searchDebounce)) {
            this.lastSearchAt = new Date();
            this.props.onSearchUsers({
                query: value,
                excludedUsers: []
            });
        }
    }

    onSelectUser(user: OrganizationUser) {
        this.props.onSelectUser(user.username);
    }

    renderOrgName(name: string) {
        if (name.length < 25) {
            return name;
        }
        return (
            <span>
                {name.slice(0, 25)}
                …
            </span>
        );
    }

    renderUsers() {
        if (!this.props.users) {
            const message = 'Search for users by name or username to display a list of available users in this space.';
            return (
                <Alert type="info" message={message} showIcon />
            );
        }
        if (this.props.users.length === 0) {
            return (
                <Alert type="warning" message="No users found" showIcon />
            );
        }
        const renderUser = (user: userModel.User) => {
            // const tooltip = (
            //     <UserComponent user={user} avatarSize={30} />
            // );
            return (
                // <Tooltip title={tooltip}>
                <div className="InviteUser-name">
                    <Avatar user={user} size={20} /> {user.realname} ({user.username})
                    </div>
                // </Tooltip>
            );
        };
        return this.props.users.map((user) => {
            let statusIcon;
            let statusTooltip;
            // let statusIconColor = '#000';
            switch (user.relation) {
                case orgModel.UserRelationToOrganization.NONE:
                    // nothing
                    break;
                case orgModel.UserRelationToOrganization.MEMBER:
                    statusIcon = <UserOutlined />;
                    statusTooltip = 'This user is already a member of this Organization';
                    break;
                case orgModel.UserRelationToOrganization.ADMIN:
                    statusIcon = <LockOutlined />;
                    statusTooltip = 'This user is already an administrator of this Organization';
                    break;
                case orgModel.UserRelationToOrganization.OWNER:
                    statusIcon = <CrownOutlined />;
                    statusTooltip = 'This user is the owner of this organization';
                    break;
                case orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING:
                    statusIcon = <InboxOutlined style={{color: 'orange'}} />
                    statusTooltip = 'This user has already requested membership to this Organization (check your requests inbox)';
                    break;
                case orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING:
                    statusIcon = <MailOutlined  style={{color: 'orange'}}/>
                    statusTooltip = 'This user has already been invited to join this Organization';
                    break;
            }
            let statusIcon2;
            if (statusIcon) {
                statusIcon2 = (
                    <Tooltip title={statusTooltip}>
                        {statusIcon}
                    </Tooltip>
                );
            }
            const isSelected = (this.props.selectedUser && (user.username === this.props.selectedUser.user.username));
            let classes = ['InviteUser-userRow'];
            if (isSelected) {
                classes.push('InviteUser-selected');
            }
            return (
                <div
                    className={classes.join(' ')}
                    key={user.username}
                    onClick={() => { this.onSelectUser.call(this, user); }}>
                    <div className="InviteUser-statusCol">
                        {statusIcon2}
                    </div>
                    <div className="InviteUser-userCol">
                        <UserEntityComponent userId={user.username} render={renderUser} />
                    </div>
                </div>
            );
        });
    }

    renderOrgInfo() {
        return (
            <div className="orgInfo">
                <div className="InviteUser-name">
                    <span className="field-label">name</span>
                    <span>{this.props.organization.name}</span>
                </div>
                <div className="InviteUser-description">
                    <span className="field-label">description</span>
                    <span>{this.props.organization.description}</span>
                </div>
            </div>
        );
    }

    renderInvitationForm() {
        let button;
        let message;
        if (this.props.selectedUser) {
            if (this.props.selectedUser.relation === orgModel.UserRelationToOrganization.VIEW) {
                button = (
                    <Button
                        type="primary"
                        onClick={this.onSendInvitation.bind(this)}>Send Invitation</Button>
                );
            } else {
                button = (
                    <Button
                        disabled
                        type="primary"
                    >Send Invitation</Button>
                );
                // message = 'User is a member of this organization'
                message = (
                    <div>
                        User may not be invited because:<br />
                        {this.renderRelation(this.props.selectedUser.relation)}
                    </div>
                );
                message = (
                    <Alert
                        type="warning"
                        message={message}
                        showIcon
                    />
                );
            }
        } else {
            button = (
                <Button
                    disabled
                    type="primary"
                >Send Invitation</Button>
            );
            message = 'Please select a user';
        }
        return (
            <div className="invitationForm">
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    {button}
                </div>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    {message}
                </div>
            </div>
        );
    }

    renderInvitationStatus() {
        switch (this.props.editState) {
            case InviteUserViewState.NONE:
                return (
                    <div>NONE</div>
                );
            case InviteUserViewState.EDITING:
                return (
                    <div>EDITING</div>
                );
            case InviteUserViewState.SENDABLE:
                return (
                    <div>SENDABLE</div>
                );
            case InviteUserViewState.SENDING:
                return (
                    <div>SENDING</div>
                );
            case InviteUserViewState.SUCCESS:
                return (
                    <div>SENT SUCCESSFULLY</div>
                );
            case InviteUserViewState.ERROR:
                return (
                    <div>ERROR SENDING</div>
                );
            default:
                return (
                    <div>Bad State</div>
                );
        }
    }

    renderRelation(relation: orgModel.UserRelationToOrganization) {
        switch (relation) {
            case (orgModel.UserRelationToOrganization.NONE):
                return (
                    <span><StopOutlined />None</span>
                );
            case (orgModel.UserRelationToOrganization.VIEW):
                return (
                    <span><StopOutlined /> Not a member</span>
                );
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (<span><UserOutlined style={{ color: 'orange' }} /> User's membership <b>request</b> is pending</span>);
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (<span><UserOutlined style={{ color: 'blue' }} /> User has been <b>invited</b> to join</span>);
            case (orgModel.UserRelationToOrganization.MEMBER):
                return (<span><UserOutlined /> User is a <b>member</b> of this organization</span>);
            case (orgModel.UserRelationToOrganization.ADMIN):
                return (<span><UnlockOutlined />User is an <b>admin</b> of this organization</span>);
            case (orgModel.UserRelationToOrganization.OWNER):
                return (
                    <span><CrownOutlined /> User is the <b>owner</b> of this Organization</span>
                );
        }
    }

    renderSelectedUser() {
        if (this.props.selectedUser === null) {
            return (
                <div className="InviteUser-selectedUser">
                    <p className="InviteUser-noSelection">
                        No user yet selected
                    </p>
                </div>
            );
        } else {
            return (
                <div className="InviteUser-selectedUser">
                    <UserComponent user={this.props.selectedUser.user} />
                    {this.renderRelation(this.props.selectedUser.relation)}
                </div>
            );
        }
    }

    renderFooter() {
        return (
            <div className="InviteUser-footer">
            </div>
        );
    }

    renderSearchButton() {
        return (<SearchOutlined />);
    }

    renderMenuButtons() {
        return (
            <div className="ButtonSet">
                <div className="ButtonSet-button">
                    <Button icon={<RollbackOutlined />}
                        danger
                        onClick={this.onClickCancelToViewer.bind(this)}>
                        Done
                    </Button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="InviteUser scrollable-flex-column">
            <MainMenu buttons={this.renderMenuButtons()} />
                <div className="InviteUser-row scrollable-flex-column">
                    <div className="InviteUser-col1 -firstCol InviteUser-users scrollable-flex-column">
                        <h3>Select User to Invite</h3>
                        <form id="searchForm" className="InviteUser-searchBar"
                            onSubmit={this.onSubmit.bind(this)}>
                            <input
                                ref={this.searchInput}
                                autoFocus
                                onChange={this.onSearchInputChange.bind(this)}
                                placeholder="Search for a user"
                            />
                            <Button
                                className="InviteUser-searchButton"
                                form="searchForm"
                                key="submit"
                                htmlType="submit"
                            >
                                {this.renderSearchButton()}
                            </Button>
                        </form>
                        <div className="InviteUser-usersTable">
                            {this.renderUsers()}
                        </div>
                    </div>
                    <div className="InviteUser-col1 -lastCol">
                        <h3>Selected User</h3>
                        {this.renderSelectedUser()}
                        {this.renderInvitationForm()}
                    </div>
                </div>

                {this.renderFooter()}
            </div>
        );
    }
}

export default InviteUser;