import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { StoreState } from '../../../../redux/store/types';
import * as actions from '../../../../redux/actions/viewOrg';
import * as acceptInboxRequestActions from '../../../../redux/actions/viewOrganization/acceptInboxRequest';

import ViewOrganization from './component';

import * as orgModel from '../../../../data/models/organization/model';
import * as requestModel from '../../../../data/models/requests';
import { AsyncModelState } from '../../../../redux/store/types/common';
import {
    ViewOrgViewModelKind, ViewAccessibleOrgViewModel, SubViewKind
} from '../../../../redux/store/types/views/Main/views/ViewOrg';

// Props for this component

// The interface for this container component
export interface OwnProps {
}

// the interface for mapStateTo props
interface StateProps {
    viewModel: ViewAccessibleOrgViewModel;
}

// the interface for mapDispatchToProps
interface DispatchProps {
    onViewOrg: (id: string) => void;
    onReloadOrg: (id: string) => void;
    onJoinOrg: () => void;
    onCancelJoinRequest: (requestId: requestModel.RequestID) => void;
    onAcceptInvitation: (requestId: requestModel.RequestID) => void;
    onRejectInvitation: (requestId: requestModel.RequestID) => void;
    onRemoveNarrative: (narrative: orgModel.NarrativeResource) => void;
    onGetViewAccess: (narrative: orgModel.NarrativeResource) => void;
    onAcceptRequest: (requestId: requestModel.RequestID) => void;
    onSortNarratives: (sortBy: string) => void;
    onSearchNarratives: (searchBy: string) => void;
    onRemoveApp: (appId: string) => void;
    subView: (subView: SubViewKind) => void;
    onSearchApps: (searchBy: string) => void;
    onSortApps: (sortBy: string) => void;

}

// hmm this bit would be for the interface for the wrapped component.
// can't really do that here, but _could_ export the interfaces above
// and compose them thus in the wrapped component. But the wrapped component
// should know nothing about this business
// type Props = StateProps & DispatchProps & OwnProps

function mapStateToProps(state: StoreState): StateProps {
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

    const {
        view: {
            value: {
                views: {
                    viewOrg: {
                        value
                    }
                }
            }
        }
    } = state;

    // TODO: of course this really needs to be an async fetch of the org info!
    return {
        viewModel: value
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onViewOrg: (id: string) => {
            dispatch(actions.load(id) as any);
        },
        onReloadOrg: (id: string) => {
            dispatch(actions.reload(id) as any);
        },
        onJoinOrg: () => {
            dispatch(actions.viewOrgJoinRequest() as any);
        },
        onCancelJoinRequest: (requestId: requestModel.RequestID) => {
            dispatch(actions.viewOrgCancelJoinRequest(requestId) as any);
        },
        onAcceptInvitation: (requestId: requestModel.RequestID) => {
            dispatch(actions.acceptJoinInvitation(requestId) as any);
        },
        onRejectInvitation: (requestId: requestModel.RequestID) => {
            dispatch(actions.rejectJoinInvitation(requestId) as any);
        },
        onRemoveNarrative: (narrative: orgModel.NarrativeResource) => {
            dispatch(actions.removeNarrative(narrative) as any);
        },
        onGetViewAccess: (narrative: orgModel.NarrativeResource) => {
            dispatch(actions.accessNarrative(narrative) as any);
        },
        onAcceptRequest: (requestId: requestModel.RequestID) => {
            dispatch(acceptInboxRequestActions.acceptRequest(requestId) as any);
        },
        onSortNarratives: (sortBy: string) => {
            dispatch(actions.sortNarratives(sortBy) as any);
        },
        onSearchNarratives: (searchBy: string) => {
            dispatch(actions.searchNarratives(searchBy) as any);
        },
        onRemoveApp: (appId: string) => {
            dispatch(actions.removeApp(appId) as any);
        },
        subView: (subView: SubViewKind) => {
            dispatch(actions.loadSubview(subView));
        },
        onSearchApps: (searchBy: string) => {
            dispatch(actions.searchApps(searchBy) as any);
        },
        onSortApps: (sortBy: string) => {
            dispatch(actions.sortApps(sortBy) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ViewOrganization);;

// export default connect(mapStateToProps, mapDispatchToProps)(ViewOrganization)

