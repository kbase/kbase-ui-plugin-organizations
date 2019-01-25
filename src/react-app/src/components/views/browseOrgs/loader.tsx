import * as React from 'react'
import { ComponentLoadingState, StoreState, BrowseOrgsView } from '../../../types';
import Container from './container'

// First the loader component, which takes care of a loading view, error view, and the 
// container.

export interface LoaderProps {
    view: BrowseOrgsView
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
        return (
            <div>
                Fetching your orgs and other things...
            </div>
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
                return this.renderLoading()
            case ComponentLoadingState.LOADING:
                return this.renderLoading()
            case ComponentLoadingState.ERROR:
                return this.renderError()
            case ComponentLoadingState.SUCCESS:
                return (
                    <Container sortBy="recentlyChanged" />
                )
        }
    }

    componentDidMount() {
        switch (this.props.view.loadingState) {
            case ComponentLoadingState.NONE:
                // should only appear briefly as the LOAD event is processed.
                this.props.onLoad()
        }
    }

    componentWillUnmount() {
        this.props.onUnload()
    }
}

// THe redux connection

import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../../../redux/actions/browseOrgs'

export interface OwnProps {

}

interface StateProps {
    view: BrowseOrgsView
}

interface DispatchProps {
    onLoad: () => void
    onUnload: () => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        view: state.views.browseOrgsView
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
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