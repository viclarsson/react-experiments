import React, { Component } from 'react';

// Context
import Context from './NotificationContext';

class NotificationProvider extends Component {
  constructor (props) {
    super(props);
    this.registerNotification = this.registerNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
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
    clearTimeout(this.timeouts[notification.id]);
    this.timeouts[notification.id] = setTimeout(() => {
      this.removeNotification(containerId, notification);
    }, timeout);
  }

  componentWillUnmountMount () {
    Object.keys(this.timeouts).forEach(t => {
      clearTimeout(t);
    });
  }

  // As the register and remove containers does not update,
  // but must be provided to consumer
  shouldComponentUpdate (nextProps, nextState) {
    if (
      this.props.children !== nextProps.children ||
      this.state.containers !== nextState.containers
    ) {
      return true;
    }
    return false;
  }

  // Register handler
  registerNotification (containerId, data) {
    if (this.props.debug) console.log('Registered notification:', data, 'in', containerId);
    const q = this.containers[containerId] || [];
    const notification = {
      ...data,
      id: '_' + Math.random().toString(36).substr(2, 9)
    };
    q.unshift(notification);
    this.containers[containerId] = q;
    this.setState({
      containers: {...this.containers}
    }, () => {
      if (notification.timeout) {
        this.createNotificationDestroyer(notification, containerId, notification.timeout);
      }
    });
  };

  // Remove handler
  removeNotification (containerId, notification) {
    if (this.props.debug) console.log('Removed notification:', notification, 'in', containerId);
    let q = this.containers[containerId];
    if (q) {
      q = q.filter(c => c !== notification);
      this.containers[containerId] = q.length > 0 ? q : undefined;
      this.setState({
        containers: {...this.containers}
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
