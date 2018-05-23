import React from "react";

// Context
import Context from "./TourContext";

const TourContainer = ({ render, ...restProps }) => {
  return (
    <Context.Consumer>
      {({ activeTourId, activeStepId, start, next, previous, done }) =>
        render({
          ...restProps,
          activeTourId,
          activeStepId,
          start,
          next,
          previous,
          done
        })
      }
    </Context.Consumer>
  );
};
export default TourContainer;

// HOC for simplicity
export function tourStep(C) {
  const TourHelper = ({ tourId, stepId, ...restProps }) => {
    return (
      <TourContainer
        render={({
          activeTourId,
          activeStepId,
          start,
          next,
          previous,
          done
        }) => (
          <C
            isActive={activeTourId === tourId && activeStepId === stepId}
            start={start}
            next={next}
            previous={previous}
            done={done}
            {...restProps}
          />
        )}
      />
    );
  };
  return TourHelper;
}

// HOC for simplicity
export function tourController(C) {
  const TourController = props => {
    return (
      <TourContainer
        render={({
          activeTourId,
          activeStepId,
          start,
          next,
          previous,
          done
        }) => (
          <C
            activeTourId={activeTourId}
            activeStepId={activeStepId}
            start={start}
            next={next}
            previous={previous}
            done={done}
            {...props}
          />
        )}
      />
    );
  };
  return TourController;
}
