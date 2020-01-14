import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../../../redux/actions/viewOrganization/manageMembership';

import { StoreState, EditState, SaveState, ValidationState, ViewOrgViewModelKind, ManageMembershipViewModel } from '../../../../../types';
import * as orgModel from '../../../../../data/models/organization/model';
import * as userModel from '../../../../../data/models/user';

import Component from './component';

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

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
    } = state;

    if (userAuthorization === null) {
        throw new Error('Unauthorized');
    }

    const viewModel = state.views.viewOrgView.viewModel;
    if (!viewModel) {
        throw new Error('argh, view model missing');
    }
    if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error("argh, wrong org kind");
    }
    if (viewModel.subViews.manageMembershipView.viewModel === null) {
        throw new Error("argh, null subview view model");
    }

    const subViewModel: ManageMembershipViewModel = viewModel.subViews.manageMembershipView.viewModel;

    const {
        organization
    } = viewModel;

    const {
        editableMemberProfile, editState, saveState, validationState
    } = subViewModel;

    return {
        username: userAuthorization.username,
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

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component);