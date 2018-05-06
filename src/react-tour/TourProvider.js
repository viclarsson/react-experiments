import React, { Component } from 'react';

// Context
import Context from './TourContext';

class TourProvider extends Component {
  constructor (props) {
    super(props);
    this.registerStep = this.registerStep.bind(this);
    this.start = this.start.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.skip = this.skip.bind(this);
    this.tours = {}; // Object of arrays with ids
    this.state = {
      registerStep: this.registerStep,
      start: this.start,
      next: this.next,
      previous: this.previous,
      skip: this.skip,
      activeTourId: null,
      activeTourIndex: null
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
      console.log('Started tour', tourId);
      this.setState({
        activeTourId: tourId,
        activeTourIndex: 0
      });
    }
  }
  next () {
    if (this.state.activeTourId) {
      this.setState({
        activeTourIndex: this.state.activeTourIndex + 1
      });
    }
  }
  previous () {
    if (this.state.activeTourId) {
      this.setState({
        activeTourIndex: this.state.activeTourIndex > 0 ? this.state.activeTourIndex - 1 : 0
      });
    }
  }
  skip () {
    if (this.state.activeTourId) {
      this.setState({
        activeTourIndex: this.tours[this.state.activeTourId].length - 1
      });
    }
  }
  done (cb) {
    if (this.state.activeTourId) {
      this.setState({
        activeTourId: null,
        activeTourIndex: null
      }, () => {
        cb();
      });
    }
  }
  render () {
    console.log(this.state);
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default TourProvider;
