let isMainModule = require("../Modules/IsMainModule.js");
let Point = require ("../Vectors/Vector2.js");
let directions = require ("../Vectors/Direction.js");
let surroundings = require ("../Vectors/Surroundings.js");

let DEBUG = false;

class Grid {
	constructor(numRows, numColumns, getValueFunction){
		[numRows, numColumns, getValueFunction] = this._parseInputs(numRows, numColumns, getValueFunction || null);
		console.log(numRows, numColumns);

		if (typeof(getValueFunction) !== "function"){
			let defaultValue = getValueFunction;
			getValueFunction = ()=>defaultValue;
		}

		this._grid = [ ];

		this._numRows = numRows;
		this._numColumns = numColumns;

		this._baseRow = 0;
		this._baseColumn = 0;

		this._getValue = getValueFunction;

		this._currentCount = 0;

		this._init();
	}

	get numColumns(){ return this._numColumns; }
	get numRows(){ return this._numRows; }

	get(rowIndex, colIndex){
		[rowIndex, colIndex] = this._parseInputs(rowIndex, colIndex, null);
		return this._takeAction(rowIndex, colIndex, false, (row)=>{
			return this._valueOf(row, colIndex);
		});
	}
	set(rowIndex, colIndex, data){
		[rowIndex, colIndex, data] = this._parseInputs(rowIndex, colIndex, data);
		return this._takeAction(rowIndex, colIndex, true, (row)=>{
			this._setValue(row, colIndex, data);
			return true;
		});
	}
	reset(row, colIndex){
		return this.set(row, colIndex, this._getValue(row, colIndex));
	}

	borderCheck(rowIndex,colIndex){
		[rowIndex, colIndex] = this._parseInputs(rowIndex, colIndex);
		return this._borderCheck(rowIndex, colIndex);
	}

	getAdjacent(position, validSpaces){
		return this._getTypesFromOffsets(position, directions).filter((a)=>validSpaces.indexOf(a.space) !== -1);
	}
	getSurroundings(position){
		return this._getTypesFromOffsets(position, surroundings);
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

		let baseCol = this._baseColumn;
		let baseRow = this._baseRow;

		for (let row = baseRow; row < nRows; row++){
			f(row, baseCol, true);
			for (let col = baseCol + 1; col < nCols; col++){
				f(row, col, false);
			}
		}
	}

	toString(){
		let str = "";
		this.each((row, col, isNextColumn)=>{
			if (isNextColumn)
				str = str + "\r\n";
			str = str + " " + this.get(row, col);
		});
		return str.replace("\n", "");
	}

	_init(){
		this.each((row,col,isNextColumn)=>{
			if (isNextColumn)
				this._grid[row] = [ ];
			this._grid[row][col] = this._getValue(row, col);
		});
	}

	_valueOf(row, columnIndex){
		return row[columnIndex];
	}
	_setValue(row, columnIndex, value){
		row[columnIndex] = value;
		return value;
	}

	_getTypesFromOffsets(position, offsets){
		let result = [ ];

		if (DEBUG) this.set(position, this._currentCount ++);

		for (let key in offsets){
			let offset = offsets[key];
			let space  = position.add(offset);
			let sType  = this.get(space);

			if (DEBUG){
				console.log(`Checking ${key}: position ${space}. Origin is ${position} with offset ${offset}`);
				console.log(`\tSpace type is ${sType}`);
			}

			result.push({
				space: space,
				spaceType: sType,
				key: key
			});
		}
		return result;
	}

	_parseInputs(position, columnIndex, dataValue){
		// indices check
		if (dataValue !== undefined && columnIndex !== undefined)
			return [position, columnIndex, dataValue];

		// otherwise - it's a Point object, so extract the x & y values
		return [position.x, position.y, columnIndex];
	}
	_takeAction(rowIndex, colIndex, isSetOperation, f) {
		if (!this._borderCheck(rowIndex, colIndex)) return false;

		let row = this._row(rowIndex);
		if (!row) return false;

		return f(row);
	}
	_row(rowNum, canCreate){
		if (!this._grid[rowNum] && canCreate)
			this._grid[rowNum] = [ ];

		return this._grid[rowNum];
	}
	_borderCheck(row, col){
		return (row >= 0 && row <= this._numRows
			 && col >= 0 && col <= this._numColumns);
	}
}

function test(){
	let grid = new Grid(5, 6, true);
	console.log (grid.toString());
	console.log(grid.numRows === 5);
	console.log(grid.numColumns === 6);

	let grid2 = grid.clone();
	console.log(grid2.toString() === grid.toString());

	grid2.set(1, 1, false);
	console.log(grid2.toString() !== grid.toString());
	console.log(!grid2.get(1,1));

	grid2.reset(1,1);
	console.log(grid2.get(1,1));
}

if (isMainModule(module))
	test();

module.exports = Grid;
