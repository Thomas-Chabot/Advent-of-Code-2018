class Queue{
	constructor(...data){
		this._queue = [...data];
		this._offset = 0;
	}
	
	getLength(){ return this._queue.length - this._offset; }
	isEmpty(){ return this.getLength() === 0; }
	enqueue(item){ this._queue.push(item); }
	
	peek(){
		return (this._queue.length > 0 ? queue[offset] : undefined);
	}
  
	dequeue(){
		// if the queue is empty, return immediately
		if (this._queue.length == 0) return undefined;

		// store the item at the front of the queue
		var item = this._queue[this._offset];

		// increment the offset and remove the free space if necessary
		if (++ this._offset * 2 >= this._queue.length){
		  this._queue  = this._queue.slice(this._offset);
		  this._offset = 0;
		}

		// return the dequeued item
		return item;
	}
	
	equals(arr){
		let index = 0;
		for (let element of this){
			if (element !== arr[index])
				return false;
			index ++;
		}
		return index === arr.length;
	}
	
	toString(){
		let str = "";
		for (let obj of this)
			str += obj;
		return str;
	}
	
	[Symbol.iterator](){
		let index = -1;
		let queue = this._queue;
		let offset = this._offset;
		
		return {
			next: ()=>{
				index ++;
				return {
					value: queue [offset + index],
					done: offset + index === queue.length
				};
			}
		}
	}
}

class FixedSizeQueue extends Queue {
	constructor(maxSize, ...data){
		super(...data);
		this._sizeLimit = maxSize;
	}
	
	enqueue(item){
		super.enqueue(item);
		while (this.getLength() > this._sizeLimit)
			this.dequeue();
	}
}

class CircularArray {
	constructor(...data){
		this._data = [...data];
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
	
	fix(index){ return this._parseIndex(index); }
	
	each(f){
		for (let index in this._data){
			f(index, this._data[index]);
		}
	}
	
	toString(){
		return `[${this._data.join(", ")}]`;
	}
	
	_parseIndex(index){
		return index % this.size;
	}
}

class Elf {
	constructor(index, data){
		this._index = index;
		this._data = data;
	}
	
	get value(){ return this._data.get(this._index); }
	
	move(){
		let currentValue = this.value;
		let newIndex     = this._index + currentValue + 1;
		this._index = this._data.fix(newIndex);
	}
}

class Exercise {
	constructor(targetSequence){
		this._data = new CircularArray(3, 7);
		this._sequence = new FixedSizeQueue(targetSequence.length, 3, 7);
		this._elves = [ ];
		
		this._targetSequence = targetSequence;
		this._hasReachedTarget = false;
		this._numRecipesAtSequence = 0;
	}
	
	get numRecipes(){ return this._data.size; }
	get hasTargetSequence(){ return this._hasReachedTarget; }
	get recipesAtSequence(){ return this._numRecipesAtSequence; }
	
	addElf(index){
		let elf = new Elf(index, this._data);
		this._elves.push(elf);
	}
	
	next(){
		let newTotal = this._calculateTotal();
		let digits   = this._parseDigits(newTotal);
		
		for (let digit of digits) {
			this._data.push(digit);
			this._addToSequence(digit);
		}	
		
		this._eachElf((elf)=>elf.move());
	}
	
	getRecipe(index){ return this._data.get(index); }
	toString(){ return this._data.toString(); }
	
	_calculateTotal(){
		let total = 0;
		this._eachElf((elf) => {
			total += elf.value;
		});
		return total;
	}
	_parseDigits(number){
		if (number === 0) return [0];
	
		let digits = [ ]
		while (number > 0) {
			digits.push (number % 10);
			number = Math.floor (number / 10);
		}
		return digits.reverse();
	}
	
	_addToSequence(digit){
		if (this._hasReachedTarget) return;
		
		this._sequence.enqueue(digit.toString());
		this._hasReachedTarget = this._sequence.equals(this._targetSequence);
		
		// Store the number of digits for the sequence here, in case we add another one afterwards
		if (this._hasReachedTarget)
			this._numRecipesAtSequence = this._data.size;
	}
	
	_eachElf(f){
		for (let elf of this._elves)
			f(elf);
	}
}

class Main {
	constructor(recipeCount, numScores, targetSequence){
		targetSequence = targetSequence.toString().split("");
		
		this._exercise = new Exercise(targetSequence);
		this._targetSequence = targetSequence;
		this._recipeCount = recipeCount;
		this._scoresTrack = numScores;
		
		this._addElves();
	}
	
	run(){
		let part1EndCount = this._recipeCount + this._scoresTrack;
		
		let hasFinishedPart1 = false;
		let hasFinishedPart2 = false;
		
		let part1Result = null;
		let part2Result = null;
		
		let index = 0;
		while (!hasFinishedPart1 || !hasFinishedPart2){
			this._exercise.next();
			
			// part 1 check
			if (!hasFinishedPart1 && this._exercise.numRecipes >= part1EndCount){
				console.log("Finished Part 1");
				
				part1Result = this._checkPart1(part1EndCount);
				hasFinishedPart1 = true;
			}
			
			// part 2 check
			if (!hasFinishedPart2 && this._exercise.hasTargetSequence){
				console.log("Finished Part 2");
				
				part2Result = this._checkPart2(index);
				hasFinishedPart2 = true;
			}
			
			index++;
		}
	
		return {part1Result, part2Result}
	}
	
	get _numRecipes(){ return this._exercise.numRecipes; }
	
	_addElves(){
		this._exercise.addElf(0);
		this._exercise.addElf(1);
	}
	
	_checkPart1(endCount){
		let extraDigits = "";
		for (let index = this._recipeCount; index < endCount; index++)
			extraDigits += this._exercise.getRecipe(index);
		
		return extraDigits;
	}
	_checkPart2(){
		return this._exercise.recipesAtSequence - this._targetSequence.length;
	}
}

function runTest(testName, numRecipes, targetSequence){
	console.log(`Running tests for ${testName}`);
	
	let main = new Main(numRecipes, 10, targetSequence);
	let {part1Result, part2Result} = main.run();
	
	console.log(`${testName} Results:
		Part 1: ${part1Result}
		Part 2: ${part2Result}
	`);
}

runTest("Example 1", 9, 51589);
runTest("Example 2", 5, "01245");
runTest("Example 3", 18, 92510);
runTest("Example 4", 2018, 59414);
runTest("Main Exercise", 919901, "919901");
