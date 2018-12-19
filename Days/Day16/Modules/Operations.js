let Constants = require ("./OpCodes.js");
let {
  OPCODE_ADDR, OPCODE_ADDI,
  OPCODE_MULR, OPCODE_MULI,
  OPCODE_BANR, OPCODE_BANI,
  OPCODE_BORR, OPCODE_BORI,
  OPCODE_SETR, OPCODE_SETI,
  OPCODE_GTIR, OPCODE_GTRI, OPCODE_GTRR,
  OPCODE_EQIR, OPCODE_EQRI, OPCODE_EQRR
} = Constants;

class Operations {
  constructor(registers){
    this._registers = registers;
  }

  set registers(r){ this._registers = r; }

  /** Public Methods **/
  // Main run command - runs an operation on given inputs w/ given output
  run(op, inputA, inputB, outputRegister){
    let result = this.getResult(op, inputA, inputB);
    this._storeInRegister(outputRegister, result);
  }

  // Return result from running an operation with inputA and inputB
  getResult(op, inputA, inputB){
    return this._runOperation(op, inputA, inputB);
  }

  /** Private Methods **/
  // Register Helpers
  _getRegisterValue(register){
    return this._registers.get(register);
  }
  _storeInRegister(register, value){
    this._registers.set(register, value);
  }

  // Convert a boolean to a register value
  _convertBoolean(bool){
    return (bool ? 1 : 0);
  }

  /* Operations */
  // main switch
  _runOperation(op, a, b){
    switch (op){
      case OPCODE_ADDR:
        return this._addr(a,b);
      case OPCODE_ADDI:
        return this._addi(a,b);
      case OPCODE_MULR:
        return this._mulr(a,b);
      case OPCODE_MULI:
        return this._muli(a,b);
      case OPCODE_BANR:
        return this._banr(a,b);
      case OPCODE_BANI:
        return this._bani(a,b);
      case OPCODE_BORR:
        return this._borr(a,b);
      case OPCODE_BORI:
        return this._bori(a,b);
      case OPCODE_SETR:
        return this._setr(a,b);
      case OPCODE_SETI:
        return this._seti(a,b);
      case OPCODE_GTIR:
        return this._gtir(a,b);
      case OPCODE_GTRI:
        return this._gtri(a,b);
      case OPCODE_GTRR:
        return this._gtrr(a,b);
      case OPCODE_EQIR:
        return this._eqir(a,b);
      case OPCODE_EQRI:
        return this._eqri(a,b);
      case OPCODE_EQRR:
        return this._eqrr(a,b);
      default:
        throw `Unknown Operation: ${op}`;
    }
  }

  // add
  _addr(a,b){
    return this._getRegisterValue(a) + this._getRegisterValue(b);
  }
  _addi(a,b){
    return this._getRegisterValue(a) + b;
  }

  // multiply
  _mulr(a,b){
    return this._getRegisterValue(a) * this._getRegisterValue(b);
  }
  _muli(a,b){
    return this._getRegisterValue(a) * b;
  }

  // binary and
  _banr(a,b){
    return this._getRegisterValue(a) & this._getRegisterValue(b);
  }
  _bani(a,b){
    return this._getRegisterValue(a) & b;
  }

  // binary or
  _borr(a,b){
    return this._getRegisterValue(a) | this._getRegisterValue(b);
  }
  _bori(a,b){
    return this._getRegisterValue(a) | b;
  }

  // set
  _setr(a,b){
    return this._getRegisterValue(a);
  }
  _seti(a,b){
    return a;
  }

  // greater than
  _gtir(a,b){
    return this._convertBoolean(a > this._getRegisterValue(b));
  }
  _gtri(a,b){
    return this._convertBoolean(this._getRegisterValue(a) > b);
  }
  _gtrr(a,b){
    return this._convertBoolean(this._getRegisterValue(a) > this._getRegisterValue(b));
  }

  // equality
  _eqir(a,b){
    return this._convertBoolean(a === this._getRegisterValue(b));
  }
  _eqri(a,b){
    return this._convertBoolean(this._getRegisterValue(a) === b);
  }
  _eqrr(a,b){
    return this._convertBoolean(this._getRegisterValue(a) === this._getRegisterValue(b));
  }


}

module.exports = Operations;
