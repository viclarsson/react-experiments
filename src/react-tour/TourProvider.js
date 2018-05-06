import React, { Component } from 'react';

// Context
import Context from './TourContext';

class TourProvider extends Component {
  constructor (props) {
    super(props);
    this.start = this.start.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.skip = this.skip.bind(this);
    this.tours = props.tours;
    this.activeIndex = 0;
    this.state = {
      start: this.start,
      next: this.next,
      previous: this.previous,
      skip: this.skip,
      activeTourId: null,
      activeStepId: null
    };
  }

  start (tourId) {
    console.log('Tours?', this.tours);
    if (this.tours[tourId]) {
      console.log('Started tour', tourId);
      this.activeIndex = 0;
      this.setState({
        activeTourId: tourId,
        activeStepId: this.tours[tourId][0]
      });
    }
  }
  next () {
    if (this.state.activeTourId) {
      this.activeIndex = this.activeIndex + 1;
      this.setState({
        activeStepId: this.tours[this.state.activeTourId][this.activeIndex]
      });
    }
  }
  previous () {
    if (this.state.activeTourId) {
      this.activeIndex = this.activeIndex - 1;
      this.setState({
        activeStepId: this.tours[this.state.activeTourId][this.activeIndex]
      });
    }
  }
  skip () {
    if (this.state.activeTourId) {
      this.setState({
        activeStepId: this.tours[this.state.activeTourId][this.tours[this.state.activeTourId].length - 1]
      });
    }
  }
  done (cb) {
    if (this.state.activeTourId) {
      this.setState({
        activeTourId: null,
        activeStepId: null
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
