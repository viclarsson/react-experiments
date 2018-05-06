import React, { Fragment, Component } from 'react';

// Context
import Context from './TourContext';

/*
* Handles how hotkeys are registered and removed in the context.
*/
class TourHandler extends Component {
  constructor (props) {
    super(props);
    // Create a reference
    this.tourId = props.tourId;
    this.index = props.index;
    this.stepId = props.stepId;
  }
  shouldComponentUpdate () {
    return false;
  }
  componentDidMount () {
    this.props.registerStep(this.tourId, this.stepId, this.index);
  }
  render() {
    return null;
  }
}

// HOC for simplicity
export function tourStep(C) {
  const TourHelper = ({ tourId, stepId, tourIndex, ...restProps }) => {
    return (
      <Context.Consumer>
        {({ registerStep, activeTourId, activeTourIndex, start, next, previous, skip, done }) => {
          console.log(tourId, activeTourId, tourIndex, activeTourIndex);
          return (
            <Fragment>
              <TourHandler
                registerStep={registerStep}
                tourId={tourId}
                stepId={stepId}
                tourIndex={tourIndex}
                />
              <C
                isActive={activeTourId === tourId && tourIndex === activeTourIndex}
                start={start}
                next={next}
                previous={previous}
                skip={skip}
                done={done}
                {...restProps}
              />
            </Fragment>
          );
        }}
      </Context.Consumer>
    );
  }
  return TourHelper;
}

// HOC for simplicity
export function tourController(C) {
  const TourController = (props) => {
    return (
      <Context.Consumer>
        {({ start, next, previous, skip, done }) => {
          return (
            <C start={start} next={next} previous={previous} skip={skip} done={done} {...props} />
          );
        }}
      </Context.Consumer>
    );
  }
  return TourController;
}
