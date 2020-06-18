import {
    StoreState
} from "../types";
import { makeBaseStoreState } from "@kbase/ui-components";
import { AsyncModelState } from "../types/common";

export class StateInstances {
    static makeInitialState(): StoreState {
        const baseState = makeBaseStoreState();
        return {
            ...baseState,
            entities: {
                users: {
                    byId: new Map(),
                    all: []
                },
                orgs: {
                    byId: new Map(),
                    all: []
                },
                requests: {
                    byId: new Map(),
                    all: []
                },
                narratives: {
                    byId: new Map()
                },
                organizations: {
                    byId: new Map()
                },
                apps: {
                    byId: new Map()
                }
            },
            db: {
            },
            view: {
                loadingState: AsyncModelState.NONE,
            },
            error: null,
            orgsApp: {

            },

            updateOrg: {
                pending: false
            },


        };
    }
}