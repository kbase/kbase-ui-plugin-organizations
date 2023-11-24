import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import {
    StoreState
} from '../../../../../../redux/store/types';
import {
    editOrgSave,
    updateName,
    updateDescription, updateLogoUrl, updateIsPrivate, updateHomeUrl, updateResearchInterests
} from '../../../../../../redux/actions/viewOrganization/editOrg';
import EditOrganization from './component';
import * as orgModel from '../../../../../../data/models/organization/model';
import {
    EditState, SaveState, ValidationState, EditableOrganization, AsyncModelState
} from '../../../../../../redux/store/types/common';
import { extractViewOrgSubView } from '../../../../../../lib/stateExtraction';
import { SubViewKind } from '../../../../../../redux/store/types/views/Main/views/ViewOrg';

interface OwnProps {
    onFinish: () => void;
}

export interface StateProps {
    editState: EditState,
    saveState: SaveState,
    validationState: ValidationState,
    editedOrganization: EditableOrganization,
    organization: orgModel.Organization;
}

export interface DispatchProps {
    onEditOrgSave: () => void;
    onUpdateName: (name: string) => void;
    onUpdateLogoUrl: (logoUrl: string | null) => void;
    // onUpdateId: (id: string) => void,
    onUpdateDescription: (description: string) => void;
    onUpdateIsPrivate: (isPrivate: boolean) => void;
    onUpdateHomeUrl: (homeUrl: string | null) => void;
    onUpdateResearchInterests: (researchInterests: string) => void;
}

export function mapStateToProps(state: StoreState): StateProps {
    const subView = extractViewOrgSubView(state);
    if (subView.kind !== SubViewKind.EDIT_ORGANIZATION) {
        throw new Error('Wrong model');
    }

    if (subView.model.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    const {
        model: {
            value: {
                editState, saveState, validationState, editedOrganization, organization
            }
        }
    } = subView;

    return {
        editState,
        saveState,
        validationState,
        editedOrganization,
        organization
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onEditOrgSave: () => {
            dispatch(editOrgSave() as any);
        },
        onUpdateName: (name: string) => {
            dispatch(updateName(name) as any);
        },
        onUpdateLogoUrl: (logoUrl: string | null) => {
            dispatch(updateLogoUrl(logoUrl) as any);
        },
        // onUpdateId: (id) => {
        //     dispatch(editOrgUpdateId(id) as any)
        // },
        onUpdateDescription: (description) => {
            dispatch(updateDescription(description) as any);
        },
        onUpdateIsPrivate: (isPrivate: boolean) => {
            dispatch(updateIsPrivate(isPrivate) as any);
        },
        onUpdateHomeUrl: (homeUrl: string | null) => {
            dispatch(updateHomeUrl(homeUrl) as any);
        },
        onUpdateResearchInterests: (researchInterests: string) => {
            dispatch(updateResearchInterests(researchInterests) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(EditOrganization);