import * as orgModel from '../../../../data/models/organization/model';
import * as requestModel from '../../../../data/models/requests';
import { View, AsyncModel } from '../../../common';

export type ManageOrganizationRequestsViewModel = AsyncModel<{
    organization: orgModel.Organization;
    requests: Array<requestModel.Request>;
    invitations: Array<requestModel.Request>;
}>;

// export interface ManageOrganizationRequestsView {
//     loadingState: ComponentLoadingState;
//     error: AppError | null;
//     viewModel: ManageOrganizationRequestsViewModel | null;
// }

// export type ManageOrganizationRequestsView = View<ManageOrganizationRequestsViewModel>;