import * as React from 'react'
import { Spin, Alert } from 'antd'
import Container from './reduxAdapter'


export interface Props {
    view: types.View<types.ManageRelatedOrgsViewModel | types.NoneViewModel>
    onLoad: () => void
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
        switch (this.props.view.state) {
            case types.ViewState.NONE:
                return this.renderLoading()
            case types.ViewState.LOADING:
                return this.renderLoading()
            case types.ViewState.ERROR:
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
                    <Container onFinish={this.props.onFinish} />
                )
        }
    }

    componentDidMount() {
        switch (this.props.view.state) {
            case types.ViewState.NONE:
                this.props.onLoad()
        }
    }

    componentWillUnmount() {
        this.props.onUnload()
    }
}

//

import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../../../../types'
import * as actions from '../../../../../redux/actions/viewOrganization/manageRelatedOrganizations'
import { OrganizationModel } from '../../../../../data/models/organization/model';

export interface OwnProps {
    onFinish: () => void
}

interface StateProps {
    view: types.View<types.ManageRelatedOrgsViewModel>
}

interface DispatchProps {
    onLoad: () => void
    onUnload: () => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    const v = state.views.viewOrgView
    const vm1 = v.viewModel
    if (vm1 === null) {
        throw new Error('vm is null')
    }
    if (vm1.kind !== types.ViewOrgViewModelKind.NORMAL) {
        throw new Error('not the right vm')
    }
    return {
        view: vm1.subViews.manageRelatedOrganizationsView
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
        onLoad: () => {
            dispatch(actions.load() as any)
        },
        onUnload: () => {
            dispatch(actions.unload() as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Loader)