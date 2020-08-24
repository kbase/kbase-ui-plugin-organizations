import * as React from 'react';
import Organizations from './organizations/component';
import { Button, Radio, Select, Alert, Checkbox, Input } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { Filter, BriefOrganization, OrganizationID, RequestStatus } from '../../../data/models/organization/model';
import './component.css';
import { AppError } from '@kbase/ui-components';
import { SortDirection } from '../../../redux/store/types/common';
import {
    LoadingOutlined, SearchOutlined, EllipsisOutlined, PlusCircleOutlined
} from '@ant-design/icons';
import Search from 'antd/lib/input/Search';
import Linker from '../../Linker';

export interface OrganizationsBrowserProps {
    totalCount: number;
    filteredCount: number;
    sortBy: string;
    filter: Filter;
    searching: boolean;
    error: AppError | null;
    organizations: Array<BriefOrganization>;
    openRequests: Map<OrganizationID, RequestStatus>;
    onSearchOrgs: (searchTerms: Array<string>) => void;
    onSortOrgs: (sortField: string, sortDirection: SortDirection) => void;
    onFilterOrgs: (filter: Filter) => void;
}

export interface OrganizationsBrowserState {
    // searchInput: string;
    filterByRoleType: string;
    filterByRole: Array<CheckboxValueType>;
    filterByPrivacy: string;
    showAdvancedControls: boolean;
    // filterByPrivacyType: Array<CheckboxValueType>
}

class OrganizationsBrowser extends React.Component<OrganizationsBrowserProps, OrganizationsBrowserState> {
    searchInput: React.RefObject<Input>;
    searchButton: React.RefObject<HTMLButtonElement>;
    filterByRoleValues: Array<any>;
    searchText: string;
    constructor(props: OrganizationsBrowserProps) {
        super(props);

        this.searchInput = React.createRef();
        this.searchButton = React.createRef();

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
        ];

        this.searchText = '';
        this.state = {
            // searchInput: '',
            filterByRoleType: 'myorgs',
            filterByRole: [],
            filterByPrivacy: 'any',
            showAdvancedControls: false
        };
    }

    // https://reactjs.org/docs/react-component.html#componentdidmount
    componentDidMount() {
        this.props.onSearchOrgs([]);
    }

    doSearch() {
        // if (this.state.searchInput === null) {
        //     return;
        // }
        const searchTerms = this.searchText.split(/[\s+]/);
        // dispatch the search event
        this.props.onSearchOrgs(searchTerms);
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.doSearch();
    }

    onSortByChange(value: string) {
        switch (value) {
            case 'owner':
                this.props.onSortOrgs('owner', SortDirection.ASCENDING);
                break;
            case 'name':
                this.props.onSortOrgs('name', SortDirection.ASCENDING);
                break;
            case 'recentlyAdded':
                this.props.onSortOrgs('created', SortDirection.DESCENDING);
                break;
            case 'recentlyChanged':
                this.props.onSortOrgs('changed', SortDirection.DESCENDING);
                break;
            case 'memberCount':
                this.props.onSortOrgs('memberCount', SortDirection.DESCENDING);
                break;
            case 'narrativeCount':
                this.props.onSortOrgs('narrativeCount', SortDirection.DESCENDING);
                break;
        }
    }

    onSortDirectionChange(e: RadioChangeEvent) {
        this.props.onSortOrgs(this.props.sortBy, e.target.value);
    }

    onFilterByRoleTypeChange(e: RadioChangeEvent) {
        let newFilter: Filter;
        this.setState({ filterByRoleType: e.target.value });
        if (e.target.value === 'select') {
            this.setState({ filterByRole: [] });
            newFilter = {
                ...this.props.filter,
                roleType: e.target.value
            };
        } else {
            newFilter = {
                ...this.props.filter,
                roleType: e.target.value,
                roles: []
            };
            this.setState({ filterByRole: [] });
        }
        this.props.onFilterOrgs(newFilter);
    }

    onFilterByRoleChange(checkedValues: CheckboxValueType[]) {
        let newFilter: Filter;
        this.setState({ filterByRole: checkedValues });
        if (checkedValues.length === 0) {
            this.setState({ filterByRoleType: 'myorgs' });
            newFilter = {
                ...this.props.filter,
                roleType: 'myorgs',
                roles: checkedValues
            } as Filter;
        } else {
            this.setState({ filterByRoleType: 'select' });
            newFilter = {
                ...this.props.filter,
                roleType: 'select',
                roles: checkedValues
            } as Filter;
        }

        this.props.onFilterOrgs(newFilter);
    }

    onFilterByPrivacyChange(e: RadioChangeEvent) {
        this.setState({ filterByPrivacy: e.target.value });
        const newFilter = {
            ...this.props.filter,
            privacy: e.target.value
        } as Filter;
        this.props.onFilterOrgs(newFilter);
    }

    onSearch(value: string) {
        this.searchText = value;
        this.doSearch();
    }

    renderSearchFeedback() {
        if (this.props.totalCount === 0) {
            return (
                <div className="OrganizationsBrowser-searchFeedback">
                    None available
                </div>
            );
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
            );

        }
        if (this.props.totalCount === this.props.filteredCount) {
            return (
                <div className="OrganizationsBrowser-searchFeedback">
                    <b>{this.props.totalCount}</b>
                    {' '}
                    orgs
                </div>
            );
        }

        return (
            <div className="OrganizationsBrowser-searchFeedback">
                <b>{this.props.filteredCount}</b>
                /
                {this.props.totalCount}
                {' '}
                orgs
            </div>
        );
    }

    renderSearchIcon() {
        if (this.props.searching) {
            return (<LoadingOutlined />);
        }
        return (<SearchOutlined />);
    }

    renderSearchForm() {
        return (
            <div id="searchForm"
                className="OrganizationsBrowser-searchBar"
            >
                <Search
                    placeholder="Search Organizations"
                    onSearch={this.onSearch.bind(this)}
                    allowClear={true}
                />

                {this.renderSearchFeedback()}
            </div>
        );
    }

    renderSearchBar() {
        return (
            <div className="OrganizationsBrowser-searchBarRow">
                <div className="OrganizationsBrowser-searchBarCol1">
                    {this.renderSearchForm()}
                </div>
                <div className="OrganizationsBrowser-searchBarCol2">
                    <Linker to="/orgs/new"><Button type="primary" icon={<PlusCircleOutlined />} style={{ marginRight: '10px' }}>Create Organization</Button></Linker>

                </div>
                {/* <div className="OrganizationsBrowser-searchBarCol3">
                </div> */}
            </div>
        );
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
        );
    }

    onToggleAdvanced() {
        // event: React.MouseEvent<HTMLAnchorElement>
        // event.preventDefault();
        // When switching back to basic filter mode, we need to ensure that advanced 
        // filtering is removed.
        if (this.state.showAdvancedControls) {
            this.setState({ showAdvancedControls: false });
            let { roleType, roles, privacy } = this.props.filter;
            if (!['myorgs', 'all'].includes(roleType)) {
                roleType = 'myorgs';
                this.setState({ filterByRoleType: 'myorgs' });
            }
            this.setState({ filterByRole: [], filterByPrivacy: 'any' });
            roles = [];
            privacy = 'any';
            this.props.onFilterOrgs({
                roleType, roles, privacy
            });
        } else {
            this.setState({ showAdvancedControls: true });
        }
    }

    renderAdvancedToggle() {
        if (this.state.showAdvancedControls) {
            return <Button type="dashed" 
                        style={{fontStyle: 'italic'}}
                        size="small" 
                        onClick={this.onToggleAdvanced.bind(this)}>
                fewer filter options
            </Button>;
            // return <a onClick={this.onToggleAdvanced.bind(this)}>
            //     fewer filter options
            // </a>;
            // return (
            //     <EllipsisOutlined
            //         className="IconButton-hover-pressed"
            //         onClick={this.onToggleAdvanced.bind(this)} />
            // );
        } else {
            return <Button type="dashed" 
                        style={{fontStyle: 'italic'}}
                        size="small" 
                        onClick={this.onToggleAdvanced.bind(this)}>
                more filter options
            </Button>;
            // return <a type="link" onClick={this.onToggleAdvanced.bind(this)}>
            //     more filter options
            // </a>;
            // return (
            //     <EllipsisOutlined
            //         className="IconButton-hover"
            //         onClick={this.onToggleAdvanced.bind(this)} />
            // );
        }
    }

    renderFilterByRole() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        };
        if (this.state.showAdvancedControls) {
            return (
                <React.Fragment>
                    
                    <Radio.Group
                        onChange={this.onFilterByRoleTypeChange.bind(this)}
                        value={this.state.filterByRoleType}>

                        <Radio value="myorgs" style={radioStyle}>My Orgs</Radio>
                        <Radio value="all" style={radioStyle}>All Orgs</Radio>
                        
                        <Radio value="notmyorgs" style={radioStyle}>Not My Orgs</Radio>
                        <Radio value="select" style={radioStyle}>Specific Role</Radio>
                    </Radio.Group>

                    <Checkbox.Group
                        options={this.filterByRoleValues}
                        value={this.state.filterByRole}
                        className="OrganizationsBrowser-checkboxGroup"
                        onChange={this.onFilterByRoleChange.bind(this)} />
                    
                    {this.renderAdvancedToggle()}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    
                    <Radio.Group
                        onChange={this.onFilterByRoleTypeChange.bind(this)}
                        value={this.state.filterByRoleType}>

                        <Radio value="myorgs" style={radioStyle}>My Orgs</Radio>
                        <Radio value="all" style={radioStyle}>All Orgs</Radio>
                    </Radio.Group>

                    {this.renderAdvancedToggle()}
                </React.Fragment>
            );
        }
    }

    renderFilterByPrivacy() {
        if (!this.state.showAdvancedControls) {
            return;
        }
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            margin: '0px'
        };
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
        );
    }

    renderOrganizations() {
        if (this.props.error) {
            return (
                <Alert
                    type="error"
                    message={this.props.error.code}
                    description={this.props.error.message} />
            );
        } else {
            let myOrgsUnfiltered: boolean;
            // TODO: the filter values should be enums.
            if (this.props.filter.roleType === 'myorgs' &&
                this.props.filter.roles.length === 0 &&
                this.props.filter.privacy === 'any' &&
                // todo should be based on parsed search
                (this.searchText.length === 0)) {
                myOrgsUnfiltered = true;
            } else {
                myOrgsUnfiltered = false;
            }

            return (
                <Organizations
                    myOrgsUnfiltered={myOrgsUnfiltered}
                    organizations={this.props.organizations}
                    openRequests={this.props.openRequests}
                />
            );
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
                    <a href="https://docs.kbase.us/getting-started/narrative/orgs" target="_blank" rel="noopener noreferrer">FAQ</a>
                </div>
            </React.Fragment>
        );
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
        );
    }
}

export default OrganizationsBrowser;