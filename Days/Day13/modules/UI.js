let libraryDir = "../../../Library";
let UIBase = require (libraryDir + "/UIBase.js");

class UI extends UIBase {
	constructor(text){
		super(text, "");
		
		let lines = text.split("\n");
		
		this._lines = lines;
		console.log(lines);
		
		this._exercise = new ExerciseMain(lines.length, lines[0].length);
		this._init();
	}
	
	get grid(){ return this._exercise._grid; }
	
	_init(){
		let lines = this._lines;
		for (let lineIndex = 0; lineIndex < lines.length; lineIndex++){
			let line = lines[lineIndex].split("");
			for (let charIndex = 0; charIndex < line.length; charIndex++){
				let position = new Point(lineIndex, charIndex);
				this._parse(line[charIndex], position);
			}
		}
	}
	_parse(character, position){
		switch(character){
			case "|":
			case "-":
			case "/":
			case "\\":
			case "+":
				this._exercise.setFloor(position);
		}
		return character;
	}
}

module.exports = UI;
