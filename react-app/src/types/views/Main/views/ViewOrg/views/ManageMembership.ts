import * as orgModel from '../../../../../../data/models/organization/model';
import { EditState, SaveState, ValidationState, AsyncModel } from '../../../../../common';


export type ManageMembershipViewModel = {
    organization: orgModel.Organization;
    editableMemberProfile: orgModel.EditableMemberProfile;
    editState: EditState;
    saveState: SaveState;
    validationState: ValidationState;
};

// export type ManageMembershipView = View<ManageMembershipViewModel>;

// export default ManageMembershipView;