import * as React from 'react'
import Header from '../../Header';
import { Icon, Button, Modal, Input } from 'antd';
import { Redirect, NavLink } from 'react-router-dom';
import './component.css'
import OrganizationHeader from '../organizationHeader/loader';
import * as orgModel from '../../../data/models/organization/model'
import * as userModel from '../../../data/models/user'

export interface ManageMembershipProps {
    username: userModel.Username
    organization: orgModel.Organization
    onLeaveOrganization: (organizationId: string) => void
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

    doLeaveOrg() {
        // alert('this will leave you the org')
        this.props.onLeaveOrganization(this.props.organization.id)
    }

    canSave() {
        return false
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

    renderOrgName(name: string) {
        const maxLength = 25
        if (name.length < 25) {
            return name
        }
        return (
            <span>
                {name.slice(0, 25)}
                …
            </span>
        )
    }

    renderHeader() {
        const breadcrumbs = (
            <React.Fragment>
                <span>
                    <NavLink to={`/viewOrganization/${this.props.organization.id}`}>
                        <span style={{ fontWeight: 'bold' }}>
                            {this.renderOrgName(this.props.organization.name)}
                        </span>
                    </NavLink>

                    <Icon type="right" style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />

                    <Icon type="user" />
                    {' '}
                    <span style={{ fontSize: '120%' }}>Manage your membership</span>
                </span>
            </React.Fragment>
        )
        const buttons = (
            <React.Fragment>
                {/* <Button icon="undo"
                    type="danger"
                    onClick={this.doCancelToViewer.bind(this)}>
                    Return to this Org
                </Button> */}
                <Button icon="save"
                    form="editMembershipForm"
                    key="submit"
                    disabled={!this.canSave.call(this)}
                    htmlType="submit">
                    Save
                </Button>
                <Button
                    // shape="circle"
                    type="danger"
                    icon="frown"
                    onClick={this.doLeaveOrg.bind(this)}>
                    Leave Organization...
                </Button>
                <Button
                    shape="circle"
                    icon="info"
                    onClick={this.doShowInfo.bind(this)}>
                </Button>
            </React.Fragment>
        )
        return (
            <Header breadcrumbs={breadcrumbs} buttons={buttons} />
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
                <h3>
                    Edit Organization Profile
                </h3>
                <div className="body">
                    <div className="col1">
                        <div className="editorTable">
                            <div className="editorTable-row">
                                <div className="editorTable-labelCol">
                                    <span className="field-label">
                                        title
                                    </span>
                                </div>
                                <div className="editorTable-controlCol">
                                    <Input />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col2">
                        <div>
                            org user profile here
                        </div>
                    </div>
                </div>
                <h3>
                    User Profile
                </h3>
                <p>
                    Your user profile is ...
                </p>
                {/* <h3>
                    Leave Org
                </h3>
                <Button>
                    Leave This Org
                </Button> */}
            </div>
        )
    }
}

export default ManageMembership