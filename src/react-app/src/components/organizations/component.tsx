import * as React from 'react';
import './component.css';
import { NavLink } from 'react-router-dom';
import { Alert } from 'antd';
import * as orgModel from '../../data/models/organization/model'
import Member from '../entities/MemberContainer';

// TODO: need more ergonomic way to resolve the common issue of data types interfering with 
// component types.

export interface OrganizationsProps {
    organizations: Array<orgModel.Organization>
}

export interface OrganizationsState {
    searchTerms: Array<string>
}

export class Organizations extends React.Component<OrganizationsProps, OrganizationsState> {

    constructor(props: OrganizationsProps) {
        super(props)

        this.state = {
            searchTerms: []
        }
    }

    getAvatarUrl(org: orgModel.Organization) {
        // const defaultImages = [
        //     'orgs-64.png',
        //     'unicorn-64.png'
        // ]
        // if (!org.gravatarHash) {
        //     return defaultImages[Math.floor(Math.random() * 2)]
        // }
        if (!org.gravatarHash) {
            return 'unicorn-64.png'
        }
        const gravatarDefault = 'identicon';

        return 'https://www.gravatar.com/avatar/' + org.gravatarHash + '?s=64&amp;r=pg&d=' + gravatarDefault;
    }

    renderAvatar(org: orgModel.Organization) {
        return (
            <img style={{ width: 64, height: 64 }}
                src={this.getAvatarUrl(org)} />
        )
    }

    renderRelation(org: orgModel.Organization) {
        return (
            <div>
                disabled
            </div>
        )
    }

    // renderRelation(org: orgModel.Organization) {
    //     switch (org.relation.type) {
    //         case (types.UserRelationToOrganization.NONE):
    //             return (
    //                 <span><Icon type="stop" />None</span>
    //             )
    //         case (types.UserRelationToOrganization.VIEW):
    //             return (
    //                 <Tooltip
    //                     placement="bottomRight"
    //                     mouseEnterDelay={0.5}
    //                     title="You are not a member of this org, but you may access it; you may request membership"
    //                 >
    //                     <span><Icon type="stop" /> You are not a member - view group to join</span>
    //                 </Tooltip>
    //             )
    //         case (types.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
    //             return (<span><Icon type="user" style={{ color: 'orange' }} /> Your membership <b>request</b> is pending</span>)
    //         case (types.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
    //             return (<span><Icon type="user" style={{ color: 'blue' }} /> You have been <b>invited</b> to join</span>)
    //         case (types.UserRelationToOrganization.MEMBER):
    //             return (<span><Icon type="user" /> You are a <b>member</b> of this organization</span>)
    //         case (types.UserRelationToOrganization.ADMIN):
    //             return (<span><Icon type="unlock" />Admin</span>)
    //         case (types.UserRelationToOrganization.OWNER):
    //             return (
    //                 <Tooltip
    //                     placement="bottomRight"
    //                     mouseEnterDelay={0.5}
    //                     title="You own this org"
    //                 >
    //                     <span><Icon type="crown" /> You are the <b>owner</b> of this Organization</span>
    //                 </Tooltip>
    //             )
    //     }
    // }

    renderAdminInfo(org: orgModel.Organization) {
        return (
            <div>
                disabled
            </div>
        )
    }

    // renderAdminInfo(org: orgModel.Organization) {
    //     if (!(org.relation.type === types.UserRelationToOrganization.OWNER ||
    //         org.relation.type === types.UserRelationToOrganization.ADMIN)) {
    //         return
    //     }
    //     let requestsPending
    //     if (org.adminRequests.length > 0) {
    //         requestsPending = (
    //             <div>
    //                 <Icon type="exclamation-circle" theme="twoTone" twoToneColor="orange" />
    //                 {' '}
    //                 there
    //                 {' '}
    //                 {org.adminRequests.length > 1 ? 'are' : 'is'}
    //                 {' '}
    //                 <b>{org.adminRequests.length} pending request{org.adminRequests.length > 1 ? 's' : ''}</b>
    //             </div>
    //         )
    //     }

    //     return (
    //         <div className="admin">
    //             {requestsPending}
    //         </div>
    //     )
    // }

    pluralize(count: number, singular: string, plural: string) {
        if (count === 0 || count > 1) {
            return plural
        }
        return singular
    }

    renderMemberCount(org: orgModel.Organization) {
        return (
            <div className="memberCount">
                {org.members.length > 0 ? org.members.length : 'no'} {this.pluralize(org.members.length, 'member', 'members')}
            </div>
        )
    }

    renderRelationInfo(org: orgModel.Organization) {
        return (
            <div>
                disabled
            </div>
        )
    }

    // renderRelationInfo(org: orgModel.Organization) {
    //     switch (org.relation.type) {
    //         case types.UserRelationToOrganization.NONE:
    //             return (
    //                 <div>
    //                     Only members may view membership information
    //                 </div>
    //             )
    //             break
    //         case types.UserRelationToOrganization.VIEW:
    //             return (
    //                 <div>Only members may view membership information</div>
    //             )
    //             break
    //         case types.UserRelationToOrganization.MEMBER:
    //             return (
    //                 <div>
    //                     {this.renderMemberCount(org)}
    //                 </div>
    //             )
    //             break
    //         case types.UserRelationToOrganization.MEMBER_REQUEST_PENDING:
    //             return (
    //                 <div>Only members may view membership information</div>
    //             )
    //             break
    //         case types.UserRelationToOrganization.MEMBER_INVITATION_PENDING:
    //             return (
    //                 <div>
    //                     Only members may view membership information
    //                 </div>
    //             )
    //             break
    //         case types.UserRelationToOrganization.ADMIN:
    //             return (
    //                 <div>
    //                     {this.renderMemberCount(org)}
    //                 </div>
    //             )
    //             break
    //         case types.UserRelationToOrganization.OWNER:
    //             return (
    //                 <div>
    //                     {this.renderMemberCount(org)}
    //                 </div>
    //             )
    //             break
    //     }
    // }

    renderOrg(org: orgModel.Organization, index: Number) {
        return (
            <div className="row organization" key={String(index)}>
                <div className="col2">
                    <NavLink to={`/viewOrganization/${org.id}`}>
                        {this.renderAvatar(org)}
                    </NavLink>
                </div>
                <div className="col1">
                    <div className="orgName">
                        <NavLink to={`/viewOrganization/${org.id}`}>
                            {org.name}
                        </NavLink>
                    </div>
                    <div className="orgOwner">
                        <span className="field-label">owner</span>
                        {/* TODO: render as Member or Owner component */}
                        <span className="field-value">
                            <Member member={org.owner} avatarSize={30} />
                            {/* <a href={"/#people/" + org.owner.username} target="_blank">{org.owner.username} ❨{org.owner.username}❩</a> */}
                        </span>
                    </div>
                    <div className="orgCreated">
                        <span className="field-label">established</span>
                        <span className="field-value">{Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }).format(org.createdAt)}</span>
                    </div>

                    {/* <div className="relation">
                        {this.renderRelation(org)}
                    </div>
                    {this.renderRelationInfo(org)} */}

                    {/* {this.renderAdminInfo(org)} */}
                </div>
            </div>
        )
    }

    renderOrgs() {
        if (this.props.organizations.length > 0) {
            return (
                this.props.organizations.map((org: orgModel.Organization, index) => {
                    return (
                        this.renderOrg(org, index)
                    )
                })
            )
        } else {
            return (
                <Alert type="warning"
                    style={{ maxWidth: '20em', margin: '20px auto 0 auto' }}
                    message="Sorry, no organizations were found." />
            )
        }
    }

    render() {
        return (
            <div className="Organizations">
                <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {this.renderOrgs()}
                </div>
            </div >
        )
    }
}

export default Organizations;