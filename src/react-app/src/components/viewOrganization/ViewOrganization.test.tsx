import React from 'react'
import { Organization, ViewOrgState, UserRelationToOrganization, MemberType } from '../../types'
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
        id: '',
        name: '',
        gravatarHash: '',
        description: '',
        createdAt: new Date(),
        modifiedAt: new Date(),
        members: [],
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
    const onAcceptInvitation = () => { }
    const onRejectInvitation = () => { }

    const wrapper = shallow(<ViewOrganization
        state={state}
        id={id}
        organization={organization}
        error={error}
        username={username}
        onViewOrg={onViewOrg}
        onJoinOrg={onJoinOrg}
        onCancelJoinRequest={onCancelJoinRequest}
        onAcceptInvitation={onAcceptInvitation}
        onRejectInvitation={onRejectInvitation}
    />)
});
