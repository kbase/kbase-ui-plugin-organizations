import * as React from 'react'
import './Auth.css'

import * as types from '../types'
import { Button } from 'antd';


export interface AuthState {

}

class Auth extends React.Component<types.AuthProps, AuthState> {

    tokenRef: React.RefObject<HTMLInputElement>

    constructor(props: types.AuthProps) {
        super(props)

        this.tokenRef = React.createRef()

        this.props.checkAuth()
    }

    onLogoutClick() {
        this.props.onRemoveAuthorization()
    }

    onLoginClick() {
        if (this.tokenRef.current === null) {
            return
        }
        const token = this.tokenRef.current.value
        if (token.length === 0) {
            return
        }
        this.props.onAddAuthorization(token)
    }

    buildAuthForm() {
        return (
            <div className="Auth-form">
                Token: <input ref={this.tokenRef} style={{ width: '30em' }} />
                <Button
                    icon="save"
                    htmlType="submit"
                    onClick={this.onLoginClick.bind(this)} >
                    Assign Token
                </Button>
            </div>
        )
    }

    buildAuthToolbar() {
        return (
            <div className="Auth-toolbar">
                Logged in as <b><span>{this.props.authorization.authorization.realname}</span> (<span>{this.props.authorization.authorization.username}</span></b>)
                {' '}
                <Button icon="logout" onClick={this.onLogoutClick.bind(this)}></Button>
            </div>
        )
    }

    buildAuthDev() {
        switch (this.props.authorization.status) {
            case types.AuthState.NONE:
            case types.AuthState.CHECKING:
                return (
                    <div></div>
                )
            case types.AuthState.AUTHORIZED:
                return (
                    <div className="Auth Auth-authorized scrollable-flex-column">
                        {this.buildAuthToolbar()}
                        {this.props.children}
                    </div>
                )
            case types.AuthState.UNAUTHORIZED:
                return (
                    <div className="Auth Auth-unauthorized scrollable-flex-column">
                        <p>Not authorized! Enter a user token below</p>
                        {this.buildAuthForm()}
                    </div>
                )
            case types.AuthState.ERROR:
                return (
                    <div className="Auth Auth-unauthorized scrollable-flex-column">
                        <p>Error</p>
                        {this.props.authorization.message}
                    </div>
                )
            default:
                return (
                    <div></div>
                )
        }
    }

    buildAuthProd() {
        switch (this.props.authorization.status) {
            case types.AuthState.NONE:
            case types.AuthState.CHECKING:
                return (
                    <div></div>
                )
            case types.AuthState.AUTHORIZED:
                return (
                    <div className="Auth Auth-authorized scrollable-flex-column">
                        {this.props.children}
                    </div>
                )
            case types.AuthState.UNAUTHORIZED:
                return (
                    <div className="Auth Auth-unauthorized scrollable-flex-column">
                        <p>Not authorized!</p>
                    </div>
                )
            case types.AuthState.ERROR:
                return (
                    <div className="Auth Auth-error scrollable-flex-column">
                        <p>Error: ??</p>
                    </div>
                )
            default:
                return (
                    <div></div>
                )
        }

    }

    render() {
        return (
            <div className="Auth scrollable-flex-column">
                {this.props.hosted ? this.buildAuthProd() : this.buildAuthDev()}
            </div>
        )

    }
}

export default Auth