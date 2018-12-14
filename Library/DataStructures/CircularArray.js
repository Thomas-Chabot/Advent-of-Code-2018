let isMainModule = require("../Modules/IsMainModule.js");

class CircularArray {
	constructor(){
		this._data = [ ];
	}

	get size(){ return this._data.length; }
	
	get(index){
		index = this._parseIndex(index);
		return this._data[index];
	}
	set(index, data){
		index = this._parseIndex(index);
		this._data[index] = data;
	}
	
	push(data){
		this._data.push(data);
	}
	pop(){
		this._data.pop();
	}
	
	_parseIndex(index){
		return index % this.size;
	}
}

/* Testing Code */
function test(){
	let N = 1000000;
	let MAX_TIME = 1000;
	
	let startTime = new Date();
	
	let circularArray = new CircularArray();
	circularArray.push(1);

	console.log ("Testing push");
	for (let i = 1; i < N; i++){
		circularArray.push(i+1);
	}
	for (let i = 0; i < N; i++){
		if (circularArray.get(i) !== i + 1)
			return false;
	}
	
	console.log ("Testing infinite get operations");
	for (let i = 0; i < N; i++){
		if (circularArray.get(N + i) !== i + 1)
			return false;
	}
	
	console.log ("Testing set");
	for (let i = 0; i < N; i++){
		circularArray.set(i, 0);
	}
	for (let i = 0; i < N; i++){
		if (circularArray.get(i) !== 0)
			return false;
	}
	
	console.log ("Testing pop");
	for (let i = 0; i < N; i++)
		circularArray.pop();
	
	for (let i = 0; i < N; i++){
		if (circularArray.get(i) !== undefined)
			return false;
	}
	
	return new Date() - startTime < MAX_TIME;
}

if (isMainModule(module))
	test();

module.exports = CircularArray;

