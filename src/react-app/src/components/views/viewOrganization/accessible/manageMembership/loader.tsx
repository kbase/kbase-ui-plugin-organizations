import * as React from 'react'
import {
    StoreState, ManageMembershipViewModel, ViewState,
    View, NoneViewModel, ViewOrgViewModelKind
} from '../../../../../types'
import Container from './container'

export interface Props {
    organizationId: string
    view: View<ManageMembershipViewModel | NoneViewModel>
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
            <React.Fragment>
                <Icon type="loading" />{' '}Loading Your Membership...
            </React.Fragment>
        )
        return (
            <Alert type="info" message={message}
                style={{ padding: '20px', width: '30em', margin: '30px auto 0 auto', textAlign: 'center' }} />
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

//

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../../../redux/actions/viewOrganization/manageMembership'
import { AnError, makeError } from '../../../../../combo/error/api'
import { Spin, Alert, Icon } from 'antd';

export interface OwnProps {
    organizationId: string
}

interface StateProps {
    view: View<ManageMembershipViewModel>
}

interface DispatchProps {
    onLoad: (organizationId: string) => void
    onUnload: () => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    // This bit deals with the fact that we are a subview 
    // and it keeps TS happy.
    const v = state.views.viewOrgView
    const vm1 = v.viewModel
    if (vm1 === null) {
        throw new Error('vm is null')
    }
    if (vm1.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error('not the right vm')
    }
    return {
        view: vm1.subViews.manageMembershipView
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
