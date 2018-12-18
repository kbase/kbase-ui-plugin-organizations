import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import * as requestModel from '../../../data/models/requests'
import { StoreState } from '../../../types';
import * as actions from '../../../redux/actions/dashboard'
import OutboxRequest from './OutboxRequest'

export interface OwnProps {

}

interface StateProps {

}

interface DispatchProps {
    onCancelOutboxRequest: (request: requestModel.Request) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {

    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onCancelOutboxRequest: (request: requestModel.Request) => {
            dispatch(actions.cancelOutboxRequest(request) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(OutboxRequest)