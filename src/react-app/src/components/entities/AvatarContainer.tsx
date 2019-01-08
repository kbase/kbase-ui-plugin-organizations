import * as React from 'react'
import * as userModel from '../../data/models/user'
import Avatar from './Avatar'

interface LoaderProps {
    userId: userModel.Username
    user: userModel.User | undefined
    size: number
    onLoad: (userId: userModel.Username) => void
}

interface LoaderState {

}

class Loader extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props)
    }

    render() {
        if (this.props.user) {
            return (
                <Avatar user={this.props.user} size={this.props.size} />
            )
        } else {
            return (
                <div>
                    Loading user...
                </div>
            )
        }
    }

    componentDidMount() {
        if (!this.props.user) {
            this.props.onLoad(this.props.userId)
        }
    }
}

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { StoreState } from '../../types';
import * as actions from '../../redux/actions/entities'


export interface OwnProps {
    userId: userModel.Username
    size: number
}

interface StateProps {
    user: userModel.User | undefined
}

interface DispatchProps {
    onLoad: (userId: userModel.Username) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        user: state.entities.users.byId.get(props.userId)
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.EntityAction>): DispatchProps {
    return {
        onLoad: (userId: userModel.Username) => {
            dispatch(actions.userLoader(userId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader)