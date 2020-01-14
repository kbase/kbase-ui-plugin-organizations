import * as React from 'react';

import AccessibleContainer from './accessible/container';
import InaccessibleContainer from './inaccessible/container';
import { Spin, Alert } from 'antd';

//

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import * as types from '../../../types';
import * as actions from '../../../redux/actions/viewOrg';
import { OrganizationKind } from '../../../data/models/organization/model';
import { AppError } from '@kbase/ui-components';

export interface Props {
    organizationId: string;
    view: types.ViewOrgView;
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
}

interface State { }

class Loader extends React.Component<Props, State> {
    previousOrganizationId: string | null;

    constructor(props: Props) {
        super(props);

        this.previousOrganizationId = null;
    }

    renderLoading() {
        const message = (
            <div>
                Loading Organization... <Spin />
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
        switch (this.props.view.loadingState) {
            case types.ComponentLoadingState.NONE:
                return this.renderLoading();
            case types.ComponentLoadingState.LOADING:
                return this.renderLoading();
            case types.ComponentLoadingState.ERROR:
                if (this.props.view.error) {
                    return this.renderError(this.props.view.error);
                } else {
                    return this.renderError({
                        code: 'Missing Error',
                        message: 'The error appears to be missing'
                    });
                }
            case types.ComponentLoadingState.SUCCESS:
            default:
                if (this.props.view.viewModel === null) {
                    return this.renderError({
                        code: 'Null Error',
                        message: 'The view model is missing, but should be available'
                    });
                }
                if (this.props.view.viewModel.organization.kind === OrganizationKind.INACCESSIBLE_PRIVATE) {
                    return <InaccessibleContainer />;
                }
                return <AccessibleContainer />;
        }
    }

    componentDidUpdate(previousProps: Props) {
        if (previousProps.organizationId !== this.props.organizationId) {
            this.props.onLoad(this.props.organizationId);
        }
    }

    componentDidMount() {
        if (this.props.view.loadingState === types.ComponentLoadingState.NONE) {
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
    view: types.ViewOrgView;
}

interface DispatchProps {
    onLoad: (organizationId: string) => void;
    onUnload: () => void;
}

function mapStateToProps(state: types.StoreState, props: OwnProps): StateProps {
    return {
        view: state.views.viewOrgView
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
