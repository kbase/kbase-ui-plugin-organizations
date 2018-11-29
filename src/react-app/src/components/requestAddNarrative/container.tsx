import { Dispatch, Action } from 'redux'

import { connect } from 'react-redux'

import * as types from '../../types'

import Component from './component'
import * as actions from '../../redux/actions/requestAddNarrative'

export interface OwnProps {
}

interface StateProps {
    organization: types.Organization
    narratives: Array<types.Narrative>
    selectedNarrative: types.Narrative | null
}

interface DispatchProps {
    doSendRequest: (groupId: string, narrative: types.Narrative) => void
    doSelectNarrative: (narrative: types.Narrative) => void
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {

    const {
        requestNarrativeView
    } = state
    if (requestNarrativeView.value === null) {
        throw new Error('view value is not defined!')
    }

    return {
        organization: requestNarrativeView.value.organization,
        narratives: requestNarrativeView.value.narratives,
        selectedNarrative: requestNarrativeView.value.selectedNarrative
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