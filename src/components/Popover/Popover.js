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
  }
  
  componentWillUpdate() {
    if (this.popper) {
      this.popper.scheduleUpdate();
      console.log("Updating popover", this.props.id);      
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

  componentWillReceiveProps(nextProps) {
    if(nextProps.show) {
      document.body.addEventListener('click', this.hideIfOutside);
    } else {
      this.removeListeners();
    }
    if (!this.popper && this.ref.current && nextProps.popover.ref.current) {
      console.log("Creating popover", this.props.id);
      const { placement } = this.props;
      let options = {
        placement: placement || 'bottom'
        };
      this.popper = new Popper(
        nextProps.popover.ref.current,
        this.ref.current,
        options
      );
    }
  }

  componentWillUnmount() {
    this.removeListeners();
    if (this.popper) {
      console.log(this.popper);
      this.popper.destroy();
      this.popper = null;
    }
  }

  render() {
    const { children, show, render, ...props } = this.props;
    return ReactDOM.createPortal(
      <div ref={this.ref}>{render({ ...props, show })}</div>,
      document.body
    );
  }
}

export default withPopover(Popover);
