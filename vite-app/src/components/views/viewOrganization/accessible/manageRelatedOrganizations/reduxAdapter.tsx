import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as orgModel from '../../../../../data/models/organization/model';
import { extractViewOrgSubView } from '../../../../../lib/stateExtraction';
import * as actions from '../../../../../redux/actions/viewOrganization/manageRelatedOrganizations';
import { StoreState } from '../../../../../redux/store/types';
import { AsyncModelState } from '../../../../../redux/store/types/common';
import { SubViewKind } from '../../../../../redux/store/types/views/Main/views/ViewOrg';
import { SelectableRelatableOrganization } from '../../../../../redux/store/types/views/Main/views/ViewOrg/views/ManageRelatedOrgs';
import ManageRelatedOrganizations from './component';

export interface OwnProps {
    onFinish: () => void;
}

interface StateProps {
    organization: orgModel.Organization;
    organizations: Array<SelectableRelatableOrganization>;
    relatedOrganizations: Array<string>;
    selectedOrganization: SelectableRelatableOrganization | null;
}

interface DispatchProps {
    onSelectOrganization: (org: SelectableRelatableOrganization) => void;
    onAddOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => void;
    onRemoveOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => void;
    onSearch: (searchBy: string) => void;
}

function mapStateToProps(state: StoreState, _props: OwnProps): StateProps {
    const subView = extractViewOrgSubView(state);
    if (subView.kind !== SubViewKind.MANAGE_RELATED_ORGS) {
        throw new Error('Wrong model');
    }

    if (subView.model.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    const {
        model: {
            value: {
                organization, availableOrganizations: { queried }, relatedOrganizations, selectedOrganization
            }
        }
    } = subView;

    return {
        organization, organizations: queried, relatedOrganizations, selectedOrganization
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onSelectOrganization: (org: SelectableRelatableOrganization) => {
            dispatch(actions.selectOrganization(org) as any);
        },
        onAddOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => {
            dispatch(actions.addOrganization(organizationId, relatedOrganizationId) as any);
        },
        onRemoveOrganization: (organizationId: orgModel.OrganizationID, relatedOrganizationId: orgModel.OrganizationID) => {
            dispatch(actions.removeOrganization(organizationId, relatedOrganizationId) as any);
        },
        onSearch: (searchBy: string) => {
            dispatch(actions.search(searchBy) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(ManageRelatedOrganizations);