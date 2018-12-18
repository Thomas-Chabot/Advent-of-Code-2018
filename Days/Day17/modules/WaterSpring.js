let Constants = require ("./Constants.js");
let {TYPE_WATER, TYPE_SAND} = Constants;

class WaterSpring{
  constructor(grid, position){
    this._grid = grid;
    this._position = position;
  }

  fill(){
    let points = [
      this._position
    ];

    while (points.length > 0) {
      let nextPoint = points.pop();
      this._check(nextPoint.down(), points);
      this._check(nextPoint.right(), points);
      this._check(nextPoint.left(), points);

      this._grid.set(nextPoint, TYPE_WATER);
    }
  }

  _check(position, pointsArray){
    if (this._isValid(position))
      pointsArray.push(position);
  }

  _isValid(position){
    return this._grid.get(position) === TYPE_SAND
        && this._grid.borderCheck(position);
  }
}

module.exports = WaterSpring;
