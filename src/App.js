import React, { Fragment, PureComponent } from 'react';

// Route
import { withRouter, Route, Switch } from 'react-router'

// Routes
import Index from './routes';
import Demo from './routes/demo';

// Tachyons style
import {
  WHITE_LINK
} from './tachyons';

// HOCs
import { withNotifications } from './react-notification/NotificationHelper';
import withHotkey from './react-hotkeys/HotkeyHelper';

// Components
import TestComponent from './components/TestComponent';
import NotificationComponent from './components/NotificationComponent';
const Hotkey = withHotkey(TestComponent);
const Notifications = withNotifications(NotificationComponent);

class App extends PureComponent {
  render() {
    return (
      <Fragment>
        <div className="fixed w-100 top-0">
          <Notifications containerId='error' render={({ notifications }) => {
                  // Example of a notification queue for global notifications
                  const n = notifications[notifications.length - 1] || null;
                  if (n) {
                    return (
                      <div className="tc pa2 white bg-red">
                        {n.content} &nbsp;
                        {n.id}
                      </div>
                    );
                  }
                  return null;
                }}/>
          <Notifications containerId='header' render={({ notifications, removeNotification }) => {
                  // Example of a notification queue for global notifications
                  const n = notifications[notifications.length - 1] || null;
                  if (n) {
                    // This will trigger a timed removal when rendered
                    // Could this be invoking wierd behaviour?
                    removeNotification('header', n.id, 2000);
                    return (
                      <div className="tc pa2 white bg-green">
                        {n.content} &nbsp;
                        {n.id}
                        {/* When an global notification is triggered, ESC will close before closing the list expand */}
                        <Hotkey keyCode="esc" handler={() => removeNotification('header', n.id)}>
                          <a className={WHITE_LINK + ' f7 ml2'} onClick={() => removeNotification('header', n.id)}>Dismiss (esc)</a>
                        </Hotkey>
                      </div>
                    );
                  }
                  return null;
                }}/>
        </div>
        <div className="measure center">
          <Switch>
            <Route exact path="/" component={Index}/>
            <Route path="/demo" component={Demo}/>
          </Switch>
        </div>
      </Fragment>
    );
  }
}
export default withRouter(App);
