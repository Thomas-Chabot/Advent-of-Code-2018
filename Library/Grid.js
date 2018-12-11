
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
