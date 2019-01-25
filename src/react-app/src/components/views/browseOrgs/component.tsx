import * as React from 'react';
import { NavLink } from 'react-router-dom'

import Organizations from '../../organizations/container';
import { SortDirection, AppError } from '../../../types';

import './component.css';
import { Button, Icon, Radio, Select, Modal, Alert } from 'antd'
import Header from '../../Header';
import { RadioChangeEvent } from 'antd/lib/radio';

export interface OrganizationsBrowserProps {
    totalCount: number;
    filteredCount: number;
    sortBy: string;
    filter: string;
    searching: boolean;
    error: AppError | null;
    onSearchOrgs: (searchTerms: Array<string>) => void;
    onSortOrgs: (sortField: string, sortDirection: SortDirection) => void;
    onFilterOrgs: (filter: string) => void;
}

export interface OrganizationsBrowserState {
    searchInput: string
    showInfo: boolean
    filterType: string
}
class OrganizationsBrowser extends React.Component<OrganizationsBrowserProps, OrganizationsBrowserState> {

    searchInput: React.RefObject<HTMLInputElement>;
    searchButton: React.RefObject<Button>;

    constructor(props: OrganizationsBrowserProps) {
        super(props)

        this.searchInput = React.createRef()
        this.searchButton = React.createRef()

        this.state = {
            searchInput: '',
            showInfo: false,
            filterType: 'myorgs'
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

    onSortDirectionChange2(value: string) {
        this.props.onSortOrgs(this.props.sortBy, value as SortDirection)
    }

    onFilterChange(e: RadioChangeEvent) {
        this.props.onFilterOrgs(e.target.value)
    }

    onFilterChange2(value: string) {
        this.props.onFilterOrgs(value)
    }

    onClearSearch() {
        if (this.searchInput.current === null) {
            return
        }
        this.searchInput.current.value = ''
        this.onSearchInputChange()
        // this.searchButton.current!.handleClick(new MouseEvent<HTMLButtonElement>('click'))
        // const event = new Event('change', { bubbles: true })
        // this.searchInput.current.dispatchEvent(event)
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
                    {' '}
                    organizations
                </span>
            )
        }

        return (
            <span>
                Showing
                {' '}
                {this.props.filteredCount}
                {' '}
                out of
                {' '}
                {this.props.totalCount}
                {' '}
                organizations
            </span>
        )
    }

    renderSearchIcon() {
        if (this.props.searching) {
            return (<Icon type="loading" />)
        }
        return (<Icon type="search" />)
    }

    renderSearchBar() {
        return (
            <form id="searchForm" className="OrganizationsBrowser-searchBar" onSubmit={this.onSubmit.bind(this)}>
                <input
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

                    {/* Show all */}
                </Button>
                {/* <div className="message">
                    {this.renderSearchFeedback()}
                </div> */}
            </form>
        )
    }

    renderHeader() {
        const breadcrumbs = (
            <React.Fragment>
                <span>
                    Browse and Search Organizations
                        </span>
                <Icon type="right" style={{ margin: '0 4px' }} />
                <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>
                    {this.renderSearchFeedback()}
                </span>
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
                <Select.Option value="name" key="name">Org Name</Select.Option>
                {/* <Select.Option value="owner" key="owner">Org owner</Select.Option> */}
                <Select.Option value="recentlyAdded" key="recent">Date Added</Select.Option>
                <Select.Option value="recentlyChanged" key="changed">Date Changed</Select.Option>
                <Select.Option value="newFirst" key="newFirst">New Activity</Select.Option>

            </Select>
        )
    }

    onFilterTypeChange(e: RadioChangeEvent) {
        this.setState({ filterType: e.target.value })
        if (e.target.value === 'myorgs') {
            this.props.onFilterOrgs('memberOf')
        }
    }

    renderFilterControl() {
        return (
            <React.Fragment>
                <Radio.Group
                    onChange={this.onFilterTypeChange.bind(this)}
                    value={this.state.filterType}>
                    <Radio value="myorgs">My Orgs</Radio>
                    <Radio value="filter">Custom Filter</Radio>
                </Radio.Group>
                <Select onChange={this.onFilterChange2.bind(this)}
                    value={this.props.filter}
                    disabled={this.state.filterType !== 'filter'}
                    style={{ width: '16em' }}
                    dropdownMatchSelectWidth={true}>
                    <Select.Option value="all" key="all">All</Select.Option>

                    <Select.Option value="memberOf" key="memberOf">You are a member of</Select.Option>
                    <Select.Option value="notMemberOf" key="memberOf">You are not a member of</Select.Option>

                    <Select.Option value="owned" key="owned">Owned by you</Select.Option>
                    {/* <Select.Option value="notOwned" key="notOwned">Not owned by you</Select.Option> */}

                    <Select.Option value="adminOf" key="adminOf">You administer</Select.Option>

                    {/* <Select.Option value="pending" key="pending">Pending request or invitation</Select.Option>
                    <Select.Option value="groupPending" key="groupPending">Pending group requests</Select.Option> */}
                </Select>
            </React.Fragment>
        )
    }

    renderSearchFilter() {
        return (
            <div>
                <span className="field-label">sort by</span>
                {this.renderSortByControl()}

                <span className="field-label" style={{ marginLeft: '10px' }}>filter</span>
                {this.renderFilterControl()}
            </div>
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

    render() {
        return (
            <div className="OrganizationsBrowser scrollable-flex-column">
                {this.renderHeader()}
                <div className="searchBarRow">
                    <div className="searchBarCol">
                        {this.renderSearchBar()}
                    </div>
                    <div className="sortCol">
                        {this.renderSearchFilter()}
                    </div>
                </div>
                <div className="bodyRow scrollable-flex-column">

                    <div className="col2 scrollable-flex-column">
                        {this.renderOrganizations()}
                    </div>
                    {/* <div className="col1">
                        {this.renderControlArea()}
                    </div> */}
                </div>
            </div>
        )
    }
}

export default OrganizationsBrowser