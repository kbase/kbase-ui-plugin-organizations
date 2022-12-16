import { Component } from 'react';
import * as orgModel from '../../../../../../../../data/models/organization/model';
import './RelatedOrganization.css';

export interface RelatedOrganizationProps {
    organizationId: orgModel.OrganizationID;
    // onSelectOrganization: (org: BriefOrganization) => void
    // onAddOrganization: (org: BriefOrganization) => void
}

export interface RelatedOrganizationState {
}

export default class RelatedOrganization extends Component<RelatedOrganizationProps, RelatedOrganizationState> {


    render() {
        return (
            <div className="RelatedOrganization">
                <div className="RelatedOrganization-orgCol">
                    <div className="RelatedOrganization-logoCol">
                        {/* <OrgLogo logoUrl={this.props.selectableOrganization.organization.logoUrl}
                            size={30}
                            organizationName={this.props.selectableOrganization.organization.name}
                            organizationId={this.props.selectableOrganization.organization.id} /> */}
                    </div>
                    <div className="RelatedOrganization-orgInfoCol">
                        {/* <div className="RelatedOrganization-name">{this.props.selectableOrganization.organization.name}</div>
                        <div className="RelatedOrganization-owner">
                            <Owner username={this.props.selectableOrganization.organization.owner.username}
                                avatarSize={20} showAvatar={false} />
                        </div> */}
                        {this.props.organizationId}
                    </div>
                </div>
                <div className="RelatedOrganization-actionCol"></div>
            </div>
        );
    }
}
