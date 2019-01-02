import {
  append as svgAppend,
  attr as svgAttr,
  clear as svgClear,
  create as svgCreate
} from 'tiny-svg';

import {
  classes as domClasses,
  query as domQuery
} from 'min-dom';

var LAYER_NAME = 'djs-grid';

var GRID_DIMENSIONS = {
  width : 100000,
  height: 100000
};

var DEFAULT_SPACING = 10;

export default function Grid(canvas, config, eventBus) {
  this._canvas = canvas;

  this.spacing = config.gridSnapping && config.gridSnapping.spacing || DEFAULT_SPACING;

  this.isVisible = config.gridSnapping && config.gridSnapping.active || false;

  this.hasGrid = false;

  var self = this;

  eventBus.on('diagram.init', function() {
    self._init();

    if (self.isVisible) {
      self.setVisible();
    }
  });
}

Grid.prototype._init = function() {
  var defs = domQuery('defs', this._canvas._svg);

  if (!defs) {
    defs = svgCreate('defs');

    svgAppend(this._canvas._svg, defs);
  }

  var pattern = this.pattern = svgCreate('pattern');

  svgAttr(pattern, {
    id: 'djs-grid-pattern',
    width: this.spacing,
    height: this.spacing,
    patternUnits: 'userSpaceOnUse'
  });

  var circle = this.circle = svgCreate('circle');

  svgAttr(circle, {
    cx: 1,
    cy: 1,
    r: 1,
    fill: '#ddd'
  });

  svgAppend(pattern, circle);

  svgAppend(defs, pattern);

  var grid = this.grid = svgCreate('rect');

  svgAttr(grid, {
    x: -(GRID_DIMENSIONS.width / 2),
    y: -(GRID_DIMENSIONS.height / 2),
    width: GRID_DIMENSIONS.width,
    height: GRID_DIMENSIONS.height,
    fill: 'url(#djs-grid-pattern)'
  });
};

Grid.prototype.toggleVisibility = function() {
  if (this.isVisible) {
    this.setHidden();
  } else {
    this.setVisible();
  }
};


Grid.prototype.setVisible = function() {
  var icon = domQuery('.entry.bpmn-icon-grid', this._canvas.getContainer());

  domClasses(icon).add('highlighted-entry');

  this.isVisible = true;

  var parent = this._getParent();

  svgAppend(parent, this.grid);
};

Grid.prototype.setHidden = function() {
  var icon = domQuery('.entry.bpmn-icon-grid', this._canvas.getContainer());

  domClasses(icon).remove('highlighted-entry');

  this.isVisible = false;

  var parent = this._getParent();

  svgClear(parent);
};

Grid.prototype._setSpacing = function(spacing) {
  if (spacing === this.spacing) {
    return;
  }

  this.spacing = spacing;

  svgAttr(this.pattern, {
    width: this.spacing,
    height: this.spacing
  });
};

Grid.prototype.setColor = function(color) {
  svgAttr(this.circle, {
    fill: color
  });
};

Grid.prototype._getParent = function() {
  return this._canvas.getLayer(LAYER_NAME, -2);
};

Grid.$inject = [
  'canvas',
  'config',
  'eventBus'
];