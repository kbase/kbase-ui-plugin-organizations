import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import { StoreState, AuthState } from '../types'
import Auth from '../components/Auth'
import * as actions from '../redux/actions/auth'

export interface OwnProps {
    env: string
}

interface StateProps {
    authStatus: AuthState,
    token: string | null,
    username: string | null,
    realname: string | null,
}

interface DispatchProps {
    checkAuth: () => void,
    onRemoveAuthorization: () => void,
    onAddAuthorization: (token: string) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const { auth: { status, authorization } } = state
    return {
        authStatus: status,
        token: authorization.token || null,
        username: authorization.username || null,
        realname: authorization.realname || null
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        checkAuth: () => {
            dispatch(actions.checkAuth() as any)
        },
        onRemoveAuthorization: () => {
            dispatch(actions.authRemoveAuthorization() as any)
        },
        onAddAuthorization: (token: string) => {
            dispatch(actions.authAddAuthorization(token) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Auth)