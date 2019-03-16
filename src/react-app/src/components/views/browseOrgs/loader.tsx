import * as React from 'react';
import { ComponentLoadingState, StoreState, BrowseOrgsView } from '../../../types';
import Container from './container';

// THe redux connection

import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../../redux/actions/browseOrgs';
import { Spin, Alert } from 'antd';

// First the loader component, which takes care of a loading view, error view, and the
// container.

export interface LoaderProps {
    view: BrowseOrgsView;
    onLoad: () => void;
    onUnload: () => void;
}

interface LoaderState {}

class Loader extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props);
    }

    renderLoading() {
        const message = (
            <div>
                Loading Organizations... <Spin />
            </div>
        );
        return (
            <Alert
                type="info"
                message={message}
                style={{
                    width: '20em',
                    padding: '20px',
                    margin: '20px auto'
                }}
            />
        );
    }

    renderError() {
        if (!this.props.view.error) {
            return;
        }
        return <Alert type="error" message={this.props.view.error.message} />;
    }

    render() {
        switch (this.props.view.loadingState) {
            case ComponentLoadingState.NONE:
                return this.renderLoading();
            case ComponentLoadingState.LOADING:
                return this.renderLoading();
            case ComponentLoadingState.ERROR:
                return this.renderError();
            case ComponentLoadingState.SUCCESS:
                return <Container sortBy="narrativeCount" />;
        }
    }

    componentDidMount() {
        switch (this.props.view.loadingState) {
            case ComponentLoadingState.NONE:
                // should only appear briefly as the LOAD event is processed.
                this.props.onLoad();
        }
    }

    componentWillUnmount() {
        this.props.onUnload();
    }
}

export interface OwnProps {}

interface StateProps {
    view: BrowseOrgsView;
}

interface DispatchProps {
    onLoad: () => void;
    onUnload: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        view: state.views.browseOrgsView
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onLoad: () => {
            dispatch(actions.load() as any);
        },
        onUnload: () => {
            dispatch(actions.unload() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Loader);
