import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../../../redux/actions/viewOrganization/manageRelatedOrganizations'
import ManageRelatedOrganizations from './component'
import { StoreState, ViewOrgViewModelKind, SelectableRelatableOrganization } from '../../../../../types';
import * as orgModel from '../../../../../data/models/organization/model'

export interface OwnProps {
    onFinish: () => void
}

interface StateProps {
    organization: orgModel.Organization
    organizations: Array<SelectableRelatableOrganization>
    relatedOrganizations: Array<string>
    selectedOrganization: SelectableRelatableOrganization | null
}

interface DispatchProps {
    onSelectOrganization: (org: SelectableRelatableOrganization) => void
    onAddOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => void
    onRemoveOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const viewModel = state.views.viewOrgView.viewModel
    if (!viewModel) {
        throw new Error('argh, view model missing')
    }
    if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error("argh, wrong org kind")
    }
    // if (viewModel.subViews.kind !== ViewOrgSubViewKind.MANAGE_RELATED_ORGS) {
    //     throw new Error("argh, wrong org subview kind")
    // }
    if (viewModel.subViews.manageRelatedOrganizationsView.viewModel === null) {
        throw new Error("argh, null subview view model")
    }
    const { organization, organizations, relatedOrganizations, selectedOrganization } = viewModel.subViews.manageRelatedOrganizationsView.viewModel

    return {
        organization, organizations, relatedOrganizations, selectedOrganization
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onSelectOrganization: (org: SelectableRelatableOrganization) => {
            dispatch(actions.selectOrganization(org) as any)
        },
        onAddOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => {
            dispatch(actions.addOrganization(organizationId, relatedOrganizationId) as any)
        },
        onRemoveOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => {
            dispatch(actions.removeOrganization(organizationId, relatedOrganizationId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ManageRelatedOrganizations)