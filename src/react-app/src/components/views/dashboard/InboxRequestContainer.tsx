import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import * as requestModel from '../../../data/models/requests'
import { StoreState } from '../../../types';
import * as actions from '../../../redux/actions/dashboard'
import InboxRequest from './InboxRequest'

export interface OwnProps {

}

interface StateProps {

}

interface DispatchProps {
    onAcceptInboxRequest: (request: requestModel.Request) => void
    onRejectInboxRequest: (request: requestModel.Request) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {

    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onAcceptInboxRequest: (request: requestModel.Request) => {
            dispatch(actions.acceptInboxRequest(request) as any)
        },
        onRejectInboxRequest: (request: requestModel.Request) => {
            dispatch(actions.rejectInboxRequest(request) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(InboxRequest)