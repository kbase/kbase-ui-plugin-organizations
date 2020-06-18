import * as orgModel from '../../../../data/models/organization/model';
import { AsyncModel } from '../../../common';

export type ViewMembersViewModel = AsyncModel<{
    organization: orgModel.Organization;
    relation: orgModel.Relation;
}>;

// export interface ViewMembersView {
//     loadingState: ComponentLoadingState,
//     error: AppError | null,
//     viewModel: ViewMembersViewModel | null;
// }

// export type ViewMembersView = View<ViewMembersViewModel>;