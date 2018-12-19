let Grid = require ("./Grid.js");

class GrowableGrid extends Grid {
  constructor(getValueFunction){
    super(-9e9, -9e9, getValueFunction);

    this._baseRow = this._baseColumn = 9e9;
  }

  set(rowIndex, colIndex, value){
    [rowIndex, colIndex, value] = this._parseInputs(rowIndex, colIndex, value);

    this._updateRowColTotals(rowIndex, colIndex);
    return super.set(rowIndex, colIndex, value);
  }
  _init(){
    return null;
  }

  _valueOf(row, columnIndex){
    if (row[columnIndex]) return row[columnIndex];
    return this._setValue(row, columnIndex, this._getValue(row._rowIndex, columnIndex));
  }

  _takeAction(rowIndex, colIndex, isSetOperation, f){
    let canCreate = isSetOperation || super._borderCheck(rowIndex, colIndex);

    let row = this._row(rowIndex, canCreate);
    if (!row) return false;

    return f(row);
  }
  _row(rowNum, canCreate){
    let row = super._row(rowNum, canCreate);
    if (!row) return;

    row._rowIndex = rowNum;
    return row;
  }

  _updateRowColTotals(rowIndex, columnIndex){
    this._numRows = Math.max(this._numRows, rowIndex);
    this._numColumns = Math.max(this._numColumns, columnIndex+1);

    this._baseRow = Math.min(this._baseRow, rowIndex);
    this._baseColumn = Math.min(this._baseColumn, columnIndex);
  }
}

module.exports = GrowableGrid;
