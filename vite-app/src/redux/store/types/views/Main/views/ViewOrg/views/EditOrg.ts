import { AppError } from "@kbase/ui-components";
import * as orgModel from '../../../../../../../../data/models/organization/model';
import { EditState, EditableOrganization, SaveState, ValidationState } from "../../../../../common";


export type EditOrgViewModel = {
    editState: EditState;
    saveState: SaveState;
    validationState: ValidationState;
    editedOrganization: EditableOrganization;
    organization: orgModel.Organization;
    saveError: AppError | null;
};;

// export interface EditOrgView {
//     loadingState: ComponentLoadingState,
//     error: AppError | null,
//     viewModel: EditOrgViewModel | null;
// }

// export type EditOrgView = View<EditOrgViewModel>;