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
		let movementGrid = new Grid(numRows + GRID_EXTRA.x, numColumns + GRID_EXTRA.y, []);

		this._grid = grid;
		this._movementGrid = movementGrid;

		this._carts = new Carts(grid, movementGrid);
	}

	get collision(){
		return this._carts.collision;
	}

	update(){
		this._carts.update();
		this._carts.print();

		return this._carts.collision !== null;
	}

	setFloor(point){
		point = this._parsePoint(point);
		this._grid.set(point.x, point.y, TYPE_FLOOR);
	}
	setValidMoves(position, moves){
		position = this._parsePoint(position);
		console.log(position, moves);
		this._movementGrid.set(position.x, position.y, moves);
	}

	addCart(position, direction){
		position = this._parsePoint(position);

		this._grid.set(position.x, position.y, TYPE_CART);
		this._carts.add(position, direction);
	}

	_parsePoint(position){
		return position.add(POINT_OFFSET);
	}
}

module.exports = ExerciseMain;
