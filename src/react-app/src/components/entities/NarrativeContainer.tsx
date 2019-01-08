import * as React from 'react'
import * as narrativeModel from '../../data/models/narrative'
import * as orgModel from '../../data/models/organization/model'
import Narrative from './Narrative'

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
            return (
                <div>
                    Loading narrative...
                </div>
            )
        }
    }

    componentDidMount() {
        if (!this.props.narrative) {
            this.props.onLoad(this.props.workspaceId)
        }
    }
}

// redux wrapper

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { StoreState } from '../../types'
import * as actions from '../../redux/actions/entities'

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
