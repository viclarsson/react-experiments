import React, { PureComponent } from "react";

// Hotkey
import withHotkey from "../react-hotkeys/HotkeyHelper";

// Components
import TestComponent from "../components/TestComponent";
import Draggable from "../react-dnd/Draggable";
import Droppable from "../react-dnd/Droppable";
import { withSelection } from "../components/Helpers/Selectable";

// Build components
const Hotkey = withHotkey(TestComponent);

class List extends PureComponent {
  constructor(props) {
    super(props);
    this.focusElement = null;
  }

  onDrop(i, selected) {
    const { moveToIndex, updateSelection } = this.props;
    return (monitor, component) => {
      updateSelection(moveToIndex(i, selected));
      return monitor.getItem();
    };
  }

  renderDroppable(i, c, selected, select) {
    return draggableProps => {
      return (
        <div key={c + "drag"}>
          <Draggable render={this.renderDraggable(i, c)} />
        </div>
      );
    };
  }

  renderDraggable(i, c) {
    const { expandActive, cursor, selected, select } = this.props;
    return draggableProps => {
      return (
        <div className={draggableProps.isDragging ? "o-0" : ""}>
          <div
            className={`pa2 br2 mb2 flex justify-between ${
              selected[i] ? "bg-green white" : "bg-near-white gray"
            }`}
            onClick={select(i)}
          >
            <div className="flex-auto w-100">
              Element: {c}
              {expandActive &&
                cursor === i && (
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
    const {
      next,
      previous,
      select,
      selected,
      setSelectMode,
      resetSelection
    } = this.props;
    return (
      <div
        className="mv2"
        tabIndex="-1"
        onBlur={resetSelection}
        ref={r => {
          this.focusElement = r;
        }}
      >
        <Hotkey keyCode="uparrow" handler={previous} />
        <Hotkey keyCode="downarrow" handler={next} />
        <Hotkey
          keyCode="shift"
          handler={setSelectMode("range")}
          keyUpHandler={setSelectMode(null)}
        />
        {/* Mac */}
        <Hotkey
          keyCode="cmd"
          handler={setSelectMode("add")}
          keyUpHandler={setSelectMode(null)}
        />
        {/*  Windows */}
        <Hotkey
          keyCode="ctrl"
          handler={setSelectMode("add")}
          keyUpHandler={setSelectMode(null)}
        />

        {this.props.items.length === 0 && (
          <div className="pv2 tc f7 gray">No posts.</div>
        )}

        {this.props.items.map((c, i) => (
          <Droppable
            key={c}
            onDrop={this.onDrop(i, selected)}
            render={this.renderDroppable(i, c, selected, select)}
          />
        ))}
      </div>
    );
  }
}

export default withSelection(List);
