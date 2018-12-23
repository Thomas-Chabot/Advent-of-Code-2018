let Constants = require ("./Constants.js");
let {dataStructures} = Constants;

let PriorityQueue = require (dataStructures + '/PriorityQueue.js');
let Nanobot = require ("./Nanobot.js");

class Exercise {
  constructor(){
    this._nanobotsQueue = new PriorityQueue((a,b)=>a.range>b.range);
    this._nanobots = [ ];
  }

  get bestBot(){ return this._nanobotsQueue.peek(); }
  get botsInRange(){
    let best = this.bestBot;
    let result = 0;
    for (let bot of this._nanobots){
      if (best.hasWithinRange(bot))
        result++;
    }
    return result;
  }
  addBot(position, range){
    let bot = new Nanobot(position, range);
    console.log(`Adding bot ${bot.toString()}`);

    this._nanobots.push(bot);
    this._nanobotsQueue.push(bot);
  }


}

module.exports = Exercise;
