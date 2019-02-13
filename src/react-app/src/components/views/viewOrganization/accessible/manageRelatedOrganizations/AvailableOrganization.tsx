import * as React from 'react'
import { BriefOrganization } from '../../../../../data/models/organization/model'
import './AvailableOrganization.css'
import OrgLogo from '../../../../OrgLogo'
import Owner from '../../../../entities/OwnerContainer'
import { SelectableRelatableOrganization } from '../../../../../types';
import { Icon } from 'antd';

export interface AvailableOrganizationProps {
    selectableOrganization: SelectableRelatableOrganization
    // onSelectOrganization: (org: BriefOrganization) => void
    // onAddOrganization: (org: BriefOrganization) => void
}

export interface AvailableOrganizationState {
}

export default class AvailableOrganization extends React.Component<AvailableOrganizationProps, AvailableOrganizationState> {
    constructor(props: AvailableOrganizationProps) {
        super(props)
    }

    renderRelated() {
        if (this.props.selectableOrganization.isRelated) {
            return (
                <Icon type="check" style={{ color: "green" }} />
            )
        }
    }

    render() {
        return (
            <div className="AvailableOrganization">
                <div className="AvailableOrganization-relatedCol">
                    {this.renderRelated()}
                </div>
                <div className="AvailableOrganization-orgCol">
                    <div className="AvailableOrganization-logoCol">
                        <OrgLogo logoUrl={this.props.selectableOrganization.organization.logoUrl}
                            size={30}
                            organizationName={this.props.selectableOrganization.organization.name}
                            organizationId={this.props.selectableOrganization.organization.id} />
                    </div>
                    <div className="AvailableOrganization-orgInfoCol">
                        <div className="AvailableOrganization-name">{this.props.selectableOrganization.organization.name}</div>
                        <div className="AvailableOrganization-owner">
                            <Owner username={this.props.selectableOrganization.organization.owner.username}
                                avatarSize={20} showAvatar={false} />
                        </div>
                    </div>
                </div>
                <div className="AvailableOrganization-actionCol"></div>
            </div>
        )
    }
}
