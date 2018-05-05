import React, { Component } from 'react';
import './App.css';

// Notifications
import NotificationProvider from './Notification/NotificationProvider';
import GlobalNotifications from './GlobalNotifications';
import FooterNotifications from './FooterNotifications';

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(React);
}

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      notifications: {
        global: [],
        footer: []
      },
      counter: 0
    }

    this.dismiss = this.dismiss.bind(this);
    this.push = this.push.bind(this);
  }

  // Mock action
  dismiss (containerId, id) {
    this.setState({
      notifications: {
        ...this.state.notifications,
        [containerId]: this.state.notifications[containerId].filter((data, i) => data.id !== id)
      }
    });
  }

  // Mock Action
  push (containerId, data) {
    const array = this.state.notifications[containerId] || [];
    this.setState({
      notifications: {
        ...this.state.notifications,
        [containerId]: [...array, data]
      },
      counter: this.state.counter + 1
    }, () => {
      // This would be nice if it were to be handled automatically
      // If redux, solve with middleware?
      if (data.timeout) {
        setTimeout(() => {
          this.dismiss(containerId, data.id);
        }, data.timeout);
      }
    });
  }

  render() {
    return (
      <div className="App debug">
        {/* This Component should be connected to Redux */}
        <NotificationProvider notifications={this.state.notifications} dismiss={this.dismiss}>
          <div className="center measure-wide">
            <h1>Notifications</h1>
            <a href="#" className="dib bg-blue white pa2 br2" onClick={() => this.push('global', { id: this.state.counter, timeout: 3000, data: { title: 'Hej' } })}>Trigger Global Notification</a>
            <a href="#" className="dib ml2 bg-green white pa2 br2" onClick={() => this.push('footer', { id: this.state.counter, timeout: 3000, data: { title: 'Hej' } })}>Trigger Footer Notification</a>
            <div className="pt2 mt2 bt b--gray">
              <FooterNotifications/>
            </div>
          </div>
          <div className="fixed top-0 tc w-100">
            <GlobalNotifications/>
          </div>
        </NotificationProvider>
      </div>
    );
  }
}

export default App;
