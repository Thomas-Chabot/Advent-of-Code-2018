// Square class represents a single square in the grid
class Square {
	constructor(id, left, top, sizeX, sizeY) {
		this._id = id;
		
		this._top = top;
		this._left = left;
		this._right = left + sizeX;
		this._bottom = top + sizeY;
	}
	
	get id(){ return this._id; }
	
	get top(){ return this._top; }
	get left(){ return this._left; }
	get right(){ return this._right; }
	get bottom(){ return this._bottom; }
	
	hasConflict(grid) {
		var hasConflict = false;
		this._each ((row, col) => {
			if (grid.hasConflictAt(row,col)) {
				hasConflict = true;
				return false;
			}
		});
		return hasConflict;
	}
	
	printTo(grid) {
		this._each ((r, c) => {
			grid.printTo(r,c);
		});
	}
	
	_each(f) {
		for (var r = this._top; r < this._bottom; r++) {
			for (var c = this._left; c < this._right; c++) {
				var result = f(r, c);
				if (result !== undefined)
					return result;
			}
		}
	}
}

// The main grid class - represents the entire thing
class Grid {
	constructor (numRows, numCols) {
		this._grid = this._construct (numRows, numCols);
	}
	
	printTo(row, col) {
		if (this._grid[row] === undefined || this._grid[row][col] === undefined) return;
		this._grid[row][col] ++;
	}
	
	get conflicts() {
		var conflicts = 0;
		this._each ((row, col) => {
			if (this.hasConflictAt(row,col))
				conflicts ++;
		});
		return conflicts;
	}
	hasConflictAt (row, col) {
		return this._grid[row][col] > 1;
	}
	
	_each(nr, nc, f) {
		if (typeof(nr) == "function") {
			f = nr;
			nr = this._grid.length;
			nc = this._grid[0].length;
		}
	
		for (var r = 0; r < nr; r++) {
			for (var c = 0; c < nc; c++) {
				f (r, c);
			}
		}
	}
	
	_construct (nr, nc) {
		var grid = [ ];
		this._each (nr, nc, (r, c) => {
			if (!grid[r]) grid[r] = [ ];
			grid[r][c] = 0;
		});
		return grid;
	}
}

// The main UI class - handles converting the input text into squares & the operations for the puzzle
class UI {
	constructor(lines) {
		this._squares = this._construct(lines);
		this._grid = new Grid(1000, 1000);
	}
	
	run() {
		this._eachSquare((square)=>square.printTo(this._grid));
	}
	
	get overlap(){ return this._grid.conflicts; }
	get squares(){ return this._squares; }
	
	get intactSquare() {
		let grid = this._grid;
		return this._eachSquare((square) => {
			if (!square.hasConflict(grid))
				return square;
		});
	}
	
	_eachSquare(f) {
		for (var square of this._squares) {
			let result = f(square);
			if (result !== undefined)
				return result;
		}
	}
	
	_parse(line) {
		let data = line.match(/#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)/);
		let id = parseInt(data[1]);
		let leftCoord = parseInt(data[2]);
		let topCoord = parseInt(data[3]);
		let sizeX = parseInt(data[4]);
		let sizeY = parseInt(data[5]);
		
		return new Square (id, leftCoord, topCoord, sizeX, sizeY);
	}
	
	_construct(lines) {
		let squares = [ ];
		for (var i = 0; i < lines.length; i++) {
			squares.push(this._parse(lines[i]));
		}
		return squares;
	}
}

// run through all the operations
let ui = new UI (document.body.innerText.trim().split("\n"));
ui.run();

// part 1
console.log (`Part 1 result: ${ui.overlap}`);

// part 2
console.log (`Part 2 result: ${ui.intactSquare.id}`);
