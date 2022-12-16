import { AppError, RootState } from '@kbase/ui-components';
import { Alert } from 'antd';
import React, { Component } from 'react';
import { Params } from '.';
import OrganizationsBrowser from '../../components/views/browseOrgs';
import NewOrganization from '../../components/views/newOrganization/loader';
import ViewOrganization from '../../components/views/viewOrganization/loader';
import Navigation from '../navigation';
import { RouteConfig, routeConfigToSpec } from '../navigation/RouteConfig';

const routes: Array<RouteConfig> = [
    {
        path: "orgs",
        view: 'browseOrgs'
    },
    {
        path: 'orgs/new',
        view: 'newOrg'
    },
    {
        path: 'orgs/:organizationId',
        view: 'viewOrg'
    },
    {
        path: 'org/:organizationId',
        view: 'viewOrg'
    }
];


export interface ViewRouter {
    view: string;
    router: (path: Array<string>, params: Params) => React.ReactNode;
}

export interface ViewRouters {
    [key: string]: ViewRouter;
}

export interface DispatcherProps {
    token: string | null;
    rootState: RootState;
    view: string | null;
    path: Array<string>;
    params: Params;
}

interface DispatcherState {
    view: string | null;
    path: Array<string>;
    params: Params;
    currentRoute: ViewRouter | null;
}

export class Dispatcher extends Component<DispatcherProps, DispatcherState> {
    views: ViewRouters;

    constructor(props: DispatcherProps) {
        super(props);

        this.views = {
            about: {
                view: 'about',
                router: (path: Array<string>, params: Params) => {
                    return <div>About here...</div>;
                }
            },
            help: {
                view: 'help',
                router: (path: Array<string>, params: Params) => {
                    return <div>Help here...</div>;
                }
            },
            browseOrgs: {
                view: 'browseOrgs',
                router: (path: Array<string>, params: Params) => {
                    return <OrganizationsBrowser />;
                }
            },
            newOrg: {
                view: 'newOrg',
                router: (path: Array<string>, params: Params) => {
                    return <NewOrganization />;
                }
            },
            viewOrg: {
                view: 'viewOrg',
                router: (path: Array<string>, params: Params) => {
                    if (!params.organizationId) {
                        throw new Error('org id missing!');
                    }
                    return <ViewOrganization organizationId={params.organizationId} />;
                }
            }
        };

        this.state = {
            view: this.props.view,
            path: this.props.path,
            params: this.props.params,
            currentRoute: null
        };
    }

    renderUnauthorized() {
        return <div>Sorry, not authorized. Please log in first.</div>;
    }

    renderRootState() {
        switch (this.props.rootState) {
            case RootState.NONE:
                return '';
            case RootState.HOSTED:
                return '';
            case RootState.DEVELOP:
                return '';
            case RootState.ERROR:
                return 'error';
        }
    }

    renderNavigationNone() {
        const message = <div>
            NONE
        </div>;
        return <Alert type="error" message={message} />;
    }

    // componentDidMount() {
    //     if (this.props.view === null) {
    //         return;
    //     }

    //     const route = this.routes[this.props.view];

    //     if (!route) {
    //         return;
    //     }

    //     this.setState({
    //         currentRoute: route
    //     });
    // }

    renderError(error: AppError) {
        return <Alert type="error" message={error.message} />;
    }

    renderNotFound(view: string) {
        return <Alert type="warning" message={`Not Found: ${view}`} />;
    }

    renderEmptyRoute() {
        return <div>
            Sorry, empty route.
        </div>;
    }


    renderRoute() {
        if (!this.props.view) {
            return this.renderEmptyRoute();
        }
        const route = this.views[this.props.view];
        if (!route) {
            return this.renderNotFound(this.props.view);
        }
        return route.router(this.props.path, this.props.params);
    }

    renderRouting() {
        if (!this.props.token) {
            return this.renderUnauthorized();
        }
        return this.renderRoute();
    }

    render() {
        if (this.props.rootState === RootState.DEVELOP) {
            const routeSpecs = routes.map(routeConfigToSpec);
            return <Navigation routes={routeSpecs}>
                {this.renderRouting()}
            </Navigation>;
        } else {
            return this.renderRouting();
        }
    }
}
