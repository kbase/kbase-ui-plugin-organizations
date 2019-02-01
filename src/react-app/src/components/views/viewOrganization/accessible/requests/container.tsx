import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../../../../types'
import * as acceptActions from '../../../../../redux/actions/viewOrganization/acceptInboxRequest'
import * as rejectActions from '../../../../../redux/actions/viewOrganization/denyInboxRequest'
import * as cancelRequestActions from '../../../../../redux/actions/viewOrganization/cancelOutboxRequest'
import * as requestModel from '../../../../../data/models/requests'
import * as orgModel from '../../../../../data/models/organization/model'

import Component from './component'

export interface OwnProps {
    inbox: Array<requestModel.Request>
    outbox: Array<requestModel.Request>
    relation: orgModel.Relation
}

interface StateProps {

}

interface DispatchProps {
    onAcceptJoinRequest: (request: requestModel.Request) => void
    onDenyJoinRequest: (request: requestModel.Request) => void
    onCancelJoinInvitation: (request: requestModel.Request) => void
    onGetViewAccess: (request: requestModel.Request) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onAcceptJoinRequest: (request: requestModel.Request) => {
            dispatch(acceptActions.acceptRequest(request.id) as any)
        },
        onDenyJoinRequest: (request: requestModel.Request) => {
            dispatch(rejectActions.denyRequest(request.id) as any)
        },
        onCancelJoinInvitation: (request: requestModel.Request) => {
            dispatch(cancelRequestActions.cancelRequest(request.id) as any)
        },
        onGetViewAccess: (request: requestModel.Request) => {
            // dispatch(actions.getViewAccess(requestId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Component)

