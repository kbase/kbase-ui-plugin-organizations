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
        console.log('authorizagin with', token)
        this.props.onAddAuthorization(token)
    }

    buildAuthForm() {
        return (
            <div className="Auth-form">
                Token: <input ref={this.tokenRef} />
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
                Logged in as <b><span>{this.props.realname}</span> (<span>{this.props.username}</span></b>)
                {' '}
                <Button icon="logout" onClick={this.onLogoutClick.bind(this)}>Sign out</Button>
            </div>
        )
    }

    buildAuthDev() {
        switch (this.props.authStatus) {
            case types.AuthState.NONE:
            case types.AuthState.CHECKING:
                return (
                    <div></div>
                )
            case types.AuthState.AUTHORIZED:
                return (
                    <div className="Auth Auth-authorized">
                        {this.buildAuthToolbar()}
                        {this.props.children}
                    </div>
                )
            case types.AuthState.UNAUTHORIZED:
                return (
                    <div className="Auth Auth-unauthorized">
                        <p>Not authorized! Enter a user token below</p>
                        {this.buildAuthForm()}
                    </div>
                )
            case types.AuthState.ERROR:
                return (
                    <div className="Auth Auth-unauthorized">
                        <p>Error</p>

                    </div>
                )
            default:
                return (
                    <div></div>
                )
        }
    }

    buildAuthProd2() {
        switch (this.props.authStatus) {
            case types.AuthState.NONE:
            case types.AuthState.CHECKING:
                return (
                    <div></div>
                )
            case types.AuthState.AUTHORIZED:
                return (
                    <div className="Auth Auth-authorized">
                        {this.props.children}
                    </div>
                )
            case types.AuthState.UNAUTHORIZED:
                return (
                    <div className="Auth Auth-unauthorized">
                        <p>Not authorized!</p>
                    </div>
                )
            case types.AuthState.ERROR:
                return (
                    <div className="Auth Auth-error">
                        <p>Error: ??</p>
                    </div>
                )
            default:
                return (
                    <div></div>
                )
        }

    }

    // buildAuthProd() {
    //     if (this.props.token) {
    //         return (
    //             <div className="Auth Auth-authorized">
    //                 {this.props.children}
    //             </div>
    //         )
    //     } else {
    //         return (
    //             <div className="Auth Auth-unauthorized">
    //                 <p>Not authorized!</p>
    //             </div>
    //         )
    //     }
    // }

    render() {
        return (
            <div className="Auth">
                {this.props.env === 'dev' ? this.buildAuthDev() : this.buildAuthProd2()}
            </div>
        )

    }
}

export default Auth