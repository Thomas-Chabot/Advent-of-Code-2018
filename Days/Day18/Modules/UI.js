let Constants = require ("./Constants.js");
let {modules, TYPE_LUMBERYARD, TYPE_OPEN, TYPE_TREE} = Constants;

let UIBase = require (modules + "/UIBase.js");
let Exercise = require ("./Exercise.js");

class UI extends UIBase {
  constructor(text, numRows, numColumns){
    super(text);

    this._exercise = new Exercise(numRows, numColumns);

    super._init();
  }

  run(numDays){
    for (let i = 0; i < numDays; i++){
      this._exercise.update();
      console.log("\n" + this.toString())
    }
  }

  toString(){ return this._exercise.toString(); }

  _parse(data, lineNumber){
    let characters = data.trim().split('');
    for (let index in characters) {
      this._parseValue(characters[index], lineNumber, index);
    }
  }
  _parseValue(character, rowNumber, columnNumber){
    this._exercise.set(rowNumber, columnNumber, character);
  }
}

module.exports = UI;
