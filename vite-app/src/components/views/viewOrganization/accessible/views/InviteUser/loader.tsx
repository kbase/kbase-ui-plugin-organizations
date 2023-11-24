import { Component } from 'react';

import {
    StoreState
} from '../../../../../../redux/store/types';
import Container from './container';

import { AppError } from '@kbase/ui-components';
import { Alert, Spin } from 'antd';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { extractViewOrgSubView } from '../../../../../../lib/stateExtraction';
import * as actions from '../../../../../../redux/actions/viewOrganization/inviteUser';
import { AsyncModel, AsyncModelState } from '../../../../../../redux/store/types/common';
import { SubViewKind } from '../../../../../../redux/store/types/views/Main/views/ViewOrg';
import { InviteUserViewModel } from '../../../../../../redux/store/types/views/Main/views/ViewOrg/views/InviteUser';

export interface InviteUserLoaderProps {
    view: AsyncModel<InviteUserViewModel>;
    organizationId: string;
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
    onFinish: () => void;
}

interface InviteUserLoaderState {
}

class InviteUserLoader extends Component<InviteUserLoaderProps, InviteUserLoaderState> {
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
                Error!
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
            default:
                return (
                    <Container onFinish={this.props.onFinish} />
                );
        }
    }

    componentDidMount() {
        switch (this.props.view.loadingState) {
            case AsyncModelState.NONE:
                this.props.onLoad(this.props.organizationId);
        }
    }

    // componentWillUnmount() {
    //     this.props.onUnload();
    // }
}


export interface OwnProps {
    organizationId: string;
}

interface StateProps {
    view: AsyncModel<InviteUserViewModel>;
}

interface DispatchProps {
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
}

function mapStateToProps(state: StoreState, _props: OwnProps): StateProps {
    const subView = extractViewOrgSubView(state);

    if (subView.kind !== SubViewKind.INVITE_USER) {
        throw new Error('Wrong model');
    }

    return {
        view: subView.model
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
        onLoad: (organizationId: string) => {
            dispatch(actions.load(organizationId) as any);
        },
        onUnload: () => {
            dispatch(actions.unload() as any);
        }
    };
}


export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(InviteUserLoader);