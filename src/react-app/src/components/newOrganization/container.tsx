import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { StoreState, EditState, SaveState, ValidationState, EditableOrganization, AppError } from '../../types';
import {
    addOrg, updateName, updateGravatarHash, updateId, updateDescription
} from '../../redux/actions/addOrg';

import Component from './component';

interface OwnProps {
}

export interface StateProps {
    editState: EditState
    saveState: SaveState
    validationState: ValidationState
    newOrganization: EditableOrganization
    error: AppError | null
}

export interface DispatchProps {
    onSave: () => void,
    onUpdateName: (name: string) => void,
    onUpdateGravatarHash: (gravatarHash: string) => void,
    onUpdateId: (id: string) => void,
    onUpdateDescription: (description: string) => void
}

export function mapStateToProps(state: StoreState): StateProps {
    if (!state.addOrgView.viewModel) {
        throw new Error('View model missing in state')
    }
    const {
        addOrgView: {
            viewModel: { editState, saveState, validationState, newOrganization, error } } } = state
    return {
        editState,
        saveState,
        validationState,
        newOrganization,
        error
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onSave: () => {
            dispatch(addOrg() as any)
        },
        onUpdateName: (name) => {
            dispatch(updateName(name) as any)
        },
        onUpdateGravatarHash: (gravatarHash: string) => {
            dispatch(updateGravatarHash(gravatarHash) as any)
        },
        onUpdateId: (id) => {
            dispatch(updateId(id) as any)
        },
        onUpdateDescription: (description) => {
            dispatch(updateDescription(description) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component)