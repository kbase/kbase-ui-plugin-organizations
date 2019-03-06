import * as React from 'react'
import * as appModel from '../../../data/models/apps'
import './component.css'
import { Icon } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


enum View {
    COMPACT = 0,
    NORMAL
}

function reverseView(v: View) {
    switch (v) {
        case View.COMPACT:
            return View.NORMAL
        case View.NORMAL:
            return View.COMPACT
    }
}

export interface AppProps {
    app: appModel.AppFullInfo // for now, we'll switch to full app soon
}

interface AppState {
    view: View
}

export default class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props)

        this.state = {
            view: View.COMPACT
        }
    }

    onToggleView() {
        this.setState({
            view: reverseView(this.state.view)
        })
    }

    renderIcon() {
        if (!this.props.app.icon.url) {
            return (
                // <div className="fa-layers fa-fw">
                //     <FontAwesomeIcon icon="square" size="3x" style={{ color: 'rgb(103, 58, 103)' }} />
                //     <FontAwesomeIcon icon="cube" size="3x" inverse transform="shrink-4 left-1" />
                // </div>
                <Icon type="border" style={{ fontSize: '30px', color: 'rgb(103, 58, 103)' }} />
            )
        }
        return (
            <img src={this.props.app.icon.url} className="App-icon" />
        )
    }

    renderAuthors() {
        const authorCount = this.props.app.authors.length
        return this.props.app.authors
            .map((authorUsername, index) => {
                let sep
                if (index < authorCount - 1) {
                    sep = ', '
                }
                return (
                    <a href={`#people/${authorUsername}`} key={authorUsername}>
                        {authorUsername}{sep}
                    </a>
                )
            })
    }

    renderViewControl() {
        return (
            <a onClick={this.onToggleView.bind(this)}
                className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
            >
                <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
            </a>
        )
    }


    renderCompact() {
        return (
            <div className='App'>
                <div className="App-controlCol">
                    {this.renderViewControl()}
                </div>
                <div className="App-iconCol">
                    {this.renderIcon()}
                </div>
                <div className="App-appCol">
                    <div className='App-name'>
                        <a href={"/#catalog/apps/" + this.props.app.id} target="_blank">
                            {this.props.app.name}
                        </a>
                    </div>
                    <div className="App-subtitle">
                        {this.props.app.subtitle}
                    </div>
                    {/* <div className="App-moduleName">
                        <span className="field-label">module</span>{this.props.app.moduleName}
                    </div>
                    <div className="App-authors">
                        <span className="field-label">by</span> {this.renderAuthors()}
                    </div> */}
                </div>

            </div>
        )
    }

    renderNormal() {
        return (
            <div className='App'>
                <div className="App-controlCol">
                    {this.renderViewControl()}
                </div>
                <div className="App-iconCol">
                    {this.renderIcon()}
                </div>
                <div className="App-appCol">
                    <div className='App-name'>
                        <a href={"/#catalog/apps/" + this.props.app.id} target="_blank">
                            {this.props.app.name}
                        </a>
                    </div>
                    <div className="App-subtitle">
                        {this.props.app.subtitle}
                    </div>
                    <div className="App-moduleName">
                        <span className="field-label">module</span>{this.props.app.moduleName}
                    </div>
                    <div className="App-authors">
                        <span className="field-label">by</span> {this.renderAuthors()}
                    </div>
                </div>

            </div>
        )
    }

    render() {
        switch (this.state.view) {
            case View.COMPACT:
                return (
                    <div className="Narrative View-COMPACT">
                        {this.renderCompact()}
                    </div>
                )
            case View.NORMAL:
                return (
                    <div className="Narrative View-NORMAL">
                        {this.renderNormal()}
                    </div>
                )
        }
    }
}