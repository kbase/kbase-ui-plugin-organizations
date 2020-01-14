import * as React from 'react';
import * as orgModel from '../../../data/models/organization/model';
import './Inaccessible.css';
import { Icon } from 'antd';

export interface OrganizationProps {
    organization: orgModel.InaccessiblePrivateOrganization;
}

interface OrganizationState {

}

export default class Organization extends React.Component<OrganizationProps, OrganizationState> {
    render() {
        return (
            <div className="OrganizationEntity-Inaccessible ">
                <div className="OrganizationEntity-Inaccessible-logoCol">
                    <Icon type="lock" />
                </div>
                <div className="OrganizationEntity-Inaccessible-mainCol">
                    <div className="OrganizationEntity-Inaccessible-name">
                        Private Organization
                    </div>

                </div>
            </div>
        );
    }
}