import * as React from 'react';
import './Organizations.css';
import * as types from '../types';
import { NavLink } from 'react-router-dom';
import { Alert, Icon, Tooltip } from 'antd';
import { BriefOrganization } from '../types';

// TODO: need more ergonomic way to resolve the common issue of data types interfering with 
// component types.

export interface OrganizationsProps {
    organizations: Array<BriefOrganization>
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

    getAvatarUrl(org: BriefOrganization) {
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

    renderAvatar(org: BriefOrganization) {
        return (
            <img style={{ width: 64, height: 64 }}
                src={this.getAvatarUrl(org)} />
        )
    }

    renderRelation(org: BriefOrganization) {
        switch (org.relation) {
            case (types.UserRelationToOrganization.NONE):
                return (
                    <span><Icon type="stop" />None</span>
                )
            case (types.UserRelationToOrganization.VIEW):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are not a member of this org, but you may access it; you may request membership"
                    >
                        <span><Icon type="eye" />View</span>
                    </Tooltip>
                )
            case (types.UserRelationToOrganization.MEMBER):
                return (<span><Icon type="user" />Member</span>)
            case (types.UserRelationToOrganization.ADMIN):
                return (<span><Icon type="unlock" />Admin</span>)
            case (types.UserRelationToOrganization.OWNER):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You own this org"
                    >
                        <span><Icon type="lock" theme="filled" />Owner</span>
                    </Tooltip>
                )
        }
    }

    renderOrg(org: BriefOrganization, index: Number) {
        return (
            <div className="row" key={String(index)}>
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
                        <a href={"/#people/" + org.owner.username} target="_blank">{org.owner.realname} ❨{org.owner.username}❩</a>
                    </div>
                    <div className="relation">
                        {this.renderRelation(org)}
                    </div>
                </div>
            </div>
        )
    }

    renderOrgs() {
        if (this.props.organizations.length > 0) {
            return (
                this.props.organizations.map((org: BriefOrganization, index) => {
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
                {this.renderOrgs()}
            </div>
        )
    }
}

export default Organizations;