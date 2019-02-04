import * as React from 'react';

import Organizations from './organizations/container';
import { SortDirection, AppError } from '../../../types';

import './component.css';
import { Button, Icon, Radio, Select, Modal, Alert, Checkbox } from 'antd'
import Header from '../../Header';
import { RadioChangeEvent } from 'antd/lib/radio';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { Filter } from '../../../data/models/organization/model';
import MainMenu from '../../menu/component';

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
    showInfo: boolean
    filterByRoleType: string
    filterByRole: Array<CheckboxValueType>
    filterByPrivacy: string
    showAdvancedControls: boolean
    // filterByPrivacyType: Array<CheckboxValueType>
}

type CBVT = CheckboxValueType

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
            showInfo: false,
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

    onShowInfo() {
        Modal.info({
            title: 'Organizations Browser Help',
            width: '50em',
            content: (
                <div>
                    <p>This is the organizations browser...</p>
                </div>
            )
        })
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
                <span>
                    No organizations in the system
                </span>
            )
        }
        if (this.props.filteredCount === 0) {
            return (
                <span>
                    No organizations found out of
                    {' '}
                    {this.props.totalCount}
                    {' '}
                    available.
                </span>
            )

        }
        if (this.props.totalCount === this.props.filteredCount) {
            return (
                <span>
                    Showing all
                    {' '}
                    {this.props.totalCount}
                </span>
            )
        }

        return (
            <span>
                Found
                {' '}
                {this.props.filteredCount}
                {' '}
                out of
                {' '}
                {this.props.totalCount}
            </span>
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
                {/* <Tooltip
                    title="Enter one or more words to search organizations by name or owner">
                    <Icon type="info-circle" theme="twoTone" style={{ alignSelf: 'end' }} />
                </Tooltip> */}
                <Button
                    disabled={!this.haveSearchInput()}
                    ref={this.searchButton}
                    form="searchForm"
                    key="submit"
                    htmlType="submit">
                    {this.renderSearchIcon()}
                    {/* Search */}
                </Button>
                <Button
                    onClick={this.onClearSearch.bind(this)}
                    disabled={!this.haveSearchInput()}
                    icon="close"
                >
                </Button>

            </form>
        )
    }

    renderSearchBar() {
        return (
            <div className="OrganizationsBrowser-searchBarRow">
                <div className="OrganizationsBrowser-searchBarCol1">

                </div>
                <div className="OrganizationsBrowser-searchBarCol2">
                    {this.renderSearchForm()}
                </div>
                <div className="OrganizationsBrowser-searchBarCol3">
                    {this.renderSearchFeedback()}
                </div>
            </div>
        )
    }

    renderHeader() {
        const breadcrumbs = (
            <React.Fragment>
            </React.Fragment>
        )
        const buttons = (
            <React.Fragment>
                {/* <NavLink to="/newOrganization"><Button icon="plus-circle">Create Organization</Button></NavLink> */}
                <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
            </React.Fragment>
        )
        return (
            <Header breadcrumbs={breadcrumbs} buttons={buttons} />
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
                {/* <Select.Option value="owner" key="owner">Org owner</Select.Option> */}
                {/* <Select.Option value=""newFirst key="newFirst">New Activity</Select.Option> */}
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
        const checkboxStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            margin: '0 0 0 6px'
        }
        return (
            <React.Fragment>
                <Radio.Group
                    onChange={this.onFilterByPrivacyChange.bind(this)}
                    value={this.state.filterByPrivacy}>
                    <Radio value="any" style={radioStyle}>Any</Radio>
                    <Radio value="public" style={radioStyle}>Public</Radio>
                    <Radio value="private" style={radioStyle}>Private</Radio>
                </Radio.Group>
            </React.Fragment >
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
                    <div className="field-label" style={{ marginTop: '10px' }}>by privacy</div>
                ) : (null)}
                {this.renderFilterByPrivacy()}
            </React.Fragment>
        )
    }

    renderMenuButtons() {
        return (
            <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
        )
    }

    render() {
        return (
            <div className="OrganizationsBrowser scrollable-flex-column">
                <MainMenu buttons={this.renderMenuButtons()} />
                {/* {this.renderHeader()} */}
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