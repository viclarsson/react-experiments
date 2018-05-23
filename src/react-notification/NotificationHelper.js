import React, { Fragment } from "react";

// Context
import Context from "./NotificationContext";

// HOC for simplicity
export function NotificationTrigger(C) {
  const NotificationHelper = ({ props }) => {
    return (
      <Context.Consumer>
        {({ registerNotification, removeNotification }) => {
          return (
            <Fragment>
              <C
                {...props}
                registerNotification={registerNotification}
                removeNotification={removeNotification}
              />
            </Fragment>
          );
        }}
      </Context.Consumer>
    );
  };
  return NotificationHelper;
}

export function withNotifications(C) {
  const NotificationHelper = ({ containerId, ...restProps }) => {
    return (
      <Context.Consumer>
        {({ containers, removeNotification }) => {
          return (
            <C
              {...restProps}
              notifications={containers[containerId]}
              removeNotification={removeNotification}
            />
          );
        }}
      </Context.Consumer>
    );
  };
  return NotificationHelper;
}
