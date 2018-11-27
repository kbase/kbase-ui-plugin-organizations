import * as React from 'react'
import './style.css'
import { BriefUser, User } from '../../types';
import { AutoComplete, Input, Icon } from 'antd';
import UserComponent from '../User'

export interface SearchUsersProps {
    users: Array<BriefUser>
    selectedUser: User | null
    onSearchUsers: (query: string) => void,
    onSelectUser: (username: string) => void
}

export interface SearchUsersState {
    autocompleteMessage: string
}

class SearchUsers extends React.Component<SearchUsersProps, SearchUsersState> {
    lastSearchAt: Date | null
    static searchDebounce: number = 200

    constructor(props: SearchUsersProps) {
        super(props)

        this.lastSearchAt = null;

        this.state = {
            autocompleteMessage: ''
        }
    }

    foundUsers() {
        const users = this.props.users.map(({ username, realname }) => {
            return {
                value: username,
                text: realname + ' (' + username + ')'
            }
        })

        return users
    }

    onSearchUsers(value: string) {
        if (value.length < 3) {
            this.setState({ autocompleteMessage: 'Search begins after 3 or more characters' })
            return
        }
        this.setState({ autocompleteMessage: '' })
        // build up list of users already owning, members of, or with membership pending.
        const excludedUsers: Array<string> = []
        if (this.lastSearchAt === null ||
            (new Date().getTime() - this.lastSearchAt.getTime() > SearchUsers.searchDebounce)) {
            this.lastSearchAt = new Date()
            this.props.onSearchUsers(value)
        }
    }

    onSelectUser(value: string) {
        this.props.onSelectUser(value);
    }

    renderUserSelection() {
        const dataSource = this.foundUsers()
        return (
            <div className="userSelection">
                <AutoComplete
                    onSearch={this.onSearchUsers.bind(this)}
                    onSelect={this.onSelectUser.bind(this)}
                    dataSource={dataSource}
                    className="userAutocomplete" >
                    <Input suffix={<Icon type="search" />} />
                </AutoComplete>
                <div className="autocompleteMessage">
                    {this.state.autocompleteMessage}
                </div>
            </div>
        )
    }

    renderSelectedUser() {
        if (this.props.selectedUser === null) {
            return (
                <div className="selectedUser">
                    <p className="noSelection">
                        No user yet selected
                    </p>
                </div>
            )
        } else {
            return (
                <div className="selectedUser">
                    <UserComponent user={this.props.selectedUser} />
                </div>
            )
        }
    }

    render() {
        return (
            <div className="SelectUser">
                <div className="userSelector">
                    <h4>Search for User (by username or real name</h4>
                    {this.renderUserSelection()}
                </div>
                <div className="userSelection">
                    <h4>Selected User (will appear when selected on left)</h4>
                    {this.renderSelectedUser()}
                </div>
            </div>
        )
    }
}

export default SearchUsers