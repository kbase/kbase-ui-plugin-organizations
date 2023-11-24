import { Component, Fragment } from 'react';
import {
    StoreState
} from '../../../../../../redux/store/types';
import Container from './container';

import { LoadingOutlined } from '@ant-design/icons';
import { AppError } from '@kbase/ui-components';
import { Alert } from 'antd';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { extractViewOrgSubView } from '../../../../../../lib/stateExtraction';
import * as actions from '../../../../../../redux/actions/viewOrganization/manageMembership';
import { AsyncModel, AsyncModelState } from '../../../../../../redux/store/types/common';
import { SubViewKind } from '../../../../../../redux/store/types/views/Main/views/ViewOrg';
import { ManageMembershipViewModel } from '../../../../../../redux/store/types/views/Main/views/ViewOrg/views/ManageMembership';

export interface Props {
    organizationId: string;
    view: AsyncModel<ManageMembershipViewModel>;
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
    onFinish: () => void;
}

interface State {
}

class Loader extends Component<Props, State> {
    renderLoading() {
        const message = (
            <Fragment>
                <LoadingOutlined />{' '}Loading Your Membership...
            </Fragment>
        );
        return (
            <Alert type="info" message={message}
                style={{ padding: '20px', width: '30em', margin: '30px auto 0 auto', textAlign: 'center' }} />
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
}

//


export interface OwnProps {
    organizationId: string;
}

interface StateProps {
    view: AsyncModel<ManageMembershipViewModel>;
}

interface DispatchProps {
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
}

function mapStateToProps(state: StoreState): StateProps {
    const subView = extractViewOrgSubView(state);

    if (subView.kind !== SubViewKind.MANAGE_MEMBERSHIP) {
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

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader);
