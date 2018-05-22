import React, { Component } from "react";

// Hotkey
import withHotkey from "../../react-hotkeys/HotkeyHelper";

// Components
import TestComponent from "../TestComponent";
import Draggable from "../../react-dnd/Draggable";
import Droppable from "../../react-dnd/Droppable";

// Build components
const Hotkey = withHotkey(TestComponent);

const ListVisuals = ({
  draggable,
  c,
  i,
  expandActive,
  cursor,
  select,
  selected
}) => {
  return (
    <div
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

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.renderDraggable = this.renderDraggable.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  shouldComponentUpdate (nextProps) {
    return this.props.selected[this.props.i] !== nextProps.selected[nextProps.i]
  }

  onDrop(monitor, component) {
    const { i, onDrop } = this.props;
    onDrop(i);
    return monitor.getItem();
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
      i
    } = this.props;
    return (
      <div className={props.isDragging ? "o-0" : ""}>
        <ListVisuals
          key={c + '-' + i + '-drag'}
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
        <Draggable render={this.renderDraggable} />
      </div>
    );
  }
  render() {
    const {
      selected,
      c,
      i
    } = this.props;
    return <Droppable key={`${selected[i]}-${c}-${i}`}onDrop={this.onDrop} render={this.renderItem}/>;
  }
}

export default ListItem;
