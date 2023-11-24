import { Component } from 'react';
import * as userModel from '../../data/models/user';

export interface UserProps {
    user: userModel.User;
    render: (user: userModel.User) => JSX.Element;
}

interface UserState {
}

class User extends Component<UserProps, UserState> {
    render() {
        return (
            this.props.render(this.props.user)
        );
    }
}

export default User;