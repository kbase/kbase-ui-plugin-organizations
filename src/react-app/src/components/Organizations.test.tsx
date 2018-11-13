import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { AppState } from '../types';

import Organizations from './Organizations'


configure({ adapter: new Adapter() })

/*
 id: string
    name: string
    gravatarHash: string | null
    owner: {
        username: string
        realname: string
    }
    createdAt: Date
    modifiedAt: Date
*/
it('renders without crashing', () => {
    const organizations = [{
        id: '',
        name: '',
        gravatarHash: '',
        owner: {
            username: '',
            realname: ''
        },
        createdAt: new Date(),
        modifiedAt: new Date()
    }]

    const wrapper = shallow(<Organizations organizations={organizations} />)

});
