import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as requestModel from '../../../../../data/models/requests';
import * as acceptActions from '../../../../../redux/actions/viewOrganization/acceptInboxRequest';
import * as rejectActions from '../../../../../redux/actions/viewOrganization/denyInboxRequest';
import { StoreState } from '../../../../../redux/store/types';
import InboxRequest from './InboxRequest';

export interface OwnProps {

}

interface StateProps {

}

interface DispatchProps {
    onAcceptInboxRequest: (request: requestModel.Request) => void;
    onRejectInboxRequest: (request: requestModel.Request) => void;
}

function mapStateToProps(): StateProps {
    return {
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onAcceptInboxRequest: (request: requestModel.Request) => {
            dispatch(acceptActions.acceptRequest(request.id) as any);
        },
        onRejectInboxRequest: (request: requestModel.Request) => {
            dispatch(rejectActions.denyRequest(request.id) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(InboxRequest);
