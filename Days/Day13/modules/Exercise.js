let libraryDir = "../../../Library";
let Grid = require (libraryDir + "/Grid.js");
let Point = require (libraryDir + "/Point.js");

class ExerciseMain {
	constructor(numRows, numColumns){
		// by default - everything is a wall
		this._grid = new Grid(numRows + 2, numColumns + 2, TYPE_WALL);
	}
	
	setFloor(point){
		console.log(point.toString(), " is a floor");
		this._grid.set(point.x + 1, point.y + 1, TYPE_FLOOR);
	}
	
	addCart(position, direction){
	
	}
}

module.exports = ExerciseMain;
