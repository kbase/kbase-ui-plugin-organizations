import * as React from 'react'
import Header from '../../Header';
import { Icon, Button, Modal } from 'antd';
import { Redirect } from 'react-router-dom';
import './component.css'
import OrganizationHeader from '../organizationHeader/loader';
import * as orgModel from '../../../data/models/organization/model'
import * as userModel from '../../../data/models/user'

export interface ManageMembershipProps {
    username: userModel.Username
    organization: orgModel.Organization
}

interface MangeMembershipState {
    cancelToBrowser: boolean
    cancelToViewer: boolean
}

class ManageMembership extends React.Component<ManageMembershipProps, MangeMembershipState> {
    constructor(props: ManageMembershipProps) {
        super(props)

        this.state = {
            cancelToBrowser: false,
            cancelToViewer: false
        }
    }

    doCancelToViewer() {
        this.setState({ cancelToViewer: true })
    }

    doCancelToBrowser() {
        this.setState({ cancelToBrowser: true })
    }

    doShowInfo() {
        // this.setState({ showInfo: true })
        Modal.info({
            title: 'Manage My Membership Help',
            width: '50em',
            content: (
                <div>
                    <p>This is the view to help you manage your membership...</p>
                </div>
            )
        })
    }

    renderHeader() {
        let orgName: string
        const crumbs = (
            <React.Fragment>
                <Icon type="tool" />
                {' '}
                Managing your membership in the Organization "
                            {this.props.organization.name}
                "
            </React.Fragment>
        )
        const buttons = (
            <React.Fragment>
                <Button icon="undo"
                    type="danger"
                    onClick={this.doCancelToViewer.bind(this)}>
                    Return to this Org
                        </Button>
                <Button icon="undo"
                    type="danger"
                    onClick={this.doCancelToBrowser.bind(this)}>
                    Return to Orgs Browser
                        </Button>
                <Button
                    shape="circle"
                    icon="info"
                    onClick={this.doShowInfo.bind(this)}>
                </Button>
            </React.Fragment>
        )
        return (
            <Header breadcrumbs={crumbs} buttons={buttons} />
        )
    }

    renderOrgHeader() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }
        return (
            <OrganizationHeader organizationId={this.props.organization.id} />
        )
    }

    render() {

        if (this.state.cancelToBrowser) {
            return <Redirect push to="/organizations" />
        }

        if (this.state.cancelToViewer) {
            return <Redirect push to={"/viewOrganization/" + this.props.organization.id} />
        }

        return (
            <div className="ManageMembership">
                {this.renderHeader()}
                {this.renderOrgHeader()}
                <div className="body">
                    <div className="col1">
                        <div>
                            editing area here
                        </div>
                    </div>
                    <div className="col2">
                        <div>
                            org user profile here
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ManageMembership