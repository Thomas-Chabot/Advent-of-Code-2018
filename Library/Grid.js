// NOTE: Grid class relies on the Point class for get & set operations
class Grid {
	constructor(numRows, numColumns, defaultValue){
		this._grid = [ ];
		
		this._numRows = numRows;
		this._numColumns = numColumns;
		this._defaultValue = defaultValue;
		
		this._init();
	}
	
	get(position){
		return this._takeAction(position, (column)=>{
			return column[position.x];
		});
	}
	set(position, data){
		return this._takeAction(position, (column)=>{
			column[position.x] = data;
			return true;
		});
	}
	reset(position){
		return this._set(position, this._defaultValue);
	}
	
	_init(){
		let nRows = this._numRows;
		let nCols = this._numColumns;
		
		for (let col = 0; col < nCols; col++){
			let column = [ ];
			for (let row = 0; row < nRows; row++){
				column[row] = this._defaultValue;
			}
			this._grid[col] = column;
		}
	}
	
	_takeAction(position, f) {
		if (!this._borderCheck(position)) return false;
	
		let column = this._column(position.y);
		if (!column) return false;
		
		return f(column);
	}
	_column(colNum, canCreate){
		if (!this._grid[column] && canCreate)
			this._grid[column] = [ ];
		
		return this._grid[column];
	}
	
	_borderCheck(position){
		return (position.x >= 0 && position.x <= this._numRows
			 && position.y >= 0 && position.y <= this._numColumns);
	}
}
