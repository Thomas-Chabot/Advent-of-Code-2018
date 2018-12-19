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
			let value = this._parse(lines[i], i);
			if (value)
				result.push(value);
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
	_parseInts(...values){
		let result = [ ];
		for (let value of values)
			result.push(this._parseInt(value));
		return result;
	}
	_parseInt(value){
		let result = parseInt(value);
		if (isNaN(result))
			return value;
		return result;
	}

	/* Must Overload */
	_run(data){
		throw new Error("_run method must be overloaded");
	}
	_parse(line, lineNumber){
		throw new Error("_parse method must be overloaded");
	}
}

module.exports = UIBase;
