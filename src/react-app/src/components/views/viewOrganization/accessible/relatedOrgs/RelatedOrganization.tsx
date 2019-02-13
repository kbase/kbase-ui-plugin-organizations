import * as React from 'react'
import './RelatedOrganization.css'
import OrgLogo from '../../../../OrgLogo'
import Owner from '../../../../entities/OwnerContainer'
import { SelectableRelatableOrganization } from '../../../../../types';
import { Icon } from 'antd';
import * as orgModel from '../../../../../data/models/organization/model'

export interface RelatedOrganizationProps {
    organizationId: orgModel.OrganizationID
    // onSelectOrganization: (org: BriefOrganization) => void
    // onAddOrganization: (org: BriefOrganization) => void
}

export interface RelatedOrganizationState {
}

export default class RelatedOrganization extends React.Component<RelatedOrganizationProps, RelatedOrganizationState> {
    constructor(props: RelatedOrganizationProps) {
        super(props)
    }

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
        )
    }
}
