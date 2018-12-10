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
		grid.set(this._position.x, this._position.y, this._textVal);
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
		let point = this._createPoint(position, velocity);
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

	_createPoint(position, velocity){
		let point = new Point(position, velocity, this._pointsText);
		point.addTo(this._grid);

		return point;
	}
	_eachPoint(f){
		for (let point of this._points)
			f(point);
	}
}

/* UI */
class UIBase {
	/* Constructor */
	constructor(text, splitter){
		if (splitter === undefined) splitter = "\n";

		this._text = text;
		this._splitter = splitter;
	}

	/* Public Methods */
	run(){
		this._each((d)=>this._run(d));
	}

	/* Private Methods */
	_init(){
		let lines = this._text.trim().split(this._splitter);
		this._data = this._construct(lines);
	}

	// construct the object from the UI
	_construct(lines){
		let result = [ ];
		for (var i = 0; i < lines.length; i++) {
			result.push(this._parse(lines[i], i));
		}
		return result;
	}

	/* Helper Methods */
	_each(f){
		for (var data of this._data)
			f(data);
	}
	_sort(comparator){
		//console.log("sorting")
		this._data.sort(comparator);
	}

	/* Must Overload */
	_run(data){
		throw new Error("_run method must be overloaded");
	}
	_parse(line, lineNumber){
		throw new Error("_parse method must be overloaded");
	}
}

class UI extends UIBase {
	constructor(text){
		super(text);

		this._main = new Main(25, 25, "*");
		this._offset = new Vector2(8, 8);

		this._init();
	}

	run(){
		let main = this._main;
		for (let i = 0; i < 6; i++){
			console.log(main.toString());
			main.next();
		}
	}

	_parse(line){
		let [str, pX, pY, vX, vY] = line.replace(/ /g, "")
		                                .match(/position=<([\-0-9]+),([\-0-9]+)>velocity=<([\-0-9]+),([\-0-9]+)>/);

		let position = new Vector2 (parseInt(pX), parseInt(pY));
		let velocity = new Vector2 (parseInt(vX), parseInt(vY));

		this._main.addPoint(position, velocity);
	}
}

let ui = new UI(`position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>`)
ui.run();
