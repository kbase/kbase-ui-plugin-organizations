import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { StoreState, EditableOrganization, EditState, SaveState, ValidationState } from '../../../../../types';
import {
    editOrgSave,
    updateName,
    updateDescription, updateLogoUrl, updateIsPrivate, updateHomeUrl, updateResearchInterests
} from '../../../../../redux/actions/editOrg';
import EditOrganization from './component';
import * as orgModel from '../../../../../data/models/organization/model'

interface OwnProps {
    onFinish: () => void
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
    onUpdateHomeUrl: (homeUrl: string | null) => void
    onUpdateResearchInterests: (researchInterests: string) => void
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
            dispatch(updateName(name) as any)
        },
        onUpdateLogoUrl: (gravatarHash: string | null) => {
            dispatch(updateLogoUrl(gravatarHash) as any)
        },
        // onUpdateId: (id) => {
        //     dispatch(editOrgUpdateId(id) as any)
        // },
        onUpdateDescription: (description) => {
            dispatch(updateDescription(description) as any)
        },
        onUpdateIsPrivate: (isPrivate: boolean) => {
            dispatch(updateIsPrivate(isPrivate) as any)
        },
        onUpdateHomeUrl: (homeUrl: string | null) => {
            dispatch(updateHomeUrl(homeUrl) as any)
        },
        onUpdateResearchInterests: (researchInterests: string) => {
            dispatch(updateResearchInterests(researchInterests) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(EditOrganization)