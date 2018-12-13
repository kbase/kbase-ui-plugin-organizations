import { Dispatch, Action } from 'redux'

import { connect } from 'react-redux'

import * as types from '../../../types'

import Component from './component'
import * as actions from '../../../redux/actions/requestAddNarrative'
import * as orgModel from '../../../data/models/organization/model'

export interface OwnProps {
}

interface StateProps {
    organization: orgModel.Organization
    relation: orgModel.Relation
    narratives: Array<types.Narrative>
    selectedNarrative: types.Narrative | null
    searching: boolean
    sortBy: string
    sortDirection: types.SortDirection
    filter: string
}

interface DispatchProps {
    doSendRequest: (groupId: string, narrative: types.Narrative) => void
    doSelectNarrative: (narrative: types.Narrative) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    if (state.views.requestNarrativeView.viewModel === null) {
        throw new Error('view value is not defined!')
    }
    const {
        views: {
            requestNarrativeView: {
                viewModel: {
                    organization, relation, narratives, selectedNarrative
                }
            }
        }
    } = state


    return {
        organization: organization,
        relation: relation,
        narratives: narratives,
        selectedNarrative: selectedNarrative,
        searching: false,
        sortBy: 'title',
        sortDirection: types.SortDirection.ASCENDING,
        filter: ''
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        doSendRequest: (groupId: string, narrative: types.Narrative) => {
            dispatch(actions.sendRequest(groupId, narrative) as any)
        },
        doSelectNarrative: (narrative: types.Narrative) => {
            dispatch(actions.selectNarrative(narrative) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Component)