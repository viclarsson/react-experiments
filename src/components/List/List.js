import React, { PureComponent } from "react";

// Animation
import { Transition } from "react-spring";

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
    this.state = {
      hover: null
    };
    this.onHover = this.onHover.bind(this);
    this.onEndDrag = this.onEndDrag.bind(this);
  }

  onEndDrag(i) {
    this.setState({ hover: null });
  }

  onHover(i) {
    const { moveToIndex, updateSelection, selected } = this.props;
    if (i !== this.state.hover) {
      updateSelection(moveToIndex(i, selected));
      this.setState({ hover: i });
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
      <div className="mv2" onBlur={resetSelection}>
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

        <Transition
          items={this.props.items}
          keys={(item, i) => item.c + "-" + i}
          from={item => ({ opacity: 0, height: 0 })}
          enter={(item, i) => ({ opacity: 1, height: "auto" })}
          leave={item => ({ opacity: 0, height: 0 })}
        >
          {this.props.items.map((c, i) => styles => (
            <div style={{...styles}}>
                <ListItem
                  onDrop={this.onDrop}
                  onHover={this.onHover}
                  onEndDrag={this.onEndDrag}
                  c={c}
                  i={i}
                  selected={selected}
                  select={select}
                  cursor={cursor}
                  expandActive={expandActive}
                />
              </div>
          ))}
        </Transition>
      </div>
    );
  }
}

export default withSelection(List);
