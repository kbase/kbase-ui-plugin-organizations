import * as React from 'react'
import * as orgModel from '../../../../../data/models/organization/model'
import { Alert, Card, Menu, Icon, Dropdown, Modal, Input, Select } from 'antd'
import Member from '../../../../entities/MemberContainer'
import './component.css'

export interface MembersProps {
    organization: orgModel.Organization
    relation: orgModel.Relation
    searchMembersBy: string
    sortMembersBy: string
    members: Array<orgModel.Member>
    onPromoteMemberToAdmin: (username: string) => void
    onRemoveMember: (username: string) => void
    onDemoteAdminToMember: (username: string) => void
    onSearchMembers: (searchBy: string) => void
    onSortMembers: (sortBy: string) => void
}

interface MembersState {
}

export default class Members extends React.Component<MembersProps, MembersState> {
    constructor(props: MembersProps) {
        super(props)
    }

    onConfirmRemoveMember(memberUsername: orgModel.Username) {
        const confirmed = (() => {
            this.props.onRemoveMember(memberUsername)
        })
        Modal.confirm({
            title: 'Really remove this user?',
            content: (
                <p>
                    This is not reversible.
                </p>
            ),
            width: '50em',
            onOk: () => {
                confirmed()
            }
        })
    }

    onMemberMenu(key: string, member: orgModel.Member) {
        switch (key) {
            case 'promoteToAdmin':
                this.props.onPromoteMemberToAdmin(member.username)
                break
            case 'removeMember':
                this.onConfirmRemoveMember(member.username)
                break
        }
    }

    onAdminMenu(key: string, member: orgModel.Member) {
        switch (key) {
            case 'demoteToMember':
                this.props.onDemoteAdminToMember(member.username)
                break
        }
    }

    renderMemberMenu(member: orgModel.Member) {
        const menu = (
            <Menu onClick={({ key }) => { this.onMemberMenu.call(this, key, member) }}>
                <Menu.Item key="promoteToAdmin" >
                    <Icon type="unlock" />Promote to Admin
                </Menu.Item>
                <Menu.Item key="removeMember" >
                    <Icon type="delete" />Remove Member
                </Menu.Item>
            </Menu>
        )
        return (
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Icon type="ellipsis" className="IconButton-hover" />
                </Dropdown>
            </div>
        )
    }

    renderAdminMenu(member: orgModel.Member) {
        const menu = (
            <Menu onClick={({ key }) => { this.onAdminMenu.call(this, key, member) }}>
                <Menu.Item key="demoteToMember">
                    <Icon type="user" />Demote to Member
                    </Menu.Item>
            </Menu>
        )
        return (
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Icon type="ellipsis" className="IconButton-hover" />
                </Dropdown>
            </div>
        )
    }

    renderOwnerMenu(member: orgModel.Member) {
        return (
            <div></div>
        )
    }

    renderMemberOptions(member: orgModel.Member) {
        if (!(this.props.relation.type === orgModel.UserRelationToOrganization.OWNER ||
            this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN)) {
            return
        }

        switch (member.type) {
            case orgModel.MemberType.OWNER:
                return this.renderOwnerMenu(member)
            case orgModel.MemberType.ADMIN:
                return this.renderAdminMenu(member)
            case orgModel.MemberType.MEMBER:
                return this.renderMemberMenu(member)
        }
    }

    renderMembers() {
        let members: JSX.Element | Array<JSX.Element>
        const message = (
            <div style={{ fontStyle: 'italic', textAlign: 'center' }}>
                No members.
            </div>
        )

        if (this.props.members.length === 0) {
            members = (
                <Alert type="info" message={message} />
            )
        } else {
            members = this.props.members.map((member) => {
                return (
                    <div className="Members-row simpleCard" key={member.username}>
                        <div className="Members-member">
                            <Member member={member} avatarSize={50} />
                        </div>
                        <div className="Members-menu">
                            {this.renderMemberOptions(member)}
                        </div>
                    </div>
                )
            })
        }

        return (
            <div className="infoTable">
                {members}
            </div>
        )
    }

    renderSearchBar() {
        const doChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.props.onSearchMembers(e.target.value)
            // console.log('sorting by', e.target.value)
        }
        return (
            <div style={{ paddingRight: '6px' }}>
                <Input style={{ width: '100%', marginRight: '6px' }}
                    placeholder="Filter members by name"
                    onChange={doChange} />
            </div>
        )
    }

    renderSortBar() {
        const handleSelect = (value: string) => {
            this.props.onSortMembers(value)
            // console.log('filtering by ', value)
        }

        return (
            <React.Fragment>
                <span className="field-label">sort</span>
                <Select onChange={handleSelect}
                    style={{ width: '10em' }}
                    dropdownMatchSelectWidth={true}
                    defaultValue={this.props.sortMembersBy}
                >
                    <Select.Option value="name" key="name">Name</Select.Option>
                    <Select.Option value="added" key="added">Date Joined</Select.Option>
                </Select>
            </React.Fragment>
        )
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
        )
    }

    render() {
        return (
            <div className="ViewOrganizationMembers scrollable-flex-column">
                <div className="ViewOrganizationMembers-header">
                    {this.renderHeader()}
                </div>
                <div className="ViewOrganizationMembers-body scrollable-flex-column">
                    {this.renderMembers()}
                </div>

            </div>
        )
    }
}