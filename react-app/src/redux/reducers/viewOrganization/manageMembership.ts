import { Action } from 'redux';
import * as actions from '../../actions/viewOrganization/manageMembership';
import {
    StoreState, SyncState, ValidationStateOk, ValidationState, ValidationErrorType,
    SaveState, EditState, ManageMembershipViewModel, ViewOrgViewModelKind, View, ViewState
} from '../../../types';
import { ActionFlag } from '../../actions';

export function loadStart(state: View<ManageMembershipViewModel>, action: actions.LoadStart): View<ManageMembershipViewModel> {
    return {
        ...state,
        state: ViewState.LOADING,
        error: null,
        viewModel: null
    };
}

export function loadSuccess(state: View<ManageMembershipViewModel>, action: actions.LoadSuccess): View<ManageMembershipViewModel> {
    return {
        ...state,
        state: ViewState.OK,
        error: null,
        viewModel: {
            organization: action.organization,
            editableMemberProfile: action.editableMemberProfile,
            editState: EditState.UNEDITED,
            saveState: SaveState.NEW,
            validationState: validationStateOk()
        }
    };
}

export function loadError(state: View<ManageMembershipViewModel>, action: actions.LoadError): View<ManageMembershipViewModel> {
    return {
        state: ViewState.ERROR,
        error: action.error,
        viewModel: null
    };
}

export function unload(state: View<ManageMembershipViewModel>, action: actions.Unload): View<ManageMembershipViewModel> {
    if (state.viewModel === null) {
        return state;
    }

    return {
        ...state,
        state: ViewState.NONE,
        error: null,
        viewModel: null
    };
}

function validationStateOk(): ValidationStateOk {
    const x: ValidationState = {
        type: ValidationErrorType.OK,
        validatedAt: new Date()
    };
    return x;
}

export function updateTitleSuccess(state: View<ManageMembershipViewModel>, action: actions.UpdateTitleSuccess): View<ManageMembershipViewModel> {
    if (state.viewModel === null) {
        return state;
    }

    const editedMember = state.viewModel.editableMemberProfile;
    let syncState;
    if (action.title !== editedMember.title.remoteValue) {
        syncState = SyncState.DIRTY;
    } else {
        syncState = SyncState.CLEAN;
    }
    const newState = {
        ...state,
        viewModel: {
            ...state.viewModel,
            editableMemberProfile: {
                ...state.viewModel.editableMemberProfile,
                title: {
                    value: action.title,
                    remoteValue: action.title,
                    syncState: syncState,
                    validationState: validationStateOk()
                }
            }
        }
    };

    const editState = evaluateEditorState(newState.viewModel);

    return {
        ...newState,
        viewModel: {
            ...newState.viewModel,
            editState: editState
        }
    };
}
function evaluateEditorState(viewModel: ManageMembershipViewModel): EditState {
    if (viewModel.editableMemberProfile.title.syncState === SyncState.DIRTY) {
        return EditState.EDITED;
    }

    return EditState.UNEDITED;
}

function evaluateSuccess(state: View<ManageMembershipViewModel>, action: actions.EvaluateSuccess): View<ManageMembershipViewModel> {
    if (state.viewModel === null) {
        return state;
    }

    const editState = evaluateEditorState(state.viewModel);

    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            editState: editState,
            validationState: {
                type: ValidationErrorType.OK,
                validatedAt: new Date()
            }
        }
    };
}

function evaluateError(state: View<ManageMembershipViewModel>, action: actions.EvaluateError): View<ManageMembershipViewModel> {
    if (state.viewModel === null) {
        return state;
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            validationState: {
                type: ValidationErrorType.ERROR,
                message: 'Validation error(s)',
                validatedAt: new Date()
            }
        }
    };
}

export function saveSuccess(state: View<ManageMembershipViewModel>, action: actions.SaveSuccess): View<ManageMembershipViewModel> {
    if (state.viewModel === null) {
        return state;
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            editState: EditState.UNEDITED,
            saveState: SaveState.SAVED,
            editableMemberProfile: {
                ...state.viewModel.editableMemberProfile,
                title: {
                    ...state.viewModel.editableMemberProfile.title,
                    syncState: SyncState.CLEAN
                }
            }
        }
    };
}


// export function demoteSelfToMemberSuccess(state: View<ManageMembershipViewModel>, action: actions.DemoteSelfToMemberSuccess): View<ManageMembershipViewModel> {
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

function localReducer(state: View<ManageMembershipViewModel>, action: Action): View<ManageMembershipViewModel> | null {
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

export default function reducer(state: StoreState, action: Action): StoreState | null {
    if (!haveReducer(action)) {
        return null;
    }
    if (!state.views.viewOrgView.viewModel) {
        return state;
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }
    const viewState: View<ManageMembershipViewModel> = state.views.viewOrgView.viewModel.subViews.manageMembershipView;
    const newViewState = localReducer(viewState, action);
    if (newViewState === null) {
        return null;
    }
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    subViews: {
                        ...state.views.viewOrgView.viewModel.subViews,
                        manageMembershipView: newViewState
                    }
                }
            }
        }
    };
}

