import * as React from 'react'

import OrganizationHeader from '../organizationHeader/loader';
import { Redirect, NavLink } from 'react-router-dom';
import { Narrative, NarrativeState, SortDirection } from '../../../types';
import Header from '../../Header';
import { Icon, Button, Modal, Alert, Select } from 'antd';
import './component.css'
import * as orgModel from '../../../data/models/organization/model'


export interface Props {
    organization: orgModel.Organization
    narratives: Array<Narrative>
    relation: orgModel.Relation
    selectedNarrative: Narrative | null
    searching: boolean
    sortBy: string
    sortDirection: string
    filter: string
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
            title: 'Request to Add Narrative Help',
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
            <OrganizationHeader organizationId={this.props.organization.id} />
        )
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
        let orgName: string
        const breadcrumbs = (
            <React.Fragment>
                <span>
                    <NavLink to={`/viewOrganization/${this.props.organization.id}`}>
                        <span style={{ fontWeight: 'bold' }}>
                            {this.renderOrgName(this.props.organization.name)}
                        </span>
                    </NavLink>

                    <Icon type="right" style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />

                    <Icon type="plus" />
                    {' '}
                    <span style={{ fontSize: '120%' }}>Add Narrative to Org</span>
                </span>
            </React.Fragment>
        )
        const buttons = (
            <React.Fragment>
                <Button icon="undo"
                    type="danger"
                    onClick={this.doCancelToViewer.bind(this)}>
                    Return to this Org
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

    renderNarratives() {
        if (this.props.narratives.length === 0) {
            return (
                <div className="message">
                    You do not have any Narratives
                </div>
            )
        }
        return this.props.narratives.map((narrative, index) => {
            let isSelected
            if (this.props.selectedNarrative &&
                narrative.workspaceId === this.props.selectedNarrative.workspaceId) {
                isSelected = true
            } else {
                isSelected = false
            }
            let classNames = ['narrative']
            if (isSelected) {
                classNames.push('selected')
            }
            if (narrative.status === NarrativeState.ASSOCIATED) {
                classNames.push('narrativeInOrg')
                return (
                    <div
                        className={classNames.join(' ')}
                        onClick={() => { this.doSelectNarrative.call(this, narrative) }}
                        key={String(index)}>
                        <div className="title">
                            {narrative.title || 'n/a'} (associated)
                        </div>
                    </div>
                )
            } else if (narrative.status === NarrativeState.REQUESTED) {
                classNames.push('narrativeInOrg')
                return (
                    <div
                        className={classNames.join(' ')}
                        onClick={() => { this.doSelectNarrative.call(this, narrative) }}
                        key={String(index)}>
                        <div className="title">
                            {narrative.title || 'n/a'} (request pending)
                        </div>
                    </div>
                )
            } else {
                classNames.push('narrativeNotInOrg')
                return (
                    <div
                        className={classNames.join(' ')}
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

    onSearchSubmit() {
        console.log('searching...')
        return
    }

    renderSearchIcon() {
        if (this.props.searching) {
            return (<Icon type="loading" />)
        }
        return (<Icon type="search" />)
    }

    renderSearchBar() {
        return (
            <form id="searchForm"
                className="searchBar"
                onSubmit={this.onSearchSubmit.bind(this)}>
                <input
                    placeholder="Search your Narratives"
                    // onChange={this.onSearchInputChange.bind(this)}
                    autoFocus
                // ref={this.searchInput}
                />
                {/* <Tooltip
                    title="Enter one or more words to search organizations by name or owner">
                    <Icon type="info-circle" theme="twoTone" style={{ alignSelf: 'end' }} />
                </Tooltip> */}
                <Button
                    // disabled={!this.haveSearchInput()}
                    // ref={this.searchButton}
                    className="button"
                    form="searchForm"
                    key="submit"
                    htmlType="submit">
                    {this.renderSearchIcon()}
                    {/* Search */}
                </Button>

                {/* <div className="message">
                    {this.renderSearchFeedback()}
                </div> */}
            </form>
        )
    }

    onSortByChange() {

    }

    onSortDirectionChange() {

    }

    onFilterChange() {

    }

    renderFilterSortBar() {
        return (
            <div className="filterSortBar">
                <span className="field-label">sort by</span>
                <Select onChange={this.onSortByChange.bind(this)}
                    defaultValue={this.props.sortBy}
                    style={{ width: '8em' }}
                    dropdownMatchSelectWidth={true}>
                    <Select.Option value="title" key="title">Title</Select.Option>
                    <Select.Option value="savedAt" key="savedAt">Last saved</Select.Option>
                </Select>
                <Select onChange={this.onSortDirectionChange.bind(this)}
                    style={{ width: '4em' }}
                    dropdownMatchSelectWidth={true}
                    defaultValue={this.props.sortDirection}>
                    <Select.Option value={SortDirection.ASCENDING} key="name"><Icon type="sort-ascending" /></Select.Option>
                    <Select.Option value={SortDirection.DESCENDING} key="owner"><Icon type="sort-descending" /></Select.Option>
                </Select>
                {/* <span className="field-label" style={{ marginLeft: '10px' }}>filter</span>
                <Select onChange={this.onFilterChange.bind(this)}
                    defaultValue={this.props.filter}
                    style={{ width: '10em' }}
                    dropdownMatchSelectWidth={true}>
                    <Select.Option value="all" key="all">All</Select.Option>
                    <Select.Option value="notAssociatedPending" key="notAssociatedPending">Not Associated/Pending</Select.Option>
                    <Select.Option value="associatedPending" key="associatedPending">Only Associated/Pending</Select.Option>
                </Select> */}
            </div>
        )
    }

    renderNarrativeSelector() {
        return (
            <div className="narrativeSelector scrollable-flex-column">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: '0 0 10em' }}>
                        {this.renderSearchBar()}
                    </div>
                    <div style={{ flex: '1 1 0px' }}>
                        {this.renderFilterSortBar()}
                    </div>
                </div>
                <div className="narratives scrollable-flex-column">
                    <div className="narrativesTable">
                        {this.renderNarratives()}
                    </div>
                </div>
            </div >
        )
    }

    renderSelectedNarrativeButton() {
        if (!this.props.selectedNarrative) {
            return
        }
        if (this.props.selectedNarrative.status === NarrativeState.ASSOCIATED) {
            return (
                <Alert type="info" message="This Narrative is associated with this Organization" />
            )
        } else if (this.props.selectedNarrative.status === NarrativeState.REQUESTED) {
            return (
                <Alert type="warning" message="You have requested to associate this Narrative with this Organization" />
            )
        }
        let buttonLabel
        if (this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.relation.type === orgModel.UserRelationToOrganization.OWNER) {
            buttonLabel = 'Add Selected Narrative to Organization'
        } else {
            buttonLabel = 'Request Association of Selected Narrative to Organization'
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
                <Alert type="info" message="Select a narrative on the left to show it here and be able to add it to this organization." />
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
                        {this.renderNarrativeSelector()}
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