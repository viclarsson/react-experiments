import React, { Fragment, PureComponent } from 'react';

// Redux
import { connect } from 'react-redux';

// Hotkey
import withHotkey from '../react-hotkeys/HotkeyHelper';

// Tour
import { tourStep, tourController as TC } from '../react-tour/TourHelper';

// Components
import TestComponent from '../components/TestComponent';
import TourComponent from '../components/TourComponent';
import { push } from 'react-router-redux';


// Tachyons style
import {
  BLUE_BUTTON,
  TOUR_ELEMENT
} from '../tachyons';

const HotkeyComponent = withHotkey(TestComponent);
const TourStep = tourStep(TourComponent);
const TourController = TC(TourComponent);

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.goToDemo = this.goToDemo.bind(this);
  }

  goToDemo (next, activeStepId) {
    const { dispatch } = this.props;
    return (e) => {
      if (activeStepId === 'intro-2') next();
      dispatch(push('/demo'));
    }
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
        <TourController render={({ start }) => (
          <a className={BLUE_BUTTON} onClick={() => start('intro', () => alert('Start callback for tracking for example!'))}>
            Start intro tour!
          </a>
        )} />

        <TourStep tourId="intro" stepId="intro-1" render={
          ({ isActive, next, previous }) => isActive ? (
            <div className={TOUR_ELEMENT}>
              This is the first step!
              <a className={BLUE_BUTTON} onClick={() => next()}>
                Next
              </a>
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
          <HotkeyComponent keyCode="rightarrow" handler={this.goToDemo(next, activeStepId)}>
            <a className={BLUE_BUTTON} onClick={this.goToDemo(next, activeStepId)}>
              Try! (or click right arrow)
            </a>
          </HotkeyComponent>
        )} />
        <TourStep tourId="intro" stepId="intro-2" render={
          ({ isActive, next }) => isActive ? (
            <div className={TOUR_ELEMENT}>
              Click above to start!
            </div>
          ) : null}/>
      </Fragment>
    );
  }
}

export default connect()(Index);
