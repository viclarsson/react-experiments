import React, { PureComponent } from "react";

// Hotkey
import withHotkey from "../../react-hotkeys/HotkeyHelper";

// Components
import TestComponent from "../TestComponent";
import Draggable from "../../react-dnd/Draggable";
import Droppable from "../../react-dnd/Droppable";

// Build components
const Hotkey = withHotkey(TestComponent);

// The visual layer (designer)
const ListVisuals = ({
  draggable,
  c,
  i,
  expandActive,
  cursor,
  select,
  selected,
  style
}) => {
  return (
    <div
      style={style}
      className={`pa2 br2 mb2 flex justify-between ${
        selected[i] ? "bg-green white" : "bg-near-white gray"
      }`}
      onClick={() => select(i)}
    >
      <div className="flex-auto w-100">
        Element: {c}
        {expandActive &&
          cursor === i && (
            <div className="f7">
              {/* Another hotkey for ENTER (13) */}
              <Hotkey keyCode="enter" handler={() => alert(`Surprise! ${c}`)}>
                <div>Try Enter for surprise!</div>
              </Hotkey>
              <div>
                Expandable dummy which adds a handler for ENTER. As it was
                mounted later, it gets priority. This makes it possible to use
                different states to trigger different actions on the same
                keycode. Such wow. Another example were to be to add a "remove"
                feature on focus. Just create a state for it and render the
                Hotkey.
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

// List item functions (Tech Js developer)
class ListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.onHover = this.onHover.bind(this);
    this.onEndDrag = this.onEndDrag.bind(this);
    this.renderDraggable = this.renderDraggable.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  onEndDrag(monitor, component) {
    const { i, onEndDrag } = this.props;
    onEndDrag(i);
  }

  onHover(monitor, component) {
    const { i, onHover } = this.props;
    onHover(i);
  }

  renderDraggable(props) {
    const {
      // Select API
      cursor,
      selected,
      select,
      // Data
      expandActive,
      c,
      i,
      style
    } = this.props;
    return (
      <div className={props.isDragging ? "o-10" : ""}>
        <ListVisuals
          style={style}
          cursor={cursor}
          selected={selected}
          select={select}
          expandActive={expandActive}
          c={c}
          i={i}
        />
      </div>
    );
  }
  renderItem() {
    return (
      <div>
        <Draggable onEndDrag={this.onEndDrag} render={this.renderDraggable} />
      </div>
    );
  }
  render() {
    const { expandActive, selected, c, i, hover } = this.props;
    return (
      <Droppable
        key={`${selected[i]}-${c}-${i}-${expandActive}-${hover}`}
        onDrop={this.onDrop}
        onHover={this.onHover}
        render={this.renderItem}
      />
    );
  }
}

export default ListItem;
