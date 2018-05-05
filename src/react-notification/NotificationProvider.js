import React, { Component } from 'react';

// Context
import Context from './NotificationContext';

class NotificationProvider extends Component {
  render () {
    return (
      <Context.Provider value={this.props}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default NotificationProvider;
