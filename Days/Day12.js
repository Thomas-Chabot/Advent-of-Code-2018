/*
  This is an implementation which works for Part 1 without any attempts at achieving better efficiency.
   It will be much too slow to run on Part 2, so will need to work on efficiency for that
*/

/* Constants */
const PLANT_POT = "#";
const EMPTY_POT = ".";
const NUM_ITERATIONS = 20;

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

/* Exercise Code */
class ExerciseMain {
	constructor(ruleLength, initialState){
		this._rules = new Trie();
		this._state = initialState.split("");
		this._length = ruleLength;
		
		this._extraSpace = ruleLength + 1; // space to add at the front & end of the array
		
		this._lowerBound = 0;
		this._upperBound = this._state.length;
	}
	
	get plantPots(){
		let result = [ ];
		for (let index in this._state){
			if (this._state[index] === PLANT_POT)
				result.push(index);
		}
		return result;
	}
	
	addRule(rule, result){
		this._rules.add(rule, result);
	}
	
	next(){
		let newState = { };
		
		this._lowerBound -= this._extraSpace;
		this._upperBound += this._extraSpace;
		
		let offset = (this._length - 1) / 2;
		
		for (let i = this._lowerBound; i < this._upperBound; i++){
			let result = this._getResult((index)=>this._get(index + i - offset));
			if (result === PLANT_POT)
				newState[i] = result;
		}
		
		this._state = newState;
		return newState;
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
	
	run(){
		this._exercise.next();
	}
	
	get plantsSum(){
		let plantPots = this._exercise.plantPots;
		let sum = 0;
		
		for (let index of plantPots)
			sum += parseInt(index);
		
		return sum;
	}
	
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
for (let i = 0; i < NUM_ITERATIONS; i++)
	ui.run();
console.log(ui.plantsSum);
