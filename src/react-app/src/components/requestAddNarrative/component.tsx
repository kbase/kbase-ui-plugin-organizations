import * as React from 'react'

import OrganizationHeader from '../organizationHeader/container';
import { Redirect } from 'react-router-dom';
import { Organization, Narrative, UserRelationToOrganization } from '../../types';
import Header from '../Header';
import { Icon, Button, Modal } from 'antd';
import './component.css'


export interface Props {
    organization: Organization
    narratives: Array<Narrative>
    selectedNarrative: Narrative | null
    doSendRequest: (groupId: string, narrative: Narrative) => void
    doSelectNarrative: (narrative: Narrative) => void
}

enum NavigateTo {
    NONE = 0,
    BROWSER,
    VIEWER
}

interface State {
    navigateTo: NavigateTo,
    // selectedNarrative: Narrative | null
}

export class RequestAddNarrative extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            navigateTo: NavigateTo.NONE,
            // selectedNarrative: null
        }
    }

    doCancelToBrowser() {
        this.setState({ navigateTo: NavigateTo.BROWSER })
    }

    doCancelToViewer() {
        this.setState({ navigateTo: NavigateTo.VIEWER })
    }

    doSelectNarrative(narrative: Narrative) {
        this.props.doSelectNarrative(narrative)
    }

    doShowInfo() {
        // this.setState({ showInfo: true })
        Modal.info({
            title: 'Reqeust to Add Narrative Help',
            width: '50em',
            content: (
                <div>
                    <p>This is the view to help you request the addition of a narrative to this org...</p>
                </div>
            )
        })
    }

    doSendRequest() {
        if (this.props.selectedNarrative === null) {
            console.warn('attempt to send request without selected narrative')
            return
        }
        this.props.doSendRequest(this.props.organization.id, this.props.selectedNarrative)
    }

    canSendRequest() {
        if (this.props.selectedNarrative) {
            return true
        }
        return false
    }

    renderOrgHeader() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }
        return (
            <OrganizationHeader organization={this.props.organization} />
        )
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

    renderNarratives() {
        return this.props.narratives.map((narrative, index) => {
            if (narrative.inOrganization) {
                return (
                    <div
                        className="narrative narrativeInOrg"
                        onClick={() => { this.doSelectNarrative.call(this, narrative) }}
                        key={String(index)}>
                        <div className="title">
                            {narrative.title || 'n/a'}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div
                        className='narrative narrativeNotInOrg'
                        onClick={() => { this.doSelectNarrative.call(this, narrative) }}
                        key={String(index)}>
                        <div className="title">
                            {narrative.title || 'n/a'}
                        </div>
                    </div>
                )
            }

        })
    }

    renderSelectNarrative() {
        return (
            <div className="narrativeSelector scrollable-flex-column">
                {/* <div className="control">
                    <input placeholder="Search for a Narrative You Own" />
                </div> */}
                <div className="narratives scrollable-flex-column">
                    <div className="narrativesTable">
                        {this.renderNarratives()}
                    </div>

                </div>
            </div>
        )
    }

    renderSelectedNarrativeButton() {
        if (!this.props.selectedNarrative) {
            return
        }
        if (this.props.selectedNarrative.inOrganization) {
            return (
                <i>
                    This Narrative is associated with this Organization
                </i>
            )
        }
        let buttonLabel
        if (this.props.organization.relation.type === UserRelationToOrganization.ADMIN ||
            this.props.organization.relation.type === UserRelationToOrganization.OWNER) {
            buttonLabel = 'Add Selected Narrative to Organization'
        } else {
            buttonLabel = 'Request Addition of Selected Narrative to Organization'
        }
        return (
            <Button
                type="primary"
                onClick={this.doSendRequest.bind(this)}
                disabled={!this.canSendRequest.call(this)}
            >{buttonLabel}</Button>
        )

    }

    renderSelectedNarrative() {
        if (this.props.selectedNarrative) {
            return (
                <div className="selectedNarrative">
                    <div className="title">
                        {this.props.selectedNarrative.title}
                    </div>
                    <div>
                        <i>last modified</i>
                        {' '}
                        {Intl.DateTimeFormat('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        }).format(this.props.selectedNarrative.modifiedAt)}
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <i>Select a narrative on the left to show it here and be able to add it to this organization.</i>
                </div>
            )
        }
    }

    render() {
        switch (this.state.navigateTo) {
            case NavigateTo.BROWSER:
                return <Redirect push to="/organizations" />
            case NavigateTo.VIEWER:
                return <Redirect push to={"/viewOrganization/" + this.props.organization.id} />
            case NavigateTo.NONE:
            default:
            // do nothing.
        }

        // let buttonLabel
        // if (this.props.organization.relation.type === UserRelationToOrganization.ADMIN ||
        //     this.props.organization.relation.type === UserRelationToOrganization.OWNER) {
        //     buttonLabel = 'Add Selected Narrative to Organization'
        // } else {
        //     buttonLabel = 'Request Addition of Selected Narrative to Organization'
        // }

        return (
            <div className="RequestNarrative scrollable-flex-column">
                {this.renderHeader()}
                {this.renderOrgHeader()}
                <div className="body scrollable-flex-column">
                    <div className="selectNarrativeCol scrollable-flex-column">
                        <h3>Select a Narrative</h3>
                        {this.renderSelectNarrative()}
                    </div>
                    <div className="selectedNarrativeCol">
                        <h3>Selected Narrative</h3>
                        {this.renderSelectedNarrative()}
                        <div className="selectedNarrativeButtonBar">
                            {this.renderSelectedNarrativeButton()}
                        </div>
                    </div>
                </div>
                <div className="footer">
                    {/* <Button
                        type="primary"
                        onClick={this.doSendRequest.bind(this)}
                        disabled={!this.canSendRequest.call(this)}
                    >{buttonLabel}</Button> */}
                </div>
            </div>
        )
    }
}

export default RequestAddNarrative