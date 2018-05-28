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

// Popovers
import Trigger from "../components/Popover/Trigger";
import Popover from "../components/Popover/Popover";
import { PopoverReference } from "../react-popover/PopoverHelper";

// Components
import FileHandler from "../components/Upload/FileHandler";
import Feature from "../components/Feature";
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
      dispatch(push("/demo?modal=demo"));
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

  render() {
    return (
      <Fragment>
        <h1>UI Hygiene</h1>
        <p>
          The idea is to create a system for handling hotkeys, notifications,
          tours and a drag and drop system. All components provide a simple but
          customizable and powerful usage.
        </p>
        <Trigger id="demo-popover" asReference>
          <a>Trigger popover</a>
        </Trigger>
        <Popover
          id="demo-popover"
          placement="left"
          className="mr2"
          hideArrow
          arrowClasses="b--washed-green"
          override={true}
          render={({ show }) =>
            show && (
              <div className="pa2 br2 bg-washed-green green">
                I'm a small annotation with no arrow.
              </div>
            )
          }
        />

        <Trigger id="demo-popover-2" triggerToggles>
          <a>Trigger popover 2 (toggles)</a>
        </Trigger>

        <Popover
          placement="top"
          className="mb2"
          arrowClasses="b--red"
          id="demo-popover-2"
          render={({ show }) =>
            show && <div className="pa2 br2 bg-red white">Popover!</div>
          }
        />
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
          <PopoverReference id="demo-popover-2" component="li">
            The tour system as also state based where the steps are mounted when
            the step is active, which makes it scalable.
          </PopoverReference>
          <TourStep
          tourId="intro"
          stepId="intro-1"
          render={({ isActive, next, previous, done }) => (
            <Feature show={isActive} className="pa4 br2">
            <li>
              The drag and drop system makes it easy to create actions based on
              prop callbacks in order to keep the React way of doing things.
              {isActive && (
                    <a className={BLUE_BUTTON} onClick={() => next()}>
                I get it!
              </a>
              )}
            </li>
          </Feature>
          )} />

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
                <Popover
                  placement="left"
                  override={true}
                  className="mr2"
                  arrowClasses="b--red"
                  id="tour-popover"
                  render={({ show }) =>
                    show && (
                      <div className="pa2 br2 bg-red white">
                        The second will appear here!
                      </div>
                    )
                  }
                />
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

        <FileHandler accept={["image/jpeg"]} multiple={true} />

        <p>Open the console and inspect the actions, state and DOM.</p>

        <TourController
          render={({ next, activeStepId }) => (
            <PopoverReference id="tour-popover">
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
            </PopoverReference>
          )}
        />
        <TourStep
          tourId="intro"
          stepId="intro-2"
          render={({ isActive, next }) =>
            isActive ? (
              <div className={TOUR_ELEMENT}>
                <Hotkey
                  keyCode="rightarrow"
                  handler={this.goToDemo(next, "intro-2")}
                >
                  Click above to start (or right arrow)!
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
