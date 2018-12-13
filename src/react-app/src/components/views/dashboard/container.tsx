import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import Dashboard from './component'
import { StoreState, DashboardViewModel } from '../../../types';
import * as actions from '../../../redux/actions/dashboard';

export interface OwnProps {

}

interface StateProps {
    viewModel: DashboardViewModel
}

interface DispatchProps {

}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const view = state.views.dashboardView
    if (view.viewModel === null) {
        throw new Error('view model is null!')
    }
    return {
        viewModel: view.viewModel
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.DashboardAction>): DispatchProps {
    return {

    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Dashboard)