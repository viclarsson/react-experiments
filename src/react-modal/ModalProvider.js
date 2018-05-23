import React, { PureComponent } from "react";

// Helper
import Query from "url-parse";

// Context
import Context from "./ModalContext";

class ModalProvider extends PureComponent {
  constructor(props) {
    super(props);
    if (props.store) {
      this.storeListener = this.storeListener.bind(this);
      this.props.store.subscribe(this.storeListener);
    } else if (props.debug) {
      console.log(
        "ModalProvider does not listen to store as props was provided."
      );
    }
    this.state = {
      active: null
    };
  }

  storeListener() {
    const { store } = this.props;
    const action = store.getState().lastAction;
    if (!action) {
      console.error("ModalProvider is missing last action reducer!");
      return;
    }
    switch (action.type) {
      // Handle routing
      case "@@router/LOCATION_CHANGE":
        const params = new Query(action.payload.search, true);
        if (params.query.modal) {
          this.setState({ active: params.query.modal });
        } else {
          this.setState({ active: null });
        }
        break;
      case "@@modal/SHOW":
        this.setState({ active: action.payload.modal_id });
        break;
      case "@@modal/HIDE":
        this.setState({ active: null });
        break;
      default:
    }
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default ModalProvider;
