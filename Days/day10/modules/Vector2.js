/*
  The main Vector2 class. Taken from Library/Point.js, renamed for this exercise
*/
class Vector2 {
	constructor(x, y) {
		this._x = x;
		this._y = y;
	}

	get x(){ return this._x; }
	get y(){ return this._y; }

	add(otherPoint){
		return new Vector2(this.x + otherPoint.x, this.y + otherPoint.y, this.id);
	}

	isLessThan(otherPoint){
		return this.x < otherPoint.x || this.y < otherPoint.y;
	}
	isGreaterThan(otherPoint){
		return this.x > otherPoint.x || this.y > otherPoint.y;
	}

	toString(){ return `(${this.x}, ${this.y})`; }
}

module.exports = Vector2;
