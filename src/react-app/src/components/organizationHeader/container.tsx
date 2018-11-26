import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../types'
// we steal the view org actions...
import * as actions from '../../redux/actions/viewOrg'

import OrganizationHeader from './component'

// Props for this component

// The interface for this container component
export interface OwnProps {
}

// the interface for mapStateTo props
interface StateProps {
}

// the interface for mapDispatchToProps
interface DispatchProps {
    onJoinOrg: () => void
    onCancelJoinRequest: (requestId: string) => void
    onAcceptInvitation: (requestId: string) => void
    onRejectInvitation: (requestId: string) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ViewOrgFetch>): DispatchProps {
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

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(OrganizationHeader)
