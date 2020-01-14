import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { AppState, UserRelationToOrganization, Organization, MemberType } from '../../types';

import Organizations from './component'


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
    const organizations: Array<Organization> = [{
        id: '',
        name: '',
        description: '',
        gravatarHash: '',
        owner: {
            type: MemberType.MEMBER,
            user: {
                username: '',
                realname: '',
                title: '',
                avatarOption: '',
                gravatarDefault: '',
                gravatarHash: '',
                organization: '',
                city: '',
                state: '',
                country: ''
            }
        },
        relation: {
            type: UserRelationToOrganization.NONE
        },
        createdAt: new Date(),
        modifiedAt: new Date(),
        members: [],
        adminRequests: []
    }]

    const wrapper = shallow(<Organizations organizations={organizations} />)

});
