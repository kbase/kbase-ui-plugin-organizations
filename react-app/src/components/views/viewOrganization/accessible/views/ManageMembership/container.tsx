import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../../../../redux/actions/viewOrganization/manageMembership';

import { StoreState } from '../../../../../../types';
import * as orgModel from '../../../../../../data/models/organization/model';
import * as userModel from '../../../../../../data/models/user';

import Component from './component';
import { EditState, SaveState, ValidationState, AsyncModelState } from '../../../../../../types/common';
import { ViewOrgViewModelKind, SubViewKind } from '../../../../../../types/views/Main/views/ViewOrg';

export interface OwnProps {
    onFinish: () => void;
}

interface StateProps {
    username: userModel.Username;
    organization: orgModel.Organization;
    editableMemberProfile: orgModel.EditableMemberProfile;
    editState: EditState;
    saveState: SaveState;
    validationState: ValidationState;
}

interface DispatchProps {
    onLeaveOrganization: (organizationId: string) => void;
    onDemoteSelfToMember: (organizationId: string) => void;
    onUpdateTitle: (title: string) => void;
    onSave: () => void;
}

function mapStateToProps(state: StoreState): StateProps {
    if (state.auth.userAuthorization === null) {
        throw new Error('Not authorized');
    }

    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     throw new Error('Not in view orgs view');
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error('Wrong model');
    }

    if (state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.MANAGE_MEMBERSHIP) {
        throw new Error('Wrong model!');
    }

    if (state.view.value.views.viewOrg.value.subView.model.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    const {
        auth: {
            userAuthorization: {
                username
            }
        },
        view: {
            value: {
                views: {
                    viewOrg: {
                        value: {
                            organization,
                            subView: {
                                model: {
                                    value: {
                                        editableMemberProfile, editState, saveState, validationState
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } = state;

    return {
        username,
        organization, editableMemberProfile, editState, saveState, validationState
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
        onLeaveOrganization: (organizationId: string) => {
            dispatch(actions.leaveOrg(organizationId) as any);
        },
        onUpdateTitle: (title: string) => {
            dispatch(actions.updateTitle(title) as any);
        },
        onSave: () => {
            dispatch(actions.save() as any);
        },
        onDemoteSelfToMember: (organizationId: string) => {
            dispatch(actions.demoteSelfToMember(organizationId) as any);
        }
    };
}

// export function mapDispatchToProps(): DispatchProps {
//     return {
//         onLeaveOrganization: actions.leaveOrg,
//         onUpdateTitle: actions.updateTitle,
//         onSave: actions.save,
//         onDemoteSelfToMember: actions.demoteSelfToMember
//     };
// }

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component);