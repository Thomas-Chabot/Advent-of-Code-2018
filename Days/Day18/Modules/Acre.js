let Constants = require ("./Constants.js");
let {TYPE_TREE, TYPE_OPEN, TYPE_LUMBERYARD} = Constants;

class Acre {
  constructor(position, grid, type){
    this._position = position;
    this._grid = grid;
    this._type = type;
  }

  get type(){ return this._type; }
  set type(t){ this._type = t; }

  set grid(g){ this._grid = g; }

  update(){
    let surroundings = this._getSurroundingCounts();
    let newType = this._getNewType(surroundings);
    this._type = newType;
  }
  print(){
    this._grid.set(this._position, this._type);
  }

  toString(){ return this._type; }

  _getSurroundingCounts(){
    let surroundings = this._grid.getSurroundings(this._position);
    let totals = {
      [TYPE_TREE]: 0,
      [TYPE_OPEN]: 0,
      [TYPE_LUMBERYARD]: 0
    };

    for (let key in surroundings) {
      let spaceType = surroundings[key].spaceType;
      let value = spaceType ? spaceType.type : '';
      if (totals[value] !== undefined)
        totals[value] ++;
    }

    return totals;
  }

  _getNewType(surroundings){
    switch (this._type){
      case TYPE_TREE:
        return this._updateTree(surroundings);
      case TYPE_LUMBERYARD:
        return this._updateLumberYard(surroundings);
      case TYPE_OPEN:
        return this._updateOpen(surroundings);
      default:
        console.error(`Unknown type: ${this._type}`);
        return this._type;
    }
  }
  _updateTree(surroundingCounts){
    if (surroundingCounts[TYPE_LUMBERYARD] >= 3)
      return TYPE_LUMBERYARD;
    return TYPE_TREE;
  }
  _updateOpen(surroundingCounts){
    if (surroundingCounts[TYPE_TREE] >= 3)
      return TYPE_TREE;
    return TYPE_OPEN;
  }
  _updateLumberYard(surroundingCounts){
    if (surroundingCounts[TYPE_TREE] >= 1 && surroundingCounts[TYPE_LUMBERYARD] >= 1)
      return TYPE_LUMBERYARD;
    return TYPE_OPEN;
  }
}

module.exports = Acre;
