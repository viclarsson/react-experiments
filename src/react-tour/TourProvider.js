import React, { Component } from 'react';

// Context
import Context from './TourContext';

class TourProvider extends Component {
  constructor (props) {
    super(props);
    this.start = this.start.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.done = this.done.bind(this);
    this.skip = this.skip.bind(this);
    this.tours = props.tours;
    this.activeIndex = 0;
    this.state = {
      start: this.start,
      next: this.next,
      previous: this.previous,
      done: this.done,
      skip: this.skip,
      activeTourId: null,
      activeStepId: null
    };
  }

  start (tourId, cb) {
    // If it exists and no other tour is in progress
    if (this.tours[tourId] && !this.state.activeTourId) {
      if (this.props.debug) console.log('Starting tour:', tourId);
      this.activeIndex = 0;
      this.setState({
        activeTourId: tourId,
        activeStepId: this.tours[tourId][0]
      }, () => {
        if (cb) cb();
      });
    }
  }
  next (cb) {
    if (this.state.activeTourId) {
      if (this.props.debug) console.log('Next in tour:', this.state.activeTourId);
      this.activeIndex = this.activeIndex + 1;
      this.setState({
        activeStepId: this.tours[this.state.activeTourId][this.activeIndex]
      }, () => {
        if (cb) cb();
      });
    }
  }
  previous (cb) {
    if (this.state.activeTourId) {
      if (this.props.debug) console.log('Previous in tour:', this.state.activeTourId);
      this.activeIndex = this.activeIndex - 1;
      this.setState({
        activeStepId: this.tours[this.state.activeTourId][this.activeIndex]
      }, () => {
        if (cb) cb();
      });
    }
  }
  skip (cb) {
    if (this.state.activeTourId) {
      if (this.props.debug) console.log('Skipped in tour:', this.state.activeTourId);
      this.setState({
        activeStepId: this.tours[this.state.activeTourId][this.tours[this.state.activeTourId].length - 1]
      }, () => {
        if (cb) cb();
      });
    }
  }
  done (cb) {
    if (this.state.activeTourId) {
      if (this.props.debug) console.log('Done in tour:', this.state.activeTourId);
      this.setState({
        activeTourId: null,
        activeStepId: null
      }, () => {
        if (cb) cb();
      });
    }
  }
  render () {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default TourProvider;
