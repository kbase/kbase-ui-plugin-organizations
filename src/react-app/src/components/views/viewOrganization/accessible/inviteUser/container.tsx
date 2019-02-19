import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../../../../types'
import * as actions from '../../../../../redux/actions/viewOrganization/inviteUser'
import InviteUser from './component'
import * as orgModel from '../../../../../data/models/organization/model'
import * as userModel from '../../../../../data/models/user'

export interface OwnProps {
    onFinish: () => void
}

interface StateProps {
    organization: orgModel.Organization
    users: Array<types.OrganizationUser> | null
    selectedUser: {
        user: types.User,
        relation: orgModel.UserRelationToOrganization
    } | null
    editState: types.InviteUserViewState
}

interface DispatchProps {
    onSearchUsers: (query: userModel.UserQuery) => void
    onSelectUser: (username: string) => void
    onSendInvitation: () => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    const viewModel = state.views.viewOrgView.viewModel
    if (!viewModel) {
        throw new Error('argh, view model missing')
    }
    if (viewModel.kind !== types.ViewOrgViewModelKind.NORMAL) {
        throw new Error("argh, wrong org kind")
    }
    if (viewModel.subViews.inviteUserView.viewModel === null) {
        throw new Error("argh, null subview view model")
    }

    return viewModel.subViews.inviteUserView.viewModel
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
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