import { Alert } from 'antd';
import { Component } from 'react';
import * as orgModel from '../../../../data/models/organization/model';
import BriefOrganization from '../../../BriefOrganization';
import './component.css';

// TODO: need more ergonomic way to resolve the common issue of data types interfering with 
// component types.

export interface OrganizationsProps {
    organizations: Array<orgModel.BriefOrganization>;
    openRequests: Map<orgModel.OrganizationID, orgModel.RequestStatus>;
    myOrgsUnfiltered: boolean;
}

export interface OrganizationsState {
    searchTerms: Array<string>;
}

export class Organizations extends Component<OrganizationsProps, OrganizationsState> {
    constructor(props: OrganizationsProps) {
        super(props);

        this.state = {
            searchTerms: []
        };
    }

    renderAdminInfo(org: orgModel.Organization) {
        return (
            <div>
                disabled
            </div>
        );
    }

    pluralize(count: number, singular: string, plural: string) {
        if (count === 0 || count > 1) {
            return plural;
        }
        return singular;
    }

    renderNoOrgs() {
        let message;
        if (this.props.myOrgsUnfiltered) {
            message = (
                <div>
                    <p>
                        You neither own nor are a member of any Organizations, so there is nothing to show you here.
                    </p>
                    <p>
                        You may use the <b>Create Organization</b> button on the upper right to
                        create your own Organization, or use the <b>All Orgs</b> filter on the right
                        to browse and search all public Organizations.
                    </p>
                    {/* <p>
                        You can use the filter on the right to {browseButton} through existing public Organizations,
                        or you may {createButton} your own Organization.
                    </p> */}
                </div>
            );
        } else {
            message = (
                <div>
                    <p>
                        Sorry, no Organizations found.
                    </p>
                </div>
            );
        }

        return (
            <Alert type="warning"
                style={{ maxWidth: '50em', margin: '20px auto 0 auto' }}
                message={message} />
        );
    }

    renderOrgs() {
        if (this.props.organizations.length > 0) {
            return (
                this.props.organizations.map((organization, index) => {
                    const status = this.props.openRequests.get(organization.id) || null;
                    return (
                        <div key={String(index)} className="SimpleCard">
                            <BriefOrganization organization={organization} openRequestsStatus={status} />
                        </div>
                    );
                })
            );
        } else {
            return this.renderNoOrgs();
        }
    }

    render() {
        return (
            <div className="Organizations">
                <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {this.renderOrgs()}
                </div>
            </div >
        );
    }
}

export default Organizations;