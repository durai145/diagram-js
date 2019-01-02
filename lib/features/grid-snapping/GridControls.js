import {
  domify,
  query as domQuery
} from 'min-dom';

import {
  assign
} from 'min-dash';

var INCREMENT = 5;


export default function GridControls(canvas, eventBus, grid, gridSnapping) {
  this._canvas = canvas;
  this._grid = grid;
  this._gridSnapping = gridSnapping;

  var self = this;

  eventBus.on('diagram.init', function() {
    self._init();
  });
}

GridControls.prototype._init = function() {
  var parent = domify('<div class="djs-grid-controls">' +
    '<span class="djs-grid-label">Size</span>' +
    '<div class="djs-grid-buttons">' +
      '<button class="djs-grid-button djs-grid-decrease"><span class="icon bpmn-icon-minus"></button>' +
      '<button class="djs-grid-button djs-grid-increase"><span class="icon bpmn-icon-plus"></button>' +
    '</div>' +
    '<span class="djs-grid-label">Color</span>' +
    '<div class="djs-grid-buttons">' +
      '<button class="djs-grid-button djs-grid-decrease djs-grid-color grey"></button>' +
      '<button class="djs-grid-button djs-grid-increase djs-grid-color green"></button>' +
    '</div>' +
  '</div>');

  assign(parent.style, {
    display: 'none',
    position: 'absolute',
    top: '20px',
    left: '20px'
  });

  this._canvas.getContainer().appendChild(parent);

  var decrease = domQuery('.djs-grid-decrease', parent),
      increase = domQuery('.djs-grid-increase', parent),
      colorGrey = domQuery('.djs-grid-color.grey', parent),
      colorGreen = domQuery('.djs-grid-color.green', parent);

  var self = this;

  decrease.addEventListener('click', function() {
    var spacing = self._gridSnapping.getSpacing();

    var newSpacing = Math.max(5, spacing - INCREMENT);

    self._gridSnapping.setSpacing(newSpacing);
  });

  increase.addEventListener('click', function() {
    var spacing = self._gridSnapping.getSpacing();

    var newSpacing = Math.min(25, spacing + INCREMENT);

    self._gridSnapping.setSpacing(newSpacing);
  });

  colorGrey.addEventListener('click', function() {
    self._grid.setColor('#ddd');
  });

  colorGreen.addEventListener('click', function() {
    self._grid.setColor('#52b415');
  });

  this._canvas.getContainer().addEventListener('contextmenu', function(event) {
    event.preventDefault();

    assign(parent.style, {
      display: 'flex',
      top: event.offsetY + 'px',
      left: event.offsetX + 'px'
    });
  });

  this._canvas.getContainer().addEventListener('click', function(event) {
    if (parent.contains(event.target) || parent === event.target) {
      return;
    }

    assign(parent.style, {
      display: 'none'
    });
  });
};

GridControls.$inject = [
  'canvas',
  'eventBus',
  'grid',
  'gridSnapping'
];