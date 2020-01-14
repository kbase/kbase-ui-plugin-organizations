import * as React from 'react';
import MainMenu from '../../../../menu/component';
import { Button, Input, Icon, Alert, Select } from 'antd';
import './component.css';
import { SelectableApp, ResourceRelationToOrg } from '../../../../../types';
import App from '../../../../entities/app/loader';
import { ChangeEvent } from 'react';

export interface AddAppsProps {
    apps: Array<SelectableApp>;
    selectedApp: SelectableApp | null;
    // sortBy: string
    onFinish: () => void;
    onSelectApp: (appId: string) => void;
    onRequestAssociation: (appId: string) => void;
    onSearch: (searchBy: string) => void;
    onSort: (sortBy: string) => void;
}

interface AddAppsState {
}

type AlertType = 'info' | 'warning' | 'error' | 'success';

export default class AddApps extends React.Component<AddAppsProps, AddAppsState> {


    doSelectApp(app: SelectableApp) {
        this.props.onSelectApp(app.app.id);
    }

    doRequestAssociation() {
        if (this.props.selectedApp) {
            this.props.onRequestAssociation(this.props.selectedApp.app.id);
        }
    }

    doSearch(e: ChangeEvent<HTMLInputElement>) {
        const search = e.target.value;
        this.props.onSearch(search);
    }

    doSortBy(sortBy: string) {
        this.props.onSort(sortBy);
    }

    renderMenuButtons() {
        return (
            <div className="ButtonSet">
                <div className="ButtonSet-button">
                    <Button icon="rollback"
                        type="danger"
                        onClick={this.props.onFinish}>
                        Done
                </Button>
                </div>
            </div >
        );
    }

    renderSearchBar() {
        return (
            <div className="AddApps-searchBar">
                <div className="AddApps-searchInput">
                    <Input
                        onChange={this.doSearch.bind(this)}
                        style={{ width: '100%' }}
                        placeholder="Filter apps by title" />
                </div>
                <div className="AddApps-sortControl">
                    <Select
                        onChange={this.doSortBy.bind(this)}
                        defaultValue="name"
                        style={{ width: '10em' }}
                        dropdownMatchSelectWidth={true}>
                        <Select.Option value="name" key="name">App</Select.Option>
                        <Select.Option value="module" key="module">Module</Select.Option>
                    </Select>
                </div>
            </div>
        );
    }

    renderAppStatus(app: SelectableApp) {
        switch (app.relation) {
            case (ResourceRelationToOrg.NONE):
                return;
            case (ResourceRelationToOrg.ASSOCIATED):
                return (
                    <Icon type="check" style={{ color: 'green' }} />
                );
            case (ResourceRelationToOrg.ASSOCIATION_PENDING):
                return (
                    <Icon type="loading" style={{ color: 'orange' }} />
                );
        }
    }

    renderApps() {
        if (this.props.apps.length === 0) {
            const message = (
                <React.Fragment>
                    <p>
                        You have not authored any released apps
                    </p>
                </React.Fragment>
            );
            return (
                <Alert type="info" message={message} />
            );
        }
        const apps = this.props.apps.map((app, index) => {
            let classes = ['AddApps-app'];
            if (app.selected) {
                classes.push('Hoverable-selected');
            } else {
                classes.push('Hoverable');
            }
            return (
                <div className={classes.join(' ')} key={String(index)} onClick={() => { this.doSelectApp(app); }}>
                    <div className="AddApps-app-statusColumn">
                        {this.renderAppStatus(app)}
                    </div>
                    <div className="AddApps-app-appColumn">
                        <App appId={app.app.id} />
                        {/* <AppBrief app={app.app} /> */}
                    </div>

                </div>
            );
        });
        return (
            <div className="AddApps-apps">
                {apps}
            </div>
        );
    }

    renderAppSelector() {
        return (
            <React.Fragment>
                {this.renderSearchBar()}
                {this.renderApps()}
            </React.Fragment>
        );
    }

    renderMessage() {
        const app = this.props.selectedApp;
        let alertType: AlertType;
        let message: string;
        if (this.props.apps.length === 0) {
            message = 'You have not authored any released apps';
            alertType = 'info';
        } else if (app === null) {
            message = 'Please select an App to associate';
            alertType = 'info';
        } else {
            switch (app.relation) {
                case (ResourceRelationToOrg.ASSOCIATED):
                    message = 'This App is already associated';
                    alertType = 'warning';
                    break;
                case (ResourceRelationToOrg.ASSOCIATION_PENDING):
                    message = 'You have requested association of this App';
                    alertType = 'warning';
                    break;
                default:
                    return;
            }
        }

        return (
            <Alert
                type={alertType}
                style={{ marginBottom: '10px' }}
                message={message} />
        );
    }

    renderSelectedApp() {
        if (this.props.selectedApp === null) {
            return;
        }
        return (
            <div className="AddApps-selectedApp">
                <App appId={this.props.selectedApp.app.id} />
            </div>
        );
    }

    renderAppSelectionControls() {
        if (this.props.selectedApp === null) {
            return (
                <Button
                    disabled
                    type="primary">
                    Associate this App
                </Button>
            );
        }
        switch (this.props.selectedApp.relation) {
            case (ResourceRelationToOrg.NONE):
                return (
                    <Button
                        onClick={() => { this.doRequestAssociation(); }}
                        type="primary">
                        Associate this App
                    </Button>
                );
            case (ResourceRelationToOrg.ASSOCIATED):
                return (
                    <Button
                        disabled={true}
                        type="primary">
                        Associate this App
                    </Button>
                );
            case (ResourceRelationToOrg.ASSOCIATION_PENDING):
                return (
                    <Button
                        disabled={true}
                        type="primary">
                        Associate this App
                    </Button>
                );
        }
    }

    renderAppAdder() {
        return (
            <React.Fragment>
                {this.renderSelectedApp()}
                {this.renderMessage()}
                <div className="AddApps-selectionControls">
                    {this.renderAppSelectionControls()}
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="AddApps">
                <MainMenu buttons={this.renderMenuButtons()} />
                <div className="AddApps-row">
                    <div className="AddApps-selectColumn">
                        <h3>Select an App you have authored</h3>
                        {this.renderAppSelector()}
                    </div>

                    <div className="AddApps-addColumn">
                        <h3>View and Add App</h3>
                        {this.renderAppAdder()}
                    </div>
                </div>
            </div>
        );
    }
}