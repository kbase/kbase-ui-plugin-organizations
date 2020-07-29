import * as actions from '../../actions/entities/organization';
import { StoreState } from '../../store/types';
import { ActionFlag } from '../../actions';

function loadSuccess(state: StoreState, action: actions.LoadSuccess) {
    const newOrgs = new Map(state.entities.organizations.byId);
    newOrgs.set(action.organization.id, action.organization);

    return {
        ...state,
        entities: {
            ...state.entities,
            organizations: {
                ...state.entities.organizations.byId,
                byId: newOrgs
            }
        }
    };
}

export default function reducer(state: StoreState, action: actions.OrganizationEntityAction): StoreState | null {
    switch (action.type) {
        case ActionFlag.ENTITY_ORGANIZATION_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess);
        default:
            return null;
    }
}
