import React from 'react';

import * as orgModel from '../../../../../data/models/organization/model';
import './component.css';
import { Button, Input, Alert } from 'antd';
import AvailableOrganization from './AvailableOrganization';
import BriefOrganization from '../../../../BriefOrganization';
import { SelectableRelatableOrganization } from '../../../../../redux/store/types/views/Main/views/ViewOrg/views/ManageRelatedOrgs';
import { RollbackOutlined } from '@ant-design/icons';

export interface ManageRelatedOrganizationsProps {
    organization: orgModel.Organization;
    relatedOrganizations: Array<string>;
    // relation: orgModel.Relation
    selectedOrganization: SelectableRelatableOrganization | null;
    organizations: Array<SelectableRelatableOrganization>;
    onFinish: () => void;
    onSelectOrganization: (org: SelectableRelatableOrganization) => void;
    onAddOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => void;
    onRemoveOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => void;
    onSearch: (searchBy: string) => void;
}

interface ManageRelatedOrganizationsState {
}

export default class ManageRelatedOrganizations extends React.Component<ManageRelatedOrganizationsProps, ManageRelatedOrganizationsState> {
    onAddSelectedOrganization() {
        if (!this.props.selectedOrganization) {
            return;
        }
        this.props.onAddOrganization(this.props.organization.id, this.props.selectedOrganization.organization.id);
    }

    onRemoveSelectedOrganization() {
        if (!this.props.selectedOrganization) {
            return;
        }
        this.props.onRemoveOrganization(this.props.organization.id, this.props.selectedOrganization.organization.id);
    }

    onFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        this.props.onSearch(e.target.value);
    }

    renderAvailableToolbar() {
        return (
            <div className="ManageRelatedOrganizations-available-toolbar">
                <Input placeholder="Filter Available Organizations" onChange={this.onFilterChange.bind(this)} />
            </div>
        );
    }

    renderAvailableOrgs() {
        return this.props.organizations.map((org: SelectableRelatableOrganization) => {
            const selectOrg = () => {
                this.props.onSelectOrganization(org);
            };
            let classes = ['SimpleCard', 'ManageRelatedOrganizations-availableOrganization'];
            if (org.isSelected) {
                classes.push('ManageRelatedOrganizations-selected');
            }
            return (
                <div className={classes.join(' ')} onClick={selectOrg} key={org.organization.id} >
                    <AvailableOrganization selectableOrganization={org} />
                </div>
            );
        });
    }

    renderSelectedOrg() {
        let button;
        let content;
        let alert;
        let alertStyle = {
            marginBottom: '4px'
        };
        if (!this.props.selectedOrganization) {
            const message = (
                <React.Fragment>
                    <p>
                        When you select an organization on the left, details about it will be displayed here.
                    </p>
                </React.Fragment>
            );
            alert = (
                <Alert type="info" message={message} style={alertStyle} />
            );
            button = (
                <Button
                    type="primary"
                    disabled={this.props.selectedOrganization === null}
                    onClick={this.onAddSelectedOrganization.bind(this)}>
                    Add Organization
                </Button>
            );
        } else {
            content = (
                <div className="ManageRelatedOrganizations-selectedOrganization">
                    <BriefOrganization organization={this.props.selectedOrganization.organization} openRequestsStatus={null} />
                </div>
            );
            if (this.props.selectedOrganization.isRelated) {
                alert = (
                    <Alert type="warning" message="This org is associated" style={alertStyle} />
                );
                button = (
                    <Button
                        danger
                        disabled={this.props.selectedOrganization === null}
                        onClick={this.onRemoveSelectedOrganization.bind(this)}>
                        Remove Organization
                    </Button>
                );
            } else {
                button = (
                    <Button
                        type="primary"
                        disabled={this.props.selectedOrganization === null}
                        onClick={this.onAddSelectedOrganization.bind(this)}>
                        Add Organization
                    </Button>
                );
            }
        }

        return (
            <React.Fragment>
                {alert}
                {content}
                <div className="ManageRelatedOrganizations-buttonBar">
                    {button}
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="ManageRelatedOrganizations scrollable-flex-column">
                <div className="ManageRelatedOrganizations-toolbar">
                    <Button onClick={() => this.props.onFinish()} danger>
                        <RollbackOutlined />
                        {' '}
                        Done
                    </Button>
                </div>
                <div className="ManageRelatedOrganizations-main scrollable-flex-column">
                    <div className="ManageRelatedOrganizations-availableOrgs">
                        <h3 style={{ textAlign: 'center' }}>Available Organizations</h3>
                        {this.renderAvailableToolbar()}
                        <div className="ManageRelatedOrganizations-organizations">
                            {this.renderAvailableOrgs()}
                        </div>
                    </div>
                    <div className="ManageRelatedOrganizations-relatedOrgs">
                        <h3 style={{ textAlign: 'center' }}>Selected Organization</h3>
                        {this.renderSelectedOrg()}
                    </div>
                </div>
            </div>
        );
    }
}