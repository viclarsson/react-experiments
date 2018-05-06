import React from 'react';

// Context
import Context from './TourContext';

// HOC for simplicity
export function tourStep(C) {
  const TourHelper = ({ tourId, stepId, ...restProps }) => {
    return (
      <Context.Consumer>
        {({ registerStep, activeTourId, activeStepId, start, next, previous, skip, done }) => {
          console.log(tourId, activeTourId, stepId, activeStepId);
          return (
            <C
              isActive={activeTourId === tourId && activeStepId === stepId}
              start={start}
              next={next}
              previous={previous}
              skip={skip}
              done={done}
              {...restProps}
            />
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
