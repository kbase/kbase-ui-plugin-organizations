import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { StoreState, EditableOrganization, EditState, SaveState, ValidationState } from '../types';
import {
    EditOrgEdit, editOrgSave,
    editOrgUpdateName,
    // editOrgUpdateId, 
    editOrgUpdateDescription, editOrgEdit, editOrgUpdateGravatarHash
} from '../redux/actions/editOrg';

import EditOrganization from '../components/EditOrganization';

interface OwnProps {
    id: string
}

export interface StateProps {
    editState: EditState,
    saveState: SaveState,
    validationState: ValidationState,
    editedOrganization: EditableOrganization
}

export interface DispatchProps {
    onEditOrgEdit: (id: string) => void,
    onEditOrgSave: () => void,
    onUpdateName: (name: string) => void,
    onUpdateGravatarHash: (gravatarHash: string) => void,
    // onUpdateId: (id: string) => void,
    onUpdateDescription: (description: string) => void
}

export function mapStateToProps({ editOrg: { editState, saveState, validationState, editedOrganization } }: StoreState): StateProps {
    return {
        editState,
        saveState,
        validationState,
        editedOrganization
    }
}

export function mapDispatchToProps(dispatch: Dispatch<EditOrgEdit>): DispatchProps {
    return {
        onEditOrgEdit: (id: string) => {
            dispatch(editOrgEdit(id) as any)
        },
        onEditOrgSave: () => {
            dispatch(editOrgSave() as any)
        },
        onUpdateName: (name: string) => {
            dispatch(editOrgUpdateName(name) as any)
        },
        onUpdateGravatarHash: (gravatarHash: string) => {
            dispatch(editOrgUpdateGravatarHash(gravatarHash) as any)
        },
        // onUpdateId: (id) => {
        //     dispatch(editOrgUpdateId(id) as any)
        // },
        onUpdateDescription: (description) => {
            dispatch(editOrgUpdateDescription(description) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(EditOrganization)