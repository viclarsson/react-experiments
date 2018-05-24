// @flow

import React, { Component } from "react";
import type { Node } from "react";
import type { Store } from "redux";

// Context
import Context from "./TourContext";

type Tours = { [key: string]: Array<string> };
type Props = {
  +tours: Tours,
  +store: Store,
  +debug: boolean,
  +children: ?Node
};

type State = {
  +start: Function,
  +next: Function,
  +previous: Function,
  +done: Function,
  activeTourId: ?string,
  activeStepId: ?string
};

class TourProvider extends Component<Props, State> {
  // Variables
  tours: Tours = this.props.tours;
  activeIndex: number = 0;

  componentDidMount() {
    if (this.props.store) {
      this.props.store.subscribe(this.storeListener);
    } else if (this.props.debug) {
      console.log(
        "TourProvider does not listen to store as props was provided."
      );
    }
  }

  storeListener = () => {
    const { store } = this.props;
    const action = store.getState().lastAction;
    if (!action) {
      console.error("TourProvider is missing last action reducer!");
      return;
    }
    switch (action.type) {
      case "@@tour/START":
        this.start(action.tour_id, action.callback);
        break;
      case "@@tour/NEXT":
        this.next(action.callback);
        break;
      case "@@tour/PREVIOUS":
        this.previous(action.callback);
        break;
      case "@@tour/DONE":
        this.done(action.callback);
        break;
      default:
    }
  };

  start = (tourId: string, cb: Function) => {
    // If it exists and no other tour is in progress
    if (this.tours[tourId]) {
      if (this.props.debug) console.log("Starting tour:", tourId);
      this.activeIndex = 0;
      this.setState(
        {
          activeTourId: tourId,
          activeStepId: this.tours[tourId][0]
        },
        () => {
          if (cb) cb();
        }
      );
    }
  };

  next = (cb: Function) => {
    if (this.state.activeTourId) {
      if (this.props.debug)
        console.log("Next in tour:", this.state.activeTourId);
      this.activeIndex = this.activeIndex + 1;
      this.setState(
        {
          activeStepId: this.tours[this.state.activeTourId][this.activeIndex]
        },
        () => {
          if (cb) cb();
        }
      );
    }
  };

  previous = (cb: Function) => {
    if (this.state.activeTourId) {
      if (this.props.debug)
        console.log("Previous in tour:", this.state.activeTourId);
      this.activeIndex = this.activeIndex - 1;
      this.setState(
        {
          activeStepId: this.tours[this.state.activeTourId][this.activeIndex]
        },
        () => {
          if (cb) cb();
        }
      );
    }
  };

  done = (cb: Function) => {
    if (this.state.activeTourId) {
      if (this.props.debug)
        console.log("Done in tour:", this.state.activeTourId);
      this.setState(
        {
          activeTourId: null,
          activeStepId: null
        },
        () => {
          if (cb) cb();
        }
      );
    }
  };

  state = {
    start: this.start,
    next: this.next,
    previous: this.previous,
    done: this.done,
    activeTourId: null,
    activeStepId: null
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default TourProvider;
