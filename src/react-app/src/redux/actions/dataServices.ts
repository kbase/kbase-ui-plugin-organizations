import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { ActionFlag } from './index'
import * as userProfileAPI from '../../data/apis/userProfile'
import * as userProfileModel from '../../data/models/profile'
import { AnError, makeError } from '../../lib/error';
import { StoreState } from '../../types';

export interface Load extends Action<ActionFlag.DATA_SERVICE_LOAD> {
    type: ActionFlag.DATA_SERVICE_LOAD
}

export interface LoadSuccess extends Action<ActionFlag.DATA_SERVICE_LOAD_SUCCESS> {
    type: ActionFlag.DATA_SERVICE_LOAD_SUCCESS,
    profile: userProfileAPI.UserProfile
}

export interface LoadError extends Action<ActionFlag.DATA_SERVICE_LOAD_ERROR> {
    type: ActionFlag.DATA_SERVICE_LOAD_ERROR,
    error: AnError
}

function loadError(error: AnError) {
    return {
        type: ActionFlag.DATA_SERVICE_LOAD_ERROR,
        error: error
    }
}

export function load() {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.DATA_SERVICE_LOAD_START
        })

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const userProfileClient = new userProfileModel.UserProfile({
            token, username,
            userProfileServiceURL: config.services.UserProfile.url
        })

        try {
            const userProfile = await userProfileClient.getProfile(username)

            dispatch({
                type: ActionFlag.DATA_SERVICE_LOAD_SUCCESS,
                profile: userProfile
            })
        } catch (ex) {
            console.error('error', ex)
            dispatch(loadError(makeError({
                code: ex.name,
                message: ex.name
            })))
        }
    }
}

export function unload() {
    return {
        type: ActionFlag.DATA_SERVICE_UNLOAD
    }
}
