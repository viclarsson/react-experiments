import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import Popper from "popper.js";

// Context
import { withPopover } from "../../react-popover/PopoverHelper";

class Popover extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.popper = null;
    this.hideIfOutside = this.hideIfOutside.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  componentDidUpdate() {
    // Update if shown
    if (this.popper && this.props.show) {
      console.log("Updating popover", this.props.id);      
      this.popper.scheduleUpdate(); 
    }
    // Create if not shown and should show
    if(this.props.show && !this.popper && this.ref.current && this.props.popover.ref.current) {
      console.log("Creating popover", this.props.id);
      const { placement } = this.props;
      let options = {
        placement: placement || 'bottom'
        };
      this.popper = new Popper(
        this.props.popover.ref.current,
        this.ref.current,
        options
      );
      document.body.addEventListener('click', this.hideIfOutside);      
    } else {
      // Destroy otherwise
      this.destroy();
    }
  }

  hideIfOutside (e) {
    // If click does not contain the popover or trigger
    if (this.props.show && !this.props.override && (this.ref.current && !this.ref.current.contains(e.target))) {
      this.props.updatePopover(this.props.id, { show: false });
    }
  }
  removeListeners () {
    document.body.removeEventListener('click', this.hideIfOutside);
  }

  destroy() {
   this.removeListeners();
    if (this.popper) {
      console.log(this.popper);
      this.popper.destroy();
      this.popper = null;
    }
  }

  componentWillUnmount() {
    this.destroy();
  }

  render() {
    const { children, show, render, ...props } = this.props;
    if (show) {
      return ReactDOM.createPortal(
        <div ref={this.ref}>{render({ ...props, show })}</div>,
        document.body
      );
    }
    return null;
  }
}

export default withPopover(Popover);
