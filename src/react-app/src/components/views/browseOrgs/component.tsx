import * as React from 'react'
import Organizations from './organizations/container'
import { SortDirection, AppError } from '../../../types'
import { Button, Icon, Radio, Select, Modal, Alert, Checkbox } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { Filter } from '../../../data/models/organization/model'
import MainMenu from '../../menu/component'
import { NavLink } from 'react-router-dom'
import './component.css'

export interface OrganizationsBrowserProps {
    totalCount: number;
    filteredCount: number;
    sortBy: string;
    filter: Filter;
    searching: boolean;
    error: AppError | null;
    onSearchOrgs: (searchTerms: Array<string>) => void;
    onSortOrgs: (sortField: string, sortDirection: SortDirection) => void;
    onFilterOrgs: (filter: Filter) => void;
}

export interface OrganizationsBrowserState {
    searchInput: string
    filterByRoleType: string
    filterByRole: Array<CheckboxValueType>
    filterByPrivacy: string
    showAdvancedControls: boolean
    // filterByPrivacyType: Array<CheckboxValueType>
}

class OrganizationsBrowser extends React.Component<OrganizationsBrowserProps, OrganizationsBrowserState> {
    searchInput: React.RefObject<HTMLInputElement>;
    searchButton: React.RefObject<Button>;
    filterByRoleValues: Array<any>

    constructor(props: OrganizationsBrowserProps) {
        super(props)

        this.searchInput = React.createRef()
        this.searchButton = React.createRef()

        this.filterByRoleValues = [
            {
                label: 'Member',
                value: 'member'
            },
            {
                label: 'Admin',
                value: 'admin'
            },
            {
                label: 'Owner',
                value: 'owner'
            }
        ]

        this.state = {
            searchInput: '',
            filterByRoleType: 'myorgs',
            filterByRole: [],
            filterByPrivacy: 'any',
            showAdvancedControls: false
        }
    }

    // https://reactjs.org/docs/react-component.html#componentdidmount
    componentDidMount() {
        this.props.onSearchOrgs([])
    }

    doSearch() {
        if (this.searchInput.current === null) {
            return
        }
        const searchTerms = this.searchInput.current.value.split(/[\s+]/)
        // dispatch the search event
        this.props.onSearchOrgs(searchTerms);
    }

    haveSearchInput() {
        if (this.state.searchInput && this.state.searchInput.length > 0) {
            return true
        }
        return false
    }

    onSearchInputChange() {
        let currentSearchInputValue;
        if (this.searchInput.current) {
            currentSearchInputValue = this.searchInput.current.value
        } else {
            currentSearchInputValue = ''
        }
        this.setState({ searchInput: currentSearchInputValue })
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        this.doSearch()
    }

    onSortByChange(value: string) {
        switch (value) {
            case 'owner':
                this.props.onSortOrgs('owner', SortDirection.ASCENDING)
                break
            case 'name':
                this.props.onSortOrgs('name', SortDirection.ASCENDING)
                break
            case 'recentlyAdded':
                this.props.onSortOrgs('created', SortDirection.DESCENDING)
                break
            case 'recentlyChanged':
                this.props.onSortOrgs('changed', SortDirection.DESCENDING)
                break
            case 'memberCount':
                this.props.onSortOrgs('memberCount', SortDirection.DESCENDING)
                break
            case 'narrativeCount':
                this.props.onSortOrgs('narrativeCount', SortDirection.DESCENDING)
                break
        }
    }

    onSortDirectionChange(e: RadioChangeEvent) {
        this.props.onSortOrgs(this.props.sortBy, e.target.value)
    }

    onFilterByRoleTypeChange(e: RadioChangeEvent) {
        let newFilter: Filter
        this.setState({ filterByRoleType: e.target.value })
        if (e.target.value === 'select') {
            this.setState({ filterByRole: [] })
            newFilter = {
                ...this.props.filter,
                roleType: e.target.value
            }
        } else {
            newFilter = {
                ...this.props.filter,
                roleType: e.target.value,
                roles: []
            }
            this.setState({ filterByRole: [] })
        }
        this.props.onFilterOrgs(newFilter)
    }

    onFilterByRoleChange(checkedValues: CheckboxValueType[]) {
        let newFilter: Filter
        this.setState({ filterByRole: checkedValues })
        if (checkedValues.length === 0) {
            this.setState({ filterByRoleType: 'myorgs' })
            newFilter = {
                ...this.props.filter,
                roleType: 'myorgs',
                roles: checkedValues
            } as Filter
        } else {
            this.setState({ filterByRoleType: 'select' })
            newFilter = {
                ...this.props.filter,
                roleType: 'select',
                roles: checkedValues
            } as Filter
        }

        this.props.onFilterOrgs(newFilter)
    }

    onFilterByPrivacyChange(e: RadioChangeEvent) {
        this.setState({ filterByPrivacy: e.target.value })
        const newFilter = {
            ...this.props.filter,
            privacy: e.target.value
        } as Filter
        this.props.onFilterOrgs(newFilter)
    }

    onClearSearch() {
        if (this.searchInput.current === null) {
            return
        }
        this.searchInput.current.value = ''
        this.onSearchInputChange()
        this.doSearch()
    }

    renderSearchFeedback() {
        if (this.props.totalCount === 0) {
            return (
                <div className="OrganizationsBrowser-searchFeedback">
                    None available
                </div>
            )
        }
        if (this.props.filteredCount === 0) {
            return (
                <div className="OrganizationsBrowser-searchFeedback">
                    Ø
                    /
                    {this.props.totalCount}
                    {' '}
                    orgs
                </div>
            )

        }
        if (this.props.totalCount === this.props.filteredCount) {
            return (
                <div className="OrganizationsBrowser-searchFeedback">
                    <b>{this.props.totalCount}</b>
                    {' '}
                    orgs
                </div>
            )
        }

        return (
            <div className="OrganizationsBrowser-searchFeedback">
                <b>{this.props.filteredCount}</b>
                /
                {this.props.totalCount}
                {' '}
                orgs
            </div>
        )
    }

    renderSearchIcon() {
        if (this.props.searching) {
            return (<Icon type="loading" />)
        }
        return (<Icon type="search" />)
    }

    renderSearchForm() {
        return (
            <form id="searchForm" className="OrganizationsBrowser-searchBar" onSubmit={this.onSubmit.bind(this)}>
                <input
                    className="OrganizationsBrowser-searchInput"
                    placeholder="Search Organizations"
                    onChange={this.onSearchInputChange.bind(this)}
                    autoFocus
                    ref={this.searchInput}></input>
                <Button
                    disabled={!this.haveSearchInput()}
                    ref={this.searchButton}
                    form="searchForm"
                    key="submit"
                    htmlType="submit">
                    {this.renderSearchIcon()}
                </Button>
                <Button
                    onClick={this.onClearSearch.bind(this)}
                    disabled={!this.haveSearchInput()}
                    icon="close"
                >
                </Button>
                {this.renderSearchFeedback()}
            </form>
        )
    }

    renderSearchBar() {
        return (
            <div className="OrganizationsBrowser-searchBarRow">
                <div className="OrganizationsBrowser-searchBarCol1">
                    {this.renderSearchForm()}
                </div>
                <div className="OrganizationsBrowser-searchBarCol2">
                    <NavLink to="/newOrganization"><Button icon="plus-circle" style={{ marginRight: '10px' }}>Create Organization</Button></NavLink>

                </div>
                {/* <div className="OrganizationsBrowser-searchBarCol3">
                </div> */}
            </div>
        )
    }

    renderSortByControl() {
        return (
            <Select
                onChange={this.onSortByChange.bind(this)}
                defaultValue={this.props.sortBy}
                dropdownMatchSelectWidth={true}
                style={{ width: '10em' }}>
                <Select.Option value="recentlyChanged" key="changed">Date Changed</Select.Option>
                <Select.Option value="recentlyAdded" key="recent">Date Established</Select.Option>
                <Select.Option value="name" key="name">Org Name</Select.Option>
                <Select.Option value="memberCount" key="memberCount"># members</Select.Option>
                <Select.Option value="narrativeCount" key="narrativeCount"># narratives</Select.Option>
            </Select>
        )
    }

    onToggleAdvanced() {
        // When switching back to basic filter mode, we need to ensure that advanced 
        // filtering is removed.
        if (this.state.showAdvancedControls) {
            this.setState({ showAdvancedControls: false })
            let { roleType, roles, privacy } = this.props.filter
            if (!['myorgs', 'all'].includes(roleType)) {
                roleType = 'myorgs'
                this.setState({ filterByRoleType: 'myorgs' })
            }
            this.setState({ filterByRole: [], filterByPrivacy: 'any' })
            roles = []
            privacy = 'any'
            this.props.onFilterOrgs({
                roleType, roles, privacy
            })
        } else {
            this.setState({ showAdvancedControls: true })
        }
    }

    renderAdvancedToggle() {
        if (this.state.showAdvancedControls) {
            return (
                <Icon
                    type="ellipsis"
                    className="IconButton-hover-pressed"
                    onClick={this.onToggleAdvanced.bind(this)} />
            )
        } else {
            return (
                <Icon
                    type="ellipsis"
                    className="IconButton-hover"
                    onClick={this.onToggleAdvanced.bind(this)} />
            )
        }
    }

    renderFilterByRole() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        }
        if (this.state.showAdvancedControls) {
            return (
                <React.Fragment>
                    <Radio.Group
                        onChange={this.onFilterByRoleTypeChange.bind(this)}
                        value={this.state.filterByRoleType}>

                        <Radio value="myorgs" style={radioStyle}>My Orgs</Radio>
                        <Radio value="all" style={radioStyle}>All Orgs</Radio>
                        {this.renderAdvancedToggle()}
                        <Radio value="notmyorgs" style={radioStyle}>Not My Orgs</Radio>
                        <Radio value="select" style={radioStyle}>Specific Role</Radio>
                    </Radio.Group>

                    <Checkbox.Group
                        options={this.filterByRoleValues}
                        value={this.state.filterByRole}
                        className="OrganizationsBrowser-checkboxGroup"
                        onChange={this.onFilterByRoleChange.bind(this)} />
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Radio.Group
                        onChange={this.onFilterByRoleTypeChange.bind(this)}
                        value={this.state.filterByRoleType}>

                        <Radio value="myorgs" style={radioStyle}>My Orgs</Radio>
                        <Radio value="all" style={radioStyle}>All Orgs</Radio>
                        {this.renderAdvancedToggle()}
                    </Radio.Group>
                </React.Fragment>
            )
        }
    }

    renderFilterByPrivacy() {
        if (!this.state.showAdvancedControls) {
            return
        }
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            margin: '0px'
        }
        return (
            <React.Fragment>
                <Radio.Group
                    onChange={this.onFilterByPrivacyChange.bind(this)}
                    value={this.state.filterByPrivacy}>
                    <Radio value="any" style={radioStyle}>Any</Radio>
                    <Radio value="public" style={radioStyle}>Visible</Radio>
                    <Radio value="private" style={radioStyle}>Hidden</Radio>
                </Radio.Group>
            </React.Fragment>
        )
    }

    renderOrganizations() {
        if (this.props.error) {
            return (
                <Alert
                    type="error"
                    message={this.props.error.code}
                    description={this.props.error.message} />
            )
        } else {
            return (
                <Organizations />
            )
        }
    }

    renderFilterColumn() {
        return (
            <React.Fragment>
                <div className="field-label">sort by</div>
                {this.renderSortByControl()}

                <div className="field-label" style={{ marginTop: '10px' }}>filter</div>

                {this.renderFilterByRole()}

                {this.state.showAdvancedControls ? (
                    <div className="field-label" style={{ marginTop: '10px' }}>visibility</div>
                ) : (null)}
                {this.renderFilterByPrivacy()}

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <hr style={{ border: 0, borderTop: '1px solid rgba(200, 200, 200, 0.4)', width: '80%' }} />
                    <a href="https://docs.google.com/document/d/1xRpFjD3pqPIrHBjNDGht3hX-3y6A0eQRr_v51A5j2hk" target="_blank">FAQ</a>
                </div>
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="OrganizationsBrowser scrollable-flex-column">
                {this.renderSearchBar()}
                <div className="OrganizationsBrowser-bodyRow">
                    <div className="OrganizationsBrowser-bodyCol scrollable-flex-column">
                        {this.renderOrganizations()}
                    </div>
                    <div className="OrganizationsBrowser-filterCol">
                        {this.renderFilterColumn()}
                    </div>
                </div>

            </div>
        )
    }
}

export default OrganizationsBrowser