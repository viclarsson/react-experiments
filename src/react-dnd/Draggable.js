import { PureComponent } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { TYPE } from './DndConstants';

export class Draggable extends PureComponent {
  componentDidMount() {
    const { customHandler, dragPreview } = this.props;
    if (!customHandler) return null;
    dragPreview(getEmptyImage(), {
      captureDraggingState: true,
    })
  }
  render() {
    const { dragSource, dragPreview, render, ...rest } = this.props;
    if (rest.customHandler) {
      return dragSource(render(rest));
    }
    return dragPreview(dragSource(render(rest)));
  }
}


/**
* Specifies the props to inject into your component.
*/
const mapDragStateToProps = (connect, monitor) => {
  return {
    // Connect
    dragSource: connect.dragSource(),
    dragPreview: connect.dragPreview(),
    // Monitor
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag(),
    item: monitor.getItem()
  };
}

/**
* Specifies the props to inject into your component.
*/
const API = {
  beginDrag: (props, monitor, component) => {
    return props.onBeginDrag ? props.onBeginDrag(monitor, component) || {} : {};
  },
  endDrag: (props, monitor, component) => {
    return props.onEndDrag ? props.onEndDrag(monitor, component) : {};
  }
};

// Function to wrap components
export const dragSource = DragSource(TYPE, API, mapDragStateToProps);
export default dragSource(Draggable);
