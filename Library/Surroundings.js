let Point = require ("./Point.js");

let Surroundings = {
  right: new Point(0, 1), // seems backwards, but it's (row, column) - one column to the right
  left: new Point(0, -1),
  up: new Point(-1, 0),
  down: new Point(1, 0),
  upLeft: new Point(1, -1),
  upRight: new Point(1, 1),
  downLeft: new Point(-1, -1),
  downRight: new Point(-1, 1)
}

module.exports = Surroundings;
