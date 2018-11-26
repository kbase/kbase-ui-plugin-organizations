import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../types'
import * as actions from '../../redux/actions/viewMembers'
import ViewMembers from './component'

export interface OwnProps {

}

interface StateProps {
    organization: types.Organization
}

interface DispatchProps {
    onViewMembersUnload: () => void,
    onPromoteMemberToAdmin: (memberUsername: string) => void,
    onDemoteAdminToMember: (adminUsername: string) => void,
    onRemoveMember: (memberUsername: string) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    if (!state.viewMembersView || (state.viewMembersView.view === null)) {
        throw new Error('Runtime Error - view members view is not defined!')
    }
    return {
        organization: state.viewMembersView.view.organization
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ViewMembersLoad>): DispatchProps {
    return {
        onViewMembersUnload: () => {
            dispatch(actions.viewMembersUnload() as any)
        },
        onPromoteMemberToAdmin: (memberUsername: string) => {
            dispatch(actions.viewMembersPromoteToAdmin(memberUsername) as any)
        },
        onDemoteAdminToMember: (adminUsername: string) => {
            dispatch(actions.viewMembersDemoteToMember(adminUsername) as any)
        },
        onRemoveMember: (memberUsername: string) => {
            dispatch(actions.viewMembersRemoveMember(memberUsername) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(ViewMembers)