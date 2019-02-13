import * as actions from '../../actions/viewOrganization/relatedOrganizations'
import { StoreState, ViewOrgViewModelKind } from '../../../types'
import { Action } from 'redux'
import { ActionFlag } from '../../actions'

export function removeOrganization(state: StoreState, action: actions.RemoveOrganization): StoreState {

    if (!state.views.viewOrgView.viewModel) {
        return state
    }

    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }

    const relatedOrgs = state.views.viewOrgView.viewModel.organization.relatedOrganizations.filter((organizationId: string) => {
        return (organizationId !== action.organizationId)
    })

    console.log('hmm', relatedOrgs, action.organizationId)

    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    organization: {
                        ...state.views.viewOrgView.viewModel.organization,
                        relatedOrganizations: relatedOrgs
                    }
                }
            }
        }
    }
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS:
            return removeOrganization(state, action as actions.RemoveOrganization)
        default:
            return null
    }
}