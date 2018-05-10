import React from 'react';

// Context
import Context from './TourContext';

// HOC for simplicity
export function tourStep(C) {
  const TourHelper = ({ tourId, stepId, ...restProps }) => {
    return (
      <Context.Consumer>
        {({ registerStep, activeTourId, activeStepId, start, next, previous, done }) => {
          return (
            <C
              isActive={activeTourId === tourId && activeStepId === stepId}
              start={start}
              next={next}
              previous={previous}
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
        {({ activeTourId, activeStepId, start, next, previous, done }) => {
          return (
            <C activeTourId={activeTourId} activeStepId={activeStepId} start={start} next={next} previous={previous} done={done} {...props} />
          );
        }}
      </Context.Consumer>
    );
  }
  return TourController;
}
