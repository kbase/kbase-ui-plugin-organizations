import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import { StoreState } from '../../../types'
import * as actions from '../../../redux/actions/viewOrg'
import * as acceptInboxRequestActions from '../../../redux/actions/viewOrganization/acceptInboxRequest'

import ViewOrganization from './component'

import * as orgModel from '../../../data/models/organization/model'
import * as requestModel from '../../../data/models/requests';

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
}

// the interface for mapDispatchToProps
interface DispatchProps {
    onViewOrg: (id: string) => void
    onJoinOrg: () => void
    onCancelJoinRequest: (requestId: string) => void
    onAcceptInvitation: (requestId: string) => void
    onRejectInvitation: (requestId: string) => void
    onRemoveNarrative: (narrative: orgModel.NarrativeResource) => void
    onGetViewAccess: (narrative: orgModel.NarrativeResource) => void
    onAcceptRequest: (request: requestModel.Request) => void
}

// hmm this bit would be for the interface for the wrapped component.
// can't really do that here, but _could_ export the interfaces above
// and compose them thus in the wrapped component. But the wrapped component
// should know nothing about this business
// type Props = StateProps & DispatchProps & OwnProps


function mapStateToProps(state: StoreState, ownProps: OwnProps): StateProps {
    if (!state.views.viewOrgView.viewModel) {
        throw new Error('argh, view model missing')
    }
    const {
        views: {
            viewOrgView: {
                viewModel: {
                    organization, relation, groupRequests, groupInvitations, requestInbox, requestOutbox
                }
            }
        }
    } = state
    // TODO: of course this really needs to be an async fetch of the org info!
    return {
        organization, relation, groupRequests, groupInvitations, requestInbox, requestOutbox
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
        onCancelJoinRequest: (requestId: string) => {
            dispatch(actions.viewOrgCancelJoinRequest(requestId) as any)
        },
        onAcceptInvitation: (requestId: string) => {
            dispatch(actions.acceptJoinInvitation(requestId) as any)
        },
        onRejectInvitation: (requestId: string) => {
            dispatch(actions.rejectJoinInvitation(requestId) as any)
        },
        onRemoveNarrative: (narrative: orgModel.NarrativeResource) => {
            dispatch(actions.removeNarrative(narrative) as any)
        },
        onGetViewAccess: (narrative: orgModel.NarrativeResource) => {
            dispatch(actions.accessNarrative(narrative) as any)
        },
        onAcceptRequest: (request: requestModel.Request) => {
            dispatch(acceptInboxRequestActions.acceptInboxRequest(request) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ViewOrganization)

// export default connect(mapStateToProps, mapDispatchToProps)(ViewOrganization) 

