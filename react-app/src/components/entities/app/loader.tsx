import { Component } from "react";
import * as appModel from "../../../data/models/apps";
import App, { View } from "./component";

import { LoadingOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../../../redux/actions/entities";
import { StoreState } from "../../../redux/store/types";

interface LoaderProps {
  appId: appModel.AppID;
  // TODO: don't really like AppFullInfo - as a name
  app: appModel.AppFullInfo | undefined;
  imageBaseURL: string;
  initialView?: View;
  onLoad: (appId: appModel.AppID) => void;
}

interface LoaderState {}

class Loader extends Component<LoaderProps, LoaderState> {
  render() {
    if (this.props.app) {
      return (
        <App app={this.props.app} imageBaseURL={this.props.imageBaseURL} initialView={this.props.initialView || View.COMPACT}/>
      );
    } else {
      return (
        <div>
          <LoadingOutlined /> Loading App...
        </div>
      );
    }
  }

  componentDidMount() {
    if (!this.props.app) {
      this.props.onLoad(this.props.appId);
    }
  }
}

export interface OwnProps {
  appId: appModel.AppID;
}

interface StateProps {
  app: appModel.AppFullInfo | undefined;
  imageBaseURL: string;
}

interface DispatchProps {
  onLoad: (appId: appModel.AppID) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
  return {
    app: state.entities.apps.byId.get(props.appId),
    imageBaseURL: state.app.config.services.NarrativeMethodStore.url.slice(
      0,
      -4
    ),
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<actions.EntityAction>
): DispatchProps {
  return {
    onLoad: (appId: appModel.AppID) => {
      dispatch(actions.loadApp(appId) as any);
    },
  };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
  mapStateToProps,
  mapDispatchToProps
)(Loader);
