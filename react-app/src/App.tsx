import { marked, Renderer } from "marked";
import { Provider } from "react-redux";
import { createReduxStore } from "./redux/store";
// import { AppBase, AuthGate } from "@kbase/ui-components";
import Dispatcher from "./ui/dispatcher";
import ErrorBoundary from "./ui/ErrorBoundary";

import "antd/dist/reset.css";
import "./App.css";

// fontawesome setup
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCube,
  faGlobe,
  faSearch,
  faSpinner,
  faSquare,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";
import Main from "./components/Main";

// Setup

import { AppBase, AuthGate } from "@kbase/ui-components";
import { ConfigProvider } from "antd";
import { Component } from "react";

library.add(faSpinner, faSearch, faGlobe, faUserLock, faSquare, faCube);

class DescriptionRenderer extends Renderer {
  link(href: string, title: string, text: string) {
    if (this.options.sanitize) {
      let prot: string;

      try {
        prot = decodeURIComponent(href)
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

marked.use({ renderer: new DescriptionRenderer() });

// const options = new MarkedOptions();
// options.renderer = new DescriptionRenderer();
// Marked.setOptions({ renderer: new DescriptionRenderer() });

// The App Component

const store = createReduxStore();

export default class App extends Component {
  render() {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#337ab7",
            colorSuccess: "#3c763d",
            // infoColor: '#31708f',
            // warningColor: '#8a6d3b',
            colorError: "#a94442",
          },
        }}
      >
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
      </ConfigProvider>
    );
  }
}
