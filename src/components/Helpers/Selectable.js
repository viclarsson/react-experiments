import React, { PureComponent } from "react";

class Selectable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      cursor: 0, // Pointer to 'active'
      selected: {},
      selectMode: null
    };

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.setSelectMode = this.setSelectMode.bind(this);
    this.select = this.select.bind(this);
    this.resetSelection = this.resetSelection.bind(this);
    this.updateSelection = this.updateSelection.bind(this);
  }

  updateSelection(selected) {
    this.setState({ selected });
  }

  next() {
    if (this.state.cursor === this.state.items.length - 1) return;
    this.select(this.state.cursor + 1);
  }

  previous() {
    if (this.state.cursor === 0) return;
    this.select(this.state.cursor - 1);
  }

  setSelectMode(mode) {
    return () => {
      this.setState({ selectMode: mode });
    };
  }

  resetSelection() {
    this.setState({ selected: {} });
  }

  select(index) {
    const { selected, selectMode } = this.state;
    // If shift => Add all up to the value
    if (selectMode === "range") {
      let selection = { ...this.state.selected };
      let selectedIndex = this.state.cursor;
      const distance = Math.abs(selectedIndex - index);
      let start = selectedIndex < index ? selectedIndex : index;
      for (let range = start; range <= start + Math.abs(distance); range++) {
        selection[range] = true;
      }
      this.setState({
        cursor: index,
        selected: selection
      });
    } else if (selectMode === "add") {
      // If cmd => add to list
      this.setState({
        cursor: index,
        selected: {
          ...selected,
          [index]: selected[index] ? false : true
        }
      });
    } else {
      // Otherwise => Select only one
      this.setState({
        cursor: index,
        selected: {
          [index]:
            selected[index] && Object.keys(selected).length === 1 ? false : true
        }
      });
    }
  }

  render() {
    const { selected, cursor } = this.state;
    const { render, items } = this.props;
    return render({
      items,
      selected,
      cursor,
      select: this.select,
      next: this.next,
      previous: this.previous,
      setSelectMode: this.setSelectMode,
      updateSelection: this.updateSelection,
      resetSelection: this.resetSelection
    });
  }
}

export default Selectable;

export function withSelection(C) {
  class SelectionHelper extends PureComponent {
    render() {
      const { items, ...restProps } = this.props;
      return (
        <Selectable
          items={items}
          render={selectionApi => <C {...restProps} {...selectionApi} />}
        />
      );
    }
  }
  return SelectionHelper;
}
