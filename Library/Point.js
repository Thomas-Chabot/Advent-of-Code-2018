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
	
	toString(){ return `(${this.x}, ${this.y})`; }
}

module.exports = Point;
