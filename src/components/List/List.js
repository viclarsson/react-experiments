import React, { PureComponent } from "react";

// Hotkey
import withHotkey from "../../react-hotkeys/HotkeyHelper";

// Components
import TestComponent from "../TestComponent";
import ListItem from "./ListItem";
import { withSelection } from "../Helpers/Selectable";

// Build components
const Hotkey = withHotkey(TestComponent);

class List extends PureComponent {
  constructor(props) {
    super(props);
    this.focusElement = null;
    this.onHover = this.onHover.bind(this);
    this.hover = null; // Inner counter
  }

  onHover(i) {
    const { moveToIndex, updateSelection, selected } = this.props;
    if (i !== this.hover) {
      updateSelection(moveToIndex(i, selected));
      this.hover = i;
    }
  }

  render() {
    const {
      next,
      previous,
      cursor,
      select,
      selected,
      setSelectMode,
      resetSelection,
      expandActive
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
          <ListItem
            key={c + "-" + i}
            onHover={this.onHover}
            c={c}
            i={i}
            selected={selected}
            select={select}
            cursor={cursor}
            expandActive={expandActive}
          />
        ))}
      </div>
    );
  }
}

export default withSelection(List);
