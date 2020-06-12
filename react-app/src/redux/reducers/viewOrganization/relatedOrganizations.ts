import * as actions from '../../actions/viewOrganization/relatedOrganizations';
import { StoreState } from '../../../types';
import { Action } from 'redux';
import { ActionFlag } from '../../actions';
import { AsyncModelState } from '../../../types/common';
import { ViewOrgViewModelKind, SubViewKind } from '../../../types/views/Main/views/ViewOrg';

export function removeOrganization(state: StoreState, action: actions.RemoveOrganization): StoreState {
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

    if (state.view.value.views.viewOrg.value.subView.kind !== SubViewKind.MANAGE_RELATED_ORGS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.subView.model.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }


    const {
        view: {
            value: {
                views: {

                    viewOrg: {
                        value: {
                            organization: { relatedOrganizations }
                        }
                    }
                }
            }
        }
    } = state;
    const newRelatedOrganizations = relatedOrganizations
        .filter((organizationId: string) => {
            return (organizationId !== action.organizationId);
        });

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
                            organization: {
                                ...state.view.value.views.viewOrg.value.organization,
                                relatedOrganizations: newRelatedOrganizations
                            }
                        }
                    }
                }
            }
        }
    };
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_RELATED_ORGANIZATIONS_REMOVE_ORGANIZATION_SUCCESS:
            return removeOrganization(state, action as actions.RemoveOrganization);
        default:
            return null;
    }
}
