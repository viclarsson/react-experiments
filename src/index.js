import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

// Router
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware as rMiddleware } from 'react-router-redux';

// App
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// Providers
import HotkeyProvider from './react-hotkeys/HotkeyProvider';
import NotificationProvider from './react-notification/NotificationProvider';
import TourProvider from './react-tour/TourProvider';
const TOURS = {
  'intro': ['intro-1', 'intro-2', 'intro-3'],
  'second': ['second-1']
};

// Redux
const history = createHistory();
const routerMiddleware = rMiddleware(history);

const defaultState = { data: 'We have data!' };
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
    return state
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
  composeWithDevTools(
    applyMiddleware(
      thunk,
      routerMiddleware
    )
  )
);

// Development helper
if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  // Excluded Switch and App due to needed re-renders
  whyDidYouUpdate(React, { exclude: ['Switch', 'App'] });
}

// Render the app
ReactDOM.render((
  <Provider store={store}>
    <HotkeyProvider>
      <NotificationProvider store={store}>
        <TourProvider tours={TOURS} store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </TourProvider>
      </NotificationProvider>
    </HotkeyProvider>
  </Provider>
), document.getElementById('root'));
registerServiceWorker();
