import React, { Fragment, Component } from 'react';

// Route
import { Route, Switch } from 'react-router'

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
import StateComponent from './components/StateComponent';
import TestComponent from './components/TestComponent';
import NotificationComponent from './components/NotificationComponent';
const HotkeyComponent = withHotkey(TestComponent);
const Notifications = withNotifications(NotificationComponent);

class App extends Component {
  render() {
    return (
      <Fragment>
        <Notifications containerId='header' render={({ notifications, removeNotification }) => {
                // Example of a notification queue for global notifications
                const n = notifications[notifications.length - 1] || null;
                if (n) {
                  // This will trigger a timed removal when rendered
                  // Could this be invoking wierd behaviour?
                  removeNotification('header', n.id, 2000);
                  return (
                    <div className="fixed tc pa2 w-100 top-0 white bg-green">
                      {n.content} &nbsp;
                      {n.id}
                      {/* When an global notification is triggered, ESC will close before closing the list expand */}
                      <HotkeyComponent keyCode="esc" handler={() => removeNotification('header', n.id)}>
                        <a className={WHITE_LINK + ' f7 ml2'} onClick={() => removeNotification('header', n.id)}>Dismiss</a>
                      </HotkeyComponent>
                    </div>
                  );
                }
                return null;
              }}/>
        <div className="measure center">
          <Switch>
            <Route exact path="/" component={Index}/>
            <Route path="/demo" component={Demo}/>
          </Switch>
          <pre className="silver mt2 f7">
            <StateComponent />
          </pre>
        </div>
      </Fragment>
    );
  }
}
export default App;
