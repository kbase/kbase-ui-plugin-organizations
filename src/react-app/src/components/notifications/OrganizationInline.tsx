import * as React from 'react'
import * as orgModel from '../../data/models/organization/model'
import { NavLink } from 'react-router-dom';
import './OrganizationInline.css'
import OrgLogo from '../OrgLogo';

export interface OrganizationProps {
    organization: orgModel.Organization
}

interface OrganizationState {
}

export default class OrganizationCompact extends React.Component<OrganizationProps, OrganizationState> {
    constructor(props: OrganizationProps) {
        super(props)
    }

    renderLogo(org: orgModel.Organization) {
        return (
            <OrgLogo logoUrl={org.logoUrl} size={16} organizationName={org.name} organizationId={org.id} />
        )
    }

    render() {
        return (
            <span className="OrganizationInline">
                <NavLink to={`/viewOrganization/${this.props.organization.id}`}>
                    {this.props.organization.name}
                </NavLink>
            </span>
        )
    }
}
