/* Dependencies */
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

class Grid {
	constructor(numRows, numColumns, defaultValue){
		this._grid = [ ];
		
		this._numRows = numRows;
		this._numColumns = numColumns;
		this._defaultValue = defaultValue;
		
		this._init();
	}
	
	get(row, col){
		return this._takeAction(row, col, (column)=>{
			return column[row];
		});
	}
	set(row, col, data){
		return this._takeAction(row, col, (column)=>{
			column[row] = data;
			return true;
		});
	}
	reset(row, col){
		return this.set(row, col, this._defaultValue);
	}
	
	toString(){
		let str = "";
		this._each((row, col, isNextColumn)=>{
			if (isNextColumn)
				str = str + "\n";
			str = str + " " + this.get(row, col);
		});
		return str;
	}
	
	_init(){
		this._each((row,col,isNextColumn)=>{
			if (isNextColumn)
				this._grid[col] = [ ];
			this._grid[col][row] = this._defaultValue;
		});
	}
	
	_each(f){
		let nRows = this._numRows;
		let nCols = this._numColumns;
		
		for (let col = 0; col < nCols; col++){
			f(0, col, true);
			for (let row = 1; row < nRows; row++){
				f(row, col, false);
			}
		}
	}
	
	_takeAction(row, col, f) {
		if (!this._borderCheck(row, col)) return false;
	
		let column = this._column(col);
		if (!column) return false;
		
		return f(column);
	}
	_column(colNum, canCreate){
		if (!this._grid[colNum] && canCreate)
			this._grid[colNum] = [ ];
		
		return this._grid[colNum];
	}
	_borderCheck(row, col){
		return (row >= 0 && row <= this._numRows
			 && col >= 0 && col <= this._numColumns);
	}
}

/* Exercise Code */
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
		let point = new Point(position, velocity, this._pointsText);
		this._points.push(point);
	}
	
	next(){
		let grid = this._grid;
		this._eachPoint((point)=>{
			point.removeFrom(grid);
			point.next();
			point.addTo(grid);
		});
	}
	
	toString(){
		return this._grid.toString();
	}
	
	_eachPoint(f){
		for (let point of this._points)
			f(point);
	}
}

let main = new Main(5, 5, ".");
main.addPoint(new Vector2(0, 0), new Vector2(1, 1));
for (let i = 0; i < 5; i++){
	console.log(main.toString());
	main.next();
}