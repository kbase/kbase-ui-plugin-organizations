import * as narrativeModel from '../../../../../../../../data/models/narrative';
import * as orgModel from '../../../../../../../../data/models/organization/model';
import { AnError } from '../../../../../../../../lib/error';
import { SaveState, SelectionState } from '../../../../../common';

export type RequestNarrativeViewModel = {
    organization: orgModel.Organization;
    narratives: Array<narrativeModel.OrganizationNarrative>;
    selectedNarrative: narrativeModel.OrganizationNarrative | null;
    relation: orgModel.Relation;
    error: AnError | null;
    selectionState: SelectionState;
    saveState: SaveState;
};
