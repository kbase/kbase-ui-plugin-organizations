import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../../types'
import * as actions from '../../../redux/actions/manageOrganizationRequests'

import Component from './component'

export interface OwnProps {
    // organizationId: string
}

interface StateProps {
    viewModel: types.ManageOrganizationRequestsViewModel
}

interface DispatchProps {
    // onStart: (organizationId: string) => void,
    onAcceptJoinRequest: (requestId: string) => void
    onDenyJoinRequest: (requestId: string) => void
    onCancelJoinInvitation: (requestId: string) => void
    onGetViewAccess: (requestId: string) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    const {
        views: {
            manageOrganizationRequestsView
        }
    } = state
    if (!manageOrganizationRequestsView.viewModel) {
        throw new Error('view state not loaded!')
    }
    return {
        viewModel: manageOrganizationRequestsView.viewModel
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        // onStart: (organizationId: string) => {
        //     dispatch(actions.manageOrganizationRequests(organizationId) as any)
        // },
        onAcceptJoinRequest: (requestId: string) => {
            dispatch(actions.acceptJoinRequest(requestId) as any)
        },
        onDenyJoinRequest: (requestId: string) => {
            dispatch(actions.denyJoinRequest(requestId) as any)
        },
        onCancelJoinInvitation: (requestId: string) => {
            dispatch(actions.cancelJoinInvitation(requestId) as any)
        },
        onGetViewAccess: (requestId: string) => {
            dispatch(actions.getViewAccess(requestId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Component)

