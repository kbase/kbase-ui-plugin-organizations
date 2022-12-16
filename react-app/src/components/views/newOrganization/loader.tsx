import { Component } from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '../../../redux/store/types';
import Container from './container';

import { AppError } from '@kbase/ui-components';
import * as actions from '../../../redux/actions/addOrg';
import { AsyncModelState } from '../../../redux/store/types/common';
import { AddOrgViewModel } from '../../../redux/store/types/views/Main/views/AddOrg';


interface LoaderProps {
    viewModel: AddOrgViewModel;
    onLoad: () => void;
    onUnload: () => void;
}

interface LoaderState {

}

class Loader extends Component<LoaderProps, LoaderState> {
    renderLoading() {
        return (
            <div>
                Loading "Add New Organization" form...
            </div>
        );
    }

    renderError(error: AppError) {
        return (
            <div>
                Error!
                <div>
                    {error.message}
                </div>
            </div>
        );
    }

    render() {
        switch (this.props.viewModel.loadingState) {
            case AsyncModelState.NONE:
                return this.renderLoading();
            case AsyncModelState.LOADING:
                return this.renderLoading();
            case AsyncModelState.ERROR:
                if (this.props.viewModel.error) {
                    return this.renderError(this.props.viewModel.error);
                } else {
                    return this.renderError({
                        code: 'Missing Error',
                        message: 'The error appears to be missing'
                    });
                }
            case AsyncModelState.SUCCESS:
            default:
                return (
                    <Container />
                );
        }
    }

    componentDidMount() {
        switch (this.props.viewModel.loadingState) {
            case AsyncModelState.NONE:
                // should only appear briefly as the LOAD event is processed.
                this.props.onLoad();
        }
    }


    componentWillUnmount() {
        this.props.onUnload();
    }
}

// redux interface


export interface OwnProps {

}

interface StateProps {
    viewModel: AddOrgViewModel;
}

interface DispatchProps {
    onLoad: () => void;
    onUnload: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Async model not loaded!');
    }

    // if (state.view.value.kind !== ViewKind.ADD_ORG) {
    //     throw new Error('Not in browse orgs view');
    // }

    // if (state.view.value.model.loadingState !== AsyncModelState.SUCCESS) {
    //     throw new Error('Async model not loaded!');
    // }

    const {
        view: {
            value: {
                views: {
                    addOrg
                }
            }
        }
    } = state;

    return {
        viewModel: addOrg
    };
}

function mapDispatchToProps(dispatch: Dispatch<actions.Load | actions.Unload>): DispatchProps {
    return {
        onLoad: () => {
            dispatch(actions.load() as any);
        },
        onUnload: () => {
            dispatch(actions.unload() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader);