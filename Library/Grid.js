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

module.exports = Grid;
