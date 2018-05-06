import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Notifications
import NotificationProvider from './react-notification/NotificationProvider';

// Tour
import TourProvider from './react-tour/TourProvider';

const TOURS = {
  'intro': ['intro-1', 'intro-2', 'intro-3'],
  'second': ['second-1', 'second-2', 'second-3']
};

ReactDOM.render((
  <NotificationProvider>
    <TourProvider debug tours={TOURS}>
      <App />
    </TourProvider>
  </NotificationProvider>
), document.getElementById('root'));
registerServiceWorker();
