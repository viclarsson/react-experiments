import { PureComponent } from 'react';
import { DragSource } from 'react-dnd';

class Draggable extends PureComponent {
  render() {
    const { dragSource, render, ...rest } = this.props;
    return dragSource(render(rest));
  }
}


/**
 * Specifies the props to inject into your component.
 */
const mapDragStateToProps = (connect, monitor) => {
  return {
    // Connect
    dragSource: connect.dragSource(),
    // Monitor
    isDragging: monitor.isDragging()
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
export const dragSource = DragSource('Item', API, mapDragStateToProps);
export default dragSource(Draggable);
