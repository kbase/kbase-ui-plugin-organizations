import { AppError } from "@kbase/ui-components";
import { AsyncModel, EditState, EditableOrganization, SaveState, ValidationState } from "../../../common";

export interface AddOrgModel {
    editState: EditState;
    saveState: SaveState;
    error: AppError | null;
    validationState: ValidationState;
    newOrganization: EditableOrganization;
}

export type AddOrgViewModel = AsyncModel<AddOrgModel>;

// export interface AddOrgView {
//     loadingState: ComponentLoadingState;
//     error: AppError | null;
//     viewModel: AddOrgViewModel | null;
// }

// export type AddOrgView = View<AddOrgViewModel>;