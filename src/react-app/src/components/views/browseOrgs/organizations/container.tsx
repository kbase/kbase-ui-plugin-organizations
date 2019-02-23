import { connect } from 'react-redux'
import { Dispatch, Action } from 'redux'
import * as orgModel from '../../../../data/models/organization/model'
import { Organizations } from './component'
import { StoreState } from '../../../../types'

export interface OwnProps {
    myOrgsUnfiltered: boolean
}
export interface StateProps {
    organizations: Array<orgModel.BriefOrganization>
    openRequests: Map<orgModel.OrganizationID, orgModel.RequestStatus>
}

export interface DispatchProps {
}

export function mapStateToProps(state: StoreState): StateProps {
    // TODO: wow, should not do this here
    if (state.views.browseOrgsView.viewModel === null) {
        throw new Error('view not ready')
    }
    const {
        views: {
            browseOrgsView: {
                viewModel: { organizations, openRequests }
            }
        }
    } = state;

    return {
        organizations, openRequests
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {}
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Organizations)