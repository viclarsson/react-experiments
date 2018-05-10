import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

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
const defaultState = { data: 'We have data!' };
const reducer = (state = {}, action) => {
  console.log('Action': action);
  switch (action.type) {
    default:
      return state
  }
};
const store = createStore(
  reducer,
  defaultState,
  composeWithDevTools(applyMiddleware(thunk))
);

// Render the app
ReactDOM.render((
  <Provider store={store}>
    <HotkeyProvider>
      <NotificationProvider>
        <TourProvider tours={TOURS}>
          <App />
        </TourProvider>
      </NotificationProvider>
    </HotkeyProvider>
  </Provider>
), document.getElementById('root'));
registerServiceWorker();
