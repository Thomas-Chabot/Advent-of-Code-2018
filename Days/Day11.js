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
		return this._set(row, col, this._defaultValue);
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
			this._grid[col][row] = this._getPointValue(row, col);
		});
	}
	_getPointValue(row, column){ return this._defaultValue; }
	
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

class FuelCell {
	constructor(coordinate, gridSerial){
		this._coordinate = coordinate;
		this._gridSerial = gridSerial;
		this._powerLevel = this._calculatePowerLevel();
	}
	
	get powerLevel(){
		return this._powerLevel;
	}
	
	_calculatePowerLevel(){
		let rackId = this._coordinate.x + 10;
		let powerLevel = rackId * this._coordinate.y;
		powerLevel += this._gridSerial;
		powerLevel *= rackId;
		powerLevel = this._getDigit(powerLevel, 100);
		powerLevel -= 5;
		
		return powerLevel;
	}
	_getDigit (value, digit) {
		return Math.floor(value / digit) % 10;
	}
}

class FuelCells extends Grid {
	constructor(numRows, numColumns, serial){
		// NOTE: Will be using the _defaultValue property to store the grid serial value
		super(numRows, numColumns, serial);
	}
	
	get(row, column){
		let value = super.get(row, column);
		return value.powerLevel;
	}
	
	getBestSquare(square){
		
	}
	
	_getPointValue(row, column) {
		let point = new Point(row + 1, column + 1);
		return new FuelCell(point, this._gridSerial);
	}
	
	get _gridSerial(){ return this._defaultValue; }
}

let cells = new FuelCells(5, 5, 1);
console.log(cells.toString());
