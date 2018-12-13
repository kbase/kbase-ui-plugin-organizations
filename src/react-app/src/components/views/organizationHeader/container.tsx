import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../../types'
// we steal the view org actions...
import * as actions from '../../../redux/actions/viewOrg'

import Component from './component'
import * as orgModel from '../../../data/models/organization/model'
import * as requestModel from '../../../data/models/requests'
import * as userModel from '../../../data/models/user'

// Props for this component

// The interface for this container component
export interface OwnProps {
}

// the interface for mapStateTo props
interface StateProps {
    organization: orgModel.Organization
    pendingJoinRequest: requestModel.UserRequest | null
    pendingJoinInvitation: requestModel.UserInvitation | null
    currentUsername: userModel.Username
}

// the interface for mapDispatchToProps
interface DispatchProps {
    onJoinOrg: () => void
    onCancelJoinRequest: (requestId: string) => void
    onAcceptInvitation: (requestId: string) => void
    onRejectInvitation: (requestId: string) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    const {
        views: {
            organizationCentricView: { viewModel }
        },
        auth: { authorization: { username } }
    } = state

    if (!viewModel) {
        throw new Error('View model is unexpectedly missing')
    }

    return {
        organization: viewModel.organization,
        pendingJoinRequest: viewModel.pendingJoinRequest,
        pendingJoinInvitation: viewModel.pendingJoinInvitation,
        currentUsername: username
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onJoinOrg: () => {
            dispatch(actions.viewOrgJoinRequest() as any)
        },
        onCancelJoinRequest: (requestId: string) => {
            dispatch(actions.viewOrgCancelJoinRequest(requestId) as any)
        },
        onAcceptInvitation: (requestId: string) => {
            dispatch(actions.acceptJoinInvitation(requestId) as any)
        },
        onRejectInvitation: (requestId: string) => {
            dispatch(actions.rejectJoinInvitation(requestId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Component)
