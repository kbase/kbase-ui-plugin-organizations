import * as React from 'react';

import Container from './reduxAdapter';
import {
    StoreState, ViewOrgViewModelKind, ViewState,
    View, NoneViewModel, AddAppsViewModel
} from '../../../../../types';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../../../redux/actions/viewOrganization/addApps';
import { Spin, Alert } from 'antd';
import { AnError, makeError } from '../../../../../lib/error';

export interface LoaderProps {
    view: View<AddAppsViewModel | NoneViewModel>;
    onLoad: () => void;
    onUnload: () => void;
    onFinish: () => void;
}

interface LoaderState {
}

class Loader extends React.Component<LoaderProps, LoaderState> {


    renderLoading() {
        const message = (
            <div>
                Loading ...
                {' '}
                <Spin />
            </div>
        );
        return (
            <Alert type="info" message={message} style={{
                width: '20em',
                padding: '20px',
                margin: '20px auto'
            }} />
        );
    }

    renderError(error: AnError) {
        return (
            <div>
                Error loading "add apps" tool.
                <div>
                    {error.message}
                </div>
            </div>
        );
    }

    render() {
        switch (this.props.view.state) {
            case ViewState.NONE:
                return this.renderLoading();
            case ViewState.LOADING:
                return this.renderLoading();
            case ViewState.ERROR:
                if (this.props.view.error) {
                    return this.renderError(this.props.view.error);
                } else {
                    return this.renderError(makeError({
                        code: 'Missing Error',
                        message: 'The error appears to be missing'
                    }));
                }
            case ViewState.OK:
            default:
                return (
                    <Container onFinish={this.props.onFinish} />
                );
        }
    }

    componentDidMount() {
        switch (this.props.view.state) {
            case ViewState.NONE:
                this.props.onLoad();
        }
    }

    componentWillUnmount() {
        this.props.onUnload();
    }
}


export interface OwnProps {
}

interface StateProps {
    view: View<AddAppsViewModel>;
}

interface DispatchProps {
    onLoad: () => void;
    onUnload: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const v = state.views.viewOrgView;
    const vm1 = v.viewModel;
    if (vm1 === null) {
        throw new Error('vm is null');
    }
    if (vm1.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error('not the right vm');
    }
    return {
        view: vm1.subViews.addAppsView
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
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