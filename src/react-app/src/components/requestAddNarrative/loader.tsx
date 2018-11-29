import * as React from 'react'

import Container from './container'

export interface Props {
    organizationId: string
    view: types.RequestNarrativeView
    onLoad: (organizationId: string) => void
    onUnload: () => void
}

interface State {
}

class Loader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
    }

    renderLoading() {
        return (
            <div>
                Loading Your Narratives...
            </div>
        )
    }

    renderError(error: types.AppError) {
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

        switch (this.props.view.status) {
            case types.RequestNarrativeState.NONE:
                this.props.onLoad(this.props.organizationId)
                return this.renderLoading()
            case types.RequestNarrativeState.LOADING:
                return this.renderLoading()
            case types.RequestNarrativeState.ERROR:
                if (this.props.view.error) {
                    return this.renderError(this.props.view.error)
                } else {
                    return this.renderError({
                        code: 'Missing Error',
                        message: 'The error appears to be missing'
                    })
                }
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

//

import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../types'
import * as actions from '../../redux/actions/requestAddNarrative'
import RequestAddNarrative from './component';

export interface OwnProps {
    organizationId: string
}

interface StateProps {
    view: types.RequestNarrativeView
}

interface DispatchProps {
    onLoad: (organizationId: string) => void
    onUnload: () => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    return {
        view: state.requestNarrativeView
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
        onLoad: (organizationId: string) => {
            dispatch(actions.load(organizationId) as any)
        },
        onUnload: () => {
            dispatch(actions.unload() as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Loader)