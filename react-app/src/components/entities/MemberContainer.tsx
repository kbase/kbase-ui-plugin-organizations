import React from 'react';
import * as userModel from '../../data/models/user';
import Member from './Member';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '../../redux/store/types';
import * as actions from '../../redux/actions/entities';
import * as orgModel from '../../data/models/organization/model';
import { LoadingOutlined } from '@ant-design/icons';

interface LoaderProps {
    member: orgModel.Member;
    user: userModel.User | undefined;
    avatarSize: number;
    onLoad: (userId: userModel.Username) => void;
}

interface LoaderState {

}

class Loader extends React.Component<LoaderProps, LoaderState> {


    render() {
        if (this.props.user) {
            return (
                <Member member={this.props.member} user={this.props.user} avatarSize={this.props.avatarSize} />
            );
        } else {
            return (
                <div>
                    <LoadingOutlined />{' '}Loading member...
                </div>
            );
        }
    }

    componentDidMount() {
        if (!this.props.user) {
            this.props.onLoad(this.props.member.username);
        }
    }
}



export interface OwnProps {
    member: orgModel.Member;
    avatarSize: number;
}

interface StateProps {
    user: userModel.User | undefined;
}

interface DispatchProps {
    onLoad: (userId: userModel.Username) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        user: state.entities.users.byId.get(props.member.username)
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