import * as React from 'react';

import AccessibleContainer from './accessible/container';
import InaccessibleContainer from './inaccessible/container';
import { Spin, Alert } from 'antd';

//

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import * as types from '../../../redux/store/types';
import * as actions from '../../../redux/actions/viewOrg';
import { OrganizationKind } from '../../../data/models/organization/model';
import { AppError } from '@kbase/ui-components';
import { AsyncModelState, AsyncModel } from '../../../redux/store/types/common';
import { ViewOrgViewModel } from '../../../redux/store/types/views/Main/views/ViewOrg';

export interface ViewOrganizationProps {
    organizationId: string;
    viewModel: AsyncModel<ViewOrgViewModel>;
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
}

interface State { }

class Loader extends React.Component<ViewOrganizationProps, State> {
    previousOrganizationId: string | null;

    constructor(props: ViewOrganizationProps) {
        super(props);

        this.previousOrganizationId = null;
    }

    renderLoading() {
        const message = (
            <div>
                Loading Organization... <Spin />
            </div>
        );
        return <div style={{ margin: '0 auto' }}>
            <Alert
                type="info"
                message={message}
                style={{
                    width: '20em',
                    padding: '20px',
                    margin: '20px auto'
                }}
            />
        </div>;
    }

    renderError(error: AppError) {
        const message = <span style={{ fontWeight: 'bold' }}>Error</span>;
        const description = (
            <div>
                <p>{error.message}</p>
            </div>
        );
        return <Alert type="error" message={message} description={description} />;
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
                if (this.props.viewModel.value.organization.kind === OrganizationKind.INACCESSIBLE_PRIVATE) {
                    return <InaccessibleContainer />;
                }
                return <AccessibleContainer />;
        }
    }

    componentDidUpdate(previousProps: ViewOrganizationProps) {
        if (previousProps.organizationId !== this.props.organizationId) {
            this.props.onLoad(this.props.organizationId);
        }
    }

    componentDidMount() {
        if (this.props.viewModel.loadingState === AsyncModelState.NONE) {
            this.props.onLoad(this.props.organizationId);
        }
    }

    componentWillUnmount() {
        this.props.onUnload();
    }
}

export interface OwnProps {
    organizationId: string;
}

interface StateProps {
    viewModel: AsyncModel<ViewOrgViewModel>;
}

interface DispatchProps {
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Main Async model not loaded!');
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     throw new Error(`Not in view orgs view: ${state.view.value.kind}`);
    // }

    // if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
    //     throw new Error('Async model not loaded!');
    // }

    const {
        view: {
            value: {
                views: {
                    viewOrg
                }
            }
        }
    } = state;

    return {
        viewModel: viewOrg
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

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Loader);
