import { PureComponent } from "react";
import { DragLayer } from "react-dnd";

class DragLayerComponent extends PureComponent {
  render() {
    const { render, ...rest } = this.props;
    console.log(rest);
    return render(rest);
  }
}

/**
 * Specifies the props to inject into your component.
 */
const mapDragStateToProps = monitor => {
  let translation = null;
  const currentOffset = monitor.getSourceClientOffset();
  if (currentOffset) {
    const { x, y } = currentOffset;
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
    currentOffset,
    translation
  };
};

// Function to wrap components
export const dragLayer = DragLayer(mapDragStateToProps);
export default dragLayer(DragLayerComponent);
