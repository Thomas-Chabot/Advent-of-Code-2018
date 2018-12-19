let Constants = require ("./Constants.js");
let {TYPE_OPEN} = Constants;

let EventEmitter = require("events");

class Unit {
    constructor(unitType, hitPoints, attackPower, position, grid){
      this._type = unitType;
      this._hp = hitPoints;
      this._attackPower = attackPower;
      this._position = position;
      this._grid = grid;

      this.Events = new EventEmitter();
    }

    /* Public Getters */
    // Stats
    get position(){ return this._position; }
    get hitPoints(){ return Math.max(this._hp, 0); }
    get isFainted(){ return this._hp <= 0; }
    get type(){ return this._type; }

    // Adjacent Positions
    get up(){ return this._position.up(); }
    get down(){ return this._position.down(); }
    get left(){ return this._position.left(); }
    get right(){ return this._position.right(); }

    /* Public Methods */
    takeTurn(targets){
      let [canAttack, possibleTargets] = this._canAttack(targets)
      let hasValidMove = canAttack;

      if (canAttack)
        this._attack(possibleTargets);
      else
        return this._move(targets);

      return hasValidMove;
    }
    takeDamage(damage){
      this._hp -= damage;
      this._checkFainted();
    }
    moveTo(newPosition){
      this._position = newPosition;
    }

    // Operator Overloading
    toString(){ return this._type; }
    compareTo(otherUnit){
      if (this.position.row < otherUnit.position.row) return -1;
      if (this.position.row > otherUnit.position.row) return 1;

      return this.position.column - otherUnit.position.column;
    }

    /* Private Methods */
    // fainting
    _checkFainted(){
      if (!this.isFainted) return;
      this.Events.emit('Fainted')
    }

    // attack
    _canAttack(targets){
      // Unit can attack only when they are adjacent to a target
      let possibleTargets = [ ];
      targets.each((target)=>{
        if (target.position.isAdjacentTo(this.position)){
          possibleTargets.push(target);
        }
      });
      return [possibleTargets.length !== 0, possibleTargets];
    }
    _attack(targets){
      let target = this._getBestTarget(targets);
      target.takeDamage(this._attackPower);
    }
    _getBestTarget(targets){
      let bestTarget = targets[0];
      for (let i = 1; i < targets.length; i++){
        if (targets[i].hitPoints < bestTarget.hitPoints)
          bestTarget = targets[i];
      }
      return bestTarget;
    }

    // move
    _move(targets){
      return false;
    }

    // grid
    _isOpen(position){
      return this._grid.get(position) === TYPE_OPEN;
    }
}

module.exports = Unit;
