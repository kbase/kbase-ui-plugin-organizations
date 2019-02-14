import * as React from 'react'

import Container from './container'
import {
    StoreState, ViewOrgViewModelKind, ViewState,
    InviteUserViewModel, View, NoneViewModel
} from '../../../../../types';

export interface InviteUserLoaderProps {
    view: View<InviteUserViewModel | NoneViewModel>
    organizationId: string
    onLoad: (organizationId: string) => void
    onUnload: () => void
    onFinish: () => void
}

interface InviteUserLoaderState {
}

class InviteUserLoader extends React.Component<InviteUserLoaderProps, InviteUserLoaderState> {
    constructor(props: InviteUserLoaderProps) {
        super(props)
    }

    renderLoading() {
        const message = (
            <div>
                Loading Related Organizations Manager...
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
            <div>
                Error!
                <div>
                    {error.message}
                </div>
            </div>
        )
    }

    render() {
        switch (this.props.view.state) {
            case ViewState.NONE:
                return this.renderLoading()
            case ViewState.LOADING:
                return this.renderLoading()
            case ViewState.ERROR:
                if (this.props.view.error) {
                    return this.renderError(this.props.view.error)
                } else {
                    return this.renderError(makeError({
                        code: 'Missing Error',
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
        switch (this.props.view.state) {
            case ViewState.NONE:
                this.props.onLoad(this.props.organizationId)
        }
    }

    componentWillUnmount() {
        this.props.onUnload()
    }
}

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../../../redux/actions/viewOrganization/inviteUser'
import { Spin, Alert } from 'antd';
import { AnError, makeError } from '../../../../../lib/error';

export interface OwnProps {
    organizationId: string
}

interface StateProps {
    view: View<InviteUserViewModel>
}

interface DispatchProps {
    onLoad: (organizationId: string) => void
    onUnload: () => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const v = state.views.viewOrgView
    const vm1 = v.viewModel
    if (vm1 === null) {
        throw new Error('vm is null')
    }
    if (vm1.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error('not the right vm')
    }
    return {
        view: vm1.subViews.inviteUserView
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


export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(InviteUserLoader)