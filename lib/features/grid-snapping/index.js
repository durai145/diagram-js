import Grid from './Grid';
import GridControls from './GridControls';
import GridSnapping from './GridSnapping';

export default {
  __init__: [ 'grid', 'gridControls', 'gridSnapping' ],
  grid: [ 'type', Grid ],
  gridControls: [ 'type', GridControls ],
  gridSnapping: [ 'type', GridSnapping ]
};