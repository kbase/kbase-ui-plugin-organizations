import { EditState, SaveState, ValidationState, EditableOrganization, View, AsyncModel } from "../../../common";
import { AppError } from "@kbase/ui-components";

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