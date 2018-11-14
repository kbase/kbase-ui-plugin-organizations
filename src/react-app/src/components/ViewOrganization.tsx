import * as React from 'react'
import marked from 'marked'
import { NavLink } from 'react-router-dom'

import './ViewOrganization.css'

import { ViewOrgState, Organization, AppError, BriefOrganization } from '../types'
import { Button, Modal } from 'antd';
import Header from './Header';

export interface ViewOrganizationState {
    showInfo: boolean
}

export interface ViewOrganizationProps {
    state: ViewOrgState
    id: string,
    organization?: Organization
    error?: AppError
    username: string,
    onViewOrg: (id: string) => void
}

class ViewOrganization extends React.Component<ViewOrganizationProps, ViewOrganizationState> {
    constructor(props: ViewOrganizationProps) {
        super(props)

        this.state = {
            showInfo: false
        }

        this.props.onViewOrg(this.props.id)
    }

    onShowInfo() {
        // this.setState({ showInfo: true })
        Modal.info({
            title: 'View Organization Help',
            content: (
                <div>
                    <p>This is the organizations viewer...</p>
                </div>
            )
        })
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
            <div className="org">
                <div className="nameAndLogo">
                    <div className="avatar">
                        {this.renderOrgAvatar(this.props.organization)}
                    </div>
                    <div className="nameAndLink">
                        <div className="name">
                            {this.props.organization.name}
                        </div>
                        <div className="id">
                            <span className="label">permalink</span>{' '}
                            <span className="permalinkBase">https://narrative.kbase.us#orgs/</span>{this.props.organization.id}
                        </div>
                    </div>
                </div>
                <div className="description"
                    dangerouslySetInnerHTML={({ __html: marked(this.props.organization.description || '') })}
                />

            </div>
        )
    }

    getOrgAvatarUrl(org: BriefOrganization) {
        // const defaultImages = [
        //     'orgs-64.png',
        //     'unicorn-64.png'
        // ]
        // if (!org.gravatarHash) {
        //     return defaultImages[Math.floor(Math.random() * 2)]
        // }
        if (!org.gravatarHash) {
            return 'unicorn-64.png'
        }
        const gravatarDefault = 'identicon';

        return 'https://www.gravatar.com/avatar/' + org.gravatarHash + '?s=64&amp;r=pg&d=' + gravatarDefault;
    }

    renderOrgAvatar(org: BriefOrganization) {
        // console.log('grav?', org.gravatarHash)
        return (
            <img style={{ width: 64, height: 64 }}
                src={this.getOrgAvatarUrl(org)} />
        )
    }

    getAvatarUrl() {
        if (!this.props.organization) {
            return
        }
        switch (this.props.organization.owner.avatarOption || 'gravatar') {
            case 'gravatar':
                const gravatarDefault = this.props.organization.owner.gravatarDefault || 'identicon';
                const gravatarHash = this.props.organization.owner.gravatarHash;
                if (gravatarHash) {
                    return 'https://www.gravatar.com/avatar/' + gravatarHash + '?s=60&amp;r=pg&d=' + gravatarDefault;
                } else {
                    return './nouserpic.png';
                }
            case 'silhouette':
            case 'mysteryman':
            default:
                return './nouserpic.png';
        }
    }

    renderAvatar() {
        const avatarUrl = this.getAvatarUrl()
        return (
            <img
                src={avatarUrl}
                style={{ width: 60 }}
            />
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
                    <div className="col0">
                        <div>
                            <div className="label">proprietor</div>
                        </div>
                        <div className="ownerTable">
                            <div className="avatarCol">
                                {this.renderAvatar()}
                            </div>
                            <div className="proprietorCol">

                                <div className="owner">
                                    <a href="#people/{org.owner.username}" target="_blank">{this.props.organization.owner.realname}</a>
                                    {' '}
                                    ❨{this.props.organization.owner.username}❩
                                </div>
                                <div className="profileOrganization">
                                    {this.props.organization.owner.organization}
                                </div>
                                <div className="profileOrganization">
                                    {this.props.organization.owner.city} {this.props.organization.owner.state}, {this.props.organization.owner.country}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col1">
                        <span className="label">established</span>
                    </div>
                    <div className="col2">
                        <div className="createdAt">
                            {Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(this.props.organization.createdAt)}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col1">
                        <span className="label">last updated</span>
                    </div>
                    <div className="col2">
                        <div className="modifiedAt">
                            {Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(this.props.organization.modifiedAt)}
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    renderHeader() {
        return (
            <Header>
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
                        <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
                    </div>
                </div>
            </Header>
        )
    }

    renderLoadingHeader() {
        return (
            <Header>
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