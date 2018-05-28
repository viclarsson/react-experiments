import React, { PureComponent } from "react";

// Context
import {
  withPopover,
  PopoverReference
} from "../../react-popover/PopoverHelper";

class Trigger extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { id, updatePopover, show, triggerToggles } = this.props;
    // Will right now close and open the popover making the trigger seem "unclickable" when open
    updatePopover(id, { show: !show });
  }

  render() {
    const { popover, id, asReference } = this.props;
    if (asReference) {
        return (
            <PopoverReference id={id} forwardRef={this.ref}>
                <div onClick={this.toggle} ref={this.ref}>
                    {this.props.children}
                </div>
            </PopoverReference>
        );
    }
    return (
        <div onClick={this.toggle} ref={this.ref}>
            {this.props.children}
        </div>
    );
  }
}

export default withPopover(Trigger);
