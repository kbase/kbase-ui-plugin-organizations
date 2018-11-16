import React from 'react'
import { Authorization, AuthState, Organization, ViewOrgState, UserRelationToOrganization } from '../types'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ViewOrganization from './ViewOrganization'

configure({ adapter: new Adapter() })

/*
  state: ViewOrgState
    id: string,
    organization?: Organization
    error?: AppError
    username: string,
    onViewOrg: (id: string) => void
*/

it('renders without crashing', () => {
    const id = ''
    const state = ViewOrgState.NONE
    const organization: Organization = {
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
        id: '',
        name: '',
        gravatarHash: '',
        description: '',
        createdAt: new Date(),
        modifiedAt: new Date(),
        members: [],
        admins: [],
        adminRequests: []
    }
    const error = {
        code: '',
        message: ''
    }
    const username = ''
    const onViewOrg = (id: string) => { }
    const onJoinOrg = () => { }
    const onCancelJoinRequest = (id: string) => { }

    const wrapper = shallow(<ViewOrganization
        state={state}
        id={id}
        organization={organization}
        error={error}
        username={username}
        onViewOrg={onViewOrg}
        onJoinOrg={onJoinOrg}
        onCancelJoinRequest={onCancelJoinRequest}
    />)
});
