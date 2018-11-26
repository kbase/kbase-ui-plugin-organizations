import * as React from 'react'

import './component.css'

import { ViewMembersViewState } from '../../types'
import ViewMembersContainer from './container'

export interface ViewMemberLoaderProps {
    organizationId: string,
    state: ViewMembersViewState,
    onViewMembersLoad: (organizationId: string) => void
}

interface ViewMemberLoaderState {

}

class ViewMembersLoader extends React.Component<ViewMemberLoaderProps, ViewMemberLoaderState> {
    constructor(props: ViewMemberLoaderProps) {
        super(props)
    }

    renderLoading() {
        return (
            <div>
                Loading...
            </div>
        )
    }

    render() {
        switch (this.props.state) {
            case ViewMembersViewState.NONE:
                this.props.onViewMembersLoad(this.props.organizationId)
                return this.renderLoading()
            case ViewMembersViewState.LOADING:
                return this.renderLoading()
            case ViewMembersViewState.SUCCESS:
                return (
                    <ViewMembersContainer />
                )
        }
    }
}

import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../types'
import * as actions from '../../redux/actions/viewMembers'
// import ViewMembers from './component'

export interface OwnProps {
    organizationId: string
}

interface StateProps {
    state: types.ViewMembersViewState
}

interface DispatchProps {
    onViewMembersLoad: (organizationId: string) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    return {
        state: state.viewMembersView.state
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ViewMembersLoad>): DispatchProps {
    return {
        onViewMembersLoad: (organizationId: string) => {
            dispatch(actions.viewMembersLoad(organizationId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(ViewMembersLoader)