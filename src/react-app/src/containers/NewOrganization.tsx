import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { StoreState } from '../types';
import {
    AddOrg, addOrg,
    addOrgUpdateName, addOrgUpdateId, addOrgUpdateDescription, addOrgEdit
} from '../redux/actions/addOrg';

import NewOrganization from '../components/NewOrganization';

interface OwnProps {
}

export interface StateProps {
}

export interface DispatchProps {
    onAddOrg: () => void,
    onAddOrgEdit: () => void,
    onUpdateName: (name: string) => void,
    onUpdateId: (id: string) => void,
    onUpdateDescription: (description: string) => void
}

export function mapStateToProps({ addOrg: { editState, saveState, validationState, newOrganization } }: StoreState): StateProps {
    return {
        editState,
        saveState,
        validationState,
        newOrganization
    }
}

export function mapDispatchToProps(dispatch: Dispatch<AddOrg>): DispatchProps {
    return {
        onAddOrgEdit: () => {
            dispatch(addOrgEdit() as any)
        },
        onAddOrg: () => {
            dispatch(addOrg() as any)
        },
        onUpdateName: (name) => {
            dispatch(addOrgUpdateName(name) as any)
        },
        onUpdateId: (id) => {
            dispatch(addOrgUpdateId(id) as any)
        },
        onUpdateDescription: (description) => {
            dispatch(addOrgUpdateDescription(description) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(NewOrganization)