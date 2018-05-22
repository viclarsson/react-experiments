import React, { Fragment, PureComponent } from "react";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Hotkey
import withHotkey from "../react-hotkeys/HotkeyHelper";

// Notification
import { withNotifications } from "../react-notification/NotificationHelper";
import { tourStep, tourController as TC } from "../react-tour/TourHelper";

// Components
import TestComponent from "../components/TestComponent";
import NotificationComponent from "../components/NotificationComponent";
import List from "../components/List";

// Actions
import * as NotificationActions from "../react-notification/NotificationActions";
import { push } from "react-router-redux";

// Tachyons style
import { BLUE_BUTTON, TOUR_ELEMENT, HOTKEY } from "../tachyons";

// Build components
import TourComponent from "../components/TourComponent";
const Hotkey = withHotkey(TestComponent);
const Notifications = withNotifications(NotificationComponent);
const TourStep = tourStep(TourComponent);
const TourController = TC(TourComponent);

class Demo extends PureComponent {
  constructor(props) {
    super(props);

    // Could be in Redux
    this.state = {
      components: [],
      expandActive: false
    };

    // Could be Redux Actions
    this.goToIndex = this.goToIndex.bind(this);
    this.addComponent = this.addComponent.bind(this);
    this.moveToIndex = this.moveToIndex.bind(this);
    this.removeSelected = this.removeSelected.bind(this);

    // Actions
    this.toggleExpand = this.toggleExpand.bind(this);
    this.expand = this.expand.bind(this);
    this.contract = this.contract.bind(this);

    // Test
    this.copy = this.copy.bind(this);
    this.paste = this.paste.bind(this);

    this.clipboard = null;
    this.focusElement = null;

    // Notifications
    this.triggerNotification = this.triggerNotification.bind(this);
  }

  goToIndex() {
    const { push } = this.props;
    return e => {
      push("/");
    };
  }

  moveToIndex(index, selected) {
    const { components } = this.state;
    const componentAtIndex = components[index];
    const selectedItems = components.filter((c, i) => selected[i]);
    const notSelected = components.filter((c, i) => !selected[i]);
    let newIndex = notSelected.indexOf(componentAtIndex);
    if (newIndex < 0) newIndex = index;
    const newArray = [
      ...notSelected.slice(0, index),
      ...selectedItems,
      ...notSelected.slice(index)
    ];
    let newSelected = {};
    for (let i = 0; i < selectedItems.length; i++) {
      newSelected[i + index] = true;
    }
    this.setState({ components: newArray });
    return newSelected;
  }

  toggleExpand() {
    return e => {
      this.setState({
        expandActive: !this.state.expandActive
      });
    };
  }
  expand() {
    return e => {
      this.setState({
        expandActive: true
      });
    };
  }
  contract() {
    return e => {
      this.setState({
        expandActive: false
      });
    };
  }

  addComponent() {
    const value = Math.random()
      .toString(36)
      .substring(7);
    this.setState({
      components: [...this.state.components, value]
    });
    this.props.registerNotification("bottom-right", {
      content: "Added " + value,
      timeout: 3000
    });
  }

  removeSelected(selected) {
    const newArray = this.state.components.filter((v, i) => !selected[i]);
    const diff = this.state.components.length - newArray.length;
    this.setState({
      components: newArray
    });
    this.props.registerNotification("bottom-right", {
      content: "Removed " + diff,
      timeout: 3000
    });
  }

  triggerNotification(content) {
    return e => {
      this.props.registerNotification("header", { content });
    };
  }

  copy(selected) {
    if (this.focusElement === document.activeElement) {
      this.clipboard = { ...selected };
    }
  }

  paste(selected) {
    if (this.focusElement === document.activeElement) {
      const toCopy = this.state.components.filter((c, i) => selected[i]);
      this.setState({
        components: [
          ...this.state.components,
          ...toCopy.map(c => c + " (copy)")
        ]
      });
    }
  }

  render() {
    const { activeIndex, components } = this.state;
    return (
      <Fragment>
        {/* Notifications placed in bottom right corner */}
        <div className="fixed right-0 bottom-0 pa4">
          <Notifications
            containerId="bottom-right"
            render={({ notifications, removeNotification }) =>
              notifications.map((n, i) => (
                <div key={n.id} className="pa2 bg-near-white gray mt1 tr">
                  {n.content}
                  <a
                    className={BLUE_BUTTON + " ml1 f7"}
                    onClick={() => removeNotification("bottom-right", n)}
                  >
                    Dismiss
                  </a>
                </div>
              ))
            }
          />
        </div>

        <h1>Demo</h1>
        <TourStep
          tourId="intro"
          stepId="intro-3"
          render={({ isActive, done }) =>
            isActive ? (
              <div className={TOUR_ELEMENT}>
                Great! You are now in showing the demo! Click or test the
                hotkeys!
                <a
                  className={BLUE_BUTTON}
                  onClick={() => done(() => alert("Tour callback!"))}
                >
                  Done!
                </a>
              </div>
            ) : null
          }
        />

        <TourStep
          tourId="second"
          stepId="second-1"
          render={({ isActive, done }) =>
            isActive ? (
              <div className={TOUR_ELEMENT}>
                You found the other tour! Nice! Neat with hotkeys!
                <a
                  className={BLUE_BUTTON}
                  onClick={() => {
                    done(
                      this.triggerNotification("Done with second tour! Great!")
                    );
                  }}
                >
                  Yay!
                </a>
              </div>
            ) : null
          }
        />

        <div className="flex items-center justify-between">
          {/* Navigation with hotkey where the same functions are called (should be one static defined though) */}
          <Hotkey keyCode="leftarrow" handler={this.goToIndex()}>
            <a className="blue" onClick={this.goToIndex()}>
              Back (or click left arrow)
            </a>
          </Hotkey>
          <Hotkey keyCode="plus" handler={() => this.addComponent()}>
            <a className={BLUE_BUTTON} onClick={() => this.addComponent()}>
              Add component (press +)
            </a>
          </Hotkey>
        </div>

        <List items={this.state.components} expandActive={this.state.expandActive} moveToIndex={this.moveToIndex}/>

        <div className="flex justify-around items-center gray f7">
          {/* Hotkeys for list */}
          <Hotkey keyCode="backspace" handler={() => this.removeSelected()} />
          <Hotkey keyCode="ctrl+c" handler={this.copy} />
          <Hotkey keyCode="ctrl+v" handler={this.paste} />
          {activeIndex >= components.length - 1 && (
            <Hotkey keyCode="tab" handler={() => this.addComponent()}>
              TAB to add
            </Hotkey>
          )}

          {/* Hotkeys with explanation */}
          <Hotkey keyCode="t" handler={this.toggleExpand()}>
            <div className="mr2">
              Try <span className={HOTKEY}>T</span> to toggle expand
            </div>
          </Hotkey>
          <Hotkey keyCode="enter" handler={this.expand()}>
            <div className="mr2">
              Try <span className={HOTKEY}>Enter</span> to expand
            </div>
          </Hotkey>
          <Hotkey keyCode="esc" handler={this.contract()}>
            <div className="mr2">
              Try <span className={HOTKEY}>ESC</span> to close again
            </div>
          </Hotkey>
          <TourController
            render={({ start }) => (
              <Hotkey keyCode="ctrl+alt+t" handler={() => start("second")}>
                <div className="ml2">
                  Try <span className={HOTKEY}>ctrl + alt + t</span> to start
                  another tour!
                </div>
              </Hotkey>
            )}
          />
        </div>

        <div className="tc f7 mt2">
          <Hotkey
            keyCode="g"
            handler={this.triggerNotification(
              "Global notification (from hotkey)!"
            )}
          >
            <a
              className={BLUE_BUTTON}
              onClick={this.triggerNotification("Global notification!")}
            >
              Trigger global notification{" "}
              <span className={HOTKEY + " white b--white"}>G</span>
            </a>
          </Hotkey>
        </div>
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      registerNotification: NotificationActions.registerNotification,
      push
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(Demo);
