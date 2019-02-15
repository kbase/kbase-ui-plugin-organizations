import * as React from 'react'
import { NarrativeState } from '../../../../../types';
import { Icon, Button, Alert, Select, Tooltip } from 'antd';
import './component.css'
import * as orgModel from '../../../../../data/models/organization/model'
import * as narrativeModel from '../../../../../data/models/narrative'
import MainMenu from '../../../../menu/component';
import { OrganizationNarrative, AccessibleNarrative } from '../../../../../data/models/narrative';
import NiceElapsedTime from '../../../../NiceElapsedTime';

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

export class RequestAddNarrative extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
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

    renderNarratives() {
        if (this.props.narratives.length === 0) {
            return (
                <div className="message">
                    You do not have any Narratives
                </div>
            )
        }
        return this.props.narratives.map((orgNarrative, index) => {
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
                    key={String(index)}>
                    <div className="RequestNarrative-narrativeFlag">
                        {flag}
                    </div>
                    <div className="RequestNarrative-narrative">
                        {this.renderNarrative(orgNarrative.narrative)}
                    </div>
                </div>
            )
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
                    <div className="RequestNarrative-narrativesTable">
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
            return (
                <Alert type="info" message="Select a narrative on the left to show it here and be able to add it to this organization." />
            )
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

    render() {
        return (
            <div className="RequestNarrative scrollable-flex-column">
                <MainMenu buttons={this.renderMenuButtons()} />
                <div className="RequestNarrative-body scrollable-flex-column">
                    <div className="RequestNarrative-selectNarrativeCol scrollable-flex-column">
                        <h3>Select a Narrative</h3>
                        {this.renderNarrativeSelector()}
                    </div>
                    <div className="RequestNarrative-selectedNarrativeCol">
                        <h3>Selected Narrative</h3>
                        {this.renderSelectedNarrative()}
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