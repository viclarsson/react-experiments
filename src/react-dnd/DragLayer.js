import React, { PureComponent } from "react";
import { DragLayer } from "react-dnd";

class DragLayerComponent extends PureComponent {
  render() {
    const { render, ...rest } = this.props;
    if (!rest.isDragging) return null;
    // Make the dragLayer fixed
    return (
      <div
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 100,
          left: 0,
          top: 0,
          width: "100%",
          height: "100%"
        }}
      >
        {render(rest)}
      </div>
    );
  }
}

/**
 * Specifies the props to inject into your component.
 */
const mapDragStateToProps = monitor => {
  let translation = null;
  const offset = monitor.getClientOffset();
  if (offset) {
    const { x, y } = offset;
    const temp = `translate(${x}px, ${y}px)`;
    translation = {
      transform: temp,
      WebkitTransform: temp
    };
  }
  return {
    // Monitor
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
    translation
  };
};

// Function to wrap components
export const dragLayer = DragLayer(mapDragStateToProps);
export default dragLayer(DragLayerComponent);
