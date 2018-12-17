let Constants = require ("./Constants.js");
let {dataStructures, TYPE_SAND, TYPE_CLAY} = Constants;

let Grid = require (dataStructures + "/GrowableGrid.js");
let Spring = require ("./WaterSpring.js");

class Exercise {
  constructor(){
    this._grid = new Grid(TYPE_SAND);
    this._spring = new Spring(0, 500);
  }

  get hasDrops(){ return this._spring.isValid; }

  next(){
    this._spring.next();
  }

  setupGrid(clayPoints){
    for (let pointData of clayPoints)
      this._setClay(pointData);
  }

  toString(){ return this._grid.toString(); }

  _setClay(pointData){
    for (let row = pointData.yStart; row <= pointData.yEnd; row++){
      for (let col = pointData.xStart; col <= pointData.xEnd; col++){
        this._grid.set(row, col, TYPE_CLAY);
      }
    }
  }
}

module.exports = Exercise;
