let Constants = require ("../Constants.js");
let {HIT_POINTS, ATTACK_POWER, TYPE_ELF} = Constants;

let Unit = require("./Base.js");

class Elf extends Unit {
  constructor(position){
    super(TYPE_ELF, HIT_POINTS, ATTACK_POWER, position);
  }
}

module.exports = Elf;
