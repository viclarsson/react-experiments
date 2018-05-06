import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Notifications
import NotificationProvider from './react-notification/NotificationProvider';

// Tour
import TourProvider from './react-tour/TourProvider';

ReactDOM.render((
  <NotificationProvider>
    <TourProvider debug>
      <App />
    </TourProvider>
  </NotificationProvider>
), document.getElementById('root'));
registerServiceWorker();
