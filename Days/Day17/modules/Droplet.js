let Constants = require ("./Constants.js");
let {TYPE_WATER, TYPE_SAND} = Constants;

class Droplet {
  constructor(grid, position){
    this._grid = grid;
    this._position = position;
  }

  print(){
    this._grid.set(this._position, TYPE_WATER);
  }
  
/*
  drop(){
    return this._checkMoveDown() ||
           this._checkMoveLeft() ||
           this._checkMoveRight();
  }

  _checkMoveDown(){
    return this._attemptDrop(this._position.down());
  }
  _checkMoveLeft(){
    return this._attemptDrop(this._position.left());
  }
  _checkMoveRight(){
    return this._attemptDrop(this._position.right());
  }

  _attemptDrop(position){
    if (!this._canDrop(position)) return false;

    this._grid.set(this._position, TYPE_SAND);
    this._grid.set(position, TYPE_WATER);

    this._position = position;
    return true;
  }
  _canDrop(position){
    return this._grid.get(position) === TYPE_SAND
        && this._grid.borderCheck(position);
  }
*/
}

module.exports = Droplet;
