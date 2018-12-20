let Constants = require ("./Constants.js");
let {libraryDir, dataStructures} = Constants;

let Acre = require ("./Acre.js");
let Grid = require (dataStructures + "/Grid.js");
let Point = require (libraryDir + "/Point.js");

class Exercise {
  constructor(numRows, numColumns){
    this._grid = new Grid(numRows, numColumns, this._createAcre);
    this._each((acre)=>acre.grid = this._grid);
  }

  set(rowNum, colNum, type){
    this._grid.get(rowNum, colNum).type = type;
  }

  update(){
    this._each((acre)=>acre.update())
  }

  toString(){ return this._grid.toString(); }

  _each(f){
    let grid = this._grid;
    grid.each((row,col)=>{
      let acre = grid.get(row,col);
      f(acre);
    });
  }
  _createAcre(row, col){
    let point = new Point(row, col);
    return new Acre(point);
  }
}

module.exports = Exercise;
