import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import Dashboard from './component'
import { StoreState, DashboardViewModel } from '../../../types';
import * as actions from '../../../redux/actions/dashboard';
import * as userModel from '../../../data/models/user'
import * as requestModel from '../../../data/models/requests'


export interface OwnProps {

}

interface StateProps {
    viewModel: DashboardViewModel
    currentUser: userModel.Username
}

interface DispatchProps {
    onAcceptInboxRequest: (request: requestModel.Request) => void
    onCancelOutboxRequest: (request: requestModel.Request) => void
    onRefresh: () => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const view = state.views.dashboardView
    const currentUser = state.auth.authorization.username
    if (view.viewModel === null) {
        throw new Error('view model is null!')
    }
    return {
        viewModel: view.viewModel,
        currentUser
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.DashboardAction<any>>): DispatchProps {
    return {
        onAcceptInboxRequest: (request: requestModel.Request) => {
            dispatch(actions.acceptInboxRequest(request) as any)
        },
        onCancelOutboxRequest: (request: requestModel.Request) => {
            dispatch(actions.cancelOutboxRequest(request) as any)
        },
        onRefresh: () => {
            dispatch(actions.refresh() as any)
            // alert('yes, wll refresh')
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Dashboard)