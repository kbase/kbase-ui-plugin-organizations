import * as React from 'react';
import {NavLink} from 'react-router-dom'

import Organizations from '../containers/Organizations';
import * as types from '../types';

import './OrganizationsBrowser.css';
import {FaSearch} from 'react-icons/fa'


class OrganizationsBrowser extends React.Component<types.OrganizationsBrowserProps, types.OrganizationsBrowserState> {

    searchInput: React.RefObject<HTMLInputElement>;
    sortBy: string;
    sortDescending: boolean;

    constructor(props: types.OrganizationsBrowserProps) {
        super(props)

        this.searchInput = React.createRef(); 

        this.sortBy = 'createdAt';
        this.sortDescending = false;
        
        this.state = {
            sortBy: 'createdAt',
            sortDescending: false,
            showAll: true,
            filterYourOrgs: false
        }

        // this.onSearchOrgs = this.props.onSearchOrgs
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (this.searchInput.current === null) {
            return 
        }
        const searchTerms = this.searchInput.current.value.split(/[\s+]/)
        // dispatch the search event
        this.props.onSearchOrgs(searchTerms);
    }

    onSortByChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist()
        this.sortBy = e.target.value
        this.props.onSortOrgs(this.sortBy, this.sortDescending)
        // this.setState({sortBy: e.target.value})
    }

    onSortDirectionChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist()
        this.sortDescending = e.target.value === 'descending';
        this.props.onSortOrgs(this.sortBy, this.sortDescending)
    }

    renderControlArea() {
        return (
            <div className="OrganizationsBrowser-controlArea">
                {this.renderSortArea()}
                {this.renderFilterArea()}
            </div>
        )
    }

    renderSortArea() {
        return (
            <div className="controlGroup">
                <div className="header">
                    sort
                </div>
                
                <div className="row">
                    <div className="col1">
                        {/* TODO: either use radio, but just use native checked behavior with initial
                               checked set by props, or use an icon based radio with display class set
                               by state. */}
                        <input type="radio" name="sortBy" value="name"
                               checked={this.props.sortBy === 'name'}
                               onChange={this.onSortByChange.bind(this)}></input>
                    </div>
                    <div className="col2">
                        Org name
                    </div>
                </div>
                <div className="row">
                    <div className="col1">
                        <input type="radio" name="sortBy" value="createdAt"
                               checked={this.props.sortBy === 'createdAt'}
                               onChange={this.onSortByChange.bind(this)}></input>
                    </div>
                    <div className="col2">
                        Created
                    </div>
                </div>
                <div className="row">
                    <div className="col1">
                        <input type="radio" name="sortBy" value="modifiedAt"
                               checked={this.props.sortBy === 'modifiedAt'}
                               onChange={this.onSortByChange.bind(this)}></input>
                    </div>
                    <div className="col2">
                        Last updated
                    </div>
                </div>
                <div className="row">
                    <div className="col1">
                        <input type="radio" name="sortBy" value="owner"
                               checked={this.props.sortBy === 'owner'}
                               onChange={this.onSortByChange.bind(this)}></input>
                    </div>
                    <div className="col2">
                        Owner
                    </div>
                </div>

                <br />

                <div className="row">
                    <div className="col1">
                        <input type="radio" name="sortDirection" value="ascending"
                               checked={!this.props.sortDescending}
                               onChange={this.onSortDirectionChange.bind(this)}></input>
                    </div>
                    <div className="col2">
                        Ascending
                    </div>
                </div>
                <div className="row">
                    <div className="col1">
                        <input type="radio" name="sortDirection" value="descending"
                               checked={this.props.sortDescending}
                               onChange={this.onSortDirectionChange.bind(this)}></input>
                    </div>
                    <div className="col2">
                        Descending
                    </div>
                </div>
                
            </div>
        )
    }

    renderFilterArea() {
        return (
            <div className="controlGroup">
                <div className="header">
                    filter
                </div>
                
                <div className="row">
                    <div className="col1">
                        <input type="radio" name="filterAll"></input>
                    </div>
                    <div className="col2">
                        Show All (no filter)
                    </div>
                </div>
                <div className="row">
                    <div className="col1">
                        <input type="radio" name="filterAll"></input>
                    </div>
                    <div className="col2">
                        Filter by:
                    </div>
                </div>
                <div className="row">
                    <div className="col1">
                        <input type="checkbox"></input>
                    </div>
                    <div className="col2">
                        Your Orgs
                    </div>
                </div>
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
                </span>
            )

        }
        if (this.props.totalCount === this.props.filteredCount) {
            return (
                <span>
                Found
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

    renderSearchBar() {
        return (
            <form className="OrganizationsBrowser-searchBar" onSubmit={this.onSubmit.bind(this)}>
                <div className="col1">
                    <input placeholder="Search Organizations" ref={this.searchInput}></input>
                    <button type="submit">
                        <FaSearch />
                        {' '}
                        Search
                    </button>
                    <div className="message">
                    {this.renderSearchFeedback()}
                    </div>
                </div>
                <div className="col2">
                    <NavLink to="/newOrganization">Create Organization</NavLink>
                </div>
            </form>
        )
    }

    render() {
        return (
            <div className="OrganizationsBrowser">
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