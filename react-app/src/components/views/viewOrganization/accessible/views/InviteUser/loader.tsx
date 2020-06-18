import * as React from 'react';

import Container from './container';
import {
    StoreState
} from '../../../../../../types';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../../../../redux/actions/viewOrganization/inviteUser';
import { Spin, Alert } from 'antd';
import { extractViewOrgSubView } from '../../../../../../lib/stateExtraction';
import { SubViewKind } from '../../../../../../types/views/Main/views/ViewOrg';
import { InviteUserViewModel } from '../../../../../../types/views/Main/views/ViewOrg/views/InviteUser';
import { AsyncModelState, AsyncModel } from '../../../../../../types/common';
import { AppError } from '@kbase/ui-components';

export interface InviteUserLoaderProps {
    view: AsyncModel<InviteUserViewModel>;
    organizationId: string;
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
    onFinish: () => void;
}

interface InviteUserLoaderState {
}

class InviteUserLoader extends React.Component<InviteUserLoaderProps, InviteUserLoaderState> {
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

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
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