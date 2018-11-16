import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { AppState, UserRelationToOrganization } from '../types';

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
        description: '',
        gravatarHash: '',
        owner: {
            username: '',
            realname: '',
            avatarOption: '',
            gravatarDefault: '',
            gravatarHash: '',
            organization: '',
            city: '',
            state: '',
            country: ''
        },
        relation: {
            type: UserRelationToOrganization.NONE
        },
        createdAt: new Date(),
        modifiedAt: new Date(),
        members: [],
        admins: [],
        adminRequests: []
    }]

    const wrapper = shallow(<Organizations organizations={organizations} />)

});
