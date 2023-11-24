import { RootState } from "@kbase/ui-components";
import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";
import { Dispatch } from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { StoreState } from "../../redux/store/types";
import { Dispatcher } from "./view";

interface OwnProps {}

interface StateProps {
  token: string | null;
  rootState: RootState;
  view: string | null;
  path: Array<string>;
  params: Params;
}

export interface Params {
  [key: string]: string;
}
interface DispatchProps {
}

function mapStateToProps(state: StoreState, _props: OwnProps): StateProps {
  const {
    authentication,
    root: { state: rootState },
    app: {
      runtime: {
        navigation: {
          view: navView,
          params: navParams,
        },
      },
    },
  } = state;

  // Auth integration.
  let token;
  if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
    token = null;
  } else {
    token = authentication.userAuthentication.token;
  }

  const params = {
    ...navParams,
  };
  delete params.rest;
  delete params.view;

  const path = (() => {
    if (!params.rest) {
      return [];
    }
    return params.rest.split("/");
  })();

  const view = (() => {
    if (!navView) {
      return "about";
    }
    return navView;
  })();

  return { token, rootState, view, path, params };
}

function mapDispatchToProps(
  _dispatch: Dispatch<Action>,
  _ownProps: OwnProps,
): DispatchProps {
  return {};
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(Dispatcher);
