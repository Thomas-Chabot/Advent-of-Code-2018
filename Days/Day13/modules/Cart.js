/* Constants */
let Constants = require ("./Constants.js");
let {TYPE_WALL, TYPE_FLOOR, TYPE_CART} = Constants;

class Cart {
  constructor(position, direction){
    this._position = position;
    this._direction = direction;
  }

  get currentRow(){ return this._position.x; }
  get currentCol(){ return this._position.y; }

  update(grid){
    grid.set(this._position, TYPE_FLOOR);
    this.getPaths(grid);

  //  grid.set(this._position, TYPE_CART);
//    console.log(this._position.toString(), grid.get(this._position), TYPE_CART);
  }

  getPaths(grid){
    let validSpaces = grid.getAdjacent(this._position, TYPE_FLOOR);
    console.log(validSpaces);
  }
}

module.exports = Cart;
