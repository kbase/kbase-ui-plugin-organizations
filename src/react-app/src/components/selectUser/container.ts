import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import * as types from '../../types'
import * as actions from '../../redux/actions/viewOrg'
import SearchUsers from './component'

export interface OwnProps {

}

interface StateProps {

}

interface DispatchProps {

}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    return {


    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {

    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(SearchUsers)