import { dragSource as dS, Draggable  } from './Draggable';
import { dropTarget as dT } from './Droppable';
export default dS(dT(Draggable));
