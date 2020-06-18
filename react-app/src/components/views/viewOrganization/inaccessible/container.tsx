import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { StoreState } from '../../../../types';
import * as actions from '../../../../redux/actions/viewOrg';

import ViewOrganization from './component';

import * as orgModel from '../../../../data/models/organization/model';
import * as requestModel from '../../../../data/models/requests';
import { AsyncModelState } from '../../../../types/common';
import { ViewOrgViewModelKind } from '../../../../types/views/Main/views/ViewOrg';

// Props for this component

// The interface for this container component
export interface OwnProps {
}

// the interface for mapStateTo props
interface StateProps {
    organization: orgModel.InaccessiblePrivateOrganization;
    relation: orgModel.Relation;
    requestOutbox: Array<requestModel.Request>;
}

// the interface for mapDispatchToProps
interface DispatchProps {
    onJoinOrg: () => void;
    onCancelJoinRequest: (requestId: string) => void;
    onAcceptInvitation: (requestId: string) => void;
    onRejectInvitation: (requestId: string) => void;
}

// hmm this bit would be for the interface for the wrapped component.
// can't really do that here, but _could_ export the interfaces above
// and compose them thus in the wrapped component. But the wrapped component
// should know nothing about this business
// type Props = StateProps & DispatchProps & OwnProps


function mapStateToProps(state: StoreState, ownProps: OwnProps): StateProps {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     throw new Error('Not in view orgs view');
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.PRIVATE_INACCESSIBLE) {
        throw new Error('Wrong model');
    }

    const {
        view: {
            value: {
                views: {
                    viewOrg: {
                        value: viewModel
                    }
                }
            }
        }
    } = state;

    // const viewModel = state.views.viewOrgView.viewModel
    if (!viewModel) {
        throw new Error('argh, view model missing');
    }
    if (viewModel.kind !== ViewOrgViewModelKind.PRIVATE_INACCESSIBLE) {
        throw new Error("argh, wrong org kind");
    }
    const {
        organization, relation, requestOutbox
    } = viewModel;

    // TODO: of course this really needs to be an async fetch of the org info!
    return {
        organization, relation, requestOutbox
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onJoinOrg: () => {
            dispatch(actions.viewOrgJoinRequest() as any);
        },
        onCancelJoinRequest: (requestId: string) => {
            dispatch(actions.viewOrgCancelJoinRequest(requestId) as any);
        },
        onAcceptInvitation: (requestId: string) => {
            dispatch(actions.acceptJoinInvitation(requestId) as any);
        },
        onRejectInvitation: (requestId: string) => {
            dispatch(actions.rejectJoinInvitation(requestId) as any);
        },
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ViewOrganization);
