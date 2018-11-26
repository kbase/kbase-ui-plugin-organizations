import * as React from 'react'

import InviteUserContainer from './InviteUserContainer'
import { InviteUserState } from '../../types';

export interface InviteUserLoaderProps {
    state: InviteUserState,
    organizationId: string,
    onInviteUserLoad: (organizationId: string) => void
}

interface InviteUserLoaderState {

}

class InviteUserLoader extends React.Component<InviteUserLoaderProps, InviteUserLoaderState> {
    constructor(props: InviteUserLoaderProps) {
        super(props)
    }

    renderLoading() {
        return (
            <div>
                Loading...
            </div>
        )
    }

    renderError() {
        return (
            <div>
                Error!
            </div>

        )
    }

    render() {
        console.log('loader', this.props)
        switch (this.props.state) {
            case InviteUserState.NONE:
                this.props.onInviteUserLoad(this.props.organizationId)
                return this.renderLoading()
            case InviteUserState.LOADING:
                return this.renderLoading()
            case InviteUserState.ERROR:
                return this.renderError()
            case InviteUserState.READY:
                return (
                    <InviteUserContainer />
                )
        }


    }
}

// The container component -- just in this file!
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../types'
import * as actions from '../../redux/actions/inviteUser'
// import ViewMembers from './component'

export interface OwnProps {
    organizationId: string
}

interface StateProps {
    state: types.InviteUserState
}

interface DispatchProps {
    onInviteUserLoad: (organizationId: string) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    console.log('mapping state to props', props)
    return {
        state: state.inviteUserView.state
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.InviteUserLoad>): DispatchProps {
    return {
        onInviteUserLoad: (organizationId: string) => {
            dispatch(actions.inviteUserLoad(organizationId) as any)
        }
    }
}


export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(InviteUserLoader)