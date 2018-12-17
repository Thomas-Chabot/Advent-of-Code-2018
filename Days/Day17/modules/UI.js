let Constants = require ("./Constants.js");
let {libraryDir, modules, dataStructures} = Constants;

let UIBase = require (modules + "/UIBase.js");
let Exercise = require ("./Exercise.js");

class UI extends UIBase {
  constructor(text){
    super(text);

    this._exercise = new Exercise();

    super._init();
    this._exercise.setupGrid(this._data);
  }

  get output(){ return this._exercise.toString(); }

  /* Running the exercise */
  run(){
    while (this._exercise.hasDrops)
      this._exercise.next();
  }

  /* Input Parsing */
  _parse(data){
    return this._parseWithSetX(data) || this._parseWithSetY(data);
  }
  _parseWithSetX(data){
    return this._doParse(data, /x=([0-9]+), y=([0-9]+)..([0-9]+)/,
                         (x, yS, yE)=>this._getParsedData(x, x, yS, yE));
  }
  _parseWithSetY(data){
    return this._doParse(data, /y=([0-9]+), x=([0-9]+)..([0-9]+)/,
                         (y, xS, xE)=>this._getParsedData(xS, xE, y, y));
  }
  _doParse(data, match, getParsed){
    let result = data.match(match);
    if (!result) return null;

    let [str, firstNum, secondNum, thirdNum] = result;
    [firstNum, secondNum, thirdNum] = [parseInt(firstNum), parseInt(secondNum), parseInt(thirdNum)];

    return getParsed(firstNum, secondNum, thirdNum);
  }
  _getParsedData(xStart, xEnd, yStart, yEnd){
    return {
      xStart,
      xEnd,
      yStart,
      yEnd
    };
  }
}

module.exports = UI;
