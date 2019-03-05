import * as React from 'react'
import { NarrativeState } from '../../../../../types';
import { Icon, Button, Alert, Select, Tooltip } from 'antd';
import './component.css'
import * as orgModel from '../../../../../data/models/organization/model'
import * as narrativeModel from '../../../../../data/models/narrative'
import MainMenu from '../../../../menu/component'
import { OrganizationNarrative, AccessibleNarrative } from '../../../../../data/models/narrative'
import NiceElapsedTime from '../../../../NiceElapsedTime'
import { FlexibleColumnWrapper, Renderable } from './FlexibleColumnWrapper'

export interface Props {
    organization: orgModel.Organization
    narratives: Array<OrganizationNarrative>
    relation: orgModel.Relation
    selectedNarrative: OrganizationNarrative | null
    searching: boolean
    sortBy: string
    filter: string
    doSortBy: (sortBy: narrativeModel.Sort) => void
    doSendRequest: (groupId: string, workspaceId: number) => void
    doSelectNarrative: (narrative: OrganizationNarrative) => void
    onFinish: () => void
}

interface State {
}

class NarrativeRenderer extends Renderable {
    rowRenderer: (index: number) => JSX.Element
    rowCount: number
    constructor(rowRenderer: (index: number) => JSX.Element, rowCount: number) {
        super()

        this.rowRenderer = rowRenderer
        this.rowCount = rowCount
    }

    size() {
        return this.rowCount
    }

    render(index: number) {
        return this.rowRenderer(index)
    }

    renderEmpty() {
        return (
            <div className="RequestNarrative-narrative-skeleton">
                <div className="RequestNarrative-narrative-skeleton-row" style={{ width: '20em' }}>&nbsp;</div>
                <div className="RequestNarrative-narrative-skeleton-row" style={{ width: '5em' }}>&nbsp;</div>
                <div className="RequestNarrative-narrative-skeleton-row" style={{ width: '10em' }}>&nbsp;</div>
            </div>
        )
    }
}

export class RequestAddNarrative extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            containerDimensions: null
        }

    }

    onFinish() {
        this.props.onFinish()
    }

    doSelectNarrative(narrative: OrganizationNarrative) {
        this.props.doSelectNarrative(narrative)
    }

    doSendRequest() {
        if (this.props.selectedNarrative === null) {
            console.warn('attempt to send request without selected narrative')
            return
        }
        this.props.doSendRequest(this.props.organization.id, this.props.selectedNarrative.narrative.workspaceId)
    }

    canSendRequest() {
        if (this.props.selectedNarrative) {
            return true
        }
        return false
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

    renderPermission(narrative: AccessibleNarrative) {
        switch (narrative.access) {
            case narrativeModel.NarrativeAccess.VIEW:
                return (
                    <span>
                        <Icon type="eye" /> View
                    </span>
                )
            case narrativeModel.NarrativeAccess.EDIT:
                return (
                    <span>
                        <Icon type="edit" /> Edit
                    </span>
                )
            case narrativeModel.NarrativeAccess.ADMIN:
                return (
                    <span>
                        <Icon type="unlock" /> Admin
                    </span>
                )
            case narrativeModel.NarrativeAccess.OWNER:
                return (
                    <span>
                        <Icon type="crown" /> Owner
                    </span>
                )
            default:
                return (
                    <span>
                        ERROR
                    </span>
                )
        }
    }

    renderPublicPermission(narrative: AccessibleNarrative) {
        if (narrative.isPublic) {
            return (
                <span>
                    <Icon type="global" /> Public
                </span>
            )
        } else {
            return (
                <span>
                    <Icon type="lock" /> Private
                </span>
            )
        }
    }

    renderNarrative(narrative: AccessibleNarrative) {
        return (
            <React.Fragment>
                <div className="RequestNarrative-title">
                    {narrative.title}
                </div>

                <div className="RequestNarrative-publicPermission">
                    {this.renderPublicPermission(narrative)}
                </div>
                <div className="RequestNarrative-modifiedAt">
                    <span className="field-label">
                        <Icon type="save" />
                    </span>
                    {' '}
                    <NiceElapsedTime time={narrative.lastSavedAt} tooltipPrefix="last saved " />
                </div>
            </React.Fragment>
        )
    }

    renderOrgNarrative(orgNarrative: OrganizationNarrative) {
        const { status, narrative } = orgNarrative
        let isSelected
        if (this.props.selectedNarrative &&
            narrative.workspaceId === this.props.selectedNarrative.narrative.workspaceId) {
            isSelected = true
        } else {
            isSelected = false
        }
        let classNames = ['RequestNarrative-narrativeCell']
        if (isSelected) {
            classNames.push('RequestNarrative-selected')
        }
        let flag
        switch (status) {
            case NarrativeState.ASSOCIATED:
                classNames.push('RequestNarrative-narrativeInOrg')
                flag = (
                    <Tooltip title="This narrative is already associated with this organization">
                        <Icon type="check" style={{ color: 'green' }} />
                    </Tooltip>
                )
                break
            case NarrativeState.REQUESTED:
                classNames.push('RequestNarrative-narrativeInOrg')
                flag = (
                    <Tooltip title="You have already requested that this narrative be added to this organization">
                        <Icon type="loading" style={{ color: 'orange' }} />
                    </Tooltip>
                )
                break
            default:
                classNames.push('RequestNarrative-narrativeNotInOrg')
        }

        return (
            <div
                className={classNames.join(' ')}
                onClick={() => { this.doSelectNarrative.call(this, orgNarrative) }}
            >
                <div className="RequestNarrative-narrativeFlag">
                    {flag}
                </div>
                <div className="RequestNarrative-narrative">

                    {this.renderNarrative(orgNarrative.narrative)}
                </div>
            </div>
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
        const rowRenderer = (index: number) => {
            return this.renderOrgNarrative(this.props.narratives[index])
        }
        const narrativeRenderer = new NarrativeRenderer(rowRenderer, this.props.narratives.length)
        return (
            <FlexibleColumnWrapper renderable={narrativeRenderer} />
        )
    }

    onSearchSubmit() {
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
                className="RequestNarrative-searchBar"
                onSubmit={this.onSearchSubmit.bind(this)}>
                <input
                    placeholder="Search your Narratives"
                    // onChange={this.onSearchInputChange.bind(this)}
                    autoFocus
                />
                <Button
                    className="RequestNarrative-button"
                    form="searchForm"
                    key="submit"
                    htmlType="submit">
                    {this.renderSearchIcon()}
                </Button>
            </form>
        )
    }

    renderFeedbackBar() {
        return (
            <div>
                Showing
                {' '}
                {
                    Intl.NumberFormat('en-US', {
                        style: 'decimal',
                        useGrouping: true
                    }).format(this.props.narratives.length)
                }
                {' '}
                narratives
            </div>
        )
    }

    onSortByChange(value: string) {
        switch (value) {
            case 'title':
                this.props.doSortBy(narrativeModel.Sort.TITLE)
                break
            case 'savedAt':
                this.props.doSortBy(narrativeModel.Sort.LAST_SAVED)
                break
        }
    }

    onSortDirectionChange() {
    }

    onFilterChange() {
    }

    renderFilterSortBar() {
        return (
            <div className="RequestNarrative-filterSortBar">
                <span className="field-label">sort by</span>
                <Select onChange={this.onSortByChange.bind(this)}
                    defaultValue={this.props.sortBy}
                    style={{ width: '8em' }}
                    dropdownMatchSelectWidth={true}>
                    <Select.Option value="title" key="title">Title</Select.Option>
                    <Select.Option value="savedAt" key="savedAt">Last saved</Select.Option>
                </Select>
            </div>
        )
    }

    renderNarrativeSelector() {
        return (
            <div className="RequestNarrative-narrativeSelector scrollable-flex-column">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {/* <div style={{ flex: '0 0 10em' }}>
                        {this.renderSearchBar()}
                    </div> */}
                    <div style={{ flex: '1 1 0px' }}>
                        {this.renderFilterSortBar()}
                    </div>
                </div>
                <div className="RequestNarrative-feedbackBar">
                    {this.renderFeedbackBar()}
                </div>
                <div className="RequestNarrative-narratives scrollable-flex-column">
                    <div className="RequestNarrative-narrativesTable scrollable-flex-column"  >
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
                <div className="RequestNarrative-selectedNarrative">
                    <div className="RequestNarrative-title">
                        {this.props.selectedNarrative.narrative.title}
                    </div>
                    <div>
                        <span className="field-label">
                            <Icon type="save" />
                        </span>
                        {' '}
                        <NiceElapsedTime time={this.props.selectedNarrative.narrative.lastSavedAt} tooltipPrefix="last saved " />
                    </div>
                </div>
            )
        } else {
            if (this.props.relation.type === orgModel.UserRelationToOrganization.MEMBER) {
                const message = (
                    <p>
                        Select a narrative on the left to show it here and be able to request association of
                        it with this Organization.
                    </p>
                )
                return (
                    <Alert type="info" message={message} />
                )
            } else {
                const message = (
                    <p>
                        Select a narrative on the left to show it here and be able to associate it with this Organization.
                    </p>
                )
                return (
                    <Alert type="info" message={message} />
                )
            }
        }
    }

    renderMenuButtons() {
        return (
            <div className="ButtonSet">
                <div className="ButtonSet-button">
                    <Button icon="rollback"
                        type="danger"
                        onClick={this.onFinish.bind(this)}>
                        Done
                    </Button>
                </div>
            </div >
        )
    }

    renderAlert() {
        if (this.props.relation.type === orgModel.UserRelationToOrganization.MEMBER) {
            const warning = (
                <React.Fragment>
                    <p>
                        As an Organization member, you are able to request association of any Narrative you
                        own with this Organization.
                    </p>
                    <p>
                        If your Narrative association request is accepted by an Organization administrator,
                        it will appear for all members on the main Organization page.
                    </p>
                    <p>
                        Members will be able to gain view share access to the Narrative.
                    </p>
                    <p>
                        Only Organization administrators will be able to disassociate the Narrative from the Organization.
                    </p>
                </React.Fragment>
            )
            return (
                <Alert type="warning"
                    message={warning}
                    style={{ marginBottom: '10px' }} />
            )
        } else {
            const warning = (
                <React.Fragment>
                    <p>
                        As an Organization administrator, you will be able to immediate associate a Narrative you
                        own with this Organization.
                    </p>
                    <p>
                        Members will be able to gain view share access to the Narrative.
                    </p>
                    <p>
                        Only Organization administrators will be able to disassociate the Narrative from the Organization.
                    </p>
                </React.Fragment>

            )
            return (
                <Alert type="warning"
                    message={warning}
                    style={{ marginBottom: '10px' }} />
            )
        }
    }

    renderSelectedAlert() {
        if (this.props.selectedNarrative && this.props.selectedNarrative.status === NarrativeState.NONE) {
            if (this.props.relation.type === orgModel.UserRelationToOrganization.MEMBER) {
                const warning = (
                    <React.Fragment>
                        <p>
                            Please be aware that if your request to associate this Narrative is accepted,
                            you will be unable to directly remove it from the Organization.
                    </p>
                        <p>
                            Only Organization administrators are able to remove associated Narratives from the Organization.
                    </p>
                    </React.Fragment>
                )
                return (
                    <Alert type="warning"
                        message={warning}
                        style={{ marginBottom: '10px', marginTop: '10px' }} />
                )
            }
        }
    }

    render() {
        return (
            <div className="RequestNarrative scrollable-flex-column">
                <MainMenu buttons={this.renderMenuButtons()} />
                <div className="RequestNarrative-body scrollable-flex-column">
                    <div className="RequestNarrative-selectNarrativeCol scrollable-flex-column">
                        <h3>Select a Narrative to Associate with this Organization</h3>
                        {this.renderNarrativeSelector()}
                    </div>
                    <div className="RequestNarrative-selectedNarrativeCol">
                        <h3>Selected Narrative</h3>
                        {/* {this.renderAlert()} */}
                        {this.renderSelectedNarrative()}
                        {this.renderSelectedAlert()}
                        <div className="RequestNarrative-selectedNarrativeButtonBar">
                            {this.renderSelectedNarrativeButton()}
                        </div>
                    </div>
                </div>
                <div className="RequestNarrative-footer">
                </div>
            </div>
        )
    }
}

export default RequestAddNarrative