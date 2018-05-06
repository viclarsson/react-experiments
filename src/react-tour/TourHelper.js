import React from 'react';

// Context
import Context from './TourContext';

// HOC for simplicity
function withTour(C) {
  const TourHelper = (props) => {
    return (
      <Context.Consumer>
        {({ start, next, previous, skip, done, activeTourId, activeTourIndex }) => {
          return (<C activeTourIndex={activeTourIndex} activeTourId={activeTourId} {...props} />);
        }}
      </Context.Consumer>
    );
  }
  return TourHelper;
}
export default withTour;
