import * as React from 'react';
import { NavLink } from 'react-router-dom'

import Organizations from '../containers/Organizations';
import * as types from '../types';

import './OrganizationsBrowser.css';
import { FaSearch, FaSpinner } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Icon, Radio, Tooltip } from 'antd'
import Header from './Header';
import RadioGroup from 'antd/lib/radio/group';
import { RadioChangeEvent } from 'antd/lib/radio';


class OrganizationsBrowser extends React.Component<types.OrganizationsBrowserProps, types.OrganizationsBrowserState> {

    searchInput: React.RefObject<HTMLInputElement>;
    searchButton: React.RefObject<Button>;

    constructor(props: types.OrganizationsBrowserProps) {
        super(props)

        this.searchInput = React.createRef()
        this.searchButton = React.createRef()

        this.state = {
            searchInput: ''
        }

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

    onSortByChange(e: RadioChangeEvent) {
        this.props.onSortOrgs(e.target.value, this.props.sortDirection)
    }

    onSortDirectionChange(e: RadioChangeEvent) {
        this.props.onSortOrgs(this.props.sortBy, e.target.value)
    }

    onFilterChange(e: RadioChangeEvent) {
        this.props.onFilterOrgs(e.target.value)
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

    renderControlArea() {
        return (
            <div className="OrganizationsBrowser-controlArea">
                {/* {this.renderSortArea()} */}
                {this.renderSortArea2()}
                {this.renderFilterArea2()}
            </div>
        )
    }

    renderSortArea2() {
        return (
            <div className="controlGroup">
                <div className="header">
                    sort
                </div>
                <RadioGroup onChange={this.onSortByChange.bind(this)} value={this.props.sortBy}>
                    <Radio className="radio" value="name">Org name</Radio>
                    <Radio className="radio" value="owner">Owner</Radio>
                </RadioGroup>

                <div style={{ marginTop: '10px' }}>
                    <RadioGroup onChange={this.onSortDirectionChange.bind(this)} value={this.props.sortDirection}>
                        <Radio className="radio" value={types.SortDirection.ASCENDING}><Icon type="sort-ascending" /> Ascending</Radio>
                        <Radio className="radio" value={types.SortDirection.DESCENDING}><Icon type="sort-descending" /> Descending</Radio>
                    </RadioGroup>
                </div>
            </div>
        )
    }

    renderFilterArea2() {
        return (
            <div className="controlGroup">
                <div className="header">
                    filter
                </div>
                <RadioGroup onChange={this.onFilterChange.bind(this)} value={this.props.filter}>
                    <Radio className="radio" value="all">All</Radio>
                    <Radio className="radio" value="owned">Owned by you</Radio>
                    <Radio className="radio" value="notOwned">Owned by others</Radio>
                </RadioGroup>
            </div>
        )
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
                Found
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
                <Tooltip
                    title="Enter one or more words to search organizations by name or owner">
                    <Icon type="info-circle" theme="twoTone" style={{ alignSelf: 'end' }} />
                    {/* <Icon type="info" style={{ alignSelf: 'end' }} /> */}
                </Tooltip>
                <Button
                    disabled={!this.haveSearchInput()}
                    ref={this.searchButton}
                    form="searchForm"
                    key="submit"
                    htmlType="submit">
                    {this.renderSearchIcon()}
                    Search
                </Button>
                <Button
                    onClick={this.onClearSearch.bind(this)}
                    disabled={!this.haveSearchInput()}
                >
                    Show all
                </Button>
                <div className="message">
                    {this.renderSearchFeedback()}
                </div>
            </form>
        )
    }

    renderHeader() {
        return (
            <Header title="Organizations">
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            Browse and Search Organizations
                            </span>
                    </div>
                    <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <NavLink to="/newOrganization"><Button icon="plus-circle">Create Organization</Button></NavLink>
                    </div>
                </div>
            </Header>
        )
    }

    render() {
        return (
            <div className="OrganizationsBrowser">
                {this.renderHeader()}
                <div className="searchBarRow">
                    <div className="col1">
                    </div>
                    <div className="col2">
                        {this.renderSearchBar()}
                    </div>
                </div>
                <div className="bodyRow">
                    <div className="col1">
                        {this.renderControlArea()}
                    </div>
                    <div className="col2">
                        <Organizations />
                    </div>
                </div>
            </div>
        )
    }
}

export default OrganizationsBrowser