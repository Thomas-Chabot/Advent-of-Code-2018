let Direction;

class Point {
	constructor(x, y) {
		this._x = x;
		this._y = y;
	}

	get x(){ return this._x; }
	get y(){ return this._y; }

	up(){ return this.add(Direction.up); }
	down(){ return this.add(Direction.down); }
	left(){ return this.add(Direction.left); }
	right(){ return this.add(Direction.right); }

	inverse(){
		return new Point(-this.x, -this.y);
	}

	add(otherPoint){
		return new Point(this.x + otherPoint.x, this.y + otherPoint.y, this.id);
	}

	rotate(rotation){
		let radians = rotation * (Math.PI / 180);

		let xPrime = (this.x * Math.cos(radians)) - (this.y * Math.sin(radians))
		let yPrime = (this.y * Math.cos(radians)) + (this.x * Math.sin(radians));

		return new Point(Math.round(xPrime), Math.round(yPrime));
	}

	// Comparisons
	isLessThan(otherPoint){
		return this.x < otherPoint.x || this.y < otherPoint.y;
	}
	isGreaterThan(otherPoint){
		return this.x > otherPoint.x || this.y > otherPoint.y;
	}
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
	equals(otherPosition){
		if (!otherPosition) return false;
		return this.x === otherPosition.x && this.y === otherPosition.y;
	}
}

module.exports = Point;
