import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { extractViewOrgSubView } from '../../../../../../lib/stateExtraction';
import * as actions from '../../../../../../redux/actions/viewOrganization/addApps';
import { StoreState } from '../../../../../../redux/store/types';
import { AsyncModelState } from '../../../../../../redux/store/types/common';
import { SubViewKind } from '../../../../../../redux/store/types/views/Main/views/ViewOrg';
import { SelectableApp } from '../../../../../../redux/store/types/views/Main/views/ViewOrg/views/AddApp';
import Component from './component';

export interface OwnProps {
    onFinish: () => void;
}

interface StateProps {
    apps: Array<SelectableApp>;
    selectedApp: SelectableApp | null;
    sortBy: string;
}

interface DispatchProps {
    // onSearchUsers: (query: userModel.UserQuery) => void
    // onSelectUser: (username: string) => void
    // onSendInvitation: () => void
    onSelectApp: (appId: string) => void;
    onRequestAssociation: (appId: string) => void;
    onSearch: (searchBy: string) => void;
    onSort: (sortBy: string) => void;
}

function mapStateToProps(state: StoreState, _props: OwnProps): StateProps {
    const subView = extractViewOrgSubView(state);
    if (subView.kind !== SubViewKind.ADD_APP) {
        throw new Error('Wrong model');
    }

    if (subView.model.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    const {
        model: {
            value: {
                apps, selectedApp, sortBy
            }
        }
    } = subView;

    // const vm = viewModel.subViews.addAppsView.viewModel
    return {
        apps, selectedApp, sortBy
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
        // onSearchUsers: ({ query, excludedUsers }) => {
        //     dispatch(actions.inviteUserSearchUsers({ query, excludedUsers }) as any)
        // },
        // onSelectUser: (username: string) => {
        //     dispatch(actions.selectUser(username) as any)
        // },
        // onSendInvitation: () => {
        //     dispatch(actions.sendInvitation() as any)
        // }
        onSelectApp: (appId: string) => {
            dispatch(actions.select(appId) as any);
        },
        onRequestAssociation: (appId: string) => {
            dispatch(actions.requestAssociation(appId) as any);
        },
        onSearch: (searchBy: string) => {
            dispatch(actions.search(searchBy) as any);
        },
        onSort: (sortBy: string) => {
            dispatch(actions.sort(sortBy) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component);