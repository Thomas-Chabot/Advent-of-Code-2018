/* Constants */
let Constants = require ("./Constants.js");
let {libraryDir, modules} = Constants;

/* Dependencies */
let Point = require (libraryDir + "/Point.js");
let UIBase = require (modules + "/UIBase.js");
let Direction = require (libraryDir + "/Direction.js");
let Exercise = require ("./Exercise.js");

/* UI Class */
class UI extends UIBase {
	constructor(text){
		super(text, "");

		let lines = text.split("\n");

		this._lines = lines;

		this._exercise = new Exercise(lines.length, lines[0].length);
		this._init();
	}

	get grid(){ return this._exercise._grid; }
	run(){
		let hasCollided = false;
		let i = 0;
		while (!hasCollided){
			i++;

			hasCollided = this._exercise.update();
			this.print();
		}

		console.log (this._exercise.collision);
	}

	print(){
			console.log(this.grid.toString());
	}

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
		this._parseValidMovements(character, position);
		this._parseCart(character, position);

		return character;
	}
	_parseValidMovements(character, position){
		let validMoves = this._calculateMoves(position, character)
		console.log(`Position ${position.toString()} is character ${character} with valid moves ${validMoves}`)
		if (!validMoves) return;

		this._exercise.setValidMoves(position, validMoves);
		this._exercise.setFloor(position);
	}
	_parseCart(character, position){
		switch(character.toLowerCase()){
			case "^":
				this._exercise.addCart(position, Direction.up);
				break;
			case "<":
				this._exercise.addCart(position, Direction.left);
				break;
			case ">":
				this._exercise.addCart(position, Direction.right);
				break;
			case "v":
				this._exercise.addCart(position, Direction.down);
				break;
		}
	}

	_calculateMoves(position, character){
		switch (character.toLowerCase()){
			case "|":
			case "^":
			case "v":
				return [
								{space: position.up(), direction: "up"},
				 		 		{space: position.down(), direction: "down"}
							 ];
			case "-":
			case "<":
			case ">":
				return [
					{space: position.left(), direction: Direction.left},
					 position.right()];
			case "/":
				return [position.down(), position.right()];
			case "\\":
				return [position.down(), position.left()];
			case "+":
				return [position.up(), position.left(), position.right(), position.down()];
			default:
				return null;
		}
	}
}

module.exports = UI;
