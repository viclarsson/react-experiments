import React, { Fragment, PureComponent } from 'react';

// Hotkey
import HotkeyProvider from './react-hotkeys/HotkeyProvider';
import withHotkey from './react-hotkeys/HotkeyHelper';

// Notification
import { withNotifications, NotificationTrigger as Trigger } from './react-notification/NotificationHelper';

// Components
import TestComponent from './components/TestComponent';
import NotificationComponent from './components/NotificationComponent';
const HotkeyComponent = withHotkey(TestComponent);
const Notifications = withNotifications(NotificationComponent);

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(React);
}

class App extends PureComponent {
  constructor (props) {
    super(props);
    // Could be in Redux
    this.state = {
      components: [],
      page: 'index',
      activeIndex: 0,
      expandActive: false
    }

    // Could be Redux Actions
    this.addComponent = this.addComponent.bind(this);
    this.removeComponent = this.removeComponent.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.expand = this.expand.bind(this);
    this.contract = this.contract.bind(this);

    // Notifications
    this.triggerNotification = this.triggerNotification.bind(this);
  }

  next () {
    return (e) => {
      if (this.state.activeIndex === (this.state.components.length - 1)) return;
      e.preventDefault();
      this.setState({
        activeIndex: this.state.activeIndex + 1
      });
    }
  }
  previous (e) {
    return (e) => {
      if (this.state.activeIndex === 0) return;
      e.preventDefault();
      this.setState({
        activeIndex: this.state.activeIndex - 1
      });
    }
  }
  toggleExpand () {
    return (e) => {
      this.setState({
        expandActive: !this.state.expandActive
      });
    }
  }
  expand () {
    return (e) => {
      this.setState({
        expandActive: true
      });
    }
  }
  contract () {
    return (e) => {
      this.setState({
        expandActive: false
      });
    }
  }
  addComponent () {
    const value = Math.random().toString(36).substring(7);
    this.setState({
      components: [...this.state.components, value]
    });
    this.props.registerNotification('top', { content: 'Added ' + value, timeout: 3000 });
  }
  removeActive () {
    return (e) => {
      if (this.state.components.length === 0) return;
      const newArray = this.state.components.filter((v, i) => i !== this.state.activeIndex);
      const removed = this.state.components.filter((v, i) => i === this.state.activeIndex);
      this.setState({
        components: newArray
      });
      this.props.registerNotification('top', { content: 'Removed ' + removed[0], timeout: 3000 });
    }
  }

  removeComponent (value) {
    const newArray = this.state.components.filter(v => v !== value);
    this.setState({
      components: newArray
    });
    this.props.registerNotification('top', { content: 'Removed ' + value, timeout: 3000 });
  }

  triggerNotification (content) {
    return (e) => {
      this.props.registerNotification('header', { content });
    };
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <HotkeyProvider>
          <Notifications containerId='header' render={({ notifications, removeNotification }) => {
              // Example of a notification queue for global notifications
              const n = notifications[notifications.length - 1] || null;
              if (n) {
                // This will trigger a timed removal when rendered
                // Could this be invoking wierd behaviour?
                removeNotification('header', n, 2000);
                return (
                  <div className="fixed tc pa2 w-100 top-0 white bg-green">
                    {n.content} / {n.id} /
                    <a onClick={() => removeNotification('header', n)}>Dismiss</a>
                  </div>
                );
              }
              return null;
            }}/>
        <div className="center measure">
          { this.state.page === 'index' && (
            <Fragment>
              <h1>UI hotkeys</h1>
              <p>
                The idea is to create a system for handling UI hotkeys.
                Hotkeys makes an web application feel modern and responsive,
                but the handling and implementation must be scalable.
              </p>
              <p>
                Common scenarios:
              </p>
              <ul>
                <li>Escape to close</li>
                <li>Enter to proceed</li>
                <li>Custom key binding</li>
              </ul>
              <HotkeyComponent keyCode={39} handler={() => this.setState({ page: 'demo' })}>
                <a className="dib white bg-blue pa2" onClick={() => this.setState({ page: 'demo' })}>
                  Try! (or click right arrow)
                </a>
              </HotkeyComponent>
            </Fragment>
          )}
          { this.state.page === 'demo' && (
            <Fragment>
              <h1>Demo</h1>

              {/* Nagivation with hotkey */}
              <HotkeyComponent keyCode={37} handler={() => this.setState({ page: 'index' })}>
                <a className="blue" onClick={() => this.setState({ page: 'index' })}>
                  Back (or click left arrow)
                </a>
              </HotkeyComponent>

              <div className="fixed right-0 top-0">
                <Notifications containerId='top' render={({ notifications, removeNotification }) => (
                    notifications.map((n, i) => (
                      <div key={n.id} className="pa2 bg-near-white gray">
                        {n.content}
                        <a onClick={() => removeNotification('top', n)}>Dismiss</a>
                      </div>
                    ))
                )}/>
              </div>

              <p>
                <HotkeyComponent keyCode={187} handler={() => this.addComponent()}>
                  <a className="dib white bg-blue pa2" onClick={() => this.addComponent()}>Add component (press +)</a>
                </HotkeyComponent>
              </p>
              <p className="gray f7 tc">(the active index has some bugs when removing/adding. No biggie, out of scope)</p>

              {this.state.components.map((c, i) => (
                <Fragment key={c}>
                  <div className={`pa2 br2 mb2 flex justify-between ${activeIndex === i ? 'bg-gray white' : 'bg-near-white gray'}`}>
                    <div className="flex-auto w-100">
                      Element: {c}
                      {this.state.expandActive && this.state.activeIndex === i && (
                        <div className="f7">
                          {/* Another hotkey for ENTER (13) */}
                          <HotkeyComponent keyCode={13} handler={() => alert(`Surprise! ${c}`)}>
                            <div>Try Enter for surprise!</div>
                          </HotkeyComponent>
                          <div>
                            Expandable dummy which adds a handler for ENTER. As it was mounted later, it gets priority.
                            This makes it possible to use different states to trigger different actions on the same keycode. Such wow.
                            Another example were to be to add a "remove" feature on focus. Just create a state for it and render the
                            HotkeyComponent.
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-none">
                      <a className="dib white bg-red pa1 br2 f7" onClick={() => this.removeComponent(c)}>Remove (Backspace)</a>
                    </div>
                  </div>
                </Fragment>
              ))}

              <Notifications containerId='bottom' render={({ notifications }) => (
                  notifications.map((n, i) => (<div key={n.id}>{n.content}</div>))
              )}/>

              <div className="flex justify-around items-center gray f7">
                {/* Hotkeys for list */}
                <HotkeyComponent keyCode={38} handler={this.previous()} />
                <HotkeyComponent keyCode={40} handler={this.next()} />
                <HotkeyComponent keyCode={8} handler={this.removeActive()} />
                <HotkeyComponent keyCode={84} handler={this.toggleExpand()}>
                  <div>Try T to toggle expand</div>
                </HotkeyComponent>
                <HotkeyComponent keyCode={13} handler={this.expand()}>
                  <div>Try Enter to expand</div>
                </HotkeyComponent>
                <HotkeyComponent keyCode={27} handler={this.contract()}>
                  <div>Try ESC to close again</div>
                </HotkeyComponent>
                <a className="dib white bg-blue pa2" onClick={this.triggerNotification('Hej!')}>
                  Trigger global notification
                </a>
              </div>
            </Fragment>
          )}
        </div>
      </HotkeyProvider>
    );
  }
}

/*
* Connecting notifications globally.
* If using router, each route can connect a "local" notification system.
*/
export default Trigger(App);
