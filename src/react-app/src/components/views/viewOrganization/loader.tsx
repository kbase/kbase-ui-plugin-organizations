import * as React from 'react'

import AccessibleContainer from './accessible/container'
import InaccessibleContainer from './inaccessible/container'
import { Spin, Alert } from 'antd';

export interface Props {
    organizationId: string
    view: types.ViewOrgView
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
        const message = (
            <div>
                Loading your Organization...
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
        switch (this.props.view.loadingState) {
            case types.ComponentLoadingState.NONE:
                return this.renderLoading()
            case types.ComponentLoadingState.LOADING:
                return this.renderLoading()
            case types.ComponentLoadingState.ERROR:
                if (this.props.view.error) {
                    return this.renderError(this.props.view.error)
                } else {
                    return this.renderError({
                        code: 'Missing Error',
                        message: 'The error appears to be missing'
                    })
                }
            default:
                if (this.props.view.viewModel === null) {
                    return this.renderError({
                        code: 'Null Error',
                        message: 'The view model is missing, but should be available'
                    })
                }
                if (this.props.view.viewModel.organization.kind === OrganizationKind.INACCESSIBLE_PRIVATE) {
                    return (
                        <InaccessibleContainer />
                    )
                    // return this.renderError({
                    //     code: 'Unsupported',
                    //     message: 'Private orgs are not currently supported'
                    // })
                }
                return (
                    <AccessibleContainer />
                )
        }
    }

    componentDidMount() {
        switch (this.props.view.loadingState) {
            case types.ComponentLoadingState.NONE:
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

import * as types from '../../../types'
import * as actions from '../../../redux/actions/viewOrg'
import { OrganizationKind } from '../../../data/models/organization/model';

export interface OwnProps {
    organizationId: string
}

interface StateProps {
    view: types.ViewOrgView
}

interface DispatchProps {
    onLoad: (organizationId: string) => void
    onUnload: () => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    return {
        view: state.views.viewOrgView
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