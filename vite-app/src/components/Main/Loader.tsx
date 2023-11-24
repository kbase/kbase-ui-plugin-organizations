/**
 * This is a "loader" component. It is solely responsible for
 */
import { Component } from 'react';
import Container from './state';

// The redux connection

import { Alert, Spin } from 'antd';
import { AsyncModelState, ModelError } from '../../redux/store/types/common';
import { MainViewModel } from '../../redux/store/types/views/Main';

// First the loader component, which takes care of a loading view, error view, and the
// container.

export interface LoaderProps {
    view: MainViewModel;
    onLoad: () => void;
    unload: () => void;
}

interface LoaderState { }

export default class Loader extends Component<LoaderProps, LoaderState> {
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
