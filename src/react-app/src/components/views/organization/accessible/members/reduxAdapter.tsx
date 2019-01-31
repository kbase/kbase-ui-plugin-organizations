import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import { StoreState } from '../../../../../types'
import * as actions from '../../../../../redux/actions/viewOrganization/viewMembers'
import ViewMembers from './component'
import * as orgModel from '../../../../../data/models/organization/model'

export interface OwnProps {
    organization: orgModel.Organization
    relation: orgModel.Relation
}

interface StateProps {

}

interface DispatchProps {
    onViewMembersUnload: () => void,
    onPromoteMemberToAdmin: (memberUsername: string) => void,
    onDemoteAdminToMember: (adminUsername: string) => void,
    onRemoveMember: (memberUsername: string) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    // if (!state.views.viewMembersView || (state.views.viewMembersView.viewModel === null)) {
    //     throw new Error('Runtime Error - view members view is not defined!')
    // }
    // const {
    //     views: {
    //         viewMembersView: {
    //             viewModel: { organization, relation }
    //         }
    //     }
    // } = state
    // return {
    //     organization, relation
    // }
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onViewMembersUnload: () => {
            dispatch(actions.unload() as any)
        },
        onPromoteMemberToAdmin: (memberUsername: string) => {
            dispatch(actions.promoteToAdmin(memberUsername) as any)
        },
        onDemoteAdminToMember: (adminUsername: string) => {
            dispatch(actions.demoteToMember(adminUsername) as any)
        },
        onRemoveMember: (memberUsername: string) => {
            dispatch(actions.removeMember(memberUsername) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ViewMembers)