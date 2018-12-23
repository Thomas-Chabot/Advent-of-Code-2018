let Point = require ("./Vector2.js");

let Direction = {
  right: new Point(0, 1), // seems backwards, but it's (row, column) - one column to the right
  left: new Point(0, -1),
  up: new Point(-1, 0),
  down: new Point(1, 0)
}

module.exports = Direction;
