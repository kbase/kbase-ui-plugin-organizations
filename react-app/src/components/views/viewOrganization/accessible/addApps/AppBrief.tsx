import * as React from 'react'
import * as appModel from '../../../../../data/models/apps'
import './AppBrief.css'

export interface AppBriefProps {
    app: appModel.AppBriefInfo // for now, we'll switch to full app soon
}

interface AppBriefState {

}

export default class AppBrief extends React.Component<AppBriefProps, AppBriefState> {


    render() {
        return (
            <div className='App'>
                <div className='App-name'>
                    {this.props.app.name}
                </div>
                <div className="App-moduleName">
                    {this.props.app.moduleName}
                </div>
            </div>
        )
    }
}