import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../types'
import * as actions from '../redux/actions/manageGroupRequests'

import ManageGroupRequests from '../components/ManageGroupRequests'

export interface OwnProps {
    organizationId: string
}

interface StateProps {
    manageGroupRequestsView: types.ManageGroupRequestsView | null
}

interface DispatchProps {
    onStart: (organizationId: string) => void,
    onAcceptJoinRequest: (requestId: string) => void,
    onDenyJoinRequest: (requestId: string) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    const {
        manageGroupRequestsView
    } = state
    return {
        manageGroupRequestsView
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ManageGroupRequests>): DispatchProps {
    return {
        onStart: (organizationId: string) => {
            dispatch(actions.manageGroupRequests(organizationId) as any)
        },
        onAcceptJoinRequest: (requestId: string) => {
            dispatch(actions.manageGroupRequestsAcceptJoinRequest(requestId) as any)
        },
        onDenyJoinRequest: (requestId: string) => {
            dispatch(actions.manageGroupRequestsDenyJoinRequest(requestId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(ManageGroupRequests)

