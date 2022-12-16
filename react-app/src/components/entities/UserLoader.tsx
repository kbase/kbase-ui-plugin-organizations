import { Component } from 'react';
import * as userModel from '../../data/models/user';

interface LoaderProps {
    render: (user: userModel.User) => JSX.Element;
    userId: userModel.Username;
    user: userModel.User | undefined;
    onLoad: (userId: userModel.Username) => void;
}

interface LoaderState {

}

class Loader extends Component<LoaderProps, LoaderState> {


    render() {
        if (this.props.user) {
            return (
                this.props.render(this.props.user)
                // <User user={this.props.user} avatarSize={this.props.avatarSize} />
            );
        } else {
            return (
                <div>
                    <LoadingOutlined />{' '}Loading user...
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