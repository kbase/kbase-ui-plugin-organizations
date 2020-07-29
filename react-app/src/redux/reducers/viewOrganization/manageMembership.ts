import { Action } from 'redux';
import * as actions from '../../actions/viewOrganization/manageMembership';
import {
    StoreState
} from '../../store/types';
import { ActionFlag } from '../../actions';
import {
    AsyncModelState, EditState, SaveState, ValidationStateOk, ValidationState, ValidationErrorType, SyncState, AsyncModel
} from '../../store/types/common';
import { SubViewKind, ViewOrgViewModelKind } from '../../store/types/views/Main/views/ViewOrg';
import { ManageMembershipViewModel } from '../../store/types/views/Main/views/ViewOrg/views/ManageMembership';
import { EditableMemberProfile } from '../../../data/models/organization/model';

export function loadStart(state: AsyncModel<ManageMembershipViewModel>, action: actions.LoadStart): AsyncModel<ManageMembershipViewModel> {
    return {
        loadingState: AsyncModelState.LOADING
    };
}

export function loadSuccess(state: AsyncModel<ManageMembershipViewModel>, action: actions.LoadSuccess): AsyncModel<ManageMembershipViewModel> {
    return {
        loadingState: AsyncModelState.SUCCESS,
        value: {
            organization: action.organization,
            editableMemberProfile: action.editableMemberProfile,
            editState: EditState.UNEDITED,
            saveState: SaveState.NEW,
            validationState: validationStateOk()
        }
    };
}

export function loadError(state: AsyncModel<ManageMembershipViewModel>, action: actions.LoadError): AsyncModel<ManageMembershipViewModel> {
    return {
        loadingState: AsyncModelState.ERROR,
        error: action.error
    };
}

export function unload(state: AsyncModel<ManageMembershipViewModel>, action: actions.Unload): AsyncModel<ManageMembershipViewModel> {
    return {
        loadingState: AsyncModelState.NONE
    };
}

function validationStateOk(): ValidationStateOk {
    const x: ValidationState = {
        type: ValidationErrorType.OK,
        validatedAt: new Date()
    };
    return x;
}

export function updateTitleSuccess(state: AsyncModel<ManageMembershipViewModel>, action: actions.UpdateTitleSuccess): AsyncModel<ManageMembershipViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const editedMember = state.value.editableMemberProfile;
    let syncState;
    if (action.title !== editedMember.title.remoteValue) {
        syncState = SyncState.DIRTY;
    } else {
        syncState = SyncState.CLEAN;
    }
    const editState = evaluateEditorState(state.value.editableMemberProfile);
    return {
        ...state,
        value: {
            ...state.value,
            editState: editState,
            editableMemberProfile: {
                ...state.value.editableMemberProfile,
                title: {
                    value: action.title,
                    remoteValue: action.title,
                    syncState: syncState,
                    validationState: validationStateOk()
                }
            }
        }
    };
}
function evaluateEditorState(viewModel: EditableMemberProfile): EditState {
    if (viewModel.title.syncState === SyncState.DIRTY) {
        return EditState.EDITED;
    }

    return EditState.UNEDITED;
}

function evaluateSuccess(state: AsyncModel<ManageMembershipViewModel>, action: actions.EvaluateSuccess): AsyncModel<ManageMembershipViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const editState = evaluateEditorState(state.value.editableMemberProfile);

    return {
        ...state,
        value: {
            ...state.value,
            editState: editState,
            validationState: {
                type: ValidationErrorType.OK,
                validatedAt: new Date()
            }
        }
    };
}

function evaluateError(state: AsyncModel<ManageMembershipViewModel>, action: actions.EvaluateError): AsyncModel<ManageMembershipViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }
    return {
        ...state,
        value: {
            ...state.value,
            validationState: {
                type: ValidationErrorType.ERROR,
                message: 'Validation error(s)',
                validatedAt: new Date()
            }
        }
    };
}

export function saveSuccess(state: AsyncModel<ManageMembershipViewModel>, action: actions.SaveSuccess): AsyncModel<ManageMembershipViewModel> {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }
    return {
        ...state,
        value: {
            ...state.value,
            editState: EditState.UNEDITED,
            saveState: SaveState.SAVED,
            editableMemberProfile: {
                ...state.value.editableMemberProfile,
                title: {
                    ...state.value.editableMemberProfile.title,
                    syncState: SyncState.CLEAN
                }
            }
        }
    };
}


// export function demoteSelfToMemberSuccess(state: AsyncModel<ManageMembershipViewModel>, action: actions.DemoteSelfToMemberSuccess): AsyncModel<ManageMembershipViewModel> {
//     if (!state.views.manageMembershipView.viewModel) {
//         return state
//     }

//     const {
//         views: { viewOrgView: { viewModel } }
//     } = state

//     if (viewModel === null) {
//         return state
//     }

//     // TODO: ugh, cut this off before getting here.
//     if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
//         return state
//     }

//     // TODO: probably better is to have to have the action handler do a call to get the members
//     // and to populate the orgs membership struct from that...
//     const members = viewModel.organization.members.map((member) => {
//         if (member.username === action.memberUsername) {
//             return {
//                 ...member,
//                 type: MemberType.MEMBER
//             }
//         } else {
//             return member
//         }
//     })

//     const sortedMembers = viewModel.members.map((member) => {
//         if (member.username === action.memberUsername) {
//             return {
//                 ...member,
//                 type: MemberType.MEMBER
//             }
//         } else {
//             return member
//         }
//     })

//     return {
//         ...state,
//         views: {
//             ...state.views,
//             viewOrgView: {
//                 ...state.views.viewOrgView,
//                 viewModel: {
//                     ...viewModel,
//                     organization: {
//                         ...viewModel.organization,
//                         members: members
//                     },
//                     members: sortedMembers
//                 }
//             }
//         }
//     }
// }

// function reducer(state: StoreState, action: Action): StoreState | null {
//     switch (action.type) {
//         case ActionFlag.MANAGE_MEMBERSHIP_LOAD_START:
//             return loadStart(state, action as actions.LoadStart)
//         case ActionFlag.MANAGE_MEMBERSHIP_LOAD_SUCCESS:
//             return loadSuccess(state, action as actions.LoadSuccess)
//         case ActionFlag.MANAGE_MEMBERSHIP_LOAD_ERROR:
//             return loadError(state, action as actions.LoadError)
//         case ActionFlag.MANAGE_MEMBERSHIP_UNLOAD:
//             return unload(state, action as actions.Unload)
//         case ActionFlag.MANAGE_MEMBERSHIP_UPDATE_TITLE_SUCCESS:
//             return updateTitleSuccess(state, action as actions.UpdateTitleSuccess)
//         case ActionFlag.MANAGE_MEMBERSHIP_EVALUATE_SUCCESS:
//             return evaluateSuccess(state, action as actions.EvaluateSuccess)
//         case ActionFlag.MANAGE_MEMBERSHIP_EVALUATE_ERROR:
//             return evaluateError(state, action as actions.EvaluateError)
//         case ActionFlag.MANAGE_MEMBERSHIP_SAVE_SUCCESS:
//             return saveSuccess(state, action as actions.SaveSuccess)
//         // case ActionFlag.MANAGE_MEMBERSHIP_DEMOTE_SELF_TO_MEMBER_SUCCESS:
//         //     return demoteSelfToMemberSuccess(state, action as actions.DemoteSelfToMemberSuccess)
//         default:
//             return null
//     }
// }

function localReducer(state: AsyncModel<ManageMembershipViewModel>, action: Action): AsyncModel<ManageMembershipViewModel> | null {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_START:
            return loadStart(state, action as actions.LoadStart);
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess);
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_ERROR:
            return loadError(state, action as actions.LoadError);
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UNLOAD:
            return unload(state, action as actions.Unload);
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UPDATE_TITLE_SUCCESS:
            return updateTitleSuccess(state, action as actions.UpdateTitleSuccess);
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE_SUCCESS:
            return evaluateSuccess(state, action as actions.EvaluateSuccess);
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE_ERROR:
            return evaluateError(state, action as actions.EvaluateError);
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_SUCCESS:
            return saveSuccess(state, action as actions.SaveSuccess);
        // case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_DEMOTE_SELF_TO_MEMBER_SUCCESS:
        //     return demoteSelfToMemberSuccess(state, action as actions.DemoteSelfToMemberSuccess)
        default:
            return null;
    }
}

function haveReducer(action: Action): boolean {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_START:
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_SUCCESS:
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_LOAD_ERROR:
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UNLOAD:
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_UPDATE_TITLE_SUCCESS:
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE_SUCCESS:
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_EVALUATE_ERROR:
        case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_SAVE_SUCCESS:
            // case ActionFlag.VIEW_ORG_MANAGE_MEMBERSHIP_DEMOTE_SELF_TO_MEMBER_SUCCESS:
            return true;
        default:
            return false;
    }
}

// export default function reducer(state: StoreState, action: Action): StoreState | null {
//     if (!haveReducer(action)) {
//         return null;
//     }
//     if (!state.views.viewOrgView.viewModel) {
//         return state;
//     }
//     if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
//         return state;
//     }
//     const viewState: ManageMembershipViewModel = state.views.viewOrgView.viewModel.subViews.manageMembershipView;
//     const newViewState = localReducer(viewState, action);
//     if (newViewState === null) {
//         return null;
//     }
//     return {
//         ...state,
//         views: {
//             ...state.views,
//             viewOrgView: {
//                 ...state.views.viewOrgView,
//                 viewModel: {
//                     ...state.views.viewOrgView.viewModel,
//                     subViews: {
//                         ...state.views.viewOrgView.viewModel.subViews,
//                         manageMembershipView: newViewState
//                     }
//                 }
//             }
//         }
//     };
// }

export default function reducer(state: StoreState, action: Action): StoreState | null {
    if (!haveReducer(action)) {
        return null;
    }

    if (state.auth.userAuthorization === null) {
        return state;
    }

    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.MANAGE_MEMBERSHIP) {
        return state;
    }

    // if (state.view.value.views.viewOrg.value.subView.model.loadingState !== AsyncModelState.SUCCESS) {
    //     return state;
    // }

    const viewState = state.view.value.views.viewOrg.value.subView.model;
    const newViewState = localReducer(viewState, action);
    if (newViewState === null) {
        return null;
    }
    return {
        ...state,
        view: {
            ...state.view,
            value: {
                ...state.view.value,
                views: {
                    ...state.view.value.views,
                    viewOrg: {
                        ...state.view.value.views.viewOrg,
                        value: {
                            ...state.view.value.views.viewOrg.value,
                            subView: {
                                ...state.view.value.views.viewOrg.value.subView,
                                model: newViewState
                            }
                        }
                    }
                }
            }
        }
    };
}

