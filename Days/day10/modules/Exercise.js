/*
  This program controls the main exercise logic
*/

let Grid = require ("./Grid.js");

class Point {
	constructor(position, velocity, textValue){
		this._position = position;
		this._velocity = velocity;
		this._textVal = textValue;
	}

	next(){ this._position = this._position.add(this._velocity); }
	addTo(grid){
		return grid.set(this._position.x, this._position.y, this._textVal);
	}
	removeFrom(grid){
		grid.reset(this._position.x, this._position.y);
	}

	toString(){
		return `A point at ${this._position} travelling at a velocity of ${this._velocity}`;
	}
}

class Main {
	constructor(numRows, numColumns, pointsText){
		this._grid = new Grid(numRows, numColumns, ".");
		this._points = [ ];

		this._pointsText = pointsText;
	}
	addPoint(position, velocity){
		let point = this._createPoint(position, velocity);
		this._points.push(point);
	}

	next(){
		let grid = this._grid;
		let dataOutsideBounds = false;

		this._eachPoint((point)=>{
			point.removeFrom(grid);
			point.next();
      if (!point.addTo(grid))
        dataOutsideBounds = true;
		});

		return !dataOutsideBounds;
	}

	toString(){
		return this._grid.toString();
	}

	_createPoint(position, velocity){
		let point = new Point(position, velocity, this._pointsText);
		point.addTo(this._grid);

		return point;
	}
	_eachPoint(f){
		for (let point of this._points)
			f(point);
	}
}

module.exports = Main;
