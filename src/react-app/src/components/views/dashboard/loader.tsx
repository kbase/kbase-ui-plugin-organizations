import * as React from 'react'
import { ComponentLoadingState, AppError, DashboardViewModel, DashboardView, StoreState } from '../../../types';
import Container from './container'

// First the loader component, which takes care of a loading view, error view, and the 
// container.

export interface LoaderProps {
    view: DashboardView
    onLoad: () => void
    onUnload: () => void
}

interface LoaderState {

}

class Loader extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props)
    }

    renderLoading() {
        const message = (
            <div>
                Loading your organizations...
                {' '}
                <Spin />
            </div>
        )
        return (
            <Alert type="info" message={message} style={{ width: '30em', margin: '20px auto' }} />
        )
    }

    renderError() {
        if (!this.props.view.error) {
            return
        }
        return (
            <div>
                Error! {this.props.view.error.message}
            </div>
        )
    }

    render() {
        switch (this.props.view.loadingState) {
            case ComponentLoadingState.NONE:
                // should only appear briefly as the LOAD event is processed.
                this.props.onLoad()
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

    componentWillUnmount() {
        this.props.onUnload()
    }
}

// THe redux connection

import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../../../redux/actions/dashboard'
import { Alert, Spin } from 'antd';

export interface OwnProps {

}

interface StateProps {
    view: DashboardView
}

interface DispatchProps {
    onLoad: () => void
    onUnload: () => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        view: state.views.dashboardView
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.DashboardAction<any>>): DispatchProps {
    return {
        onLoad: () => {
            dispatch(actions.load() as any)
        },
        onUnload: () => {
            dispatch(actions.unload() as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader)