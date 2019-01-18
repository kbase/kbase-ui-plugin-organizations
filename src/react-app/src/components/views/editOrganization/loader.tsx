import * as React from 'react'
import { ComponentLoadingState, DashboardView, StoreState, EditOrgView } from '../../../types';
import Container from './container'
import * as orgModel from '../../../data/models/organization/model'

// First the loader component, which takes care of a loading view, error view, and the 
// container.

export interface LoaderProps {
    organizationId: orgModel.OrganizationID
    view: EditOrgView
    onLoad: (organizationId: orgModel.OrganizationID) => void
    onUnload: () => void
}

interface LoaderState {

}

class Loader extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props)
    }

    renderLoading() {
        return (
            <div>
                Fetching your organizations and other stuff...
            </div>
        )
    }

    renderError() {
        if (!this.props.view.error) {
            return
        }
        return (
            <div>
                Error! {this.props.view.error.message}
            </div>
        )
    }

    render() {
        switch (this.props.view.loadingState) {
            case ComponentLoadingState.NONE:
                return this.renderLoading()
            case ComponentLoadingState.LOADING:
                return this.renderLoading()
            case ComponentLoadingState.ERROR:
                return this.renderError()
            case ComponentLoadingState.SUCCESS:
                return (
                    <Container />
                )
        }
    }

    componentDidMount() {
        switch (this.props.view.loadingState) {
            case ComponentLoadingState.NONE:
                // should only appear briefly as the LOAD event is processed.
                this.props.onLoad(this.props.organizationId)
        }
    }

    componentWillUnmount() {
        this.props.onUnload()
    }
}

// THe redux connection

import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../../../redux/actions/editOrg'

export interface OwnProps {
    organizationId: orgModel.OrganizationID
}

interface StateProps {
    view: EditOrgView
}

interface DispatchProps {
    onLoad: (organizationId: orgModel.OrganizationID) => void
    onUnload: () => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        view: state.views.editOrgView
    }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onLoad: (organizationId: orgModel.OrganizationID) => {
            dispatch(actions.load(organizationId) as any)
        },
        onUnload: () => {
            dispatch(actions.unload() as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader)