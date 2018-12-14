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
	constructor(){
		this._data = new CircularArray(3, 7);
		this._elves = [ ];
	}
	
	get numRecipes(){ return this._data.size; }
	
	addElf(index){
		let elf = new Elf(index, this._data);
		this._elves.push(elf);
	}
	
	next(){
		let newTotal = this._calculateTotal();
		let digits   = this._parseDigits(newTotal);
		
		for (let digit of digits)
			this._data.push(digit);
		
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
	
	_eachElf(f){
		for (let elf of this._elves)
			f(elf);
	}
}

class Main {
	constructor(recipeCount, numScores){
		this._exercise = new Exercise();
		this._recipeCount = recipeCount;
		this._scoresTrack = numScores;
		
		this._addElves();
	}
	
	run(){
		let endCount = this._recipeCount + this._scoresTrack;
		while (this._exercise.numRecipes < endCount)
			this._exercise.next();
		
		let extraDigits = "";
		for (let index = this._recipeCount; index < endCount; index++)
			extraDigits += this._exercise.getRecipe(index);
		
		return extraDigits;
	}
	
	_addElves(){
		this._exercise.addElf(0);
		this._exercise.addElf(1);
	}
}

let exercise = new Main(919901, 10);
exercise.run()
