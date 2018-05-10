import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Hotkeys
import HotkeyProvider from './react-hotkeys/HotkeyProvider';

// Notifications
import NotificationProvider from './react-notification/NotificationProvider';

// Tour
import TourProvider from './react-tour/TourProvider';

const TOURS = {
  'intro': ['intro-1', 'intro-2', 'intro-3'],
  'second': ['second-1']
};

ReactDOM.render((
  <HotkeyProvider>
    <NotificationProvider>
      <TourProvider tours={TOURS}>
        <App />
      </TourProvider>
    </NotificationProvider>
  </HotkeyProvider>
), document.getElementById('root'));
registerServiceWorker();
