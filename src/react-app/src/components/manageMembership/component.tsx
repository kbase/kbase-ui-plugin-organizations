import * as React from 'react'
import Header from '../Header';
import { Icon, Button, Modal } from 'antd';
import { Redirect } from 'react-router-dom';
import './style.css'
import { Organization } from '../../types';

export interface ManageMembershipProps {
    // temp.
    organization: Organization
}

interface MangeMembershipState {
    cancelToBrowser: boolean
    cancelToViewer: boolean
}

class ManageMembership extends React.Component<ManageMembershipProps, MangeMembershipState> {
    constructor(props: ManageMembershipProps) {
        super(props)
        console.log('here...')

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
        return (
            <Header>
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            <Icon type="tool" />
                            {' '}
                            Managing your membership in the Organization "
                            {this.props.organization.name}
                            "
                        </span>
                    </div>
                    <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
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
                    </div>
                </div>
            </Header>
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