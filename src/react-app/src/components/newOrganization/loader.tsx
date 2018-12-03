import * as React from 'react'

import { AppError, AddOrgView, ComponentLoadingState, StoreState } from '../../types'
import Container from './container'
import './loader.css'

interface LoaderProps {
    view: AddOrgView
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
                Loading "Add New Organization" form...
            </div>
        )
    }

    renderError(error: AppError) {
        return (
            <div>
                Error!
                <div>
                    {error.message}
                </div>
            </div>
        )
    }

    render() {
        switch (this.props.view.loadingStatus) {
            case ComponentLoadingState.NONE:
                this.props.onLoad()
                return this.renderLoading()
            case ComponentLoadingState.LOADING:
                return this.renderLoading()
            case ComponentLoadingState.ERROR:
                if (this.props.view.error) {
                    return this.renderError(this.props.view.error)
                } else {
                    return this.renderError({
                        code: 'Missing Error',
                        message: 'The error appears to be missing'
                    })
                }
            case ComponentLoadingState.SUCCESS:
            default:
                return (
                    <Container />
                )
        }
    }

    componentWillUnmount() {
        this.props.onUnload()
    }
}

// redux interface

import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions/addOrg'

export interface OwnProps {

}

interface StateProps {

}

interface DispatchProps {
    onLoad: () => void
    onUnload: () => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        view: state.addOrgView
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.Load | actions.Unload>): DispatchProps {
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