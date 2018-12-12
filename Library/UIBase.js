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
