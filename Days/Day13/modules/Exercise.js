/* Constants */
let Constants = require ("./Constants.js");
let {libraryDir, dataStructures, TYPE_WALL, TYPE_FLOOR, TYPE_CART, GRID_EXTRA, POINT_OFFSET} = Constants;

/* Dependencies */
let Grid = require (dataStructures + "/Grid.js");
let Point = require (libraryDir + "/Point.js");
let Carts = require ("./Carts.js");

/* Class */
class ExerciseMain {
	constructor(numRows, numColumns){
		// by default - everything is a wall
		let grid = new Grid(numRows + GRID_EXTRA.x, numColumns + GRID_EXTRA.y, TYPE_WALL);

		this._grid = grid;
		this._carts = new Carts(grid);
	}

	update(){
		this._carts.update();
	}

	setFloor(point){
		point = this._parsePoint(point);
		this._grid.set(point.x, point.y, TYPE_FLOOR);
	}

	addCart(position, direction){
		position = this._parsePoint(position);
		this._carts.add(position, direction);
	}

	_parsePoint(position){
		return position.add(POINT_OFFSET);
	}
}

module.exports = ExerciseMain;
