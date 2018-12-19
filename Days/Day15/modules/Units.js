let Constants = require ("./Constants.js");
let {dataStructures, TYPE_GOBLIN, TYPE_ELF} = Constants;

let PriorityQueue = require (dataStructures + "/PriorityQueue.js");
let LinkedList    = require (dataStructures + "/DoublyLinkedList.js");

let Elf = require ("./units/Elf.js");
let Goblin = require ("./units/Goblin.js");

class Units {
  constructor(){
    this._units = this._createPQueue();
    this._elves = new LinkedList();
    this._goblins = new LinkedList();

    this._currentRound = 0;
    this._hasGameEnded = false;
  }

  get isGameOver(){
      return this._hasGameEnded;
  }
  get totalHitPoints(){
    let hitPoints = 0;
    this._units.each((unit)=>{
      hitPoints += unit.hitPoints;
    });
    return hitPoints;
  }

  nextRound(){
    let gameEnded = false;
    this._units.each((unit)=>{
      if (gameEnded) return;

      let targets = this._getTargets(unit);
      gameEnded = !unit.takeTurn(targets);
    });

    this._currentRound ++;
    this._hasGameEnded = gameEnded;

    return !gameEnde;
  }
  addElf(position){
    let elf = new Elf(position);
    this._addUnit(elf, this._elves);
  }
  addGoblin(position){
    let goblin = new Goblin(position);
    this._addUnit(goblin, this._goblins);
  }


  _getTargets(unit){
    if (unit.type === TYPE_ELF)
      return this._goblins;
    return this._elves;
  }

  _addUnit(unit, unitArray){
    this._units.push(unit);
    unitArray.push(unit);
  }
  _createPQueue(){
    return new PriorityQueue((a,b)=>a.compareTo(b)<0);
  }
}
