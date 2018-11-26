import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../types'
import * as actions from '../../redux/actions/manageOrganizationRequests'

import Component from './component'

export interface OwnProps {
    // organizationId: string
}

interface StateProps {
    viewState: types.ManageOrganizationRequestsValue
}

interface DispatchProps {
    // onStart: (organizationId: string) => void,
    onAcceptJoinRequest: (requestId: string) => void,
    onDenyJoinRequest: (requestId: string) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    const {
        manageOrganizationRequestsView
    } = state
    if (!manageOrganizationRequestsView.viewState) {
        throw new Error('view state not loaded!')
    }
    return {
        viewState: manageOrganizationRequestsView.viewState
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ManageOrganizationRequests>): DispatchProps {
    return {
        // onStart: (organizationId: string) => {
        //     dispatch(actions.manageOrganizationRequests(organizationId) as any)
        // },
        onAcceptJoinRequest: (requestId: string) => {
            dispatch(actions.manageOrganizationRequestsAcceptJoinRequest(requestId) as any)
        },
        onDenyJoinRequest: (requestId: string) => {
            dispatch(actions.manageOrganizationRequestsDenyJoinRequest(requestId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Component)

