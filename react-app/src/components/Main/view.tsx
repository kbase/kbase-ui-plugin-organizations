import React from 'react';
import './style.css';
import { MainView } from '../../types/views/Main';
import { ModelLoaded } from '../../types/common';
import OrganizationsBrowser from '../views/browseOrgs';
import { Alert } from 'antd';
import { Switch, Route, Redirect, RouteComponentProps, HashRouter } from 'react-router-dom';
import NewOrganization from '../views/newOrganization/loader';
import ViewOrganization from '../views/viewOrganization/loader';

export interface Props {
    viewModel: ModelLoaded<MainView>;
    setTitle: (title: string) => void;
}

interface State {
}

export default class Navigation extends React.Component<Props, State> {
    componentDidMount() {
        this.props.setTitle('Organizations');
    }

    renderNotFound() {
        return <Alert type="warning" message="The view was not found" />;
    }

    renderMenu() {
        interface ViewOrgMatchProps {
            id: string;
        }
        type WrappedProps = RouteComponentProps<ViewOrgMatchProps>;
        const NotFound: React.StatelessComponent<{}> = () => {
            return (
                <Alert type="warning" message="Sorry, not found" />
            );
        };
        /*
         <Route path="/orgs/:id"
                            exact={true}
                            component={(props: WrappedProps) => {
                                return <ViewOrganization organizationId={props.match.params.id} />;
                            }}
                        />
        */

        return <HashRouter basename="/" hashType="noslash">
            <div
                className="App scrollable-flex-column"
                data-k-b-testhook-plugin="organizations"
            >
                <div className="App-body scrollable-flex-column">
                    <Switch>
                        <Route path="/orgs" component={OrganizationsBrowser} exact />
                        <Route path="/orgs/new" component={NewOrganization} exact />

                        <Route path="/orgs/:id"
                            exact={true}
                            render={(props: WrappedProps) => {
                                return <ViewOrganization organizationId={props.match.params.id} />;
                            }}
                        />
                        <Redirect from="/" to="/orgs" exact={true} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        </HashRouter>;
    }

    render() {
        //  {this.renderView()}
        return <div
            className="Col Col-scrollable"
            data-k-b-testhook-component="Navigation"
        >
            {this.renderMenu()}
        </div>;
    }
}
