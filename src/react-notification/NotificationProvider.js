import React, { Component } from 'react';

// Context
import Context from './NotificationContext';

/*
* Notification data structure
* Send whatever you want, the only taken keys in the object are:
*  - id (A random generated id to keep track of notification)
*  - timeout (If the notification should auto-remove after timeout milliseconds)
*/

class NotificationProvider extends Component {
  constructor (props) {
    super(props);
    this.registerNotification = this.registerNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.createNotificationDestroyer = this.createNotificationDestroyer.bind(this);
    this.state = {
      registerNotification: this.registerNotification,
      removeNotification: this.removeNotification,
      containers: {}
    };
    // To be able to register multiple containers on mounts
    this.containers = {};
    this.timeouts = {};
  }

  createNotificationDestroyer (notification, containerId, timeout) {
    if(!this.timeouts[notification.id]) {
      this.timeouts[notification.id] = setTimeout(() => {
        this.removeNotification(containerId, notification);
      }, timeout);
    }
  }

  componentWillUnmountMount () {
    Object.keys(this.timeouts).forEach(t => {
      clearTimeout(t);
    });
  }

  // Register handler
  registerNotification (containerId, data) {
    if (this.props.debug) console.log('Registered notification:', data, 'in', containerId);
    const q = this.containers[containerId] ? [...this.containers[containerId]] : [];
    const notification = {
      ...data,
      id: '_' + Math.random().toString(36).substr(2, 9)
    };
    q.unshift(notification);
    this.containers[containerId] = q;
    this.setState({
      containers: { ...this.containers }
    }, () => {
      if (notification.timeout) {
        this.createNotificationDestroyer(notification, containerId, notification.timeout);
      }
    });
  };

  // Remove handler
  removeNotification (containerId, notification, timeout = null) {
    if (this.props.debug) console.log('Removed notification:', notification, 'in', containerId);
    // For delayed removal
    if (timeout) {
      this.createNotificationDestroyer(notification, containerId, timeout);
      return;
    }
    let q = this.containers[containerId];
    if (q) {
      q = q.filter(c => c !== notification);
      // Remove array if no notifications left
      this.containers[containerId] = q.length > 0 ? q : undefined;
      // Remove eventual timeout to not trigger renders
      clearTimeout(this.timeouts[notification.id]);
      this.setState({
        containers: { ...this.containers }
      });
    }
  }

  render () {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default NotificationProvider;
