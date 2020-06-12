import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import {
    StoreState
} from '../../../types';
import {
    addOrg, updateName, updateLogoUrl, updateId, updateDescription,
    updateIsPrivate, updateHomeUrl, updateResearchInterests
} from '../../../redux/actions/addOrg';

import Component from './component';
import { AppError } from '@kbase/ui-components';
import {
    EditState, SaveState, ValidationState, EditableOrganization, AsyncModelState
} from '../../../types/common';

interface OwnProps {
}

export interface StateProps {
    editState: EditState;
    saveState: SaveState;
    validationState: ValidationState;
    newOrganization: EditableOrganization;
    error: AppError | null;
}

export interface DispatchProps {
    onSave: () => void;
    onUpdateName: (name: string) => void;
    onUpdateLogoUrl: (logoUrl: string | null) => void;
    onUpdateId: (id: string) => void;
    onUpdateDescription: (description: string) => void;
    onUpdateIsPrivate: (isPrivate: boolean) => void;
    onUpdateHomeUrl: (homeUrl: string | null) => void;
    onUpdateResearchInterests: (researchInterests: string) => void;
}

export function mapStateToProps(state: StoreState): StateProps {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    // if (state.view.value.kind !== ViewKind.ADD_ORG) {
    //     throw new Error('Not in browse orgs view');
    // }

    if (state.view.value.views.addOrg.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    // if (!state.views.addOrgView.viewModel) {
    //     throw new Error('View model missing in state');
    // }

    const {
        view: {
            value: {
                views: {
                    addOrg: {
                        value: {
                            editState, saveState, validationState, newOrganization, error
                        }
                    }
                }
            }
        }
    } = state;


    return {
        editState,
        saveState,
        validationState,
        newOrganization,
        error
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onSave: () => {
            dispatch(addOrg() as any);
        },
        onUpdateName: (name) => {
            dispatch(updateName(name) as any);
        },
        onUpdateLogoUrl: (logoUrl: string | null) => {
            dispatch(updateLogoUrl(logoUrl) as any);
        },
        onUpdateId: (id) => {
            dispatch(updateId(id) as any);
        },
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

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component);