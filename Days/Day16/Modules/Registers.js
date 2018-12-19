class Registers {
  constructor(...values){
    this._registers = values;
  }

  get size(){ return this._registers.length; }

  get(register){
    return this._registers[register];
  }
  set(register, value){
    this._registers[register] = value;
  }
  setValues(...values){
    this._registers = values;
  }
  clear(){
    for (let index in this._registers)
      this._registers[index] = 0;
  }

  equals(otherRegisters){
    if (this._registers.size !== otherRegisters.size) return false;

    let isEqual = true;
    this._each((value, register)=>{
      if (otherRegisters.get(register) !== value){
        isEqual = false;
        return false;
      }
    });

    return isEqual;
  }

  _each(f){
    for (let i = 0; i < this.size; i++)
      f(this.get(i), i);
  }
}

module.exports = Registers;
