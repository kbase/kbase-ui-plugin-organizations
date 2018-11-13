import * as React from 'react';
import './Organizations.css';
import * as types from '../types';
import { NavLink } from 'react-router-dom';
import { Alert } from 'antd';
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

    renderOrg(org: BriefOrganization, index: Number) {
        return (
            <div className="row" key={String(index)}>
                <div className="col2">
                    {this.renderAvatar(org)}
                </div>
                <div className="col1">
                    <div className="orgName">
                        <NavLink to={`/viewOrganization/${org.id}`}>{org.name}</NavLink>
                    </div>
                    <div className="orgOwner">
                        <span className="field-label">owner</span>
                        <a href={"/#people/" + org.owner.username} target="_blank">{org.owner.realname} ❨{org.owner.username}❩</a>
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