import * as React from 'react'

import InviteUserContainer from './InviteUserContainer'
import { ComponentLoadingState } from '../../types';

export interface InviteUserLoaderProps {
    loadingState: ComponentLoadingState,
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
        switch (this.props.loadingState) {
            case ComponentLoadingState.NONE:
                this.props.onInviteUserLoad(this.props.organizationId)
                return this.renderLoading()
            case ComponentLoadingState.LOADING:
                return this.renderLoading()
            case ComponentLoadingState.ERROR:
                return this.renderError()
            case ComponentLoadingState.SUCCESS:
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
    loadingState: types.ComponentLoadingState
}

interface DispatchProps {
    onInviteUserLoad: (organizationId: string) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    return {
        loadingState: state.inviteUserView.loadingState
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