import * as React from 'react'

import './component.css'

import { Button, Icon, Menu, Dropdown } from 'antd';
import MemberComponent from '../../entities/MemberContainer';
import * as orgModel from '../../../data/models/organization/model'

interface MemberRowProps {
    member: orgModel.Member,
    organization: orgModel.Organization,
    relation: orgModel.Relation,
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
            case orgModel.MemberType.MEMBER:
                return (
                    <Button
                        style={{ width: '100%' }}
                        disabled={!this.state.over}
                        onClick={() => { this.props.onPromoteMemberToAdmin(this.props.member.username) }}>
                        <Icon type="unlock" />Promote to Admin
                    </Button>
                )
            case orgModel.MemberType.ADMIN:
                return (
                    <Button
                        style={{ width: '100%' }}
                        disabled={!this.state.over}
                        onClick={() => { this.props.onDemoteAdminToMember(this.props.member.username) }}>
                        <Icon type="user" />Demote to Member
                </Button>
                )
            case orgModel.MemberType.OWNER:
                return
        }
    }

    renderMemberButtons(member: orgModel.Member) {
        if (!(this.props.relation.type === orgModel.UserRelationToOrganization.OWNER ||
            this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN)) {
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
                        onClick={() => { this.props.onRemoveMember(member.username) }}>
                        <Icon type="delete" />Remove from Org
                    </Button>
                </div>
                <div>
                    {this.renderPromoteButton()}
                </div>
            </div>
        )
    }

    onMemberMenu(key: string, member: orgModel.Member) {
        switch (key) {
            case 'promoteToAdmin':
                this.props.onPromoteMemberToAdmin(member.username)
                break
            case 'removeMember':
                this.props.onRemoveMember(member.username)
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
                    <Button icon="ellipsis" />
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
                    <Button icon="ellipsis" />
                </Dropdown>
            </div>
        )
    }

    renderOwnerMenu(member: orgModel.Member) {
        return
    }

    renderMemberOptions(member: orgModel.Member) {
        if (!(this.props.relation.type === orgModel.UserRelationToOrganization.OWNER ||
            this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN)) {
            return
        }

        switch (this.props.member.type) {
            case orgModel.MemberType.OWNER:
                return this.renderOwnerMenu(member)
            case orgModel.MemberType.ADMIN:
                return this.renderAdminMenu(member)
            case orgModel.MemberType.MEMBER:
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
            <div key={this.props.member.username}
                className="memberRow"
                onMouseEnter={this.onMouseOver.bind(this)}
                onMouseLeave={this.onMouseOut.bind(this)}>
                <div style={{ flex: '1 1 0px' }}>
                    <MemberComponent member={this.props.member} avatarSize={50} key={this.props.member.username} />
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