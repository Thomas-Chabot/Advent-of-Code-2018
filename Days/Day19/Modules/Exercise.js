let Constants = require ("./Constants.js");
let {baseCode, operation, DEBUG} = Constants;

let ExerciseBase = require (baseCode + "/Main.js");
let InstructionPointer = require (operation + "/InstructionPointer.js");
let Registers = require (operation + "/Registers.js");

class Exercise extends ExerciseBase {
  constructor(...values){
    super(...values);

    // Overload the Registers class
    this._setRegisters(new Registers(...values))
  }

  updateInstruction(index){
    this._registers.setInstruction(index);
  }
  getCurrentInstruction(){
    return this._registers.getInstruction();
  }
  nextInstruction(){ return this._registers.nextInstruction(); }
  setInstructionBinding(register){
    this._registers.bindInstructionPointer(register);
  }

  runOperations(data){
    let index = 0;
    let currentRun = 0;
    while (index >= 0 && index < data.length && currentRun < 5000){
      currentRun++;

      if (DEBUG)
        this._writeDebugMessage(data);

      this.updateInstruction(index);
      this._run(data[index]);

      index = this.nextInstruction();
    }
  }

  _run(data){
    let [operation, inputA, inputB, output] = data;
    this.run(operation, inputA, inputB, output);
  }

  _writeDebugMessage(data){
    let lineNumber = this.getCurrentInstruction();
    let instruction = data[lineNumber];
    let registerValues = this._registers.toString();

    console.log(`ip=${lineNumber} [${registerValues}] ${instruction}`);
  }
}

module.exports = Exercise;
