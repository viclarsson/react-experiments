import React from 'react';

// Context
import Context from './NotificationContext';

function NotificationContainer(Component, id) {
  return (props) => {
    return (
      <Context.Consumer>
        {({ notifications, dismiss }) => (
          notifications[id] ?
          <Component {...props} id={id} dismiss={dismiss} notifications={notifications[id]} />
          : 'no data'
        )}
      </Context.Consumer>
    );
  };
}

export default NotificationContainer;
