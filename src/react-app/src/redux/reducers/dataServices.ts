import { Action } from 'redux'
import * as actions from '../actions/dataServices'
import { StoreState, LastVisited } from '../../types';
import { ActionFlag } from '../actions';
import * as userProfileModel from '../../data/models/profile'

function loadSuccess(state: StoreState, action: actions.LoadSuccess): StoreState {
    const lastVisitedById = new Map<string, LastVisited>()
    // console.log('loaded ', action.profile.profile.plugins)
    const orgsSettings = action.profile.profile.plugins.organizations
    // console.log('org settings', orgsSettings)
    if (orgsSettings) {
        Object.keys(orgsSettings.orgSettings).map((organizationId) => {
            const orgSetting = orgsSettings.orgSettings[organizationId]
            // console.log('org setting', orgSetting.settings.lastVisitedAt)
            lastVisitedById.set(organizationId, { lastVisitedAt: new Date(orgSetting.settings.lastVisitedAt) })
        })
    }

    // console.log('loaded ', lastVisitedById)

    return {
        ...state,
        db: {
            ...state.db,
            lastVisited: {
                byId: lastVisitedById
            }
        }
    }
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.DATA_SERVICE_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        default:
            return null
    }
}