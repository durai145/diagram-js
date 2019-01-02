import {
  setSnapped
} from '../snapping/SnapUtil';

var HIGH_PRIORITY = 10000;

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
  ], HIGH_PRIORITY, function(event) {
    if (!self.active) {
      return;
    }

    var gridPosition = self._getClosestGridPosition({
      x: event.x,
      y: event.y
    });

    snapToPosition(event, gridPosition);
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

GridSnapping.prototype._getClosestGridPosition = function(position) {
  var x = position.x,
      y = position.y;

  return {
    x: quantize(x, this.spacing),
    y: quantize(y, this.spacing)
  };
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

function snapToPosition(event, position) {
  setSnapped(event, 'x', position.x);
  setSnapped(event, 'y', position.y);
}

function quantize(value, quantum) {
  var remainder = value % quantum;

  if (remainder > (quantum / 2)) {
    return value - remainder + quantum;
  } else {
    return value - remainder;
  }
}