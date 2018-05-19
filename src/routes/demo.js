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
import Draggable from "../react-dnd/Draggable";
import Droppable from "../react-dnd/Droppable";

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
      activeIndex: 0,
      expandActive: false,
      selected: {},
      selectMode: null
    };

    // Could be Redux Actions
    this.goToIndex = this.goToIndex.bind(this);
    this.addComponent = this.addComponent.bind(this);
    this.removeSelected = this.removeSelected.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.expand = this.expand.bind(this);
    this.contract = this.contract.bind(this);
    this.setSelectMode = this.setSelectMode.bind(this);
    this.copy = this.copy.bind(this);
    this.paste = this.paste.bind(this);
    this.moveSelected = this.moveSelected.bind(this);

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

  next() {
    return e => {
      if (this.state.activeIndex === this.state.components.length - 1) return;
      e.preventDefault();
      const index = this.state.activeIndex + 1;
      const selected = { [index]: true };
      this.setState({
        activeIndex: index,
        selected
      });
    };
  }
  previous(e) {
    return e => {
      if (this.state.activeIndex === 0) return;
      e.preventDefault();
      const index = this.state.activeIndex - 1;
      const selected = { [index]: true };
      this.setState({
        activeIndex: index,
        selected
      });
    };
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
      components: [...this.state.components, value],
      activeIndex: this.state.components.length
    });
    this.props.registerNotification("bottom-right", {
      content: "Added " + value,
      timeout: 3000
    });
  }
  removeSelected() {
    const newArray = this.state.components.filter(
      (v, i) => !this.state.selected[i]
    );
    const diff = this.state.components.length - newArray.length;
    this.setState({
      components: newArray,
      selected: {}
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

  copy() {
    if (this.focusElement === document.activeElement) {
      this.clipboard = { ...this.state.selected };
    }
  }

  paste() {
    if (this.focusElement === document.activeElement) {
      const toCopy = this.state.components.filter(
        (c, i) => this.state.selected[i]
      );
      this.setState({
        components: [
          ...this.state.components,
          ...toCopy.map(c => c + " (copy)")
        ],
        selected: {}
      });
    }
  }

  setSelectMode(mode) {
    return e => {
      this.setState({ selectMode: mode });
    };
  }

  moveSelected(index) {
    const { selected, components } = this.state;
    const itemAtIndex = components[index];
    const selectedItems = components.filter((c, i) => selected[i]);
    const notSelected = components.filter((c, i) => !selected[i]);
    let newIndex = notSelected.indexOf(itemAtIndex);
    if (newIndex < 0) newIndex = index;
    const newArray = [
      ...notSelected.slice(0, index),
      ...selectedItems,
      ...notSelected.slice(index)
    ];
    let newSelected = {};
    for (let i = 0; i < selectedItems.length; i++)
      newSelected[i + index] = true;
    this.setState({ components: newArray, selected: newSelected });
  }

  onDrop(i) {
    return (monitor, component) => {
      this.moveSelected(i);
      return monitor.getItem();
    };
  }

  select(index) {
    return e => {
      const { selected, selectMode } = this.state;
      // If shift => Add all up to the value
      if (selectMode === "range") {
        let selection = {};
        let selectedIndex = parseInt(Object.keys(selected)[0], 0);
        const distance = Math.abs(selectedIndex - index);
        let start = selectedIndex < index ? selectedIndex : index;
        for (let range = start; range <= start + Math.abs(distance); range++) {
          selection[range] = true;
        }
        this.setState({
          selected: selection
        });
      } else if (selectMode === "add") {
        // If cmd => add to list
        this.setState({
          selected: {
            ...selected,
            [index]: selected[index] ? false : true
          }
        });
      } else {
        // Otherwise => Select only one
        this.setState({
          selected: {
            [index]:
              selected[index] && Object.keys(selected).length === 1
                ? false
                : true
          }
        });
      }
    };
  }

  renderDroppable(i, c) {
    return draggableProps => {
      return (
        <div key={c + "drag"}>
          <Draggable render={this.renderDraggable(i, c)} />
        </div>
      );
    };
  }

  renderDraggable(i, c) {
    const { selected } = this.state;
    return draggableProps => {
      return (
        <div className={draggableProps.isDragging ? "o-0" : ""}>
          <div
            className={`pa2 br2 mb2 flex justify-between ${
              selected[i] ? "bg-green white" : "bg-near-white gray"
            }`}
            onClick={this.select(i)}
          >
            <div className="flex-auto w-100">
              Element: {c}
              {this.state.expandActive &&
                this.state.activeIndex === i && (
                  <div className="f7">
                    {/* Another hotkey for ENTER (13) */}
                    <Hotkey
                      keyCode="enter"
                      handler={() => alert(`Surprise! ${c}`)}
                    >
                      <div>Try Enter for surprise!</div>
                    </Hotkey>
                    <div>
                      Expandable dummy which adds a handler for ENTER. As it was
                      mounted later, it gets priority. This makes it possible to
                      use different states to trigger different actions on the
                      same keycode. Such wow. Another example were to be to add
                      a "remove" feature on focus. Just create a state for it
                      and render the Hotkey.
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      );
    };
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

        <div
          className="mv2"
          tabIndex="-1"
          onBlur={() => this.setState({ selected: {} })}
          ref={r => {
            this.focusElement = r;
          }}
        >
          <Hotkey
            keyCode="shift"
            handler={this.setSelectMode("range")}
            keyUpHandler={this.setSelectMode(null)}
          />
          <Hotkey keyCode="ctrl+c" handler={this.copy} />
          <Hotkey keyCode="ctrl+v" handler={this.paste} />
          {/* Mac */}
          <Hotkey
            keyCode="cmd"
            handler={this.setSelectMode("add")}
            keyUpHandler={this.setSelectMode(null)}
          />
          {/*  Windows */}
          <Hotkey
            keyCode="ctrl"
            handler={this.setSelectMode("add")}
            keyUpHandler={this.setSelectMode(null)}
          />

          {this.state.components.length === 0 && (
            <div className="pv2 tc f7 gray">No posts.</div>
          )}
          {this.state.components.map((c, i) => (
            <Droppable
              key={c}
              onDrop={this.onDrop(i)}
              render={this.renderDroppable(i, c)}
            />
          ))}
        </div>

        <div className="flex justify-around items-center gray f7">
          {/* Hotkeys for list */}
          <Hotkey keyCode="uparrow" handler={this.previous()} />
          <Hotkey keyCode="downarrow" handler={this.next()} />
          <Hotkey keyCode="backspace" handler={() => this.removeSelected()} />
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
