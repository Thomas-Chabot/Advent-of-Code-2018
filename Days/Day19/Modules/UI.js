let Constants = require ("./Constants.js");
let {modules} = Constants;

let UIBase = require (modules + "/UIBase.js");
let Exercise = require ("./Exercise.js");

class UI extends UIBase {
  constructor(text){
    super(text);

    this._instructionPointerIndex = -1;
    this._init();

    this._exercise = new Exercise(1,0,0,0,0,0);
  }

  run(){
    this._exercise.setInstructionBinding(this._instructionPointerIndex);
    this._exercise.runOperations(this._data);
  }

  toString(){ return this._exercise.toString(); }

  _parse(data){
    if (data.startsWith("#ip"))
      return this._parseInstructionPointer(data);
    return this._parseOperation(data);
  }
  _parseInstructionPointer(data){
    let [str, index] = data.match(/#ip ([0-9]+)/);
    this._instructionPointerIndex = parseInt(index);
  }
  _parseOperation(data){
    let [str, opCode, inputA, inputB, output] = data.match(/([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+)/);
    return this._parseInts(opCode, inputA, inputB, output);
  }
}

module.exports = UI;