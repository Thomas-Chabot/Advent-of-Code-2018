let Direction;
let VectorBase = require ("./VectorBase.js");
let isMainModule = require ("../Modules/IsMainModule.js");

class Vector2 extends VectorBase {
	constructor(x, y) {
		super(x, y);
	}

	get x(){ return this.getCoordinate(0); }
	get y(){ return this.getCoordinate(1); }

	up(){ return this.add(Direction.up); }
	down(){ return this.add(Direction.down); }
	left(){ return this.add(Direction.left); }
	right(){ return this.add(Direction.right); }

	rotate(rotation){
		let radians = rotation * (Math.PI / 180);

		let xPrime = (this.x * Math.cos(radians)) - (this.y * Math.sin(radians))
		let yPrime = (this.y * Math.cos(radians)) + (this.x * Math.sin(radians));

		return this._new([Math.round(xPrime), Math.round(yPrime)]);
	}

	// Comparisons
	isAdjacentTo(otherPoint){
		return this.adjacencyDistanceTo(otherPoint) === 1;
	}

	// Distance Between Points
	distanceTo(otherPoint){
		// This uses the standard distance formula
		return Math.sqrt(
			Math.pow(this.x - otherPoint.x, 2) +
			Math.pow(this.y - otherPoint.y, 2)
		);
	}
	adjacencyDistanceTo(otherPoint){
		// Calculates distance following only left-right, up-down
		return Math.abs(otherPoint.x - this.x) +
		       Math.abs(otherPoint.y - this.y);
	}


	// Method Overloading
	toString(){ return `(${this.x}, ${this.y})`; }
	_new(coordinates){ return new Vector2(...coordinates); }
}

function test(){
	let point = new Vector2(1,0);
	console.log(point.x, point.y, point.toString());

	let newPoint = point.add(new Vector2(0,1));
	console.log(newPoint.x, newPoint.y, newPoint.toString());

	newPoint = newPoint.subtract(point);
	console.log(newPoint.x, newPoint.y, newPoint.toString());
}

if (isMainModule(module))
	test();

module.exports = Vector2;
