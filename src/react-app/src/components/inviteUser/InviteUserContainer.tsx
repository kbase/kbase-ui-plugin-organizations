import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../types'
import * as actions from '../../redux/actions/inviteUser'
import InviteUser from './InviteUser'

export interface OwnProps {

}

interface StateProps {
    organization: types.Organization,
    users: Array<types.BriefUser>,
    selectedUser: types.User | null
}

interface DispatchProps {
    onSearchUsers: (query: string) => void,
    onSelectUser: (username: string) => void,
    onSendInvitation: () => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    // if (!state.viewMembersView || (state.viewMembersView.view === null)) {
    //     throw new Error('Runtime Error - view members view is not defined!')
    // }
    // return {
    //     organization: state.viewMembersView.view.organization
    // }

    return {
        organization: (state.inviteUserView.viewState as types.InviteUserValue).organization,
        users: (state.inviteUserView.viewState as types.InviteUserValue).users,
        selectedUser: (state.inviteUserView.viewState as types.InviteUserValue).selectedUser
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.InviteUserLoad>): DispatchProps {
    return {
        onSearchUsers: (query: string) => {
            dispatch(actions.inviteUserSearchUsers(query) as any)
        },
        onSelectUser: (username: string) => {
            dispatch(actions.selectUser(username) as any)
        },
        onSendInvitation: () => {
            dispatch(actions.sendInvitation() as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(InviteUser)