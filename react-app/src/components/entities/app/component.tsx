import * as React from "react";
import * as appModel from "../../../data/models/apps";
import "./component.css";
import { Tooltip, Button } from "antd";
import {
  UpOutlined,
  DownOutlined,
  BorderOutlined,
  AppstoreTwoTone,
  AppstoreOutlined,
  FileImageOutlined,
} from "@ant-design/icons";

enum View {
  COMPACT = 0,
  NORMAL,
}

function reverseView(v: View) {
  switch (v) {
    case View.COMPACT:
      return View.NORMAL;
    case View.NORMAL:
      return View.COMPACT;
  }
}

export interface AppProps {
  app: appModel.AppFullInfo; // for now, we'll switch to full app soon
  imageBaseURL: string;
}

interface AppState {
  view: View;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      view: View.COMPACT,
    };
  }

  onToggleView() {
    this.setState({
      view: reverseView(this.state.view),
    });
  }

  renderIcon() {
    if (!this.props.app.icon.url) {
      return (
        // <BorderOutlined
        //   style={{ fontSize: "40px", color: "rgb(103, 58, 103)" }}
        // />
        <FileImageOutlined
          style={{ fontSize: "40px", color: "rgba(150, 150, 150, 1)" }}
        />
      );
    }
    return (
      <img
        src={`${this.props.imageBaseURL}/${this.props.app.icon.url}`}
        className="App-icon"
        alt={`Icon for app ${this.props.app.name}`}
      />
    );
  }

  renderAuthors() {
    const authorCount = this.props.app.authors.length;
    return this.props.app.authors.map((authorUsername, index) => {
      let sep;
      if (index < authorCount - 1) {
        sep = ", ";
      }
      return (
        <a
          href={`/#people/${authorUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          key={authorUsername}
        >
          {authorUsername}
          {sep}
        </a>
      );
    });
  }

  renderViewControl() {
    return (
      <Button type="link" size="small" onClick={this.onToggleView.bind(this)}>
        {this.state.view === View.NORMAL ? <UpOutlined /> : <DownOutlined />}
      </Button>
    );
  }

  renderCompact() {
    return (
      <div className="App">
        <div className="App-controlCol">{this.renderViewControl()}</div>
        <div className="App-iconCol">{this.renderIcon()}</div>
        <div className="App-appCol">
          <div className="App-name">
            <Tooltip placement="bottomRight" title={this.props.app.subtitle}>
              <a
                href={"/#catalog/apps/" + this.props.app.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.props.app.name}
              </a>
            </Tooltip>
          </div>
          <div className="App-moduleName">
            <span className="field-label">module</span>
            {this.props.app.moduleName}
          </div>
          {/* <div className="App-subtitle">
                        {this.props.app.subtitle}
                    </div>
                    <div className="App-authors">
                        <span className="field-label">by</span> {this.renderAuthors()}
                    </div> */}
        </div>
      </div>
    );
  }

  renderNormal() {
    return (
      <div className="App">
        <div className="App-controlCol">{this.renderViewControl()}</div>
        <div className="App-iconCol">{this.renderIcon()}</div>
        <div className="App-appCol">
          <div className="App-name">
            <Tooltip placement="bottomRight" title={this.props.app.subtitle}>
              <a
                href={"/#catalog/apps/" + this.props.app.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.props.app.name}
              </a>
            </Tooltip>
          </div>
          <div className="App-subtitle">{this.props.app.subtitle}</div>
          <div className="App-moduleName">
            <span className="field-label">module</span>
            {this.props.app.moduleName}
          </div>

          <div className="App-authors">
            <span className="field-label">by</span> {this.renderAuthors()}
          </div>
        </div>
      </div>
    );
  }

  render() {
    switch (this.state.view) {
      case View.COMPACT:
        return (
          <div className="Narrative View-COMPACT">{this.renderCompact()}</div>
        );
      case View.NORMAL:
        return (
          <div className="Narrative View-NORMAL">{this.renderNormal()}</div>
        );
    }
  }
}
