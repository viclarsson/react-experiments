import React, { Fragment, PureComponent } from 'react';

// Redux
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

// Hotkey
import withHotkey from '../react-hotkeys/HotkeyHelper';

// Notification
import { withNotifications, NotificationTrigger as Trigger } from '../react-notification/NotificationHelper';
import { tourStep, tourController as TC } from '../react-tour/TourHelper';

// Components
import TestComponent from '../components/TestComponent';
import NotificationComponent from '../components/NotificationComponent';

// Tachyons style
import {
  BLUE_BUTTON,
  TOUR_ELEMENT,
  HOTKEY
} from '../tachyons';

// Build components
import TourComponent from '../components/TourComponent';
const HotkeyComponent = withHotkey(TestComponent);
const Notifications = withNotifications(NotificationComponent);
const TourStep = tourStep(TourComponent);
const TourController = TC(TourComponent);

class Demo extends PureComponent {
  constructor (props) {
    super(props);
    // Could be in Redux
    this.state = {
      components: [],
      activeIndex: 0,
      expandActive: false
    }

    // Could be Redux Actions
    this.goToIndex = this.goToIndex.bind(this);
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

  goToIndex () {
    const { dispatch } = this.props;
    return (e) => {
      dispatch(push('/'));
    }
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
    this.props.registerNotification('bottom-right', { content: 'Added ' + value, timeout: 3000 });
  }
  removeActive () {
    return (e) => {
      if (this.state.components.length === 0) return;
      const newArray = this.state.components.filter((v, i) => i !== this.state.activeIndex);
      const removed = this.state.components.filter((v, i) => i === this.state.activeIndex);
      this.setState({
        components: newArray
      });
      this.props.registerNotification('bottom-right', { content: 'Removed ' + removed[0], timeout: 3000 });
    }
  }

  removeComponent (value) {
    const newArray = this.state.components.filter(v => v !== value);
    this.setState({
      components: newArray
    });
    this.props.registerNotification('bottom-right', { content: 'Removed ' + value, timeout: 3000 });
  }

  triggerNotification (content) {
    return (e) => {
      this.props.registerNotification('header', { content });
    };
  }

  render() {
    const { activeIndex, components } = this.state;
    return (
      <Fragment>
        {/* Notifications placed in bottom right corner */}
        <div className="fixed right-0 bottom-0 pa4">
          <Notifications containerId='bottom-right' render={({ notifications, removeNotification }) => (
              notifications.map((n, i) => (
                <div key={n.id} className="pa2 bg-near-white gray mt1 tr">
                  {n.content}
                  <a className={BLUE_BUTTON + ' ml1 f7'} onClick={() => removeNotification('bottom-right', n)}>Dismiss</a>
                </div>
              ))
          )}/>
        </div>

        <h1>Demo</h1>
          <TourStep tourId="intro" stepId="intro-3" render={
            ({ isActive, done }) => isActive ? (
              <div className={TOUR_ELEMENT}>
                Great! You are now in showing the demo! Click or test the hotkeys!
                <a className={BLUE_BUTTON} onClick={() => done(() => alert('Tour callback!'))}>
                  Done!
                </a>
              </div>
            ) : null}/>

          <TourStep tourId="second" stepId="second-1" render={
              ({ isActive, done }) => isActive ? (
                <div className={TOUR_ELEMENT}>
                  You found the other tour! Nice! Neat with hotkeys!
                  <a className={BLUE_BUTTON} onClick={() => {
                      done(() => {
                        // Function call due to curry,
                        this.triggerNotification('Done with second tour! Great!')();
                      });
                  }}>
                    Yay!
                  </a>
                </div>
              ) : null}/>

        <div className="flex items-center justify-between">
          {/* Navigation with hotkey where the same functions are called (should be one static defined though) */}
          <HotkeyComponent keyCode="leftarrow" handler={this.goToIndex()}>
            <a className="blue" onClick={this.goToIndex()}>
              Back (or click left arrow)
            </a>
          </HotkeyComponent>
          <HotkeyComponent keyCode="plus" handler={() => this.addComponent()}>
            <a className={BLUE_BUTTON} onClick={() => this.addComponent()}>Add component (press +)</a>
          </HotkeyComponent>
        </div>

        <div className="mv2">
          {this.state.components.length === 0 && (
            <div className="pv2 tc f7 gray">No posts.</div>
          )}
          {this.state.components.map((c, i) => (
            <Fragment key={c}>
              <div className={`pa2 br2 mb2 flex justify-between ${activeIndex === i ? 'bg-gray white' : 'bg-near-white gray'}`}>
                <div className="flex-auto w-100">
                  Element: {c}
                  {this.state.expandActive && this.state.activeIndex === i && (
                    <div className="f7">
                      {/* Another hotkey for ENTER (13) */}
                      <HotkeyComponent keyCode="enter" handler={() => alert(`Surprise! ${c}`)}>
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
        </div>

        <div className="flex justify-around items-center gray f7">
          {/* Hotkeys for list */}
          <HotkeyComponent keyCode="uparrow" handler={this.previous()} />
          <HotkeyComponent keyCode="downarrow" handler={this.next()} />
          <HotkeyComponent keyCode="backspace" handler={this.removeActive()} />
          {activeIndex >= (components.length - 1) && (
            <HotkeyComponent keyCode="tab" handler={() => this.addComponent()}>
              TAB to add
            </HotkeyComponent>
          )}

          {/* Hotkeys with explanation */}
          <HotkeyComponent keyCode="t" handler={this.toggleExpand()}>
            <div className="mr2">Try <span className={HOTKEY}>T</span> to toggle expand</div>
          </HotkeyComponent>
          <HotkeyComponent keyCode="enter" handler={this.expand()}>
            <div className="mr2">Try <span className={HOTKEY}>Enter</span> to expand</div>
          </HotkeyComponent>
          <HotkeyComponent keyCode="esc" handler={this.contract()}>
            <div className="mr2">Try <span className={HOTKEY}>ESC</span> to close again</div>
          </HotkeyComponent>
          <TourController render={({ start }) => (
            <HotkeyComponent keyCode="ctrl+alt+t" handler={() => start('second')}>
              <div className="ml2">Try <span className={HOTKEY}>alt + T</span> to start another tour!</div>
            </HotkeyComponent>
          )} />
        </div>

        <div className="tc f7 mt2">
          <HotkeyComponent keyCode="g" handler={this.triggerNotification('Global notification (from hotkey)!')}>
            <a className={BLUE_BUTTON} onClick={this.triggerNotification('Global notification!')}>
              Trigger global notification <span className={HOTKEY + ' white b--white'}>G</span>
            </a>
          </HotkeyComponent>
        </div>
      </Fragment>
    );
  }
}

export default Trigger(connect()(Demo));
