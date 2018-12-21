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

  set processLine(f){ this._onLineProcessed = f; }

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

  setRegisterValues(...values){
    this._registers.setValues(...values);
  }
  getRegisterValue(index){ return this._registers.get(index); }

  runOperations(data, startingIndex, exitIndex){
    let index = (startingIndex === undefined ? this._registers.getInstruction() : 0);
    if (!exitIndex) exitIndex = -1;

    while (index >= 0 && index < data.length){
      if (DEBUG)
        this._writeDebugMessage(data);

      if (!this._processLine())
        break;

      this.updateInstruction(index);
      this._run(data[index]);

      if (index === exitIndex) return;

      index = this.nextInstruction();
    }
  }

  calculateResult(x){
    // NOTE: This was taken by translating the ElfCode into JavaScript code,
    //       then finding a more efficient method of calculating the result.
    // This may or may not work for other inputs
    let result = 0;
    for (let i = 1; i <= x; i++){
    	if (x % i === 0)
    		result += i;
    }
    return result;
  }

  _run(data){
    let [operation, inputA, inputB, output] = data;
    this.run(operation, inputA, inputB, output);
  }

  _writeDebugMessage(data){
    let lineNumber = this.getCurrentInstruction();
    let instruction = data[lineNumber];
    let registerValues = this._registers.toString();

    let output = `ip=${lineNumber} [${registerValues}] ${instruction}`;
  }

  _processLine(){
    if (!this._onLineProcessed) return true;

    let lineNumber = this.getCurrentInstruction();
    let result = this._onLineProcessed(lineNumber);
    return result !== false;
  }
}

module.exports = Exercise;
