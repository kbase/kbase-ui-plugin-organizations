import * as React from 'react'
import { StoreState } from '../../types';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import Component from './component'
import * as feedsModel from '../../data/models/feeds'
import * as actions from '../../redux/actions/notifications'

export interface OwnProps {

}

export interface StateProps {
    notifications: Array<feedsModel.OrganizationNotification>
}

export interface DispatchProps {
    onRead: (notificationId: string) => void
}

export function mapStateToProps(state: StoreState): StateProps {
    const { db: { notifications: { all } } } = state

    // const values = byId.values()

    // todo .. some processing

    // const notifications = Array.from(values)
    return {
        notifications: all
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onRead: (notificationId: string) => {
            dispatch(actions.read(notificationId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component)
