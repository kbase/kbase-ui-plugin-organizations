import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import * as types from '../../../../../../types';
import Component from './component';
import * as actions from '../../../../../../redux/actions/viewOrganization/requestAddNarrative';
import * as orgModel from '../../../../../../data/models/organization/model';
import * as narrativeModel from '../../../../../../data/models/narrative';
import { extractViewOrgSubView } from '../../../../../../lib/stateExtraction';
import { SubViewKind } from '../../../../../../types/views/Main/views/ViewOrg';
import { AsyncModelState } from '../../../../../../types/common';

export interface OwnProps {
    onFinish: () => void;
}

interface StateProps {
    organization: orgModel.Organization;
    relation: orgModel.Relation;
    narratives: Array<narrativeModel.OrganizationNarrative>;
    selectedNarrative: narrativeModel.OrganizationNarrative | null;
    searching: boolean;
    sortBy: string;
    // sortDirection: types.SortDirection
    filter: string;
}

interface DispatchProps {
    doSendRequest: (groupId: string, workspaceId: number) => void;
    doSelectNarrative: (narrative: narrativeModel.OrganizationNarrative) => void;
    doSortBy: (sortBy: narrativeModel.Sort) => void;
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    const subView = extractViewOrgSubView(state);
    if (subView.kind !== SubViewKind.ADD_NARRATIVE) {
        throw new Error('Wrong model');
    }

    if (subView.model.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    const {
        model: {
            value: {
                organization, relation, narratives, selectedNarrative
            }
        }
    } = subView;

    return {
        organization, relation, narratives, selectedNarrative,
        searching: false,
        sortBy: 'title',
        filter: ''
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        doSendRequest: (groupId: string, workspaceId: number) => {
            dispatch(actions.sendRequest(groupId, workspaceId) as any);
        },
        doSelectNarrative: (narrative: narrativeModel.OrganizationNarrative) => {
            dispatch(actions.selectNarrative(narrative) as any);
        },
        doSortBy: (sortBy: narrativeModel.Sort) => {
            dispatch(actions.sort(sortBy) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Component);