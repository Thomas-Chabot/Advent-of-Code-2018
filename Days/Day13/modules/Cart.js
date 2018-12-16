/* Constants */
let Constants = require ("./Constants.js");
let {libraryDir, dataStructures, TYPE_WALL, TYPE_FLOOR, TYPE_CART, CART_TURNS} = Constants;

let Direction = require (libraryDir + "/Direction.js");
let CircularArray = require (dataStructures + "/CircularArray.js");

class Cart {
  constructor(position, direction){
    this._position = position;
    this._direction = direction;

    this._rotations = new CircularArray(...CART_TURNS);
    this._curRotation = 0;
  }

  get currentRow(){ return this._position.x; }
  get currentCol(){ return this._position.y; }

  hasCollision(grid){
    return grid.get(this._position) === TYPE_CART;
  }
  
  printTo(grid){
    grid.set(this._position, TYPE_CART);
  }

  update(grid){
    grid.set(this._position, TYPE_FLOOR);

    let nextMove = this._getNextMove(grid);

    this._position = this._position.add(nextMove);
    this._direction = nextMove;

    return this._hasCollision;
  }

  _getNextMove(grid){
    let validPaths = this._getPaths(grid);
    if (validPaths.length === 1)
      return this._parseDirection(validPaths[0]);
    else
      return this._turn(validPaths);
  }
  _getPaths(grid){
    let validSpaces = grid.getAdjacent(this._position, [TYPE_FLOOR, TYPE_CART]);
    let prevPosition = this._position.add(this._direction.inverse());

    let result = [ ];
    for (let space of validSpaces){
      if (space.space.equals(prevPosition))
        continue;

      result.push(space);
    }

    return result;
  }

  _turn(){
    let nextRotation = this._rotations.get(this._curRotation ++);
    let direction = this._direction.rotate(nextRotation);

    this._direction = direction;
    return direction;
  }

  _parseDirection(move){
    return Direction[move.direction];
  }
}

module.exports = Cart;
