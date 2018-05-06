import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Notifications
import NotificationProvider from './react-notification/NotificationProvider';

ReactDOM.render((
  <NotificationProvider>
    <App />
  </NotificationProvider>
), document.getElementById('root'));
registerServiceWorker();
