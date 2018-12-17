let Grid = require ("./Grid.js");

class GrowableGrid extends Grid {
  constructor(getValueFunc){
    super(-9e9, -9e9, getValueFunc);

    this._baseRow = this._baseColumn = 9e9;
  }

  _init(){
    return null;
  }

  _valueOf(row, columnIndex){
    console.log(row, columnIndex, row[columnIndex]);
    if (row[columnIndex]) return row[columnIndex];

    return this._setValue(row, columnIndex, this._getValue(row._rowIndex, columnIndex));
  }
  _setValue(row, columnIndex, value){
    this._numColumns = Math.max(this._numColumns, columnIndex+1);
    this._baseColumn = Math.min(this._baseColumn, columnIndex);

    row[columnIndex] = value;
    return value;
  }

  _takeAction(rowIndex, colIndex, f){
    let row = this._row(rowIndex);
    return f(row);
  }
  _borderCheck(r, c){
    return true;
  }
  _row(rowNum){
    let row = super._row(rowNum, true);
    row._rowIndex = rowNum;

    this._numRows = Math.max(this._numRows, rowNum+1);
    this._baseRow = Math.min(this._baseRow, rowNum);

    return row;
  }
}
