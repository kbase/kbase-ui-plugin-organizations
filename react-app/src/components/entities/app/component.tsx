import {
  ExpandOutlined,
  FileImageOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";
import { Button, Image, Tooltip } from "antd";
import { Component } from "react";
import * as appModel from "../../../data/models/apps";
import "./component.css";

export enum View {
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
  initialView: View;
}

interface AppState {
  view: View;
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      view: props.initialView,
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
      <Image
        src={`${this.props.imageBaseURL}/${this.props.app.icon.url}`}
        className="App-icon"
        alt={`Icon for app ${this.props.app.name}`}
        fallback="data:image/png;base64,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"
        preview={false}
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
      <Button
        type="link"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          this.onToggleView();
        }}
      >
        {this.state.view === View.NORMAL ? (
          <ShrinkOutlined />
        ) : (
          <ExpandOutlined />
        )}
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
