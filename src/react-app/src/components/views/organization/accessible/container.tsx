import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import { StoreState, ViewOrgViewModelKind } from '../../../../types'
import * as actions from '../../../../redux/actions/viewOrg'
import * as acceptInboxRequestActions from '../../../../redux/actions/viewOrganization/acceptInboxRequest'
import * as denyInboxRequestActions from '../../../../redux/actions/viewOrganization/denyInboxRequest'
import * as cancelOutboxRequestActions from '../../../../redux/actions/viewOrganization/cancelOutboxRequest'
import * as notificationActions from '../../../../redux/actions/notifications'

import ViewOrganization from './component'

import * as orgModel from '../../../../data/models/organization/model'
import * as requestModel from '../../../../data/models/requests'
import * as feedsModel from '../../../../data/models/feeds'

// Props for this component

// The interface for this container component
export interface OwnProps {
}

// the interface for mapStateTo props
interface StateProps {
    organization: orgModel.Organization
    relation: orgModel.Relation
    groupRequests: Array<requestModel.Request> | null
    groupInvitations: Array<requestModel.Request> | null
    requestOutbox: Array<requestModel.Request>
    requestInbox: Array<requestModel.Request>
    notifications: Array<feedsModel.OrganizationNotification>
}

// the interface for mapDispatchToProps
interface DispatchProps {
    onViewOrg: (id: string) => void
    onJoinOrg: () => void
    onCancelJoinRequest: (requestId: requestModel.RequestID) => void
    onAcceptInvitation: (requestId: requestModel.RequestID) => void
    onRejectInvitation: (requestId: requestModel.RequestID) => void
    onRemoveNarrative: (narrative: orgModel.NarrativeResource) => void
    onGetViewAccess: (narrative: orgModel.NarrativeResource) => void
    onAcceptRequest: (requestId: requestModel.RequestID) => void
    onReadNotification: (notificationId: string) => void
}

// hmm this bit would be for the interface for the wrapped component.
// can't really do that here, but _could_ export the interfaces above
// and compose them thus in the wrapped component. But the wrapped component
// should know nothing about this business
// type Props = StateProps & DispatchProps & OwnProps

function mapStateToProps(state: StoreState, ownProps: OwnProps): StateProps {
    const viewModel = state.views.viewOrgView.viewModel
    if (!viewModel) {
        throw new Error('argh, view model missing')
    }
    if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error("argh, wrong org kind")
    }
    const {
        organization, relation, groupRequests, groupInvitations, requestInbox, requestOutbox
    } = viewModel
    const {
        db: {
            notifications: { all }
        }
    } = state

    const notifications = all.filter((notification) => {
        return (notification.organizationId === organization.id)
    })
    // TODO: of course this really needs to be an async fetch of the org info!
    return {
        organization, relation, groupRequests, groupInvitations, requestInbox, requestOutbox, notifications
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onViewOrg: (id: string) => {
            dispatch(actions.load(id) as any)
        },
        onJoinOrg: () => {
            dispatch(actions.viewOrgJoinRequest() as any)
        },
        onCancelJoinRequest: (requestId: requestModel.RequestID) => {
            dispatch(cancelOutboxRequestActions.cancelRequest(requestId) as any)
        },
        onAcceptInvitation: (requestId: requestModel.RequestID) => {
            dispatch(acceptInboxRequestActions.acceptRequest(requestId) as any)
        },
        onRejectInvitation: (requestId: requestModel.RequestID) => {
            dispatch(denyInboxRequestActions.denyRequest(requestId) as any)
        },
        onRemoveNarrative: (narrative: orgModel.NarrativeResource) => {
            dispatch(actions.removeNarrative(narrative) as any)
        },
        onGetViewAccess: (narrative: orgModel.NarrativeResource) => {
            dispatch(actions.accessNarrative(narrative) as any)
        },
        onAcceptRequest: (requestId: requestModel.RequestID) => {
            dispatch(acceptInboxRequestActions.acceptRequest(requestId) as any)
        },
        onReadNotification: (notificationId: string) => {
            dispatch(notificationActions.read(notificationId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ViewOrganization)

// export default connect(mapStateToProps, mapDispatchToProps)(ViewOrganization) 

