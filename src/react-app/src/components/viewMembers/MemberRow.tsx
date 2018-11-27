import * as React from 'react'

import './component.css'

import { Member, Organization, UserRelationToOrganization, MemberType } from '../../types'
import { Button, Icon, Menu, Dropdown } from 'antd';
import MemberComponent from '../Member';

interface MemberRowProps {
    member: Member,
    organization: Organization,
    onPromoteMemberToAdmin: (memberUsername: string) => void,
    onDemoteAdminToMember: (adminUsername: string) => void,
    onRemoveMember: (memberUsername: string) => void
}

interface MemberRowState {
    over: boolean
}

class MemberRow extends React.Component<MemberRowProps, MemberRowState> {
    constructor(props: MemberRowProps) {
        super(props)
        this.state = {
            over: false
        }
    }

    renderPromoteButton() {
        switch (this.props.member.type) {
            case MemberType.MEMBER:
                return (
                    <Button
                        style={{ width: '100%' }}
                        disabled={!this.state.over}
                        onClick={() => { this.props.onPromoteMemberToAdmin(this.props.member.user.username) }}>
                        <Icon type="unlock" />Promote to Admin
                    </Button>
                )
            case MemberType.ADMIN:
                return (<Button
                    style={{ width: '100%' }}
                    disabled={!this.state.over}
                    onClick={() => { this.props.onDemoteAdminToMember(this.props.member.user.username) }}>
                    <Icon type="user" />Demote to Member
                </Button>
                )
            case MemberType.OWNER:
                return
        }

    }

    renderMemberButtons(member: Member) {
        if (!(this.props.organization.relation.type === UserRelationToOrganization.OWNER ||
            this.props.organization.relation.type === UserRelationToOrganization.ADMIN)) {
            return
        }
        // if (!this.state.over) {
        //     return
        // }
        return (
            <div>
                <div>
                    <Button
                        type="danger"
                        disabled={!this.state.over}
                        style={{ width: '100%' }}
                        onClick={() => { this.props.onRemoveMember(member.user.username) }}>
                        <Icon type="delete" />Remove from Org
                    </Button>
                </div>
                <div>
                    {this.renderPromoteButton()}
                </div>
            </div>
        )
    }

    renderMemberMenu(member: Member) {
        const menu = (
            <Menu>
                <Menu.Item key="promoteToAdmin" onClick={() => { this.props.onPromoteMemberToAdmin(member.user.username) }} >
                    <Icon type="unlock" />Promote to Admin
                </Menu.Item>
                <Menu.Item key="removeMember" type="danger" onClick={() => { this.props.onRemoveMember(member.user.username) }}>
                    <Icon type="delete" />Remove Member
                </Menu.Item>
            </Menu>
        )
        return (
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon="ellipsis" />
                </Dropdown>
            </div>
        )
    }

    renderAdminMenu(member: Member) {
        const menu = (
            <Menu>
                <Menu.Item key="demoteToMember" onClick={() => { this.props.onDemoteAdminToMember(member.user.username) }}>
                    <Icon type="user" />Demote to Member
                    </Menu.Item>
            </Menu>
        )
        return (
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon="ellipsis" />
                </Dropdown>
            </div>
        )
    }

    renderOwnerMenu(member: Member) {
        return
    }

    renderMemberOptions(member: Member) {
        if (!(this.props.organization.relation.type === UserRelationToOrganization.OWNER ||
            this.props.organization.relation.type === UserRelationToOrganization.ADMIN)) {
            return
        }

        switch (this.props.member.type) {
            case MemberType.OWNER:
                return this.renderOwnerMenu(member)
            case MemberType.ADMIN:
                return this.renderAdminMenu(member)
            case MemberType.MEMBER:
                return this.renderMemberMenu(member)
        }
    }

    onMouseOver() {
        this.setState({ over: true })
    }

    onMouseOut() {
        this.setState({ over: false })
    }

    render() {
        return (
            <div key={this.props.member.user.username}
                className="memberRow"
                onMouseEnter={this.onMouseOver.bind(this)}
                onMouseLeave={this.onMouseOut.bind(this)}>
                <div style={{ flex: '1 1 0px' }}>
                    <MemberComponent member={this.props.member} avatarSize={50} key={this.props.member.user.username} />
                </div>
                <div style={{ flex: '0 0 10em', textAlign: 'right' }}>
                    {/* {this.renderMemberButtons(this.props.member)} */}
                    {this.renderMemberOptions(this.props.member)}
                </div>
            </div>
        )
    }
}

export default MemberRow