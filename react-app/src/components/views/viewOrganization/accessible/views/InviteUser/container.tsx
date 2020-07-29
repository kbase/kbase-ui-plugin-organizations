import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as types from '../../../../../../redux/store/types';
import * as actions from '../../../../../../redux/actions/viewOrganization/inviteUser';
import InviteUser from './component';
import * as orgModel from '../../../../../../data/models/organization/model';
import * as userModel from '../../../../../../data/models/user';
import { extractViewOrgSubView } from '../../../../../../lib/stateExtraction';
import { SubViewKind } from '../../../../../../redux/store/types/views/Main/views/ViewOrg';
import { AsyncModelState, OrganizationUser, User } from '../../../../../../redux/store/types/common';
import { InviteUserViewState } from '../../../../../../redux/store/types/views/Main/views/ViewOrg/views/InviteUser';

export interface OwnProps {
    onFinish: () => void;
}

interface StateProps {
    organization: orgModel.Organization;
    users: Array<OrganizationUser> | null;
    selectedUser: {
        user: User,
        relation: orgModel.UserRelationToOrganization;
    } | null;
    editState: InviteUserViewState;
}

interface DispatchProps {
    onSearchUsers: (query: userModel.UserQuery) => void;
    onSelectUser: (username: string) => void;
    onSendInvitation: () => void;
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    const subView = extractViewOrgSubView(state);
    if (subView.kind !== SubViewKind.INVITE_USER) {
        throw new Error('Wrong model');
    }

    if (subView.model.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    const {
        model: {
            value: {
                organization, users, selectedUser, editState
            }
        }
    } = subView;

    return {
        organization, users, selectedUser, editState
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
        onSearchUsers: ({ query, excludedUsers }) => {
            dispatch(actions.inviteUserSearchUsers({ query, excludedUsers }) as any);
        },
        onSelectUser: (username: string) => {
            dispatch(actions.selectUser(username) as any);
        },
        onSendInvitation: () => {
            dispatch(actions.sendInvitation() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(InviteUser);