import * as React from 'react';
import * as userModel from '../../data/models/user';
import UserWrapped from './UserWrapped';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '../../types';
import * as actions from '../../redux/actions/entities';
import { Icon } from 'antd';

interface LoaderProps {
    userId: userModel.Username;
    render: (user: userModel.User) => JSX.Element;
    user: userModel.User | undefined;
    onLoad: (userId: userModel.Username) => void;
}

interface LoaderState {

}

class Loader extends React.Component<LoaderProps, LoaderState> {


    render() {
        if (this.props.user) {
            return (
                <UserWrapped user={this.props.user} render={this.props.render} />
            );
        } else {
            return (
                <div>
                    <Icon type="loading" />{' '}Loading user {this.props.userId} ...
                </div>
            );
        }
    }

    componentDidMount() {
        if (!this.props.user) {
            this.props.onLoad(this.props.userId);
        }
    }
}



export interface OwnProps {
    userId: userModel.Username;
    render: (user: userModel.User) => JSX.Element;
}

interface StateProps {
    user: userModel.User | undefined;
}

interface DispatchProps {
    onLoad: (userId: userModel.Username) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        user: state.entities.users.byId.get(props.userId)
    };
}

function mapDispatchToProps(dispatch: Dispatch<actions.EntityAction>): DispatchProps {
    return {
        onLoad: (userId: userModel.Username) => {
            dispatch(actions.userLoader(userId) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader);