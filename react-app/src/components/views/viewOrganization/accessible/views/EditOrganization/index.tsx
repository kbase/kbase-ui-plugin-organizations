import * as React from 'react';
import { StoreState } from '../../../../../../redux/store/types';
import Container from './container';
import * as orgModel from '../../../../../../data/models/organization/model';

import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../../../../../redux/actions/viewOrganization/editOrg';
import { Alert, Spin } from 'antd';
import { SubViewKind } from '../../../../../../redux/store/types/views/Main/views/ViewOrg';
import { extractViewOrgSubView } from '../../../../../../lib/stateExtraction';
import { EditOrgViewModel } from '../../../../../../redux/store/types/views/Main/views/ViewOrg/views/EditOrg';
import { AsyncModelState, AsyncModel } from '../../../../../../redux/store/types/common';
import { AppError } from '@kbase/ui-components';

// First the loader component, which takes care of a loading view, error view, and the 
// container.

export interface LoaderProps {
    organizationId: orgModel.OrganizationID;
    view: AsyncModel<EditOrgViewModel>;
    onLoad: (organizationId: orgModel.OrganizationID) => void;
    onUnload: () => void;
    onFinish: () => void;
}

interface LoaderState {
}

class Loader extends React.Component<LoaderProps, LoaderState> {
    renderLoading() {
        const message = (
            <div>
                Loading Editor...
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
            <Alert message={error.message} />
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
                // should only appear briefly as the LOAD event is processed.
                this.props.onLoad(this.props.organizationId);
        }
    }
}

// THe redux connection


export interface OwnProps {
    organizationId: orgModel.OrganizationID;
}

interface StateProps {
    view: AsyncModel<EditOrgViewModel>;
}

interface DispatchProps {
    onLoad: (organizationId: orgModel.OrganizationID) => void;
    onUnload: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const subView = extractViewOrgSubView(state);

    if (subView.kind !== SubViewKind.EDIT_ORGANIZATION) {
        throw new Error('Wrong model');
    }

    return {
        view: subView.model
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onLoad: (organizationId: orgModel.OrganizationID) => {
            dispatch(actions.load(organizationId) as any);
        },
        onUnload: () => {
            dispatch(actions.unload() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader);