import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as orgModel from '../../../../../../../../data/models/organization/model';
import { extractViewOrgModel } from '../../../../../../../../lib/stateExtraction';
import * as actions from '../../../../../../../../redux/actions/viewOrganization/relatedOrganizations';
import { StoreState } from '../../../../../../../../redux/store/types';
import Component from './component';

export interface OwnProps {
    organization: orgModel.Organization;
    relatedOrganizations: Array<orgModel.OrganizationID>;
    onManageRelatedOrgs: () => void;

}

interface StateProps {
    searchMembersBy: string;
    sortMembersBy: string;
    members: Array<orgModel.Member>;
}

interface DispatchProps {
    onRemoveRelatedOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => void;
}

function mapStateToProps(state: StoreState, _props: OwnProps): StateProps {
    const viewOrgModel = extractViewOrgModel(state);
    const { searchMembersBy, sortMembersBy, members } = viewOrgModel;
    return {
        searchMembersBy, sortMembersBy, members
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onRemoveRelatedOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => {
            dispatch(actions.removeOrganization(organizationId, relatedOrganizationId) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component);