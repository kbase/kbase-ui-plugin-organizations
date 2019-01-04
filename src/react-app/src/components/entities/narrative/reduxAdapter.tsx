import * as React from 'react'
import * as narrativeModel from '../../../data/models/narrative'
import Narrative from './component'

interface LoaderProps {
    workspaceId: narrativeModel.WorkspaceID
    narrative: narrativeModel.Narrative | null
    onLoad: (workspaceId: narrativeModel.WorkspaceID) => void
}

interface LoaderState { }

class Loader extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props)
    }

    render() {
        if (this.props.narrative) {
            return (
                <Narrative
                    narrative={this.props.narrative}
                />
            )
        } else {
            this.props.onLoad(this.props.workspaceId)
            return (
                <div>
                    Loading narrative...
                </div>
            )
        }
    }
}

// redux wrapper

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { StoreState } from '../../../types'
import * as actions from '../../../redux/actions/entities'

export interface OwnProps {
    workspaceId: narrativeModel.WorkspaceID
}

interface StateProps {
    narrative: narrativeModel.Narrative | null
}

interface DispatchProps {
    onLoad: (workspaceId: narrativeModel.WorkspaceID) => void
}


function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        narrative: state.entities.narratives.byId.get(props.workspaceId) || null
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.EntityAction>): DispatchProps {
    return {
        onLoad: (workspaceId: narrativeModel.WorkspaceID) => {
            dispatch(actions.loadNarrative(workspaceId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader)
