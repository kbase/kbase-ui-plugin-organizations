import * as React from 'react';
import './component.css';
import { Alert } from 'antd';
import * as orgModel from '../../data/models/organization/model'
import BriefOrganization from '../views/organizationHeader/BriefOrganization';

// TODO: need more ergonomic way to resolve the common issue of data types interfering with 
// component types.

export interface OrganizationsProps {
    organizations: Array<{ organization: orgModel.BriefOrganization, lastVisitedAt: Date | null }>
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

    renderAdminInfo(org: orgModel.Organization) {
        return (
            <div>
                disabled
            </div>
        )
    }

    pluralize(count: number, singular: string, plural: string) {
        if (count === 0 || count > 1) {
            return plural
        }
        return singular
    }

    renderOrgs() {
        if (this.props.organizations.length > 0) {
            return (
                this.props.organizations.map(({ organization, lastVisitedAt }, index) => {
                    return (
                        <div key={String(index)} className="simpleCard">
                            <BriefOrganization organization={organization} lastVisitedAt={lastVisitedAt} />
                        </div>
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