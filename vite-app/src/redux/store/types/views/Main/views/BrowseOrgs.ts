import * as orgModel from '../../../../../../data/models/organization/model';
import { SortDirection } from '../../../common';
import { AppError } from '@kbase/ui-components';
import { AsyncModel } from '../../../common';

export enum BrowseOrgsState {
    NONE = 0,
    SEARCHING,
    SUCCESS,
    ERROR
}

export type BrowseOrgsModel = {
    rawOrganizations: Array<orgModel.BriefOrganization>;
    organizations: Array<orgModel.BriefOrganization>;
    openRequests: Map<orgModel.OrganizationID, orgModel.RequestStatus>;
    totalCount: number;
    filteredCount: number;
    sortField: string;
    sortDirection: SortDirection;
    filter: orgModel.Filter;
    searchTerms: Array<string>;
    selectedOrganizationId: string | null,
    // TODO: let's make a new interface for running operations...
    searching: boolean;
    error: AppError | null;
};

export type BrowseOrgsViewModel = AsyncModel<BrowseOrgsModel>;;

// export interface BrowseOrgsView {
//     loadingState: ComponentLoadingState,
//     error: AppError | null,
//     viewModel: BrowseOrgsViewModel | null;
// }

// export type BrowseOrgsView = View<BrowseOrgsViewModel>;

