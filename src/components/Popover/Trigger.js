import React, { PureComponent } from "react";

// Context
import {
  withPopover,
  PopoverReference
} from "../../react-popover/PopoverHelper";

class Trigger extends PureComponent {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { id, updatePopover, show } = this.props;
    // Will right now close and open the popover making the trigger seem "unclickable" when open
    updatePopover(id, { show: !show });
  }

  render() {
    const { id, asReference } = this.props;
    if (asReference) {
      return (
        <PopoverReference id={id}>
          <div onClick={this.toggle}>{this.props.children}</div>
        </PopoverReference>
      );
    }
    return <div onClick={this.toggle}>{this.props.children}</div>;
  }
}

export default withPopover(Trigger);
