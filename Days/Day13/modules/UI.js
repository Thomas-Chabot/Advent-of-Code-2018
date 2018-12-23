/* Constants */
let Constants = require ("./Constants.js");
let {libraryDir, modules, FLOOR_TYPES, TYPE_FLOOR, TYPE_CART} = Constants;

/* Dependencies */
let Point = require (vectors + "/Point.js");
let UIBase = require (modules + "/UIBase.js");
let Direction = require (vectors + "/Direction.js");
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
	run(save){
		let hasCollided = false;
		let i = 0;
		let next = ()=>{
			if (hasCollided)
				return console.log (this._exercise.collision);

			i++;

			hasCollided = this._exercise.update();
			save(this.grid.toString()).then(next);
		}

		next();
	}

	print(){
			console.log(this.grid.toString());
	}

	_init(){
		this._initGrid((char, position)=>this._parse(char, position));
		this._initGrid((char, position)=>this._parseValidMovements(char, position));
	}
	_initGrid(initFunc){
		let lines = this._lines;
		for (let lineIndex = 0; lineIndex < lines.length; lineIndex++){
			let line = lines[lineIndex].split("");
			for (let charIndex = 0; charIndex < line.length; charIndex++){
				let position = new Point(lineIndex, charIndex);
				initFunc(line[charIndex], position);
			}
		}
	}
	_parse(character, position){
		this._parseFloor(character, position);
		this._parseCart(character, position);

		return character;
	}
	_parseFloor(character, position){
		let isFloor = this._isValidFloorType(character);
		if (!isFloor) return;

		this._exercise.setFloor(position);
	}
	_parseValidMovements(character, position){
		let validMoves = this._calculateMoves(position, character, this.grid);
		if (!validMoves) return;

		this._exercise.setValidMoves(position, validMoves);
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

	_isValidFloorType(character){
		return FLOOR_TYPES[character] !== undefined;
	}
	_areValidPositions(grid, ...positions){
		let isFloor = (type)=>{
			return type === TYPE_FLOOR || type === TYPE_CART;
		}
		for (let position of positions){
			if (!isFloor(grid.get(position)))
				return false;
		}
		return true;
	}
	_calculateMoves(position, character, grid){
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
					{space: position.left(), direction: "left"},
					{space: position.right(), direction: "right"}
				];
			case "/":
				var down = position.down();
				var right = position.right();

				if (this._areValidPositions(grid, down, right))
					return [
						{space: position.down(), direction: "down"},
						{space: position.right(), direction: "right"}
					];

				return [
					{ space: position.up(), direction: "up" },
					{ space: position.left(), direction: "left" }
				]
			case "\\":
				var down = position.down();
				var left = position.left();
				if (this._areValidPositions(grid, down, left))
					return [
						{space: position.down(), direction: "down"},
						{space: position.left(), direction: "left"}
					];
				return [
					{space: position.up(), direction: "up"},
					{space: position.right(), direction: "right"}
				]
			case "+":
				return [
					{space: position.up(), direction: "up"},
					{space: position.left(), direction: "left"},
					{space: position.right(), direction: "right"},
					{space: position.down(), direction: "down"}
				];
			default:
				return null;
		}
	}
}

module.exports = UI;
