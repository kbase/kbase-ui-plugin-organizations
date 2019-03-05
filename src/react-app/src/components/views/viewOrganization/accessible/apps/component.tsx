import * as React from 'react'
import * as orgModel from '../../../../../data/models/organization/model'
import './component.css'
import { Button, Icon, Alert, Select, Input, Dropdown, Menu } from 'antd'
import App from '../../../../entities/app/loader'

export interface AppsProps {
    organization: orgModel.Organization
    apps: { sortBy: string, searchBy: string, apps: Array<orgModel.AppResource> }
    onAssociateApp: () => void
    onRemoveApp: (appId: string) => void
}

interface AppsState {

}

export default class Apps extends React.Component<AppsProps, AppsState> {
    constructor(props: AppsProps) {
        super(props)
    }

    renderButtonRow() {
        return (
            <Button size="small" style={{ width: '100%' }} onClick={this.props.onAssociateApp}>
                <Icon type="appstore" />
                Associate Apps
            </Button>
        )
    }

    renderSearchRow() {
        return (
            <React.Fragment>
                <div className="Apps-searchInput">
                    <Input placeholder="Filter apps by title or author" />
                </div>
                <div className="Apps-searchControls">
                    <span className="field-label">sort</span>
                    <Select
                        style={{ width: '11em' }}
                        dropdownMatchSelectWidth={true}
                        defaultValue="dateAdded">
                        <Select.Option key="dateAdded" value="dateAdded">Date Added</Select.Option>
                        <Select.Option key="name" value="name">Name</Select.Option>
                    </Select>
                </div>
            </React.Fragment>
        )
    }

    renderBrowseRows() {
        if (this.props.apps.apps.length === 0) {
            return (
                <Alert type="info" message="Sorry, no apps" />
            )
        }

        const apps = this.props.apps.apps.map((app, index) => {
            const menu = (
                <Menu>
                    <Menu.Item key="removeApp" onClick={() => this.props.onRemoveApp(app.appId)}>
                        <Icon type="delete" style={{ color: 'red' }} />
                        Remove App from Organization
                    </Menu.Item>
                </Menu>
            )
            return (
                <div key={String(index)} className="Apps-appRow SimpleCard">
                    <div className="Apps-appColumn">
                        <App appId={app.appId} />
                    </div>
                    <div className="Apps-menuColumn">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Icon type="ellipsis" />
                        </Dropdown>
                    </div>

                </div>
            )
        })
        return (
            <React.Fragment>
                {apps}
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="Apps">
                <div className="Apps-buttonRow">
                    {this.renderButtonRow()}
                </div>
                <div className="Apps-searchRow">
                    {this.renderSearchRow()}
                </div>
                <div className="Apps-browseRow">
                    {this.renderBrowseRows()}
                </div>
            </div>
        )
    }
}