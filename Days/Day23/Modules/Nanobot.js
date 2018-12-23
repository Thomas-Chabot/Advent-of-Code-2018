let Constants = require ("./Constants.js");
let {vectors} = Constants;

let Vector3 = require(vectors + "/Vector3.js");

class Nanobot {
  constructor(position, signalStrength){
    this._position = position;
    this._strength = signalStrength;
  }

  get range(){ return this._strength; }
  get position(){ return this._position; }

  hasWithinRange(otherBot){
    let distance = this._distanceTo(otherBot);
    return distance <= this.range;
  }

  toString(){
    return `Nanobot at position ${this.position.toString()} with range ${this.range}`;
  }

  _distanceTo(otherBot){
    return this.position.distanceTo(otherBot.position);
  }
}

module.exports = Nanobot;
