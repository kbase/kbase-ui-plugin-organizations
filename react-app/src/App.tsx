import { marked, Renderer } from 'marked';
import { Provider } from "react-redux";
import { createReduxStore } from "./redux/store";
// import { AppBase, AuthGate } from "@kbase/ui-components";
import Dispatcher from "./ui/dispatcher";
import ErrorBoundary from "./ui/ErrorBoundary";

import 'antd/dist/reset.css';
import "./App.css";

// fontawesome setup
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faCube, faGlobe, faSearch, faSpinner, faSquare, faUserLock
} from "@fortawesome/free-solid-svg-icons";
import Main from "./components/Main";

// Setup

import { AppBase, AuthGate } from '@kbase/ui-components';
import { ConfigProvider } from 'antd';
import { Component } from 'react';

// ConfigProvider.config({
//   theme: {
//     primaryColor: '#337ab7',
//     successColor: '#3c763d',
//     // infoColor: '#31708f',
//     // warningColor: '#8a6d3b',
//     errorColor: '#a94442',

//               //  '@font-size-base': '14px',                           // major text font size
//               //  '@heading-color': 'rgba(0,0,0,0.85)',                // heading text color
//               //  '@text-color': 'rgba(0, 0, 0, 1.0)',                 // major text color
//               //  '@text-color-secondary': 'rgba(0, 0, 0. 0.45)',      // secondary text color
//               //  '@disabled-color': 'rgba(0, 0, 0, 0.25)',            // disable state color
//               //  '@border-radius-base': '4px',                        // major border radius
//               //  '@border-color-base': '#d9d9d9',                     // major border color
//               //  '@box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',  // major shadow for layers
//               //  '@border-color-split': 'hsv(0, 0, 80%)'
//   }
// })


library.add(faSpinner, faSearch, faGlobe, faUserLock, faSquare, faCube);

// const renderer: Renderer = {
//   link(href:)
// }
//link(this: Renderer | RendererThis, href: string | null, title: string | null, text: string): string | T;
       

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

marked.use({renderer: new DescriptionRenderer()});

// const options = new MarkedOptions();
// options.renderer = new DescriptionRenderer();
// Marked.setOptions({ renderer: new DescriptionRenderer() });

// The App Component

const store = createReduxStore();

interface AppProps {}

interface AppState {}

export default class App<AppProps, AppState> extends Component {
  render() {
    return (
      <ConfigProvider 
        theme={{
          token: {
            colorPrimary: '#337ab7',
            colorSuccess: '#3c763d', 
            // infoColor: '#31708f',
            // warningColor: '#8a6d3b',
            colorError: '#a94442'
          }
        }}>
        <ErrorBoundary>
          <Provider store={store}>
            <AppBase>
              <AuthGate required={true}>
                <div
                  className="App Col scrollable"
                  data-k-b-testhook-plugin="organizations"
                >
                  <Main >
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
