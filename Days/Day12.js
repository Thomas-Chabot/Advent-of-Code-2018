/* Constants */
const PLANT_POT = "#";
const EMPTY_POT = ".";

const NUM_ITERATIONS_P1 = 20;
const NUM_ITERATIONS_P2 = 50 * 1000 * 1000 * 1000;

const NUM_REPETITIONS = 5;

const DEBUG = false;

/* Data Structures */
class Node {
	constructor(key, value){
		this._key = key;
		this._value = value;
		
		this._children = { };
	}
	
	get key(){ return this._key; }
	get value(){ return this._value; }
	
	addChild(node){ this._children[node.key] = node; }
	getChild(key){ return this._children[key]; }
}

class Trie {
	constructor(){
		this._head = new Node('', null);
	}
	
	add(key, value){
		let length = key.length;
		let getNextFunc = (index)=>key.charAt(index);
		
		let {curNode, prevNode, index} = this._traversePath(length, getNextFunc);
		if (curNode){
			// just set the node's value
			curNode.value = value;
		} else {
			curNode = prevNode;
			index --;
			
			while (index < length) {
				// only give the node a value if it's at the very bottom
				let nodeValue = (index === length - 1) ? value : null;
				let newNode = new Node(getNextFunc(index), nodeValue)
				
				curNode.addChild(newNode);
				curNode = newNode;
				
				index++;
			}
		}
	}
	
	get(key){
		return this.search(key.length, (index)=>key.charAt(index));
	}
	search(length, getNextKey){
		let {curNode} = this._traversePath(length, getNextKey);
		return curNode ? curNode.value : null;
	}
	
	_traversePath(pathLength, getNextStepFunc){
		let curNode = this._head;
		let prevNode = null;
		
		let index = 0;
		let rule = "";
		
		while (curNode && index < pathLength){
			let nextKey = getNextStepFunc(index);
			rule = rule + nextKey;
			
			prevNode = curNode;
			curNode = curNode.getChild(nextKey);
			
			index++;
		}
		
		if (DEBUG)
			console.log(`Rule ${rule} results in ${curNode && curNode.value}`);
		return {curNode, prevNode, index};
	}
}

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(){

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  }

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  }

  // Returns true if all values are the same
  this.isEquivalent = function(){
	let value = queue[offset];
	for (let item = offset; item < offset + queue.length; item++){
		if (queue[item] !== queue[offset])
			return false;
	}
	return true;
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

/* Exercise Code */
class ExerciseMain {
	constructor(ruleLength, initialState){
		this._initialState = initialState.split("");
	
		this._rules = new Trie();
		this._length = ruleLength;
		
		this._extraSpace = ruleLength + 1; // space to add at the front & end of the array
		
		this.setStartingValues();
	}
	
	// NOTE: once this ends, the increments will all be equal - so just return the first element
	get increment(){ return this._increments.peek(); }
	
	get plantPots(){
		let result = [ ];
		for (let index in this._state){
			if (this._state[index] === PLANT_POT)
				result.push(index);
		}
		return result;
	}
	get plantPotsSum(){
		let plantPots = this.plantPots;
		let sum = 0;
		
		for (let index of plantPots)
			sum += parseInt(index);
		
		return sum;
	}
	
	addRule(rule, result){
		this._rules.add(rule, result);
	}
	
	next(stateIndex){
		let newState = [ ]; 
		
		this._lowerBound -= this._extraSpace;
		this._upperBound += this._extraSpace;
		
		let offset = (this._length - 1) / 2;
		
		for (let i = this._lowerBound; i < this._upperBound; i++){
			let result = this._getResult((index)=>this._get(index + i - offset));
			newState[i] = result;
		}
		
		return this._setState(newState, stateIndex);
	}
	
	setStartingValues(){
		this._state = this._initialState;
		
		this._increments = new Queue();
		this._lastPotValue = 0;
		
		this._lowerBound = 0;
		this._upperBound = this._state.length;
	}
	
	_get(index){
		if (DEBUG)
			console.log ("Index ", index, " contains ", this._state[index]);
		return this._state[index] || EMPTY_POT;
	}
	_getResult(getCharFunc){
		let result = this._rules.search(this._length, getCharFunc);
		if (result === null)
			return EMPTY_POT;
		return result;
	}
	
	_setState(state, index){
		this._state = state;
		return this._isRepeating(index);
	}
	
	_isRepeating(index){
		let newPots = this.plantPotsSum;
		let increment = newPots - this._lastPotValue;
		
		if (this._checkRepetition(increment)) {
			console.log(`Increasing by ${increment} at index ${index}`);
			return true;
		}
		
		this._lastPotValue = newPots;
	}
	_checkRepetition(increment){
		let hasReachedMax = (this._increments.getLength() > NUM_REPETITIONS);
		if (hasReachedMax)
			this._increments.dequeue();
		
		this._increments.enqueue(increment);
		return hasReachedMax && this._increments.isEquivalent();
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
		let rules = text.replace(/[^\n]+\n/, "");
		let initialStateStr = text.match(/[^\n]+/)[0];
		
		super(rules);
		
		let initialState = this._parseInitialState(initialStateStr);
		this._exercise = new ExerciseMain(5, initialState);
		this._init();
	}
	
	runInfinite(finalIteration){
		let index = 0;
		let hasReachedGoal = false;
		
		this._exercise.setStartingValues();
		while (!hasReachedGoal) {
			hasReachedGoal = this._exercise.next(index);
			index++;
		}
		
		if (DEBUG){
			console.log(`Reached goal on iteration ${index}`);
			console.log(`Increasing by ${this._exercise.increment}, current value ${this.plantsSum}`);
		}
		
		let indexDifference = (finalIteration - index);
		let totalIncrement = this._exercise.increment * indexDifference;
		let finalValue = totalIncrement + this.plantsSum;
		
		return finalValue;
	}
	
	run(numTimes){
		this._exercise.setStartingValues();
		for (let i = 0; i < numTimes; i++)
			this._exercise.next(i);
		return this.plantsSum;
	}
	
	get plantsSum(){ return this._exercise.plantPotsSum; }
	
	_parse(line, lineNumber){
		let [str, rule, result] = line.match(/([^ ]+) => (.)/);
		
		// can ignore anything that produces an empty pot -> returned by default
		if (result === PLANT_POT)
			this._exercise.addRule(rule, result);
	}
	_parseInitialState(state){
		let [str, init] = state.match(/initial state: (.+)/);
		return init;
	}
}

/* Running */
let ui = new UI(document.body.innerText);

let resultPart1 = ui.run(NUM_ITERATIONS_P1);
let resultPart2 = ui.runInfinite(NUM_ITERATIONS_P2);

console.log(`Result Part 1: ${resultPart1}`);
console.log(`Result Part 2: ${resultPart2}`);
