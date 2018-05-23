// @flow

import React, { Component } from "react";
import type { Node } from "react";
import type { Store } from "redux";

// Context
import Context from "./TourContext";

type Props = {
  +tours: { [key: string]: Array<string> },
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
  constructor(props: Props) {
    super(props);
    (this: any).start = this.start.bind(this);
    (this: any).next = this.next.bind(this);
    (this: any).previous = this.previous.bind(this);
    (this: any).done = this.done.bind(this);
    (this: any).tours = props.tours;
    (this: any).activeIndex = 0;

    if (props.store) {
      (this: any).storeListener = this.storeListener.bind(this);
      this.props.store.subscribe(this.storeListener);
    } else if (props.debug) {
      console.log(
        "TourProvider does not listen to store as props was provided."
      );
    }

    this.state = {
      start: this.start,
      next: this.next,
      previous: this.previous,
      done: this.done,
      activeTourId: null,
      activeStepId: null
    };
  }

  storeListener() {
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
  }

  start(tourId: string, cb: Function) {
    // If it exists and no other tour is in progress
    if ((this: any).tours[tourId]) {
      if (this.props.debug) console.log("Starting tour:", tourId);
      (this: any).activeIndex = 0;
      this.setState(
        {
          activeTourId: tourId,
          activeStepId: (this: any).tours[tourId][0]
        },
        () => {
          if (cb) cb();
        }
      );
    }
  }
  next(cb: Function) {
    if (this.state.activeTourId) {
      if (this.props.debug)
        console.log("Next in tour:", this.state.activeTourId);
      (this: any).activeIndex = (this: any).activeIndex + 1;
      this.setState(
        {
          activeStepId: (this: any).tours[this.state.activeTourId][
            (this: any).activeIndex
          ]
        },
        () => {
          if (cb) cb();
        }
      );
    }
  }
  previous(cb: Function) {
    if (this.state.activeTourId) {
      if (this.props.debug)
        console.log("Previous in tour:", this.state.activeTourId);
      (this: any).activeIndex = (this: any).activeIndex - 1;
      this.setState(
        {
          activeStepId: (this: any).tours[this.state.activeTourId][
            (this: any).activeIndex
          ]
        },
        () => {
          if (cb) cb();
        }
      );
    }
  }
  done(cb: Function) {
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
  }
  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default TourProvider;
