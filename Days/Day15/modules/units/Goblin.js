let Constants = require ("../Constants.js");
let {HIT_POINTS, ATTACK_POWER, TYPE_GOBLIN} = Constants;

let Unit = require("./Base.js");

class Goblin extends Unit {
  constructor(position){
    super(TYPE_GOBLIN, HIT_POINTS, ATTACK_POWER, position);
  }
}

module.exports = Goblin;
