import { Component } from 'react';

import {
    StoreState
} from '../../../../../../redux/store/types';
import Container from './reduxAdapter';

import { AppError } from '@kbase/ui-components';
import { Alert, Spin } from 'antd';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { extractViewOrgSubView } from '../../../../../../lib/stateExtraction';
import * as actions from '../../../../../../redux/actions/viewOrganization/addApps';
import { AsyncModel, AsyncModelState } from '../../../../../../redux/store/types/common';
import { SubViewKind } from '../../../../../../redux/store/types/views/Main/views/ViewOrg';
import { AddAppViewModel } from '../../../../../../redux/store/types/views/Main/views/ViewOrg/views/AddApp';

export interface LoaderProps {
    view: AsyncModel<AddAppViewModel>;
    onLoad: () => void;
    onUnload: () => void;
    onFinish: () => void;
}

interface LoaderState {
}

class Loader extends Component<LoaderProps, LoaderState> {
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

    renderError(error: AppError) {
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
        switch (this.props.view.loadingState) {
            case AsyncModelState.NONE:
                return this.renderLoading();
            case AsyncModelState.LOADING:
                return this.renderLoading();
            case AsyncModelState.ERROR:
                return this.renderError(this.props.view.error);
            case AsyncModelState.SUCCESS:
            default:
                return (
                    <Container onFinish={this.props.onFinish} />
                );
        }
    }

    componentDidMount() {
        switch (this.props.view.loadingState) {
            case AsyncModelState.NONE:
                this.props.onLoad();
        }
    }

    // componentWillUnmount() {
    //     this.props.onUnload();
    // }
}

// Redux interface


export interface OwnProps {
}

interface StateProps {
    view: AsyncModel<AddAppViewModel>;
}

interface DispatchProps {
    onLoad: () => void;
    onUnload: () => void;
}

function mapStateToProps(state: StoreState, _props: OwnProps): StateProps {
    const subView = extractViewOrgSubView(state);

    if (subView.kind !== SubViewKind.ADD_APP) {
        throw new Error('Wrong model');
    }

    return {
        view: subView.model
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