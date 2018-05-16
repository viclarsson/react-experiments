import React, { Fragment, PureComponent } from "react";

// Redux
import { connect } from "react-redux";

// Hotkey
import withHotkey from "../react-hotkeys/HotkeyHelper";

// Tour
import { tourStep, tourController as TC } from "../react-tour/TourHelper";
import { start } from "../react-tour/TourActions";

// Notification
import { registerNotification } from "../react-notification/NotificationActions";

// Components
import Droppable from "../react-dnd/Droppable";
import Draggable from "../react-dnd/Draggable";
import TestComponent from "../components/TestComponent";
import TourComponent from "../components/TourComponent";
import { push } from "react-router-redux";

// Tachyons styles
import { BLUE_BUTTON, TOUR_ELEMENT } from "../tachyons";

const Hotkey = withHotkey(TestComponent);
const TourStep = tourStep(TourComponent);
const TourController = TC(TourComponent);

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.goToDemo = this.goToDemo.bind(this);
    this.startTour = this.startTour.bind(this);

    this.onDrop = this.onDrop.bind(this);
    this.canDrop = this.canDrop.bind(this);
  }

  goToDemo(next, activeStepId) {
    const { dispatch } = this.props;
    return e => {
      if (activeStepId === "intro-2") next();
      dispatch(
        registerNotification("header", {
          content: "Went to demo using actions!"
        })
      );
      dispatch(push("/demo"));
    };
  }

  startTour() {
    const { dispatch } = this.props;
    dispatch(
      start("intro", () =>
        console.log("Start callback for tracking for example!")
      )
    );
  }

  canDrop (monitor) {
    console.log(monitor.getItem());
    return 'Lal';
  }

  onDrop (monitor, component) {
    console.log('Drop!', monitor.getItem());
  }

  render() {
    return (
      <Fragment>
        <h1>UI Hygiene</h1>
        <p>
          The idea is to create a system for handling hotkeys, notifications and
          a tour system.
        </p>
        <ul>
          <li>
            The hotkeys are declarative and the order of execution is dependent
            on the order of mounting.
          </li>
          <li>
            The notification system is build with flexibility in mind.
            Notification containers are defined and their behaviour and style
            can be customized easily.
          </li>
          <li>
            The tour system as also state based where the steps are mounted when
            the step is active, which makes it scalable.
          </li>
        </ul>

        <Hotkey keyCode="s" handler={this.startTour}>
          <a className={BLUE_BUTTON} onClick={this.startTour}>
            Start intro tour! (S)
          </a>
        </Hotkey>

        <TourStep
          tourId="intro"
          stepId="intro-1"
          render={({ isActive, next, previous, done }) =>
            isActive ? (
              <div className={TOUR_ELEMENT}>
                This is the first step!
                <Hotkey keyCode="enter" handler={() => next()}>
                  <a className={BLUE_BUTTON} onClick={() => next()}>
                    Next (enter)
                  </a>
                </Hotkey>
                <Hotkey keyCode="esc" handler={() => done()}>
                  <a className={BLUE_BUTTON} onClick={() => done()}>
                    Skip (esc)
                  </a>
                </Hotkey>
              </div>
            ) : null
          }
        />

        <p>
          Almost all features in this demo has a hotkey and feedback using
          notifications.
        </p>

        <p>
          All systems are based on pure React, but are easy to hook up to Redux
          by providing the store as prop to the respective provider and adding a{" "}
          <code>lastAction</code> module to the state. The demo uses the React
          Router.
        </p>

        <p>Open the console and inspect the actions, state and DOM.</p>

          <Draggable
            onBeginDrag={(monitor, component) => {
              console.log("Begin drag", monitor, component);
              return { data: 'Hello!' };
            }}
            render={props => {
              return <div className="bg-blue">{JSON.stringify(props)}</div>;
            }}
          />

        <Droppable
          canDrop={this.canDrop}
          onDrop={this.onDrop}
          render={props => {
            return (
              <div
                className="w-100 bg-silver overflow-scroll"
                style={{ height: "400px" }}
              >
                {JSON.stringify(props)}
                <div className="w-100 bg-blue" style={{ height: "500px" }} />
                HI!
              </div>
            );
          }}
        />

        <TourController
          render={({ next, activeStepId }) => (
            <Hotkey
              keyCode="rightarrow"
              handler={this.goToDemo(next, activeStepId)}
            >
              <a
                className={BLUE_BUTTON}
                onClick={this.goToDemo(next, activeStepId)}
              >
                Try! (or click right arrow)
              </a>
            </Hotkey>
          )}
        />
        <TourStep
          tourId="intro"
          stepId="intro-2"
          render={({ isActive, next }) =>
            isActive ? (
              <div className={TOUR_ELEMENT}>
                <Hotkey
                  keyCode="enter"
                  handler={this.goToDemo(next, "intro-2")}
                >
                  Click above to start (or enter)!
                </Hotkey>
              </div>
            ) : null
          }
        />

        <i className="db mt2 gray">Try disabling internet access!</i>
      </Fragment>
    );
  }
}

export default connect()(Index);
