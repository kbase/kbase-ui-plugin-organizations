import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import { StoreState, ViewOrgViewModelKind } from '../../../../../types'
import * as actions from '../../../../../redux/actions/viewOrganization/relatedOrganizations'
import Component from './component'
import * as orgModel from '../../../../../data/models/organization/model'

export interface OwnProps {
    organization: orgModel.Organization
    relatedOrganizations: Array<orgModel.OrganizationID>
    onManageRelatedOrgs: () => void

}

interface StateProps {
    searchMembersBy: string
    sortMembersBy: string
    members: Array<orgModel.Member>
}

interface DispatchProps {
    onRemoveRelatedOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const viewModel = state.views.viewOrgView.viewModel
    if (!viewModel) {
        throw new Error('argh, view model missing')
    }
    if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error("argh, wrong org kind")
    }
    const { searchMembersBy, sortMembersBy, members } = viewModel
    return {
        searchMembersBy, sortMembersBy, members
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onRemoveRelatedOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => {
            dispatch(actions.removeOrganization(organizationId, relatedOrganizationId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component)