import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../redux/actions/manageMembership'

import { StoreState } from '../../../types';
import * as orgModel from '../../../data/models/organization/model'
import * as userModel from '../../../data/models/user'

import Component from './component'

export interface OwnProps {
}

interface StateProps {
    username: userModel.Username
    organization: orgModel.Organization
}

interface DispatchProps {
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    if (!state.views.manageMembershipView.viewModel) {
        throw new Error('View model missing')
    }
    const {
        auth: { authorization: { username } },
        views: {
            manageMembershipView: {
                viewModel: { organization }
            }
        }
    } = state
    return {
        username, organization
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component)