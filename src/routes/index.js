import React, { Fragment, PureComponent } from 'react';

// Redux
import { connect } from 'react-redux';

// Hotkey
import withHotkey from '../react-hotkeys/HotkeyHelper';

// Tour
import { tourStep, tourController as TC } from '../react-tour/TourHelper';
import { start } from '../react-tour/TourActions';

// Notification
import { registerNotification } from '../react-notification/NotificationActions';

// Components
import TestComponent from '../components/TestComponent';
import TourComponent from '../components/TourComponent';
import { push } from 'react-router-redux';


// Tachyons style
import {
  BLUE_BUTTON,
  TOUR_ELEMENT
} from '../tachyons';

const Hotkey = withHotkey(TestComponent);
const TourStep = tourStep(TourComponent);
const TourController = TC(TourComponent);

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.goToDemo = this.goToDemo.bind(this);
    this.startTour = this.startTour.bind(this);
  }

  goToDemo (next, activeStepId) {
    const { dispatch } = this.props;
    return (e) => {
      console.log(activeStepId);
      if (activeStepId === 'intro-2') next();
      dispatch(registerNotification('header', { content: 'Went to demo using actions!' }));
      dispatch(push('/demo'));
    }
  }

  startTour () {
    const { dispatch } = this.props;
    return () => dispatch(start('intro', () => console.log('Start callback for tracking for example!')))
  }

  render () {
    return (
      <Fragment>
        <h1>UI hotkeys</h1>
        <p>
          The idea is to create a system for handling UI hotkeys.
          Hotkeys makes an web application feel modern and responsive,
          but the handling and implementation must be scalable.
        </p>

        <Hotkey keyCode="s" handler={this.startTour()}>
          <a className={BLUE_BUTTON} onClick={this.startTour}>
            Start intro tour!
          </a>
        </Hotkey>

        <TourStep tourId="intro" stepId="intro-1" render={
          ({ isActive, next, previous, done }) => isActive ? (
            <div className={TOUR_ELEMENT}>
              This is the first step!
              <Hotkey keyCode="enter" handler={() => next()}>
                <a className={BLUE_BUTTON} onClick={() => next()}>
                  Next
                </a>
              </Hotkey>
              <Hotkey keyCode="esc" handler={() => done()}>
                <a className={BLUE_BUTTON} onClick={() => done()}>
                  Skip (esc)
                </a>
              </Hotkey>
            </div>
          ) : null}/>
        <p>
          Common scenarios:
        </p>
        <ul>
          <li>Escape to close</li>
          <li>Enter to proceed</li>
          <li>Custom key binding</li>
        </ul>

        <TourController render={({ next, activeStepId }) => (
          <Hotkey keyCode="rightarrow" handler={this.goToDemo(next, activeStepId)}>
            <a className={BLUE_BUTTON} onClick={this.goToDemo(next, activeStepId)}>
              Try! (or click right arrow)
            </a>
          </Hotkey>
        )} />
        <TourStep tourId="intro" stepId="intro-2" render={
          ({ isActive, next }) => isActive ? (
            <div className={TOUR_ELEMENT}>
              <Hotkey keyCode="enter" handler={this.goToDemo(next, 'intro-2')}>
                Click above to start (or enter)!
              </Hotkey>
            </div>
          ) : null}/>
      </Fragment>
    );
  }
}

export default connect()(Index);
