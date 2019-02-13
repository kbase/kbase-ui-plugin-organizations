import * as React from 'react'
import * as orgModel from '../../../data/models/organization/model'
import './Inaccessible.css'

export interface OrganizationProps {
    organization: orgModel.InaccessiblePrivateOrganization
}

interface OrganizationState {

}

export default class Organization extends React.Component<OrganizationProps, OrganizationState> {
    constructor(props: OrganizationProps) {
        super(props)
    }

    render() {
        return (
            <div>
                hey, org here
                <div>
                    {this.props.organization.id}
                </div>
            </div>
        )
    }
}