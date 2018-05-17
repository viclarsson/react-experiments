import { PureComponent } from 'react';
import { DropTarget } from 'react-dnd';
import withScrolling from 'react-dnd-scrollzone';
import { TYPE } from './DndConstants';

class DroppableComponent extends PureComponent {
  render() {
    const { dropTarget, render, ...rest } = this.props;
    return dropTarget(render(rest));
  }
}

const API = {
  canDrop: (props, monitor) => {
    return props.canDrop ? props.canDrop(monitor) : true;
  },
  drop: (props, monitor, component) => {
    return props.onDrop ? props.onDrop(monitor, component) : {};
  },
  hover: (props, monitor, component) => {
    return props.onHover ? props.onHover(monitor, component) : {};
  }
};

/**
 * Specifies the props to inject into your component.
 */
const mapDropStateToProps = (connect, monitor) => {
  return {
    // Connect
    dropTarget: connect.dropTarget(),
    // Monitor
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(), // API.canDrop
    didDrop: monitor.didDrop()
  };
}

// Function to wrap components
export const dropTarget = (C) => DropTarget(props => (props.accepts && props.accepts.concat([TYPE])) || TYPE, API, mapDropStateToProps)(withScrolling(C));
export default dropTarget(DroppableComponent);
