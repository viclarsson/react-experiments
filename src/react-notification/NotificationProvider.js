import React, { Component } from "react";

// Context
import Context from "./NotificationContext";

/*
* Notification data structure
* Send whatever you want, the only taken keys in the object are:
*  - id (A random generated id to keep track of notification)
*  - timeout (If the notification should auto-remove after timeout milliseconds)
*/

class NotificationProvider extends Component {
  constructor(props) {
    super(props);
    this.registerNotification = this.registerNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.createNotificationDestroyer = this.createNotificationDestroyer.bind(
      this
    );
    this.state = {
      registerNotification: this.registerNotification,
      removeNotification: this.removeNotification,
      containers: {}
    };

    if (props.store) {
      this.storeListener = this.storeListener.bind(this);
      this.props.store.subscribe(this.storeListener);
    } else if (props.debug) {
      console.log(
        "TourProvider does not listen to store as props was provided."
      );
    }
    // To be able to register multiple containers on mounts
    this.containers = {};
    this.timeouts = {};
  }

  storeListener() {
    const { store } = this.props;
    const action = store.getState().lastAction;
    if (!action) {
      console.error("NotificationProvider is missing last action reducer!");
      return;
    }
    switch (action.type) {
      case "@@notification/REGISTER":
        this.registerNotification(action.container_id, action.data);
        break;
      case "@@notification/REMOVE":
        this.removeNotification(
          action.container_id,
          action.notification_id,
          action.timeout
        );
        break;
      default:
    }
  }

  createNotificationDestroyer(notificationId, containerId, timeout) {
    if (!this.timeouts[notificationId]) {
      this.timeouts[notificationId] = setTimeout(() => {
        this.removeNotification(containerId, notificationId);
      }, timeout);
    }
  }

  componentWillUnmountMount() {
    Object.keys(this.timeouts).forEach(t => {
      clearTimeout(t);
    });
  }

  // Register handler
  registerNotification(containerId, data) {
    if (this.props.debug)
      console.log("Registered notification:", data, "in", containerId);
    const q = this.containers[containerId]
      ? [...this.containers[containerId]]
      : [];
    const notification = {
      ...data,
      id:
        data.id ||
        "_" +
          Math.random()
            .toString(36)
            .substr(2, 9)
    };
    q.unshift(notification);
    this.containers[containerId] = q;
    this.setState(
      {
        containers: { ...this.containers }
      },
      () => {
        if (notification.timeout) {
          this.createNotificationDestroyer(
            notification.id,
            containerId,
            notification.timeout
          );
        }
      }
    );
  }

  // Remove handler
  removeNotification(containerId, notificationId, timeout = null) {
    if (this.props.debug)
      console.log(
        "Trying to remove notification with id:",
        notificationId,
        "in",
        containerId
      );
    // For delayed removal
    if (timeout) {
      this.createNotificationDestroyer(notificationId, containerId, timeout);
      return;
    }
    let q = this.containers[containerId];
    if (q) {
      q = q.filter(c => c.id !== notificationId);
      // Remove array if no notifications left
      this.containers[containerId] = q.length > 0 ? q : undefined;
      // Remove eventual timeout to not trigger renders
      clearTimeout(this.timeouts[notificationId]);
      this.setState({
        containers: { ...this.containers }
      });
    }
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default NotificationProvider;
