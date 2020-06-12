import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../../../redux/actions/viewOrganization/manageRelatedOrganizations';
import ManageRelatedOrganizations from './component';
import { StoreState } from '../../../../../types';
import * as orgModel from '../../../../../data/models/organization/model';
import { SelectableRelatableOrganization } from '../../../../../types/views/Main/views/ViewOrg/views/ManageRelatedOrgs';
import { SubViewKind } from '../../../../../types/views/Main/views/ViewOrg';
import { extractViewOrgSubView } from '../../../../../lib/stateExtraction';
import { AsyncModelState } from '../../../../../types/common';

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

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
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