import * as React from 'react';
import Container from './container';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../../../../../redux/actions/viewOrganization/requestAddNarrative';
import { Alert } from 'antd';
import {
    StoreState
} from '../../../../../../types';
import { extractViewOrgSubView } from '../../../../../../lib/stateExtraction';
import { SubViewKind } from '../../../../../../types/views/Main/views/ViewOrg';
import { RequestNarrativeViewModel } from '../../../../../../types/views/Main/views/ViewOrg/views/RequestNarrative';
import { AsyncModelState, AsyncModel } from '../../../../../../types/common';
import { AppError } from '@kbase/ui-components';
import { LoadingOutlined } from '@ant-design/icons';

export interface Props {
    organizationId: string;
    view: AsyncModel<RequestNarrativeViewModel>;
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
    onFinish: () => void;
}

interface State {
}

class Loader extends React.Component<Props, State> {
    renderLoading() {
        const message = (
            <React.Fragment>
                <LoadingOutlined />{' '}Loading Your Narratives...
            </React.Fragment>
        );
        return (
            <Alert type="info" message={message}
                style={{
                    padding: '20px', width: '30em',
                    margin: '30px auto 0 auto', textAlign: 'center'
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
            default:
                return (
                    <Container onFinish={this.props.onFinish} />
                );
        }
    }

    componentDidMount() {
        console.log('mounting???');
        switch (this.props.view.loadingState) {
            case AsyncModelState.NONE:
                this.props.onLoad(this.props.organizationId);
        }
    }

    componentWillUnmount() {
        console.log('unmounting???');
        // this.props.onUnload();
    }
}

//

export interface OwnProps {
    organizationId: string;
}

interface StateProps {
    view: AsyncModel<RequestNarrativeViewModel>;
}

interface DispatchProps {
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const subView = extractViewOrgSubView(state);

    if (subView.kind !== SubViewKind.ADD_NARRATIVE) {
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