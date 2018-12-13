import * as actions from '../actions/global'
import { StoreState } from '../../types'
import { ActionFlag } from '../actions'
import { Action } from 'redux';
import { access } from 'fs';

export function accessNarrativeSuccess(state: StoreState, action: actions.AccessNarrativeSuccess): StoreState {
    const narrativesById = state.entities.narratives.byId
    narrativesById.set(action.narrative.workspaceId, action.narrative)

    return {
        ...state,
        entities: {
            ...state.entities,
            narratives: {
                ...state.entities.narratives,
                byId: narrativesById
            }
        }
    }
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.GLOBAL_ACCESS_NARRATIVE_SUCCESS:
            return accessNarrativeSuccess(state, action as actions.AccessNarrativeSuccess)
        default:
            return null
    }
}

// function reducer(state: StoreState, action: actions.EntityAction): StoreState | null {
//     switch (action.type) {
//         case ActionFlag.ENTITY_USER_LOADER_SUCCESS:
//             return userLoaderSuccess(state, action as actions.UserLoaderSuccess)
//         case ActionFlag.ENTITY_ORGANIZATION_LOADER_SUCCESS:
//             return organizationLoaderSuccess(state, action as actions.OrganizationLoaderSuccess)
//         case ActionFlag.ENTITY_NARRATIVE_LOAD_SUCCESS:
//             return loadNarrativeSuccess(state, action as actions.LoadNarrativeSuccess)
//         default:
//             return null
//     }
// }

// export default reducer