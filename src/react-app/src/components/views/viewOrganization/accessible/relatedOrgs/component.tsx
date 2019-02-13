import * as React from 'react'
import * as orgModel from '../../../../../data/models/organization/model'
import { Button, Menu, Dropdown, Icon, Alert } from 'antd'
import OrganizationEntity from '../../../../entities/organization/loader'
import './component.css'

export interface RelatedOrganizationsProps {
    organization: orgModel.Organization
    relatedOrganizations: Array<orgModel.OrganizationID>
    onManageRelatedOrgs: () => void
    onRemoveRelatedOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => void
}

interface RelatedOrganizationsState {

}

export default class RelatedOrganizations extends React.Component<RelatedOrganizationsProps, RelatedOrganizationsState> {
    constructor(params: RelatedOrganizationsProps) {
        super(params)
    }

    onManageRelatedOrgs() {
        this.props.onManageRelatedOrgs()
    }

    renderToolbar() {
        return (
            <div className="RelatedOrganizations-toolbar">
                <Button onClick={this.onManageRelatedOrgs.bind(this)}>
                    Add Related Org
                </Button>
            </div>
        )
    }

    onAdminMenu(key: string, organizationId: orgModel.OrganizationID) {
        switch (key) {
            case 'removeRelation':
                // this.props.onDemoteAdminToMember(member.username)
                this.props.onRemoveRelatedOrganization(this.props.organization.id, organizationId)
                // window.alert('will remove relation for org: ' + organizationId)
                break
        }
    }

    renderControls(organizationId: orgModel.OrganizationID) {
        if (!this.props.organization.isAdmin) {
            return
        }
        const menu = (
            <Menu onClick={({ key }) => { this.onAdminMenu.call(this, key, organizationId) }}>
                <Menu.Item key="removeRelation">
                    <Icon type="delete" />Remove
                    </Menu.Item>
            </Menu>
        )
        return (
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Icon type="ellipsis" className="IconButton-hover" />
                </Dropdown>
            </div>
        )
    }

    renderBody() {
        if (RelatedOrganizations.length === 0) {
            return (
                <p>Sorry, no related organizations</p>
            )
        }
        if (this.props.relatedOrganizations.length === 0) {
            const message = (
                <div style={{ fontStyle: 'italic', textAlign: 'center' }}>
                    No related organizations
                </div>
            )
            return (
                <Alert type="info" message={message} />
            )
        }
        const relatedOrgs = this.props.relatedOrganizations.map((organizationId: string) => {
            return (
                <div key={organizationId} className="RelatedOrganizations-orgRow simpleCard">
                    {/* <RelatedOrganization organizationId={org} /> */}
                    <div className="RelatedOrganizations-orgCol">
                        <OrganizationEntity organizationId={organizationId} />
                    </div>
                    <div className="RelatedOrganizations-controlCol">
                        {this.renderControls(organizationId)}
                    </div>
                </div>
            )
        });
        return (
            <div className="RelatedOrganizations-organizations">
                {relatedOrgs}
            </div>
        )
    }

    render() {
        return (
            <div className="RelatedOrganizations scrollable-flex-column">
                {/* <div className="RelatedOrganizations-toolbarRow">
                    {this.renderToolbar()}
                </div> */}
                <div className="RelatedOrganizations-bodyRow scrollable-flex-column">
                    {this.renderBody()}
                </div>
            </div>
        )
    }
}