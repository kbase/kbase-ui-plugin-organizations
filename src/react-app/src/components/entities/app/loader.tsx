import * as React from 'react'
import * as appModel from '../../../data/models/apps'
import App from './component'

interface LoaderProps {
    appId: appModel.AppID
    // TODO: don't really like AppFullInfo - as a name
    app: appModel.AppFullInfo | undefined
    onLoad: (appId: appModel.AppID) => void
}

interface LoaderState {

}

class Loader extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props)
    }

    render() {
        if (this.props.app) {
            return (
                <App app={this.props.app} />
            )
        } else {
            return (
                <div>
                    <Icon type="loading" /> Loading App...
                </div>
            )
        }
    }

    componentDidMount() {
        if (!this.props.app) {
            this.props.onLoad(this.props.appId)
        }
    }
}

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { StoreState } from '../../../types';
import * as actions from '../../../redux/actions/entities'
import { Icon } from 'antd';


export interface OwnProps {
    appId: appModel.AppID
}

interface StateProps {
    app: appModel.AppFullInfo | undefined
}

interface DispatchProps {
    onLoad: (appId: appModel.AppID) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        app: state.entities.apps.byId.get(props.appId)
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.EntityAction>): DispatchProps {
    return {
        onLoad: (appId: appModel.AppID) => {
            dispatch(actions.loadApp(appId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader)