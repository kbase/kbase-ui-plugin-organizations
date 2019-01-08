import * as React from 'react'

import Container from './container'
import { ComponentLoadingState, StoreState } from '../../../types';

export interface InviteUserLoaderProps {
    loadingState: ComponentLoadingState
    organizationId: string
    onInviteUserLoad: (organizationId: string) => void
    onUnload: () => void
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
                Loading Users...
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
                return this.renderLoading()
            case ComponentLoadingState.LOADING:
                return this.renderLoading()
            case ComponentLoadingState.ERROR:
                return this.renderError()
            case ComponentLoadingState.SUCCESS:
                return (
                    <Container />
                )
        }
    }

    componentDidMount() {
        switch (this.props.loadingState) {
            case ComponentLoadingState.NONE:
                // should only appear briefly as the LOAD event is processed.
                this.props.onInviteUserLoad(this.props.organizationId)
        }
    }

    componentWillUnmount() {
        this.props.onUnload()
    }
}

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actions/inviteUser'

export interface OwnProps {
    organizationId: string
}

interface StateProps {
    loadingState: ComponentLoadingState
}

interface DispatchProps {
    onInviteUserLoad: (organizationId: string) => void
    onUnload: () => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        loadingState: state.views.inviteUserView.loadingState
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
        onInviteUserLoad: (organizationId: string) => {
            dispatch(actions.load(organizationId) as any)
        },
        onUnload: () => {
            dispatch(actions.unload() as any)
        }
    }
}


export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(InviteUserLoader)