let Constants = require ("./Constants.js");
let {modules, MIN_POSSIBLE_OPERATIONS} = Constants;

let UIBase = require (modules + "/UIBase.js");
let Exercise = require ("./Exercise.js");

class UI extends UIBase {
  constructor(text){
    let textPortions = text.trim().split("\n\n\n");
    let textP1 = textPortions[0];
    let textP2 = textPortions[1];

    super(textP1, "\n\n");

    this._exercise = new Exercise();
    this._linesP2 = textP2.split("\n");

    this._init();
  }

  run(){
    this._numValid = 0;
    super.run();
    console.log(`Part 1 Result: ${this._numValid}`);

    this._runPart2();
  }


  // Running
  _run(data){
    let registerValues = data.before;
    let [opCode, inputA, inputB, outputIndex] = data.operationData;
    let afterValues = data.after;

    let expectedResult = afterValues[outputIndex];
    let possibleOperations = this._exercise.getPossibleOperations(registerValues, inputA, inputB, expectedResult);

    this._exercise.storeOpCodes(opCode, possibleOperations);

    if (possibleOperations.length >= MIN_POSSIBLE_OPERATIONS)
      this._numValid ++;
  }
  _runPart2(){
    this._exercise.calculateOperatorCodes();
    this._exercise.clearRegisters();

    for (let line of this._linesP2){
      if (!line) continue;

      let [opCode, inputA, inputB, output] = this._parseOperation(line);
      this._exercise.run(opCode, inputA, inputB, output);
    }

    let registers = this._exercise.registers;
    console.log(`Part 2 Result: ${registers.get(0)}`);
  }


  // Parsing
  _parse(data){
    let lines = data.split("\n");

    let registerValuesBefore = this._parseRegisters(lines[0])
    let registerValuesAfter  = this._parseRegisters(lines[2]);
    let operationValues = this._parseOperation(lines[1]);

    return {
      before: registerValuesBefore,
      after: registerValuesAfter,
      operationData: operationValues
    };
  }
  _parseRegisters(data){
    let [str, v1, v2, v3, v4] = data.match(/\[([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+)\]/);
    return this._parseInts(v1, v2, v3, v4);
  }
  _parseOperation(data){
    let [str, opCode, inputA, inputB, output] = data.match(/([0-9]+) ([0-9]+) ([0-9]+) ([0-9]+)/);
    return this._parseInts(opCode, inputA, inputB, output);
  }
}

module.exports = UI;
