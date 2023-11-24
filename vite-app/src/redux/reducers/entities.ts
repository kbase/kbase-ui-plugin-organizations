
import * as actions from '../actions/entities';
import { StoreState } from '../store/types';
import { ActionFlag } from '../actions';
import organizationsReducer from './entities/organization';

function userLoaderSuccess(state: StoreState, action: actions.UserLoaderSuccess) {
    const users = state.entities.users;
    // mutation ... horrible ;)
    users.byId.set(action.user.username, action.user);
    return {
        ...state,
        entities: {
            ...state.entities,
            users: {
                ...state.entities.users,
                byId: new Map(users.byId)
            }
        }
    };
}

function organizationLoaderSuccess(state: StoreState, action: actions.OrganizationLoaderSuccess) {
    const orgsMap = state.entities.orgs.byId;
    orgsMap.set(action.organization.id, action.organization);

    return {
        ...state,
        entities: {
            ...state.entities,
            orgs: {
                ...state.entities.orgs,
                byId: new Map(orgsMap)
            }
        }
    };
}

function loadNarrativeSuccess(state: StoreState, action: actions.LoadNarrativeSuccess): StoreState {
    const narratives = state.entities.narratives;
    narratives.byId.set(action.narrative.workspaceId, action.narrative);
    return {
        ...state,
        entities: {
            ...state.entities,
            narratives: {
                ...state.entities.narratives,
                byId: new Map(narratives.byId)
            }
        }
    };
}

function loadAppSuccess(state: StoreState, action: actions.LoadAppSuccess): StoreState {
    const apps = state.entities.apps;
    apps.byId.set(action.app.id, action.app);
    return {
        ...state,
        entities: {
            ...state.entities,
            apps: {
                ...state.entities.narratives,
                byId: new Map(apps.byId)
            }
        }
    };
}

// TODO: start and error

export default function reducer(state: StoreState, action: actions.EntityAction): StoreState | null {
    switch (action.type) {
        case ActionFlag.ENTITY_USER_LOADER_SUCCESS:
            return userLoaderSuccess(state, action as actions.UserLoaderSuccess);
        case ActionFlag.ENTITY_ORGANIZATION_LOADER_SUCCESS:
            return organizationLoaderSuccess(state, action as actions.OrganizationLoaderSuccess);
        case ActionFlag.ENTITY_NARRATIVE_LOAD_SUCCESS:
            return loadNarrativeSuccess(state, action as actions.LoadNarrativeSuccess);
        case ActionFlag.ENTITY_LOAD_APP_SUCCESS:
            return loadAppSuccess(state, action as actions.LoadAppSuccess);
    }

    return organizationsReducer(state, action);
}
