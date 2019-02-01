import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import * as requestModel from '../../../../../data/models/requests'
import { StoreState } from '../../../../../types';
import * as cancelActions from '../../../../../redux/actions/viewOrganization/cancelOutboxRequest'
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
            dispatch(cancelActions.cancelRequest(request.id) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(OutboxRequest)