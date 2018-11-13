import React from 'react'
import Auth from './Auth'
import { Authorization, AuthState } from '../types'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
    const authorization: Authorization = {
        status: AuthState.NONE,
        message: '',
        authorization: {
            token: '',
            username: '',
            realname: '',
            roles: []
        }
    }
    const checkAuth = () => { }
    const onRemoveAuthorization = () => { }
    const onAddAuthorization = (token: string) => { }
    const hosted = false
    const wrapper = shallow(<Auth
        authorization={authorization}
        hosted={hosted}
        checkAuth={checkAuth}
        onRemoveAuthorization={onRemoveAuthorization}
        onAddAuthorization={onAddAuthorization}
    />)
});
