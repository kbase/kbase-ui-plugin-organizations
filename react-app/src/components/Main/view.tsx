import React from 'react';
import './style.css';
import { MainView } from '../../redux/store/types/views/Main';
import { ModelLoaded } from '../../redux/store/types/common';
import Dispatcher from '../../ui/dispatcher';


export interface MainProps {
    viewModel: ModelLoaded<MainView>;
    setTitle: (title: string) => void;
}

interface MainState {
}

export default class Navigation extends React.Component<MainProps, MainState> {
    componentDidMount() {
        this.props.setTitle('Organizations');
    }

    // renderNotFound() {
    //     return <Alert type="warning" message="The view was not found" />;
    // }

    // renderMenu() {
    //     interface ViewOrgMatchProps {
    //         id: string;
    //     }
    //     type WrappedProps = RouteComponentProps<ViewOrgMatchProps>;
    //     const NotFound: React.StatelessComponent<{}> = () => {
    //         return (
    //             <Alert type="warning" message="Sorry, not found" />
    //         );
    //     };

    //     return <HashRouter basename="/" hashType="noslash">
    //         <div
    //             className="App scrollable-flex-column"
    //             data-k-b-testhook-plugin="organizations"
    //         >
    //             <div className="App-body scrollable-flex-column">
    //                 <Switch>
    //                     <Route path="/orgs" component={OrganizationsBrowser} exact />
    //                     <Route path="/orgs/new" component={NewOrganization} exact />

    //                     <Route path="/orgs/:id"
    //                         exact={true}
    //                         render={(props: WrappedProps) => {
    //                             return <ViewOrganization organizationId={props.match.params.id} />;
    //                         }}
    //                     />
    //                     <Redirect from="/" to="/orgs" exact={true} />
    //                     <Route component={NotFound} />
    //                 </Switch>
    //             </div>
    //         </div>
    //     </HashRouter>;
    // }

    render() {
        //  {this.renderView()}
        return <React.Fragment>
            <Dispatcher />
        </React.Fragment>;

    }
}
