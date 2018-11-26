import * as React from 'react'

import { ComponentLoadingState } from '../../types'
import Container from './container'

export interface LoaderProps {
    organizationId: string,
    loadingState: ComponentLoadingState,
    onLoad: (organizationId: string) => void
}

interface LoaderState {

}

class Loader extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props)
    }

    renderLoading() {
        return (
            <div>
                Loading...
            </div>
        )
    }

    render() {
        switch (this.props.loadingState) {
            case ComponentLoadingState.NONE:
                this.props.onLoad(this.props.organizationId)
                return this.renderLoading()
            case ComponentLoadingState.LOADING:
                return this.renderLoading()
            case ComponentLoadingState.SUCCESS:
                return (
                    <Container />
                )
        }
    }
}

import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../types'
import * as actions from '../../redux/actions/manageOrganizationRequests'

// org id fed from the url
export interface OwnProps {
    organizationId: string
}

// we unpack the view state?
interface StateProps {
    loadingState: types.ComponentLoadingState
}

// the loader can just load this view
interface DispatchProps {
    onLoad: (organizationId: string) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    return {
        loadingState: state.manageOrganizationRequestsView.state
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ManageOrganizationRequests>): DispatchProps {
    return {
        onLoad: (organizationId: string) => {
            dispatch(actions.manageOrganizationRequests(organizationId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Loader)