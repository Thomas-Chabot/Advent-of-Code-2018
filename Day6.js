/*

Queue.js

A function to represent a queue

Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(items){

  // initialise the queue and offset
  var queue  = items ? items.slice() : [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  }

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  }

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item){
    queue.push(item);
  }

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  }

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }

}

class Point {
	constructor(x, y, id, cost) {
		this._x = x;
		this._y = y;
		this._id = id;
		this._cost = cost || 0;
	}
	
	get x(){ return this._x; }
	get y(){ return this._y; }
	get id(){ return this._id; }
	get cost(){ return this._cost; }
	
	set cost(c){ this._cost = c; }
	
	add(otherPoint){
		return new Point(this.x + otherPoint.x, this.y + otherPoint.y, this.id);
	}
	
	isLessThan(otherPoint){
		return this.x < otherPoint.x || this.y < otherPoint.y;
	}
	isGreaterThan(otherPoint){
		return this.x > otherPoint.x || this.y > otherPoint.y;
	}
	
	getValue(){
		return Math.abs(this.x) + Math.abs(this.y);
	}
	
	manhattanDistance(otherRow, otherCol) {
		return Math.abs(this.x - otherRow) + Math.abs(this.y - otherCol);
	}
}

const MAX_DISTANCE = 10000;
class Grid {
	constructor(coordinates){
		this._data = { };
		
		this._coordinates = coordinates;
	}

	get border(){ return this._border; }
	set border(b){ this._border = b; }
	
	getValueAt(point){
		let value = this._getValueAt(point);
		if (value) return value.value;
		return 0;
	}
	check(point, value){
		let row = this._rowFromPoint(point);
		let originalValue = this._valueFromRowPoint(row, point);
		if (!originalValue || value < originalValue.value) {
			this._setRowValue(row, point, value);
			return true;
		} else if (value === originalValue.value && point.id !== originalValue.pointId) {
			originalValue.pointId = ".";
		}
		
		return false;
	}
	
	calculateAreas(){
		let touchingBorder = { };
		let areas = { };
		
		// 1) Check everything on the edge
		// 2) Check everything inside
		
		this._each ((point, row, column) => {
			if (this._isOnBorder(row, column)) {
					//console.log(point, "hits the border at", row, column);
					touchingBorder[point] = true;
			}
			if (!areas[point])
					areas[point] = 0;
			areas[point] ++;
		});
		
		return {areas, touchingBorder};
	}
	getFiniteAreas(){
		let values = this.calculateAreas();
		let areas = values.areas;
		for (var b in values.touchingBorder){
			areas[b] = 0;
		}
		
		return areas;
	}
	getLargestFiniteArea(){
		let areas = this.getFiniteAreas();
		let largestArea = 0;
		let areaKey = null;
		
		for (var key in areas) {
			if (areas[key] > largestArea){
				largestArea = areas[key];
				areaKey = key;
			}
		}
		
		return {areaKey, largestArea}
	}
	
	getRegionsWithCloseDistance(){
		let totalValidLocations = 0;
		
		this._each((point, row, column) => {
			if (this._isWithinDistance(row, column))
				totalValidLocations ++;
		});
		
		return totalValidLocations;
	}
	
	_isOnBorder(row, column) {
		let min = this._border.min;
		let max = this._border.max;
		
		//console.log (row, column, min, max);
		
		return (row === min.x || row === max.x || column === min.y || column === max.y)
	}
	
	_isWithinDistance(row, column){
		let totalDistance = 0;
		for (let coordinate of this._coordinates){
			let manhattanDistance = coordinate.manhattanDistance(row, column);
			totalDistance += manhattanDistance;
			//console.log ("comparing ", coordinate, " with ", row, column, ". has total distance: ", manhattanDistance);
		}
		return totalDistance < MAX_DISTANCE;
	}
	
	_getValueAt(point){
		let row = this._rowFromPoint(point);
		let value = this._valueFromRowPoint(row, point);
		return value;
	}
	
	_setRowValue(row, point, value) {
		let newValue = {
			value: value,
			pointId: point.id
		};
		this._setValue(row, this._pointToRowIndex(point), newValue);
	}
	
	_rowFromPoint(point){
		return this._getRow(this._pointToColumnIndex(point));
	}
	_valueFromRowPoint(row, point){
		return this._getValue(row, this._pointToRowIndex(point));
	}
	
	_getRow(columnIndex){
		return this._get(this._data, columnIndex, {});
	}
	_getValue(row, rowIndex){
		return this._get(row, rowIndex, null);
	}
	_setValue(row, rowIndex, value){
		row[rowIndex] = value;
	}
	
	_get(dict, index, defaultValue){
		if (!dict[index])
			dict[index] = defaultValue;
		return dict[index];
	}
	_pointToColumnIndex(point){
		return point.y;
	}
	_pointToRowIndex(point){
		return point.x;
	}
	
	_each (f) {
		let min = this._border.min;
		let max = this._border.max;
		
		for (let col = min.y; col <= max.y; col++){
			for (let row = min.x; row <= max.x; row++){
				let value = this._getValueAt(new Point(row, col));
				f(value.pointId, row, col);
			}
		}
	}
};

class FloodFill {
	constructor(points){
		this._points = points;
		this._queue = new Queue(points);
		this._grid = new Grid(points);
	}
	
	get grid(){ return this._grid; }
		
	run () {
		let border = this._border;
		this._grid.border = border;
		
		while (this._hasNext) {
			this._step(border);
		}
		return this._grid;
	}
		
	get _border(){
		let minX = 9e9;
		let maxX = -9e9;
		let minY = 9e9;
		let maxY = -9e9;
		
		for (let point of this._points) {
			if (point.x < minX)
				minX = point.x;
			else if (point.x > maxX)
				maxX = point.x;
			if (point.y < minY)
				minY = point.y;
			else if (point.y > maxY)
				maxY = point.y;
		}
		
		return {
			min: new Point(minX, minY, "min"),
			max: new Point(maxX, maxY, "max")
		}
	}
	
	get _hasNext(){
		return !this._queue.isEmpty();
	}
	
	_step(border){
		let point = this._queue.dequeue();
		let currentValue = point.cost;
		
		for (let xInc = -1; xInc <= 1; xInc++) {
			for (let yInc = -1; yInc <= 1; yInc++) {
				let increment = new Point(xInc, yInc, null);
				
				let newPoint = point.add(increment);
				if (newPoint.isLessThan(border.min) || newPoint.isGreaterThan(border.max))
					continue;
			
				let totalCost = currentValue + increment.getValue();
				//console.log("Checking point ", point.id, " at (", newPoint.x, ",", newPoint.y, ") with cost ", totalCost);
				if (this._grid.check(newPoint, totalCost)) {
					newPoint.cost = totalCost;
					
					this._queue.enqueue(newPoint);
					//console.log ("Valid point: ", newPoint, " with cost ", totalCost);
				}
			}
		}
	}
}



class UIBase {
	/* Constructor */
	constructor(text){
		let lines = text.trim().split("\n");
		this._data = this._construct(lines);
	}
	
	/* Public Methods */
	run(){
		this._each((d)=>this._run(d));
	}
	
	/* Private Methods */
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
		
		this._floodFill = new FloodFill(this._data);
	}
	
	run(){
		let grid = this._floodFill.run();
		let part1 = grid.getLargestFiniteArea();
		let part2 = grid.getRegionsWithCloseDistance();
		
		let areas = grid.calculateAreas();
		
		console.log("Part 1:", part1);
		console.log("Part 2:", part2);
	}
	
	_parse(line, lineNumber){
		let [str, xPoint, yPoint] = line.match(/([0-9]+), ([0-9]+)/);
		return new Point(parseInt(xPoint), parseInt(yPoint), 900 + lineNumber);
	}
}

/*var ui = new UI(`1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`)
ui.run();*/

new UI(document.body.innerText).run()
