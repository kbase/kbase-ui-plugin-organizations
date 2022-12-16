/**
 * This is a "loader" component. It is solely responsible for
 */
import { StoreState } from '../../redux/store/types';

// The redux connection

import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { AuthenticationStatus } from '@kbase/ui-components/lib/redux/auth/store';
import { Alert, Spin } from 'antd';
import { Component, PropsWithChildren } from 'react';
import { ConnectedProps } from 'react-redux';
import { load, unload } from '../../redux/actions/main';
import { AsyncModelState, ModelError } from '../../redux/store/types/common';
import { MainViewModel } from '../../redux/store/types/views/Main';

import Container from './state';
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
        authentication,
        view
    } = state;

    if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
        throw new Error('Unauthenticated - should never occur');
    }

    const {
        userAuthentication: {token}
    } = authentication;

    return {
        view,
        token
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

// export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
//     mapStateToProps,
//     mapDispatchToProps
// )(Loader);


const connector = connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
);

// let x: typeof connector;

type PropsFromRedux = ConnectedProps<typeof connector>


export interface LoaderProps extends PropsWithChildren, PropsFromRedux {
    view: MainViewModel;
    onLoad: () => void;
    unload: () => void;
}

interface LoaderState { }

export class Loader extends Component<LoaderProps, LoaderState> {
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
}

export default connector(Loader);