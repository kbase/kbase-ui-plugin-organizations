import * as React from 'react'
import marked from 'marked'
import { NavLink } from 'react-router-dom'

import './ViewOrganization.css'

import * as types from '../types'
import { Button } from 'antd';
import Header from './Header';

export interface ViewOrganizationState {
}

class ViewOrganization extends React.Component<types.ViewOrganizationProps, ViewOrganizationState> {
    constructor(props: types.ViewOrganizationProps) {
        super(props)

        this.props.onViewOrg(this.props.id)
    }

    buildFooter() {
        return (
            <div>
                {this.renderEditRow()}
                {/* <p style={{ textAlign: 'center' }}>
                    You may also  <NavLink to={`/organizations`}><Button type="danger" icon="undo">Return to Orgs</Button></NavLink> to the organizations browser.
                </p> */}
            </div>
        )
    }

    renderEditRow() {
        if (this.props.organization!.owner.username === this.props.username) {
            return (
                <p style={{ textAlign: 'center' }}>
                    As the owner of this group, you may <NavLink to={`/editOrganization/${this.props.organization!.id}`}><Button icon="edit">Edit</Button></NavLink> it.
                </p>
            )
        }
    }

    renderEditButton() {
        if (this.props.organization!.owner.username === this.props.username) {
            return (
                <NavLink to={`/editOrganization/${this.props.organization!.id}`}><Button icon="edit">Edit</Button></NavLink>
            )
        }
    }

    renderOrg() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }
        return (
            <form className="table">
                <div className="row">
                    <div className="col2">
                        <div className="name">
                            {this.props.organization.name}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col2">
                        <div className="id">
                            <span className="label">permalink</span>{' '}
                            <span className="permalinkBase">https://narrative.kbase.us/organizations/</span>{this.props.organization.id}
                        </div>
                    </div>
                </div>
                <div className="row" style={{ flex: '1 1 0px' }}>
                    <div className="col2">
                        <div className="description"
                            dangerouslySetInnerHTML={({ __html: marked(this.props.organization.description || '') })}
                        />
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col2">
                        {this.buildFooter()}
                    </div>
                </div> */}
            </form>
        )
    }

    renderInfo() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }
        return (
            <form className="table infoTable">
                <div className="row">
                    <div className="col1">
                        <span className="label">owner</span>
                    </div>
                    <div className="col2">
                        <div className="owner">
                            <a href="#people/{org.owner.username}" target="_blank">{this.props.organization.owner.realname} ❨{this.props.organization.owner.username}❩</a>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col1">
                        <span className="label">established</span>
                    </div>
                    <div className="col2">
                        <div className="createdAt">
                            {Intl.DateTimeFormat('en-US').format(this.props.organization.createdAt)}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col1">
                        <span className="label">last updated</span>
                    </div>
                    <div className="col2">
                        <div className="modifiedAt">
                            {Intl.DateTimeFormat('en-US').format(this.props.organization.modifiedAt)}
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    renderHeader() {
        return (
            <Header title="Organizations">
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            Viewing Org "
                            {this.props.organization && this.props.organization.name}
                            "
                        </span>
                    </div>
                    <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        {this.renderEditButton()}
                        <NavLink to={`/organizations`}><Button type="danger" icon="undo">Return to Orgs</Button></NavLink>
                    </div>
                </div>
            </Header>
        )
    }

    renderLoadingHeader() {
        return (
            <Header title="Organizations">
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            Loading Org...
                        </span>
                    </div>
                </div>
            </Header>
        )
    }

    render() {
        if (typeof this.props.organization !== 'undefined') {
            return (
                <div className="ViewOrganization">
                    {this.renderHeader()}
                    <div className="mainRow">
                        <div className="mainColumn">
                            {this.renderOrg()}
                        </div>
                        <div className="infoColumn">
                            <div className="infoBox">
                                {this.renderInfo()}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="ViewOrganization">
                {this.renderLoadingHeader()}
                Loading...
            </div>
        )
    }
}

export default ViewOrganization