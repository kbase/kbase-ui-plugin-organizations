import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import * as types from '../types'
import * as actions from '../redux/actions/app'

import KBaseIntegration from '../components/KBaseIntegration'

export interface OwnProps {

}

interface StateProps {
    status: types.AppState
    defaultPath: string
    channelId: string | null
}

interface DispatchProps {
    onAppStart: () => void
}

export function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    const { app: { status, config: { defaultPath, channelId } } } = state
    // console.log('map state', status, defaultPath, channelId)
    return {
        status, defaultPath, channelId
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onAppStart: () => {
            dispatch(actions.appStart() as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(KBaseIntegration)