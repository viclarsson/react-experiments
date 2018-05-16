import { PureComponent } from 'react';
import { dragSource as dS } from './Draggable';
import { dropTarget as dT } from './Droppable';

class DragAndDroppable extends PureComponent {
  render() {
    const { dragSource, dropTarget, render, ...rest } = this.props;
    return dropTarget(dragSource(render(rest)));
  }
}

export default dS(dT(DragAndDroppable));
