import * as React from 'react';
import { StoreState } from '../../../types';
import Container from './container';

// THe redux connection

import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../../redux/actions/browseOrgs';
import { Spin, Alert } from 'antd';
import { BrowseOrgsViewModel } from '../../../types/views/Main/views/BrowseOrgs';
import { AsyncModelState, ModelError } from '../../../types/common';

// First the loader component, which takes care of a loading view, error view, and the
// container.

export interface LoaderProps {
    viewModel: BrowseOrgsViewModel;
    onLoad: () => void;
    onUnload: () => void;
}

interface LoaderState { }

class Loader extends React.Component<LoaderProps, LoaderState> {
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

    renderError(viewModel: ModelError) {
        return <Alert type="error" message={viewModel.error.message} />;
    }

    render() {
        const viewModel = this.props.viewModel;
        switch (viewModel.loadingState) {
            case AsyncModelState.NONE:
                return this.renderLoading();
            case AsyncModelState.LOADING:
                return this.renderLoading();
            case AsyncModelState.ERROR:
                return this.renderError(viewModel);
            case AsyncModelState.SUCCESS:
                return <Container sortBy="narrativeCount" />;
        }
    }

    componentDidMount() {
        const viewModel = this.props.viewModel;
        switch (viewModel.loadingState) {
            case AsyncModelState.NONE:
                // should only appear briefly as the LOAD event is processed.
                this.props.onLoad();
        }
    }

    componentWillUnmount() {
        this.props.onUnload();
    }
}

export interface OwnProps { }

interface StateProps {
    viewModel: BrowseOrgsViewModel;
}

interface DispatchProps {
    onLoad: () => void;
    onUnload: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Main async model not loaded!');
    }

    // if (state.view.value.
    // if (state.view.value.kind !== ViewKind.BROWSE_ORGS) {
    //     throw new Error('Not in browse orgs view');
    // }

    // if (state.view.value.model.loadingState !== AsyncModelState.SUCCESS) {
    //     throw new Error('Async model not loaded!');
    // }

    const {
        view: {
            value: {
                views: {
                    browseOrgs
                }
            }
        }
    } = state;

    return {
        viewModel: browseOrgs
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
