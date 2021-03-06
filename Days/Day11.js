let GRID_SIZE = 300;

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
	constructor(numRows, numColumns, getValueFunction){
		if (typeof(getValueFunction) !== "function"){
			let defaultValue = getValueFunction;
			getValueFunction = ()=>defaultValue;
		}
	
		this._grid = [ ];
		
		this._numRows = numRows;
		this._numColumns = numColumns;
		this._getValue = getValueFunction;
		
		this._init();
	}
	
	get numColumns(){ return this._numColumns; }
	get numRows(){ return this._numRows; }
	
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
		return this._set(row, col, this._getValue(row, col));
	}
	
	clone(){
		let newGrid = new Grid(this._numRows, this._numColumns, this._getValue);
		this.each((row, col) => {
			newGrid.set(row, col, this.get(row, col));
		});
		return newGrid;
	}
	
	each(f){
		let nRows = this._numRows;
		let nCols = this._numColumns;
		
		for (let col = 0; col < nCols; col++){
			f(0, col, true);
			for (let row = 1; row < nRows; row++){
				f(row, col, false);
			}
		}
	}
	
	toString(){
		let str = "";
		this.each((row, col, isNextColumn)=>{
			if (isNextColumn)
				str = str + "\n";
			str = str + " " + this.get(row, col);
		});
		return str;
	}
	
	_init(){
		this.each((row,col,isNextColumn)=>{
			if (isNextColumn)
				this._grid[col] = [ ];
			this._grid[col][row] = this._getValue(row, col);
		});
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
	
	toString(){ return this.powerLevel; }
	toNumber(){ return this.powerLevel; }
	
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

class FuelCells {
	constructor(numRows, numColumns, serial){
		this._serial = serial;		
		this._numRows = numRows;
		this._numColumns = numColumns;
		
		this._grid = new Grid(numRows, numColumns, (row, col)=>this._getPointValue(row,col));
	}
	
	get(row, column){
		let value = this._grid.get(row, column);
		if (!value) return 0;
		
		return value.powerLevel;
	}
	
	getBestSquare(squareSize){
		let bestSquare = null;
		let highestValue = 0;
		
		this._grid.each ((row, col) => {
			let squareValue = this._getSquareValue(row, col, squareSize);
			if (squareValue > highestValue){
				highestValue = squareValue;
				bestSquare = new Point(row + 1, col + 1);
			}
		});
		
		return {
			bestSquare,
			highestValue
		};
	}
	
	toString(){ return this._grid.toString(); }
	
	_getPointValue(row, column) {
		let point = new Point(row + 1, column + 1);
		return new FuelCell(point, this._gridSerial);
	}
	
	get _gridSerial(){ return this._serial; }
	
	_getSquareValue(row, column, size) {
		if (row + size > this._numRows || column + size > this._numColumns) return 0;
		
		let total = 0;
		for (let additionX = 0; additionX < size; additionX++)
			for (let additionY = 0; additionY < size; additionY++)
				total += this.get(row + additionX, column + additionY);
		return total;
	}
}

class FuelCellsPart2 extends FuelCells {
	// This extends the FuelCells class to add a method of calculating the square with largest total power
	// Based on dynamic programming principles.
	// Separated to abstract the base methods from those related to the dynamic solver
	
	constructor(...args){
		super(...args);
	}
	
	getBestSquare(squareSize){
		// NOTE: Run to the base class method if a size has been given
		if (squareSize !== undefined)
			return super.getBestSquare(squareSize);
		
		// Dynamically find the best square
		let dynamicsGrid = this._grid.clone();
		let largestSoFar = {value: 0};
		
		for (let size = 0; size < GRID_SIZE; size++){
			let largest = this._getBiggestSquare(dynamicsGrid, size + 1);
			if (largest.value > largestSoFar.value)
				largestSoFar = largest;
				
			dynamicsGrid = this._contractGrid(dynamicsGrid, size + 1);
		}
		
		return largestSoFar;
	}
	
	_contractGrid(grid, size){
		let newGrid = new Grid(grid.numRows - 1, grid.numColumns, (row, column) => {
			let previousValue = grid.get(row, column);
			let addedValue = this._grid.get(row + size, column);
			
			return previousValue + addedValue;
		});
		
		return newGrid;
	}
	
	_getBiggestSquare(grid, size){
		let largestSquare = {value: 0};
	
		for (let col = 0; col < grid.numColumns - size; col++){
			for (let row = 0; row < grid.numRows; row++){
				let squareTotal = this._addColumns(grid, row, col, col + size);
				if (squareTotal > largestSquare.value) {
					largestSquare = {
						value: squareTotal,
						row: row + 1,
						column: col + 1,
						size: size
					};
				}
			}
		}
		
		return largestSquare;
	}
	_addColumns(grid, rowIndex, columnStart, columnEnd){
		let total = 0;
		for (let column = columnStart; column < columnEnd; column++) {
			let value = grid.get(rowIndex, column);
			if (!value) continue;
			
			total += parseInt(value);
		}
		return total;
	}
}


// examples
let puzzles = [
	{
		name: "Example 1",
		serial: 18
	},
	{
		name: "Example 2",
		serial: 42
	},
	{
		name: "Puzzle",
		serial: 2694
	}
]

for (let puzzle of puzzles){
	let start = new Date();
	
	let cells = new FuelCellsPart2(GRID_SIZE, GRID_SIZE, puzzle.serial);
	let resultPart1 = cells.getBestSquare(3).bestSquare;
	let resultPart2 = cells.getBestSquare();
	
	let part1Str = `${resultPart1.x},${resultPart1.y}`;
	let part2Str = `${resultPart2.row},${resultPart2.column},${resultPart2.size}`;
	
	console.log (`${puzzle.name} Output:`);
	console.log (`Result for Part 1: ${part1Str}`);
	console.log (`Result for Part 2: ${part2Str}`);
	console.log (`Evaluation took ${new Date() - start} ms`);
}
