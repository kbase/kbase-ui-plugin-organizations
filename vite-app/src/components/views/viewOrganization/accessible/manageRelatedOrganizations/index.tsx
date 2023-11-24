import { Alert, Spin } from 'antd';
import { Component } from 'react';
import Container from './reduxAdapter';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AppError } from '@kbase/ui-components';
import { extractViewOrgSubView } from '../../../../../lib/stateExtraction';
import * as actions from '../../../../../redux/actions/viewOrganization/manageRelatedOrganizations';
import * as types from '../../../../../redux/store/types';
import { AsyncModel, AsyncModelState } from '../../../../../redux/store/types/common';
import { SubViewKind } from '../../../../../redux/store/types/views/Main/views/ViewOrg';
import { ManageRelatedOrgsViewModel } from '../../../../../redux/store/types/views/Main/views/ViewOrg/views/ManageRelatedOrgs';


export interface Props {
    view: AsyncModel<ManageRelatedOrgsViewModel>;
    onLoad: () => void;
    onUnload: () => void;
    onFinish: () => void;
}

interface State {
}

class Loader extends Component<Props, State> {
    renderLoading() {
        const message = (
            <div>
                Loading Related Organizations Manager...
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
            <Alert type="error" message={error.message} />
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

    componentWillUnmount() {
        this.props.onUnload();
    }
}

//


export interface OwnProps {
    onFinish: () => void;
}

interface StateProps {
    view: AsyncModel<ManageRelatedOrgsViewModel>;
}

interface DispatchProps {
    onLoad: () => void;
    onUnload: () => void;
}

function mapStateToProps(state: types.StoreState, _props: OwnProps): StateProps {
    const subView = extractViewOrgSubView(state);

    if (subView.kind !== SubViewKind.MANAGE_RELATED_ORGS) {
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
            // dispatch(actions.unload() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(Loader);