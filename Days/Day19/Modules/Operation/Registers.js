let Constants = require ("../Constants.js");
let {operationOffset, baseOperations} = Constants;

let RegistersBase = require (operationOffset + baseOperations + "/Registers.js");

class Registers extends RegistersBase {
  constructor(...args){
    super(...args);

    this._instruction = 0;
    this._instructionPointerBinding = 0;
  }

  setInstruction(index){
    this._instruction = index;
    this.set(this._instructionPointerBinding, index);
  }
  getInstruction(){ return this._instruction; }
  nextInstruction(){
    this.setInstruction(this.getInstruction() + 1);
    return this._instruction;
  }
  bindInstructionPointer(register){
    this._instructionPointerBinding = register;
  }

  get(register){
    if (register === this._instructionPointerBinding)
      return this._instruction;
    return super.get(register);
  }
  set(register, value){
    if (register === this._instructionPointerBinding)
      this._instruction = value;
    super.set(register, value);
  }
  setValues(...values){
    super.setValues(...values);
  }
}

module.exports = Registers;
