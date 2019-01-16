import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { StoreState, EditableOrganization, EditState, SaveState, ValidationState } from '../../../types';
import {
    editOrgSave,
    editOrgUpdateName,
    editOrgUpdateDescription, editOrgUpdateLogoUrl, updateIsPrivate
} from '../../../redux/actions/editOrg';
import EditOrganization from './component';
import * as orgModel from '../../../data/models/organization/model'

interface OwnProps {
}

export interface StateProps {
    editState: EditState,
    saveState: SaveState,
    validationState: ValidationState,
    editedOrganization: EditableOrganization,
    organization: orgModel.Organization
}

export interface DispatchProps {
    onEditOrgSave: () => void
    onUpdateName: (name: string) => void
    onUpdateLogoUrl: (gravatarHash: string | null) => void
    // onUpdateId: (id: string) => void,
    onUpdateDescription: (description: string) => void
    onUpdateIsPrivate: (isPrivate: boolean) => void
}

export function mapStateToProps(state: StoreState): StateProps {
    if (!state.views.editOrgView.viewModel) {
        throw new Error('What, no view model??')
    }
    const {
        views: {
            editOrgView: {
                viewModel: { editState, saveState, validationState, editedOrganization, organization }
            }
        }
    } = state

    return {
        editState,
        saveState,
        validationState,
        editedOrganization,
        organization
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onEditOrgSave: () => {
            dispatch(editOrgSave() as any)
        },
        onUpdateName: (name: string) => {
            dispatch(editOrgUpdateName(name) as any)
        },
        onUpdateLogoUrl: (gravatarHash: string | null) => {
            dispatch(editOrgUpdateLogoUrl(gravatarHash) as any)
        },
        // onUpdateId: (id) => {
        //     dispatch(editOrgUpdateId(id) as any)
        // },
        onUpdateDescription: (description) => {
            dispatch(editOrgUpdateDescription(description) as any)
        },
        onUpdateIsPrivate: (isPrivate: boolean) => {
            dispatch(updateIsPrivate(isPrivate) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(EditOrganization)