class Point {
	constructor(x, y) {
		this._x = x;
		this._y = y;
	}

	get x(){ return this._x; }
	get y(){ return this._y; }

	add(otherPoint){
		return new Point(this.x + otherPoint.x, this.y + otherPoint.y, this.id);
	}

	isLessThan(otherPoint){
		return this.x < otherPoint.x || this.y < otherPoint.y;
	}
	isGreaterThan(otherPoint){
		return this.x > otherPoint.x || this.y > otherPoint.y;
	}

	inverse(){
		return new Point(-this.x, -this.y);
	}

	rotate(rotation){
		let radians = rotation * (Math.PI / 180);

		let xPrime = (this.x * Math.cos(radians)) - (this.y * Math.sin(radians))
		let yPrime = (this.y * Math.cos(radians)) + (this.x * Math.sin(radians));

		return new Point(Math.round(xPrime), Math.round(yPrime));
	}

	toString(){ return `(${this.x}, ${this.y})`; }
	equals(otherPosition){
		return this.x === otherPosition.x && this.y === otherPosition.y;
	}
}

module.exports = Point;
