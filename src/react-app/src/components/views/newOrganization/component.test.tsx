import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import NewOrganization from './component'
import { EditState, SaveState, ValidationState, FieldState, UIErrorType, EditableOrganization } from '../../../types';

configure({ adapter: new Adapter() })

function makeEmptyNewOrganization(): EditableOrganization {
    return {
        id: {
            value: '',
            status: FieldState.NONE,
            error: {
                type: UIErrorType.NONE
            }
        },
        name: {
            value: '',
            status: FieldState.NONE,
            error: {
                type: UIErrorType.NONE
            }
        },
        gravatarHash: {
            value: '',
            status: FieldState.NONE,
            error: {
                type: UIErrorType.NONE
            }
        },
        description: {
            value: '',
            status: FieldState.NONE,
            error: {
                type: UIErrorType.NONE
            }
        }
    }
}

it('renders without crashing', () => {
    const editState = EditState.NONE
    const saveState = SaveState.NONE
    const validationState = ValidationState.NONE
    const newOrg = makeEmptyNewOrganization()
    const onAddOrg = () => { }
    const onAddOrgEdit = () => { }
    const onUpdateName = (name: string) => { }
    const onUpdateGravatarHash = (gravatarHash: string) => { }
    const onUpdateId = (id: string) => { }
    const onUpdateDescription = (description: string) => { }

    const wrapper = shallow(<NewOrganization
        editState={editState} saveState={saveState} validationState={validationState}
        newOrganization={newOrg}
        onAddOrgEdit={onAddOrgEdit}
        onUpdateName={onUpdateName}
        onUpdateGravatarHash={onUpdateGravatarHash}
        onUpdateId={onUpdateId}
        onUpdateDescription={onUpdateDescription}
        onAddOrg={onAddOrg}
    />)
})
