import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import Popper from "popper.js";

import css from "./Popover.css"; // eslint disable-line

// Context
import { withPopover } from "../../react-popover/PopoverHelper";

class Popover extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.arrow = React.createRef();
    this.popper = null;
    this.hideIfOutside = this.hideIfOutside.bind(this);
    this.destroy = this.destroy.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  hideIfOutside(e) {
    // If click does not contain the popover or trigger
    if (
      this.props.show &&
      !this.props.override &&
      (this.ref.current && !this.ref.current.contains(e.target))
    ) {
      this.props.updatePopover(this.props.id, { show: false });
    }
  }

  removeListeners() {
    document.body.removeEventListener("click", this.hideIfOutside);
  }

  destroy() {
    this.removeListeners();
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
  }

  update() {
    const { id, show, reference } = this.props;
    // Create if not shown and should show
    if (
      show &&
      !this.popper &&
      this.ref.current &&
      reference &&
      reference.ref.current
    ) {
      console.log("Creating popover", id);
      const { placement } = this.props;
      let options = {
        placement: placement || "bottom",
        modifiers: {}
      };
      if (this.arrow && this.arrow.current) {
        options.modifiers.arrow = { element: this.arrow.current };
      }
      this.popper = new Popper(
        reference.ref.current,
        this.ref.current,
        options
      );
      document.body.addEventListener("click", this.hideIfOutside);
    } else if (!show) {
      // Destroy otherwise
      this.destroy();
    }
  }

  componentWillUnmount() {
    this.destroy();
  }

  render() {
    const {
      children,
      show,
      render,
      hideArrow,
      arrowClasses,
      className,
      ...props
    } = this.props;
    if (show) {
      return ReactDOM.createPortal(
        <div ref={this.ref} className={`popper ${className}`}>
          {!hideArrow && (
            <div ref={this.arrow} className={`popper--arrow ${arrowClasses}`} />
          )}
          {render({ ...props, show })}
        </div>,
        document.body
      );
    }
    return null;
  }
}

export default withPopover(Popover);
