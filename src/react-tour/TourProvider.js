import React, { Component } from 'react';

// Context
import Context from './HotkeyContext';

class TourProvider extends Component {
  constructor (props) {
    super(props);
    this.start = this.start.bind();
    this.next = this.next.bind();
    this.previous = this.previous.bind();
    this.skip = this.skip.bind();
    this.tours = {}; // Object of arrays with ids
    this.state = {
      start: this.start,
      next: this.next,
      previous: this.previous,
      skip: this.skip,
      activeTourId: null,
      activeIndex: null
    };
  }

  // Register handler
  registerStep (tourId, id, index) {
    if (this.props.debug) console.log('Registered tour step:', tourId);
    const q = this.tours[tourId] ? {...this.tours[tourId]} : {};
    q[index] = id;
    this.tours[tourId] = q;
  };

  start (tourId) {
    if (this.tours[tourId]) {
      this.setState({
        activeTourId: tourId,
        activeIndex: 0
      });
    }
  }
  next () {
    if (this.state.activeTourId) {
      this.setState({
        activeIndex: this.state.activeIndex + 1
      });
    }
  }
  previous () {
    if (this.state.activeTourId) {
      this.setState({
        activeIndex: this.state.activeIndex > 0 ? this.state.activeIndex - 1 : 0
      });
    }
  }
  skip () {
    if (this.state.activeTourId) {
      this.setState({
        activeIndex: this.tours[this.state.activeTourId].length - 1
      });
    }
  }
  done (cb) {
    if (this.state.activeTourId) {
      this.setState({
        activeTourId: null,
        activeIndex: null
      }, () => {
        cb();
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
