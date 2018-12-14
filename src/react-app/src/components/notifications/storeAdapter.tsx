import * as React from 'react'
import { StoreState } from '../../types';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import Component from './component'
import * as feedsModel from '../../data/models/feeds'

export interface OwnProps {

}

export interface StateProps {
    notifications: Array<feedsModel.Notification>
}

export interface DispatchProps {

}

export function mapStateToProps(state: StoreState): StateProps {
    const { db: { notifications: { byId } } } = state

    const values = byId.values()

    // todo .. some processing

    const notifications = Array.from(values)
    return {
        notifications
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {}
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component)
