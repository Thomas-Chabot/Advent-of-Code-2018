let Point = require ("./Point.js");

let Direction = {
  up: new Point(0, 1),
  down: new Point(0, -1),
  left: new Point(0, -1),
  right: new Point(0, 1)
}

return Direction;
