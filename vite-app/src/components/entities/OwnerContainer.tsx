import { LoadingOutlined } from '@ant-design/icons';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as orgModel from '../../data/models/organization/model';
import * as userModel from '../../data/models/user';
import * as actions from '../../redux/actions/entities';
import { StoreState } from '../../redux/store/types';
import Owner from './Owner';

interface LoaderProps {
    username: orgModel.Username;
    user: userModel.User | undefined;
    avatarSize: number;
    showAvatar: boolean;
    onLoad: (userId: userModel.Username) => void;
}

interface LoaderState {
}

class Loader extends Component<LoaderProps, LoaderState> {
    times: number;
    constructor(props: LoaderProps) {
        super(props);
        this.times = 0;
    }

    render() {
        this.times += 1;
        if (this.props.user) {
            return (
                <Owner user={this.props.user} avatarSize={this.props.avatarSize} showAvatar={this.props.showAvatar} />
            );
        } else {
            return (
                <div>
                    <LoadingOutlined />{' '}Loading owner...
                </div>
            );
        }
    }

    componentDidMount() {
        if (!this.props.user) {
            this.props.onLoad(this.props.username);
        }
    }
}

// Redux Interface

export interface OwnProps {
    username: orgModel.Username;
    avatarSize: number;
    showAvatar: boolean;
}

interface StateProps {
    user: userModel.User | undefined;
}

interface DispatchProps {
    onLoad: (userId: userModel.Username) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        user: state.entities.users.byId.get(props.username)
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