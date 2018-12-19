let Operations = require("./Operations.js");
let OpCodes    = require("./OpCodes.js");
let OpCodeData = require("./OpCodeData.js");
let Registers  = require("./Registers.js");

class Exercise {
  constructor(...values){
    this._registers = new Registers(...values);
    this._operations = new Operations(this._registers);

    this._operatorCodes = new OpCodeData();
  }

  get operatorCodes(){ return this._operatorCodes.toString(); }
  get registers(){ return this._registers; }
  
  clearRegisters(){ this._registers.clear(); }

  calculateOperatorCodes(){
    this._operatorCodes.calculateOperatorIndices();
  }

  run(opCode, inputA, inputB, output){
    let operator = this._operatorCodes.getOperator(opCode);
    this._operations.run(operator, inputA, inputB, output);
  }

  getPossibleOperations(registerValues, inputA, inputB, expectedOutput){
    this._registers.setValues(...registerValues);

    let possibleCodes = [ ];
    for (let opCodeType in OpCodes){
      let opCode = OpCodes[opCodeType];
      if (this._operations.getResult(opCode, inputA, inputB) === expectedOutput)
        possibleCodes.push(opCodeType);
    }

    return possibleCodes;
  }
  storeOpCodes(opCodeIndex, possibleOperations){
    this._operatorCodes.store(opCodeIndex, possibleOperations);
  }
}

module.exports = Exercise;
