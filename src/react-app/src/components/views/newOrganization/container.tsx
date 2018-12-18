import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { StoreState, EditState, SaveState, ValidationState, EditableOrganization, AppError } from '../../../types';
import {
    addOrg, updateName, updateGravatarHash, updateId, updateDescription, updateIsPrivate
} from '../../../redux/actions/addOrg';

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
    onSave: () => void
    onUpdateName: (name: string) => void
    onUpdateGravatarHash: (gravatarHash: string | null) => void
    onUpdateId: (id: string) => void
    onUpdateDescription: (description: string) => void
    onUpdateIsPrivate: (isPrivate: boolean) => void
}

export function mapStateToProps(state: StoreState): StateProps {
    if (!state.views.addOrgView.viewModel) {
        throw new Error('View model missing in state')
    }
    const {
        views: {
            addOrgView: {
                viewModel: { editState, saveState, validationState, newOrganization, error }
            }
        }
    } = state

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
        onUpdateGravatarHash: (gravatarHash: string | null) => {
            dispatch(updateGravatarHash(gravatarHash) as any)
        },
        onUpdateId: (id) => {
            dispatch(updateId(id) as any)
        },
        onUpdateDescription: (description) => {
            dispatch(updateDescription(description) as any)
        },
        onUpdateIsPrivate: (isPrivate: boolean) => {
            dispatch(updateIsPrivate(isPrivate) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component)