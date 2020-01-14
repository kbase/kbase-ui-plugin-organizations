import OrganizationsBrowser from './component';
import { StoreState, SortDirection } from '../../../types';
import * as actions from '../../../redux/actions/browseOrgs';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as orgModel from '../../../data/models/organization/model';
import { AppError } from '@kbase/ui-components';
//
// Typing for the mapState and mapDispatch
//

export interface OwnProps {
    sortBy: string;
}
export interface LinkStateProps {
    organizations: Array<orgModel.BriefOrganization>;
    openRequests: Map<orgModel.OrganizationID, orgModel.RequestStatus>;
    totalCount: number;
    filteredCount: number;
    filter: orgModel.Filter;
    searching: boolean,
    error: AppError | null;
}

export interface LinkDispatchProps {
    onSearchOrgs: (searchTerms: Array<string>) => void,
    onSortOrgs: (sortField: string, sortDirection: SortDirection) => void,
    onFilterOrgs: (filter: orgModel.Filter) => void;
}

// note second arg is the component props, but we don't have any component props to merge in.
export function mapStateToProps(storeState: StoreState): LinkStateProps {
    if (!storeState.views.browseOrgsView.viewModel) {
        throw new Error('No view model!');
    }

    const {
        views: {
            browseOrgsView: {
                viewModel: {
                    organizations, openRequests, error,
                    totalCount, filteredCount, filter, searching }
            }
        }
    } = storeState;

    return {
        organizations,
        openRequests,
        totalCount,
        filteredCount,
        filter,
        error,
        searching: searching
    };

}

export function mapDispatchToProps(dispatch: Dispatch<actions.SearchOrgs | actions.SortOrgs | actions.FilterOrgs>): LinkDispatchProps {
    return {
        onSearchOrgs: (searchTerms: Array<string>) => {
            // TODO proper typing here
            dispatch(actions.searchOrgs(searchTerms) as any);
        },
        onSortOrgs: (sortBy: string, sortDirection: SortDirection) => {
            // TODO proper typing here
            dispatch(actions.sortOrgs(sortBy, sortDirection) as any);
        },
        onFilterOrgs: (filter: orgModel.Filter) => {
            dispatch(actions.filterOrgs(filter) as any);
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsBrowser);