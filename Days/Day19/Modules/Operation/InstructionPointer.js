class InstructionPointer {
  constructor(){
    this._instruction = 0;
  }

  get instruction(){ return this._instruction; }
  
  setInstruction(index){
    this._instruction = index;
  }


}
