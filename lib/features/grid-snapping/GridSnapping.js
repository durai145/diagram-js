import {
  setSnapped,
  isSnapped
} from '../snapping/SnapUtil';

var LOWER_PRIORITY = 1200;

var DEFAULT_SPACING = 10;


export default function GridSnapping(
    eventBus,
    config,
    grid
) {
  this._grid = grid;

  this.active = config.gridSnapping && config.gridSnapping.active || false;

  this.spacing = config.gridSnapping && config.gridSnapping.spacing || DEFAULT_SPACING;

  var self = this;

  eventBus.on('diagram.init', function() {
    grid._setSpacing(self.spacing);
  });

  eventBus.on([
    'shape.move.hover',
    'shape.move.move',
    'shape.move.end',
    'create.hover',
    'create.move',
    'create.end',
    'connect.move',
    'connect.hover',
    'connect.end',
    'resize.move',
    'resize.move.end',
    'connectionSegment.move.move',
    'connectionSegment.move.end'
  ], LOWER_PRIORITY, function(event) {
    if (!self.active) {
      return;
    }

    [ 'x', 'y' ].forEach(function(axis) {

      if (!isSnapped(event, axis)) {
        setSnapped(event, axis, self._getClosestGridPosition(event, axis));
      }
    });
  });
}

GridSnapping.prototype.toggle = function() {
  if (this.active) {
    this.deactivate();
  } else {
    this.activate();
  }
};

GridSnapping.prototype.activate = function() {
  this.active = true;

  this._grid.setVisible();
};

GridSnapping.prototype.deactivate = function() {
  this.active = false;

  this._grid.setHidden();
};

GridSnapping.prototype.isActive = function() {
  return this.active;
};

GridSnapping.prototype._getClosestGridPosition = function(position, axis) {
  return quantize(position[axis], this.spacing);
};

GridSnapping.prototype.setSpacing = function(spacing) {
  if (spacing === this.spacing) {
    return;
  }

  this.spacing = spacing;

  this._grid._setSpacing(this.spacing);
};

GridSnapping.prototype.getSpacing = function() {
  return this.spacing;
};

GridSnapping.$inject = [
  'eventBus',
  'config',
  'grid'
];

// helpers //////////

function quantize(value, quantum) {
  return Math.round(value / quantum) * quantum;
}