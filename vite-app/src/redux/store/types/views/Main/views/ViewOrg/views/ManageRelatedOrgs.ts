import * as orgModel from '../../../../../../../../data/models/organization/model';

export interface SelectableRelatableOrganization {
    organization: orgModel.BriefOrganization;
    isRelated: boolean;
    isSelected: boolean;
}

export type ManageRelatedOrgsViewModel = {
    organization: orgModel.Organization;
    availableOrganizations: {
        organizations: Array<SelectableRelatableOrganization>;
        queried: Array<SelectableRelatableOrganization>;
        searchBy: string;
    };
    relatedOrganizations: Array<string>;
    selectedOrganization: SelectableRelatableOrganization | null;
};