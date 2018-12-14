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
