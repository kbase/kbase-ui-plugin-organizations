import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as requestModel from '../../../../../data/models/requests';
import * as cancelActions from '../../../../../redux/actions/viewOrganization/cancelOutboxRequest';
import { StoreState } from '../../../../../redux/store/types';
import OutboxRequest from './OutboxRequest';

export interface OwnProps {

}

interface StateProps {

}

interface DispatchProps {
    onCancelOutboxRequest: (request: requestModel.Request) => void;
}

function mapStateToProps(): StateProps {
    return {

    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onCancelOutboxRequest: (request: requestModel.Request) => {
            dispatch(cancelActions.cancelRequest(request.id) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(OutboxRequest);