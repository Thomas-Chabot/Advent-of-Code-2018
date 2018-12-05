let CHAR_CODE_A = 97;
let CHAR_CODE_Z = 122;

class Parser {
	constructor(data, doDebug) {
		this._data = data;
		this._doDebug = doDebug;
		
		this._toIgnore = "";
	}

	set ignoredCharacter(c) { this._toIgnore = c; }
	
	run(){
		let storedIndex = 0;
		let storedData = [this._data [0]];
		
		let actualIndex = 1;
		let actualData = this._data;
		
		let toIgnore = this._toIgnore.toLowerCase();
		let isDebugMode = this._doDebug;
		
		while (actualIndex < actualData.length) {
			let nextCharacter = actualData[actualIndex];
			let lastCharacter = storedData[storedIndex];
			
			if (nextCharacter.toLowerCase() === toIgnore) {
				actualIndex++;
				continue;
			}
			
			let areEqual = this._areEqual (lastCharacter, nextCharacter);
			
			if (isDebugMode)
				console.log (`Comparing ${lastCharacter} with ${nextCharacter}: ${areEqual}`);
			
			if (areEqual) {
				storedData.pop();
				storedIndex --;
			} else {
				storedData.push (nextCharacter);
				storedIndex ++;
			}
			
			actualIndex ++;
		}
		
		return storedIndex;
	}
	
	_areEqual(a,b) {
		if (!a || !b) return false;
		return Math.abs(a.charCodeAt(0) - b.charCodeAt(0)) === 32;
	}
}

class UI {
	constructor(data) {
		this._parser = new Parser(data.split(""));
	}
	
	run() {
		let part1Result = this._run();
		console.log (`Part 1 Result: ${part1Result}`);
		
		let part2Result = this.shortestPolymer;
		console.log (`Part 2 Result: ${part2Result}`);
	}
	
	get shortestPolymer() {
		let shortestResult = 9e9;
		for (let char = CHAR_CODE_A; char <= CHAR_CODE_Z; char++) {
			let character = String.fromCharCode(char);
			this._parser.ignoredCharacter = character;
			
			let result = this._run();
			console.log (`Checking character ${character}: ${result}`);
			
			if (result < shortestResult)
				shortestResult = result;
		}
		return shortestResult;
	}
	
	_run(){
		return this._parser.run();
	}
}

let data = `dabAcCaCBAcCcaDA`;
new UI(data).run()
