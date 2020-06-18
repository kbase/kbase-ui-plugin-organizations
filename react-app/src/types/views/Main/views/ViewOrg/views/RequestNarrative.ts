import * as orgModel from '../../../../../../data/models/organization/model';
import * as narrativeModel from '../../../../../../data/models/narrative';
import { AnError } from '../../../../../../lib/error';
import { SelectionState, SaveState, AsyncModel } from '../../../../../common';

export type RequestNarrativeViewModel = {
    organization: orgModel.Organization;
    narratives: Array<narrativeModel.OrganizationNarrative>;
    selectedNarrative: narrativeModel.OrganizationNarrative | null;
    relation: orgModel.Relation;
    error: AnError | null;
    selectionState: SelectionState;
    saveState: SaveState;
};
