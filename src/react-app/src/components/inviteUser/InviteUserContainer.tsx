import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../types'
import * as actions from '../../redux/actions/inviteUser'
import InviteUser from './InviteUser'
import { UserQuery } from '../../data/model';

export interface OwnProps {

}

interface StateProps {
    organization: types.Organization,
    users: Array<types.BriefUser>,
    selectedUser: types.User | null,
    state: types.InviteUserViewState
}

interface DispatchProps {
    onSearchUsers: (query: UserQuery) => void
    onSelectUser: (username: string) => void
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
        organization: (state.inviteUserView.value as types.InviteUserValue).organization,
        users: (state.inviteUserView.value as types.InviteUserValue).users,
        selectedUser: (state.inviteUserView.value as types.InviteUserValue).selectedUser,
        state: (state.inviteUserView.value as types.InviteUserValue).editState
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.InviteUserLoad>): DispatchProps {
    return {
        onSearchUsers: ({ query, excludedUsers }) => {
            dispatch(actions.inviteUserSearchUsers({ query, excludedUsers }) as any)
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