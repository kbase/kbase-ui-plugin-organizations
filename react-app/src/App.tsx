import React from "react";
import { Provider } from "react-redux";
import { createReduxStore } from "./redux/store";
import { AppBase, AuthGate } from "@kbase/ui-components";
import ErrorBoundary from "./ui/ErrorBoundary";
import Dispatcher from "./ui/dispatcher";
import "./App.css";

import { Marked, Renderer, MarkedOptions } from "marked-ts";

// fontawesome setup
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSpinner,
  faSearch,
  faGlobe,
  faUserLock,
  faSquare,
  faCube,
} from "@fortawesome/free-solid-svg-icons";
import Main from "./components/Main";

// Setup

library.add(faSpinner, faSearch, faGlobe, faUserLock, faSquare, faCube);

class DescriptionRenderer extends Renderer {
  link(href: string, title: string, text: string) {
    if (this.options.sanitize) {
      let prot: string;

      try {
        prot = decodeURIComponent(this.options.unescape!(href))
          .replace(/[^\w:]/g, "")
          .toLowerCase();
      } catch (e) {
        return text;
      }

      // Ahem, this is to get around the current (1/10/20) eslint rule which
      // complains about 'javascript:'
      const colon = ":";
      const x = "javascript" + colon;
      if (
        prot.indexOf(x) === 0 ||
        prot.indexOf("vbscript:") === 0 ||
        prot.indexOf("data:") === 0
      ) {
        return text;
      }
    }

    let out = '<a href="' + href + '"';

    if (title) {
      out += ' title="' + title + '"';
    }

    out += ' target="_blank" rel="noopener noreferrer">' + text + "</a>";

    return out;
  }
}

const options = new MarkedOptions();
options.renderer = new DescriptionRenderer();
Marked.setOptions({ renderer: new DescriptionRenderer() });

// The App Component

const store = createReduxStore();

interface AppProps {}

interface AppState {}

export default class App<AppProps, AppState> extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <Provider store={store}>
          <AppBase>
            <AuthGate required={true}>
              <div
                className="App Col scrollable"
                data-k-b-testhook-plugin="organizations"
              >
                <Main>
                  <Dispatcher />
                </Main>
              </div>
            </AuthGate>
          </AppBase>
        </Provider>
      </ErrorBoundary>
    );
  }
}
