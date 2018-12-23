let Constants = require ("./Constants.js");
let {modules, vectors} = Constants;

let UIBase = require (modules + "/UIBase.js");
let Vector3 = require (vectors + "/Vector3.js");
let Exercise = require ("./Exercise.js");

class UI extends UIBase {
  constructor(data){
    super(data);

    this._exercise = new Exercise();

    this._init();
  }

  get result(){ return this._exercise.botsInRange; }

  _parse(data){
    let [str, posX, posY, posZ, range] = data.match(/pos=<([\-0-9]+),([\-0-9]+),([\-0-9]+)>, r=([0-9]+)/);
    [posX, posY, posZ, range] = this._parseInts(posX, posY, posZ, range);

    let position = new Vector3(posX, posY, posZ);
    this._exercise.addBot(position, range);
  }
}

module.exports = UI;
