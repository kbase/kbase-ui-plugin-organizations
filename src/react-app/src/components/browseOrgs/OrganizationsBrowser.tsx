import * as React from 'react';
import { NavLink } from 'react-router-dom'

import Organizations from './OrganizationsContainer';
import { SortDirection, AppError } from '../../types';

import './OrganizationsBrowser.css';
import { Button, Icon, Radio, Select, Modal, Alert } from 'antd'
import Header from '../Header';
import { RadioChangeEvent } from 'antd/lib/radio';

export interface OrganizationsBrowserProps {
    totalCount: number;
    filteredCount: number;
    sortBy: string;
    sortDirection: SortDirection;
    filter: string;
    searching: boolean;
    error: AppError | null;
    onSearchOrgs: (searchTerms: Array<string>) => void;
    onSortOrgs: (sortBy: string, sortDirection: SortDirection) => void;
    onFilterOrgs: (filter: string) => void;
}

export interface OrganizationsBrowserState {
    searchInput: string
    showInfo: boolean
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
            showInfo: false
        }

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

    onSortByChange(e: RadioChangeEvent) {
        this.props.onSortOrgs(e.target.value, this.props.sortDirection)
    }

    onSortByChange2(value: string) {
        this.props.onSortOrgs(value, this.props.sortDirection)
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
        return (
            <Header>
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            Browse and Search Organizations
                        </span>
                        <Icon type="right" style={{ margin: '0 4px' }} />
                        <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>
                            {this.renderSearchFeedback()}
                        </span>
                    </div>
                    <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <NavLink to="/newOrganization"><Button icon="plus-circle">Create Organization</Button></NavLink>
                        <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
                    </div>

                </div>
            </Header>
        )
    }

    renderSearchFilter() {
        return (
            <div>
                <span className="field-label">sort by</span>
                <Select onChange={this.onSortByChange2.bind(this)}
                    defaultValue={this.props.sortBy}
                    style={{ width: '8em' }}
                    dropdownMatchSelectWidth={true}>
                    <Select.Option value="name" key="name">Org name</Select.Option>
                    <Select.Option value="owner" key="owner">Owner</Select.Option>
                    <Select.Option value="created" key="created">Date created</Select.Option>
                </Select>
                <Select onChange={this.onSortDirectionChange2.bind(this)}
                    style={{ width: '10em' }}
                    dropdownMatchSelectWidth={true}
                    defaultValue={this.props.sortDirection}>
                    <Select.Option value={SortDirection.ASCENDING} key="name"><Icon type="sort-ascending" />Ascending</Select.Option>
                    <Select.Option value={SortDirection.DESCENDING} key="owner"><Icon type="sort-descending" />Descending</Select.Option>
                </Select>
                <span className="field-label" style={{ marginLeft: '10px' }}>filter</span>
                <Select onChange={this.onFilterChange2.bind(this)}
                    defaultValue={this.props.filter}
                    style={{ width: '16em' }}
                    dropdownMatchSelectWidth={true}>
                    <Select.Option value="all" key="all">All</Select.Option>
                    <Select.Option value="memberOf" key="memberOf">You are a member of</Select.Option>
                    <Select.Option value="owned" key="owned">Owned by you</Select.Option>
                    <Select.Option value="notOwned" key="notOwned">Not owned by you</Select.Option>
                    <Select.Option value="pending" key="pending">Pending request or invitation</Select.Option>
                    <Select.Option value="groupPending" key="groupPending">Pending group requests</Select.Option>
                </Select>
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