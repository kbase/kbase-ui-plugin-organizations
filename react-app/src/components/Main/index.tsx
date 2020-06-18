/**
 * This is a "loader" component. It is solely responsible for
 */
import * as React from 'react';
import { StoreState } from '../../types';
import Container from './state';

// The redux connection

import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { Spin, Alert } from 'antd';
import { load, unload } from '../../redux/actions/main';
import { AsyncModelState, ModelError } from '../../types/common';
import { MainViewModel } from '../../types/views/Main';
// import { ViewError } from '../../types/common';
// import { mainLoad, unload } from '../../redux/actions/app';

// First the loader component, which takes care of a loading view, error view, and the
// container.

export interface LoaderProps {
    view: MainViewModel;
    onLoad: () => void;
    unload: () => void;
}

interface LoaderState { }

class Loader extends React.Component<LoaderProps, LoaderState> {
    renderLoading() {
        const message = (
            <div>
                Loading Main ... <Spin />
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

    renderError(view: ModelError) {
        return <Alert type="error" message={view.error.message} />;
    }

    render() {
        const view = this.props.view;
        switch (view.loadingState) {
            case AsyncModelState.NONE:
                return this.renderLoading();
            case AsyncModelState.LOADING:
                return this.renderLoading();
            case AsyncModelState.ERROR:
                return this.renderError(view);
            case AsyncModelState.SUCCESS:
                return <Container />;
        }
    }

    componentDidMount() {
        switch (this.props.view.loadingState) {
            case AsyncModelState.NONE:
                // should only appear briefly as the LOAD event is processed.
                this.props.onLoad();
        }
    }

    componentWillUnmount() {
        this.props.unload();
    }
}

/**
 * This is the redux interface -- the main entry point for the Main Component.
 * 
 */

export interface OwnProps { }

interface StateProps {
    view: MainViewModel;
    token: string;
}

interface DispatchProps {
    onLoad: () => void;
    unload: () => void;
}

function mapStateToProps(state: StoreState): StateProps {
    const {
        auth: { userAuthorization },
        view
    } = state;
    return {
        view,
        token: userAuthorization!.token
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onLoad: () => {
            dispatch(load() as any);
        },
        unload: () => {
            dispatch(unload() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Loader);
