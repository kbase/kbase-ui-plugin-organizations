import {Dispatch} from 'redux'
import {connect} from 'react-redux'

import { EditOrgState, Organization, EditedOrganization, AppError, StoreState } from '../types'
import {EditOrg, editOrg, editOrgUpdateName, editOrgUpdateDescription} from '../redux/actions/editOrg'

import EditOrganization from '../components/EditOrganization'
import { editOrgSave } from '../redux/actions/editOrg';

interface OwnProps {
    id: string
}
interface StateProps {
    state: EditOrgState
    organization?: Organization
    editedOrganization?: EditedOrganization
    error?: AppError
}

interface DispatchProps {
    onEditOrg: (id: string) => void,
    onUpdateOrg: () => void,
    onUpdateName: (name: string) => void,
    onUpdateDescription: (description: string) => void
}

function mapStateToProps({editOrg: {state, error, editedOrganization}}: StoreState, 
                         {id}: OwnProps): StateProps {
    return {state, error, editedOrganization}
}

export function mapDispatchToProps(dispatch: Dispatch<EditOrg>): DispatchProps {
    return {
        onEditOrg: (id) => {
            dispatch(editOrg(id) as any)
        },
        onUpdateOrg: () => {
            dispatch(editOrgSave() as any)
        },
        onUpdateName: (name) => {
            dispatch(editOrgUpdateName(name) as any)
        },
        onUpdateDescription: (description) => {
            dispatch(editOrgUpdateDescription(description) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(EditOrganization)
