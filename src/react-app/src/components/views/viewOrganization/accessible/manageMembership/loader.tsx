import * as React from 'react'
import { ManageMembershipView, ComponentLoadingState, StoreState } from '../../../../../types'
import Container from './container'
import Error from '../../../../../combo/error/component'

export interface Props {
    organizationId: string
    view: ManageMembershipView
    onLoad: (organizationId: string) => void
    onUnload: () => void
    onFinish: () => void
}

interface State {
}

class Loader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
    }

    renderLoading() {
        const message = (
            <div>
                Loading ...
                {' '}
                <Spin />
            </div>
        )
        return (
            <Alert type="info" message={message} style={{
                width: '20em',
                padding: '20px',
                margin: '20px auto'
            }} />
        )
    }

    renderError(error: AnError) {
        return (
            <Error error={error} />
        )
    }

    render() {
        switch (this.props.view.loadingState) {
            case ComponentLoadingState.NONE:
                return this.renderLoading()
            case ComponentLoadingState.LOADING:
                return this.renderLoading()
            case ComponentLoadingState.ERROR:
                if (this.props.view.error) {
                    return this.renderError(this.props.view.error)
                } else {
                    return this.renderError(makeError({
                        code: 'missing-error',
                        message: 'The error appears to be missing'
                    }))
                }
            default:
                return (
                    <Container onFinish={this.props.onFinish} />
                )
        }
    }

    componentDidMount() {
        switch (this.props.view.loadingState) {
            case ComponentLoadingState.NONE:
                // should only appear briefly as the LOAD event is processed.
                this.props.onLoad(this.props.organizationId)
        }
    }

    componentWillUnmount() {
        this.props.onUnload()
    }
}

//

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../../../redux/actions/manageMembership'
import { AnError, makeError } from '../../../../../combo/error/api'
import { Spin, Alert } from 'antd';

export interface OwnProps {
    organizationId: string
}

interface StateProps {
    view: ManageMembershipView
}

interface DispatchProps {
    onLoad: (organizationId: string) => void
    onUnload: () => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        view: state.views.manageMembershipView
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

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader)
