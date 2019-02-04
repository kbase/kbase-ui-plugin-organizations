import { Dispatch, Action } from 'redux'

import { connect } from 'react-redux'

import * as types from '../../../types'

import Component from './component'
import * as actions from '../../../redux/actions/requestAddNarrative'
import * as orgModel from '../../../data/models/organization/model'
import * as narrativeModel from '../../../data/models/narrative'

export interface OwnProps {
}

interface StateProps {
    organization: orgModel.Organization
    relation: orgModel.Relation
    narratives: Array<narrativeModel.OrganizationNarrative>
    selectedNarrative: narrativeModel.OrganizationNarrative | null
    searching: boolean
    sortBy: string
    // sortDirection: types.SortDirection
    filter: string
}

interface DispatchProps {
    doSendRequest: (groupId: string, workspaceId: number) => void
    doSelectNarrative: (narrative: narrativeModel.OrganizationNarrative) => void
    doSortBy: (sortBy: narrativeModel.Sort) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    if (state.views.requestNarrativeView.viewModel === null) {
        throw new Error('view value is not defined!')
    }

    const {
        views: {
            requestNarrativeView: {
                viewModel: {
                    organization, relation, narratives, selectedNarrative,
                }
            }
        }
    } = state

    return {
        organization, relation, narratives, selectedNarrative,
        searching: false,
        sortBy: 'title',
        // sortDirection: types.SortDirection.ASCENDING,
        filter: ''
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        doSendRequest: (groupId: string, workspaceId: number) => {
            dispatch(actions.sendRequest(groupId, workspaceId) as any)
        },
        doSelectNarrative: (narrative: narrativeModel.OrganizationNarrative) => {
            dispatch(actions.selectNarrative(narrative) as any)
        },
        doSortBy: (sortBy: narrativeModel.Sort) => {
            dispatch(actions.sort(sortBy) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Component)