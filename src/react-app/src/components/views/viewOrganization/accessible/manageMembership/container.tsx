import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../../../redux/actions/manageMembership'

import { StoreState, EditState, SaveState, ValidationState } from '../../../../../types';
import * as orgModel from '../../../../../data/models/organization/model'
import * as userModel from '../../../../../data/models/user'

import Component from './component'

export interface OwnProps {
    onFinish: () => void
}

interface StateProps {
    username: userModel.Username
    organization: orgModel.Organization
    editableMemberProfile: orgModel.EditableMemberProfile
    editState: EditState
    saveState: SaveState
    validationState: ValidationState
}

interface DispatchProps {
    onLeaveOrganization: (organizationId: string) => void,
    onUpdateTitle: (title: string) => void
    onSave: () => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    if (!state.views.manageMembershipView.viewModel) {
        throw new Error('View model missing')
    }
    const {
        auth: { authorization: { username } },
        views: {
            manageMembershipView: {
                viewModel: { organization, editableMemberProfile, editState, saveState, validationState }
            }
        }
    } = state
    return {
        username, organization, editableMemberProfile,
        editState, saveState, validationState
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
        onLeaveOrganization: (organizationId: string) => {
            dispatch(actions.leaveOrg(organizationId) as any)
        },
        onUpdateTitle: (title: string) => {
            dispatch(actions.updateTitle(title) as any)
        },
        onSave: () => {
            dispatch(actions.save() as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component)