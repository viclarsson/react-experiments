// @flow

import * as React from "react";
import ReactDOM from "react-dom";

// Redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

// Router
import createHistory from "history/createBrowserHistory";
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware as rMiddleware
} from "react-router-redux";

// App
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

// Components
import Network from "./components/Network";

// Providers
import PopoverProvider from "./react-popover/PopoverProvider";
import ModalProvider from "./react-modal/ModalProvider";
import DndProvider from "./react-dnd/DndProvider";
import HotkeyProvider from "./react-hotkeys/HotkeyProvider";
import NotificationProvider from "./react-notification/NotificationProvider";
import TourProvider from "./react-tour/TourProvider";
const TOURS = {
  intro: ["intro-1", "intro-2", "intro-3", "intro-4"],
  second: ["second-1"]
};

// Redux
const history = createHistory({
  basename: `${process.env.PUBLIC_URL || ""}/`
});
const routerMiddleware = rMiddleware(history);

const defaultState = { data: "We have data!" };
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Helper reducer for Providers to listen to
const lastAction = (state = null, action) => {
  return action;
};
const store = createStore(
  combineReducers({
    lastAction,
    reducer,
    router: routerReducer
  }),
  composeWithDevTools(applyMiddleware(thunk, routerMiddleware))
);

// Development helper
if (process.env.NODE_ENV !== "production") {
  const { whyDidYouUpdate } = require("why-did-you-update");
  // Excluded Router Switch that needs re-render
  whyDidYouUpdate(React, { exclude: ["Switch"] });
}

// Render the app
ReactDOM.render(
  <Provider store={store}>
    <ModalProvider store={store} debug>
      <PopoverProvider debug>
        <DndProvider debug>
          <HotkeyProvider debug>
            <NotificationProvider store={store} debug>
              <TourProvider tours={TOURS} store={store} debug>
                <Network />
                <ConnectedRouter history={history}>
                  <App />
                </ConnectedRouter>
              </TourProvider>
            </NotificationProvider>
          </HotkeyProvider>
        </DndProvider>
      </PopoverProvider>
    </ModalProvider>
  </Provider>,
  (document.getElementById("root"): any)
);
registerServiceWorker();
