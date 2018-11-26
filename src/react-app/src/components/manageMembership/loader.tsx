import * as React from 'react'

import Container from './component'
import { ComponentLoadingState, StoreState, ManageMembershipValue, AppError, ManageMembershipView } from '../../types';

export interface LoaderProps {
    organizationId: string
    view: ManageMembershipView
    onLoad: (organizationId: string) => void
}

interface LoaderState {

}

class ManageMembershipLoader extends React.Component<LoaderProps, LoaderState> {
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

    renderError(error: AppError) {
        return (
            <div>
                Error: {error.message}
            </div>
        )
    }

    render() {
        if (this.props.view.loading) {
            return this.renderLoading()
        } else {
            if (this.props.view.error) {
                return this.renderError(this.props.view.error)
            } else if (this.props.view.value) {
                return (
                    <Container organization={this.props.view.value.organization} />
                )
            } else {
                this.props.onLoad(this.props.organizationId)
                return this.renderLoading()
            }
        }


        //     case ComponentLoadingState.NONE:
        //         this.props.onLoad(this.props.organizationId)
        //         return this.renderLoading()
        //     case ComponentLoadingState.LOADING:
        //         return this.renderLoading()
        //     case ComponentLoadingState.SUCCESS:
        //         if (this.props.view.viewState.)
        //         return (
        //             <Container organization={this.props.view.viewState.organization />
        //         )
        // }
    }
}

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/manageMembership'

export interface OwnProps {
    organizationId: string
}

interface StateProps {
    view: ManageMembershipView
}

interface DispatchProps {
    onLoad: (organizationId: string) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        view: state.manageMembershipView
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
        onLoad: (organizationId: string) => {
            // todo: username below...
            dispatch(actions.manageMembershipLoad(organizationId, '') as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ManageMembershipLoader)