/* Priority Queue Implementation - from https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript */
let queueTop = 0;
let parent = i => ((i + 1) >>> 1) - 1;
let left = i => (i << 1) + 1;
let right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[queueTop];
  }
  push(...values) {
	for (let value of values){
      this._heap.push(value);
      this._siftUp();
    }
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > queueTop) {
      this._swap(queueTop, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[queueTop] = value;
    this._siftDown();
    return replacedValue;
  }
  toString(){ return this._heap.join(", ") };
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > queueTop && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = queueTop;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

/* Nodes - Handles the main logic for each step */
const DEFAULT_TIME_COST = 0;
const BASE_CHAR_CODE = 'A'.charCodeAt(0) - 1;

class Node {
	constructor(defaultTimeCost, key){
		this._key = key;
		this._next = [ ];
		this._dependencies = [ ];
		
		this._isReady = false;
		
		this._startedTime = 0;
		this._defaultTimeCost = defaultTimeCost;
		
		console.log(this._defaultTimeCost);
	}

	get key(){ return this._key; }
	get next(){ return this._next; }
	get ready(){ return this._isReady; }
	get timeCost(){ return this._defaultTimeCost + this._keyTimeCost; }
	get finishTime(){ return this.timeCost + this._startedTime; }
	
	set ready(isReady){ this._isReady = isReady; }
	set startedAt(start){ this._startedTime = start; }
	
	addNext(nextNode){
		this._next.push(nextNode);
		nextNode.addDependency(this);
	}
	addDependency(fromNode){
		this._dependencies.push(fromNode);
		this._isReady = false;
	}
	checkValid(){
		// difference here is that it actually checks, whereas above
		// is just based on the property being set
		for (var node of this._dependencies) {
			if (!node.ready)
				return false;
		}
		
		return true;
	}
	
	reset(){
		this.ready = false;
		this.startedAt = 0;
	}
	
	toString(){ return this.key; }
	
	get _keyTimeCost(){
		return this.key.charCodeAt(0) - BASE_CHAR_CODE;
	}
}
class NodesCollection {
	constructor(defTimeCost){
		this._nodes = { };
		this._startingNodes = { };
		
		this._defaultTimeCost = defTimeCost;
		console.log(this._defaultTimeCost);
	}
	
	get startingNodes(){ return this._startingNodes; }
	
	getNode(key){
		return this._nodes[key] || this._initNode(key);
	}
	setNext(keyF, keyT){
		// add to the list of next nodes
		this.getNode(keyF).addNext(this.getNode(keyT));
		
		// if the node is marked as a starting node, remove it from the collection - now has a dependency
		if (this._startingNodes[keyT])
			this._startingNodes[keyT] = null;
	}
	
	reset(){
		for (var nodeIndex in this._nodes){
			this._nodes[nodeIndex].reset();
		}
	}
	
	_initNode(key){
		let node = new Node(this._defaultTimeCost, key);
		
		this._nodes[key] = node;
		this._startingNodes[key] = node;
		
		return node;
	}
}

/* MainSystem - Handles the logic for controlling ordering, getting the sort, etc. */
class MainSystem {
	constructor(nodesCollection){
		this._collection = nodesCollection;
	}
	
	getResults(numWorkers){
		this._collection.reset();
		
		let result = [ ];
		let currentTime = 0;
		
		let checked = { };
		let workersQueue = new PriorityQueue((a,b)=>a.finishTime < b.finishTime);
		let waitingQueue = new PriorityQueue((a,b)=>a.timeCost < b.timeCost);
		
		this._start(workersQueue, waitingQueue, checked, numWorkers);
		while (!workersQueue.isEmpty()) {
			let nextNode = workersQueue.pop();
			currentTime = nextNode.finishTime;
			
			console.log(`${nextNode.key} finished off at ${nextNode.finishTime}, was already ready: ${nextNode.ready}`);
			
			nextNode.ready = true;
			this._addNodes(workersQueue, waitingQueue, nextNode.next, checked, numWorkers, currentTime);
			
			result.push(nextNode.key);
		}
		
		return {
			time: currentTime,
			resultsList: result
		};
	}
	
	// List Control
	_start(workersQueue, waitersQueue, checkedList, numWorkers){
		this._addNodes(workersQueue, waitersQueue, this._collection.startingNodes, checkedList, numWorkers, 0);
	}
	_addNodes(workQueue, waitQueue, nextNodesList, checkedList, maxQueueSize, startTime){
		let valid = this._getValidNodes(nextNodesList, checkedList);
		
		// step 1) add everything into the waiting queue
		waitQueue.push(...valid);
		
		// step 2) add workers until either all are working or all valid nodes are being worked on,
		//          going 1-by-1 from the waiting queue
		let totalNewWorkers = Math.min(maxQueueSize - workQueue.size(), waitQueue.size());
		for (let i = 0; i < totalNewWorkers; i++) {
			let workingNode = waitQueue.pop();
			workingNode.startedAt = startTime;
			
			console.log (`Starting ${workingNode.key} at ${startTime}.`);
			workQueue.push(workingNode);
		}
		
		console.log (`Work queue is now ${workQueue.toString()}`);
	}
	
	_getValidNodes(nodesList, checkList){
		let validNodes = [ ];
		for (let nodeIndex in nodesList){
			let node = nodesList[nodeIndex];
			
			if (!node) continue;
			if (this._hasBeenChecked(checkList, node.key)) continue;			
			if (!node.checkValid()) continue;
			
			this._markAsChecked(checkList, node.key);
			validNodes.push(node);
		}
		return validNodes;
	}
	
	_hasBeenChecked(checked, key){
		return !!checked[key];
	}
	_markAsChecked(checked, key){
		checked[key] = true;
	}
}

/* UI Logic */
class UIBasic {
	/* Constructor */
	constructor(){
	
	}
	
	/* Private Methods */
	// construct the object from the UI
	_construct(text){
		let lines = text.trim().split("\n");
		for (var i = 0; i < lines.length; i++)
			this._parse(lines[i]);
	}
	
	/* Must Overload */
	_parse(line){
		throw new Error("_parse method must be overloaded");
	}
}
class UI extends UIBasic {
	constructor(numWorkers, defaultTimeCost, text){
		super();
		
		this._numWorkers = numWorkers;
		this._defaultTimeCost = defaultTimeCost;
		this._construct(text);
	}
	
	run(){
		let part1Result = this.part1Result;
		let part2Result = this.part2Result;
		
		return [part1Result, part2Result];
	}
	
	get part1Result(){
		return new MainSystem(this._nodes).getResults(1).resultsList.join("");
	}
	get part2Result(){
		return new MainSystem(this._nodes).getResults(this._numWorkers).time;
	}
	
	get _nodes(){
		if (!this._collection)
			this._collection = new NodesCollection(this._defaultTimeCost);
		return this._collection;
	}
	
	_parse(line){
		let [str, fromKey, toKey] = line.match(/Step (.) must be finished before step (.) can begin./);
		this._nodes.setNext(fromKey, toKey);
	}
}

let logResults = (type, part1Result, part2Result) => {
	console.log("\n", type, "Results:");
	console.log(`\tPart 1 Result: ${part1Result}`);
	console.log(`\tPart 2 Result: ${part2Result}`);
}

let uiTest = new UI(2, 0, `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`);
let [uiTestPart1Result, uiTestPart2Result] = uiTest.run();


let uiExercise = new UI(4, 60, document.body.innerText);
let [uiExercisePart1Result, uiExercisePart2Result] = uiExercise.run();

logResults("Test Code", uiTestPart1Result, uiTestPart2Result);
logResults("Exercise Code", uiExercisePart1Result, uiExercisePart2Result);
