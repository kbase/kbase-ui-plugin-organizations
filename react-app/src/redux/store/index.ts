import {
    StoreState
} from "./types";
import { makeBaseStoreState } from "@kbase/ui-components";
import { AsyncModelState } from "./types/common";
import { createStore, compose, applyMiddleware } from "redux";
import reducer from "../reducers";
import thunk from "redux-thunk";

export function makeInitialStoreState(): StoreState {
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

export function createReduxStore() {
    return createStore(reducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}