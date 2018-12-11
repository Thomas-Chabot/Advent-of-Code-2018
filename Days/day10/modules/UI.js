/*
  The main class for controlling the UI of the program. This is where everything begins
*/

let Vector2 = require ("./Vector2.js");
let Main = require("./Exercise.js");

class UIBase {
	/* Constructor */
	constructor(text, splitter){
		if (splitter === undefined) splitter = "\n";

		this._text = text;
		this._splitter = splitter;
	}

	/* Public Methods */
	run(){
		this._each((d)=>this._run(d));
	}

	/* Private Methods */
	_init(){
		let lines = this._text.trim().split(this._splitter);
		this._data = this._construct(lines);
	}

	// construct the object from the UI
	_construct(lines){
		let result = [ ];
		for (var i = 0; i < lines.length; i++) {
			result.push(this._parse(lines[i], i));
		}
		return result;
	}

	/* Helper Methods */
	_each(f){
		for (var data of this._data)
			f(data);
	}
	_sort(comparator){
		//console.log("sorting")
		this._data.sort(comparator);
	}

	/* Must Overload */
	_run(data){
		throw new Error("_run method must be overloaded");
	}
	_parse(line, lineNumber){
		throw new Error("_parse method must be overloaded");
	}
}

class UI extends UIBase {
	constructor(text, writeCharacter){
		super(text);

		this._main = new Main(600, 600, writeCharacter);
		this._init();
	}

	async run(writeOutput){
		let main = this._main;
		for (let i = 0; i < 13000; i++){
			if (main.next())
        await writeOutput (main.toString(), i+1);
		}
	}

	_parse(line){
		let [str, pX, pY, vX, vY] = line.replace(/ /g, "")
		                                .match(/position=<([\-0-9]+),([\-0-9]+)>velocity=<([\-0-9]+),([\-0-9]+)>/);

		let position = new Vector2 (parseInt(pX), parseInt(pY));
		let velocity = new Vector2 (parseInt(vX), parseInt(vY));

		this._main.addPoint(position, velocity);
	}
}

module.exports = UI;
