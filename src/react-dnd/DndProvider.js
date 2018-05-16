import React, { PureComponent } from 'react';

// Base DnD
import { DragDropContextProvider } from 'react-dnd';

// Backends
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';

// To choose which backend
import isTouchDevice from './isTouchDevice';
const useTouch = isTouchDevice();

class DndProvider extends PureComponent {
  render () {
    if (this.props.debug) console.log('Rendered DndProvider using', useTouch ? 'Touch' : 'HTML5', 'backend');
    return (
      <DragDropContextProvider backend={useTouch ? TouchBackend : HTML5Backend}>
        {this.props.children}
      </DragDropContextProvider>
    )
  }
}

export default DndProvider;
