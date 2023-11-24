import { Component } from 'react';
import * as userModel from '../../data/models/user';
import Avatar from './Avatar';

interface LoaderProps {
    userId: userModel.Username;
    user: userModel.User | undefined;
    size: number;
    onLoad: (userId: userModel.Username) => void;
}

interface LoaderState {

}

class Loader extends Component<LoaderProps, LoaderState> {


    render() {
        if (this.props.user) {
            return (
                <Avatar user={this.props.user} size={this.props.size} />
            );
        } else {
            return (
                <div>
                    <LoadingOutlined />{' '}Loading avatar...
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

import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actions from '../../redux/actions/entities';
import { StoreState } from '../../redux/store/types';


export interface OwnProps {
    userId: userModel.Username;
    size: number;
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