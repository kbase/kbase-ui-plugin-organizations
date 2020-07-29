import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { StoreState } from '../../../../../redux/store/types';
import * as actions from '../../../../../redux/actions/viewOrganization/viewMembers';
import ViewMembers from './component';
import * as orgModel from '../../../../../data/models/organization/model';
import { extractViewOrgModel } from '../../../../../lib/stateExtraction';

export interface OwnProps {
    organization: orgModel.Organization;
    relation: orgModel.Relation;
    onReloadOrg: (id: string) => void;
}

interface StateProps {
    searchMembersBy: string;
    sortMembersBy: string;
    members: Array<orgModel.Member>;
}

interface DispatchProps {
    onViewMembersUnload: () => void,
    onPromoteMemberToAdmin: (memberUsername: string) => void,
    onDemoteAdminToMember: (adminUsername: string) => void,
    onRemoveMember: (memberUsername: string) => void;
    onSearchMembers: (searchBy: string) => void;
    onSortMembers: (sortBy: string) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const viewOrgModel = extractViewOrgModel(state);

    const { searchMembersBy, sortMembersBy, members } = viewOrgModel;
    return {
        searchMembersBy, sortMembersBy, members
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onViewMembersUnload: () => {
            dispatch(actions.unload() as any);
        },
        onPromoteMemberToAdmin: (memberUsername: string) => {
            dispatch(actions.promoteToAdmin(memberUsername) as any);
        },
        onDemoteAdminToMember: (adminUsername: string) => {
            dispatch(actions.demoteToMember(adminUsername) as any);
        },
        onRemoveMember: (memberUsername: string) => {
            dispatch(actions.removeMember(memberUsername) as any);
        },
        onSearchMembers: (searchBy: string) => {
            dispatch(actions.searchMembers(searchBy) as any);
        },
        onSortMembers: (sortBy: string) => {
            dispatch(actions.sortMembers(sortBy) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ViewMembers);