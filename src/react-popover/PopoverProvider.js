import React, { PureComponent } from "react";

// Context
import Context from "./PopoverContext";

class PopoverProvider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      popovers: {},
      register: this.register,
      unRegister: this.unRegister,
      update: this.update
    };
    this.popovers = {};
  }

  update = (id, data) => {
    const ref = this.popovers[id] ? this.popovers[id].ref : null;
    if (!ref) {
      console.warn("No popover with that ID registered... No action taken.");
      return;
    }
    if (this.props.debug)
      console.log("Updating popover:", id, "with data:", data);
    this.popovers[id] = {
      ref,
      ...data
    };
    this.setState({
      popovers: { ...this.popovers }
    });
  };

  register = (id, ref) => {
    this.popovers[id] = { ref };
    if (this.props.debug)
      console.log("Registering popover:", id, "with ref:", ref);
    this.setState({
      popovers: { ...this.popovers }
    });
  };

  unRegister = id => {
    this.popovers[id] = undefined;
    if (this.props.debug) console.log("Unregistering popover:", id);
    this.setState({
      popovers: { ...this.popovers }
    });
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default PopoverProvider;
