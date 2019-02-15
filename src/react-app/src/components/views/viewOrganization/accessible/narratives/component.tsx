import * as React from 'react'
import './component.css'
import * as orgModel from '../../../../../data/models/organization/model'
import { Alert, Button, Icon, Menu, Dropdown, Input, Select } from 'antd';
import OrganizationNarrative from '../../../../OrganizationNarrative'

export interface NarrativesProps {
    organization: orgModel.Organization
    narratives: Array<orgModel.NarrativeResource>
    relation: orgModel.Relation
    sortNarrativesBy: string
    searchNarrativesBy: string
    onSortNarratives: (sortBy: string) => void
    onSearchNarratives: (searchBy: string) => void
    onRemoveNarrative: (narrative: orgModel.NarrativeResource) => void
    onGetViewAccess: (narrative: orgModel.NarrativeResource) => void
    onRequestAddNarrative: () => void
}

interface NarrativesState {
}

export default class Narratives extends React.Component<NarrativesProps, NarrativesState> {
    constructor(props: NarrativesProps) {
        super(props)
    }

    onRequestAddNarrative() {
        // this.setState({ navigateTo: NavigateTo.REQUEST_ADD_NARRATIVE })
        // alert('will add narrative')
        this.props.onRequestAddNarrative()
    }

    onNarrativeMenu(key: string, narrative: orgModel.NarrativeResource) {
        switch (key) {
            case 'removeNarrative':
                this.props.onRemoveNarrative(narrative)
                break
        }
    }

    renderNarrativeMenu(narrative: orgModel.NarrativeResource) {
        const relation = this.props.relation
        let menu
        switch (relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                // should never occur
                break;
            case (orgModel.UserRelationToOrganization.VIEW):
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
            case (orgModel.UserRelationToOrganization.MEMBER):
                break;
            case (orgModel.UserRelationToOrganization.ADMIN):
            case (orgModel.UserRelationToOrganization.OWNER):
                menu = (
                    <Menu onClick={({ key }) => { this.onNarrativeMenu(key, narrative) }}>
                        <Menu.Item key="removeNarrative">
                            <Icon type="delete" /> Remove Narrative from Organization
                        </Menu.Item>
                    </Menu>
                )
        }
        if (!menu) {
            return
        }
        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <Icon type="ellipsis" className="IconButton-hover" />
            </Dropdown>
        )
    }

    renderSearchBar() {
        const doChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.props.onSearchNarratives(e.target.value)
        }
        return (
            <div style={{ paddingRight: '6px' }}>
                <Input style={{ width: '100%', marginRight: '6px' }}
                    placeholder="Filter narratives by title"
                    onChange={doChange} />
                {/* <Button>
                    <Icon type="search" />
                </Button> */}
            </div>
        )
    }

    renderSortBar() {
        const handleSelect = (value: string) => {
            this.props.onSortNarratives(value)
        }

        return (
            <React.Fragment>
                <span className="field-label">sort</span>
                <Select onChange={handleSelect}
                    style={{ width: '11em' }}
                    dropdownMatchSelectWidth={true}
                    defaultValue={this.props.sortNarrativesBy}
                >
                    <Select.Option value="name" key="name">Name</Select.Option>
                    <Select.Option value="added" key="added">Date Added</Select.Option>
                    <Select.Option value="changed" key="changed">Last Changed</Select.Option>
                </Select>
            </React.Fragment>
        )
    }

    renderMemberNarratives() {
        const extras = [(
            <Button
                key="addNarrative"
                onClick={this.onRequestAddNarrative.bind(this)}>
                <Icon type="plus" /> Add a Narrative
            </Button>
        )]

        let narrativesTable
        if (this.props.narratives.length === 0) {
            narrativesTable = (
                <Alert type="info" message="No Narratives are yet associated with this Organization" />
            )

        } else {
            narrativesTable = this.props.narratives.map((narrative) => {
                const lastOrgVisitAt = this.props.organization.lastVisitedAt
                const addedAt = narrative.addedAt
                let isNew
                if (lastOrgVisitAt === null) {
                    if (addedAt === null) {
                        isNew = false
                    } else {
                        isNew = false
                    }
                } else {
                    if (addedAt === null) {
                        isNew = false
                    } else {
                        isNew = lastOrgVisitAt.getTime() < addedAt.getTime()
                    }
                }
                const classNames = ['narrative', 'simpleCard']
                if (isNew) {
                    classNames.push('ViewOrganization-newNarrative')
                }
                return (
                    <div className={classNames.join(' ')} key={String(narrative.workspaceId)}>
                        <div className="dataCol">
                            <OrganizationNarrative
                                narrative={narrative}
                                organization={this.props.organization}
                                onGetViewAccess={this.props.onGetViewAccess} />
                        </div>
                        <div className="buttonCol">
                            {this.renderNarrativeMenu(narrative)}
                        </div>
                    </div>
                )
            })
        }

        // const narrativeCount = this.props.narratives.length
        const narrativeCount = this.props.organization.narrativeCount
        const title = (
            <span className="ViewOrganization-narrativesTitle">
                <Icon type="folder-open" style={{ marginRight: '8px' }} />
                Narratives
                {' '}
                <span className="titleCount">({narrativeCount})</span>
            </span>
        )
        return (
            <div className="ViewOrganization-narratives scrollable-flex-column">
                <div className="ViewOrganization-narrativesHeader">
                    <div className="ViewOrganization-narrativesHeaderCol1">
                        {title}
                    </div>
                    <div className="ViewOrganization-narrativesHeaderCol2">
                        {extras}
                    </div>
                </div>
                <div className="ViewOrganization-narratives-toolbar">
                    <div className="ViewOrganization-narratives-toolbar-searchCol">
                        {this.renderSearchBar()}
                    </div>
                    <div className="ViewOrganization-narratives-toolbar-sortCol">
                        {this.renderSortBar()}
                    </div>
                </div>
                <div className="ViewOrganization-narrativesList">
                    <div className="narrativesTable">
                        {narrativesTable}
                    </div>
                </div>
            </div >
        )
    }

    renderNonMemberNarratives() {
        let alert
        const narrativesToShow = this.props.organization.narratives.length
        const hiddenNarrativeCount = this.props.organization.narrativeCount - this.props.organization.narratives.length
        const alertStyle = {
            marginBottom: '10px'
        }
        if (narrativesToShow) {
            if (hiddenNarrativeCount) {
                const message = (
                    <React.Fragment>
                        <p>Since you are not a member of this Organization, only public Narratives are displayed.</p>
                        <p>{hiddenNarrativeCount} private Narrative{hiddenNarrativeCount !== 1 ? 's have ' : ' has '} been hidden.</p>
                    </React.Fragment>
                )
                alert = (
                    <Alert type="info" message={message} style={alertStyle} />
                )
            }
        } else {
            if (hiddenNarrativeCount) {
                const message = (
                    <React.Fragment>
                        <p>Since you are not a member of this Organization, only public Narratives would be displayed, but this Organization has none.</p>
                        <p>{hiddenNarrativeCount} private Narrative{hiddenNarrativeCount !== 1 ? 's have ' : ' has '} been hidden.</p>
                    </React.Fragment>
                )
                alert = (
                    <Alert type="info" message={message} style={alertStyle} />
                )
            } else {
                alert = (
                    <Alert type="info" message="No Narratives are yet associated with this Organization" style={alertStyle} />
                )
            }
        }

        let narrativesTable
        if (narrativesToShow) {
            narrativesTable = this.props.narratives.map((narrative) => {
                // create buttons or not, depending on being an admin
                return (
                    <div className="narrative simpleCard" key={String(narrative.workspaceId)}>
                        <div className="dataCol">
                            <OrganizationNarrative
                                narrative={narrative}
                                organization={this.props.organization}
                                onGetViewAccess={this.props.onGetViewAccess} />
                        </div>
                        <div className="buttonCol">
                            {this.renderNarrativeMenu(narrative)}
                        </div>
                    </div>
                )
            })
        }

        // const narrativeCount = this.props.narratives.length
        const title = (
            <span className="ViewOrganization-narrativesTitle">
                <Icon type="folder-open" style={{ marginRight: '8px' }} />
                Narratives
                {' '}
                <span className="titleCount">({this.props.organization.narrativeCount})</span>
            </span>
        )
        return (
            <div className="ViewOrganization-narratives scrollable-flex-column">
                <div className="ViewOrganization-narrativesHeader">
                    <div className="ViewOrganization-narrativesHeaderCol1">
                        {title}
                    </div>
                    <div className="ViewOrganization-narrativesHeaderCol2">
                    </div>
                </div>
                <div className="ViewOrganization-narratives-toolbar">
                    <div className="ViewOrganization-narratives-toolbar-searchCol">
                        {this.renderSearchBar()}
                    </div>
                    <div className="ViewOrganization-narratives-toolbar-sortCol">
                        {this.renderSortBar()}
                    </div>
                </div>
                <div className="ViewOrganization-narrativesList">
                    <div className="narrativesTable">
                        {alert}
                        {narrativesTable}
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if (this.props.organization.isMember) {
            return this.renderMemberNarratives()
        } else {
            return this.renderNonMemberNarratives()
        }
    }
}