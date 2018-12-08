class Node {
	constructor(childNodes, metadata){
		if (!childNodes) childNodes = [ ];
		if (!metadata) metadata = [ ];
	
		this._header = {
			numChildren: childNodes.length,
			numMetadata: metadata.length
		};
		this._childNodes = childNodes;
		this._metadata = metadata;
	}
	
	get metaDataTotal() {
		let total = 0;
		for (let data of this._metadata)
			total += data;
		return total;
	}
	
	get numMetaData(){ return this._header.numMetaData; }
	get metadata(){ return this._metadata; }
	
	get numChildren(){ return this._header.numChildren; }
	get children(){ return this._childNodes; }
	getChild(index){ return this._childNodes[index]; }
	
	eachChild(f){
		for (var child of this._childNodes)
			f(child);
	}
};

class Tree {
	constructor(base){
		this._base = base;
	}
	
	get metaDataTotal(){
		let total = 0;
		this._traverse((node)=>{
			total += node.metaDataTotal;
			return node.children;
		});
		return total;
	}
	
	get value(){
		let total = 0;
		this._traverse((node)=>{
			if (node.numChildren === 0) {
				total += node.metaDataTotal;
				return [];
			}
			
			let childNodes = [ ];
			for (let metadata of node.metadata){
				let childIndex = metadata - 1; // converts into the starting index of 0
				
				let child = node.getChild(childIndex);
				if (!child) console.error(`Could not find child at index ${childIndex} in node with ${node.numChildren} child(ren)`);
				else childNodes.push(child);
			}
			return childNodes;
		});
		return total;
	}
	
	_traverse(f){
		let nodes = [this._base];
		for (var node of nodes) {
			let newNodes = f(node);
			for (let node of newNodes)
				nodes.push(node);
		}
	}
}

class UIBase {
	/* Constructor */
	constructor(text, splitter){
		if (splitter === undefined) splitter = "\n";
		let lines = text.trim().split(splitter);
		this._data = this._construct(lines);
	}
	
	/* Public Methods */
	run(){
		this._each((d)=>this._run(d));
	}
	
	/* Private Methods */
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
	_get(index){ return this._data[index]; }
	
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
		super(text, " ");
	}
	
	run(){
		let tree = new Tree (this._parseNode(0).data);
		let total = tree.metaDataTotal;
		let value = tree.value;
		
		console.log(`Part 1 Result: ${total}`);
		console.log(`Part 2 Result: ${value}`);
	}
	
	_parse(data){ return parseInt(data); }
	
	/* Parsing Functions */
	// Nodes
	_parseNode(index){
		let numChildNodes = this._get(index ++);
		let numMetaData = this._get(index ++);
		
		var [childNodes, index] = this._getChildNodes(index, numChildNodes);
		var [metadata, index] = this._getMetadata(index, numMetaData);
		
		let node = new Node(childNodes, metadata);
		return {
			data: node, 
			index: index
		};
	}
	_getChildNodes(index, numChildNodes){
		return this._parseData(index, numChildNodes, (index)=>this._parseNode(index));
	}
	
	// Metadata
	_getMetadata(index, numMetaDatas){
		return this._parseData(index, numMetaDatas, (index)=>{
			return {
				data: this._get(index),
				index: index + 1
			}
		});
	}
	
	// main parsing function
	_parseData(index, numDatas, parseFunc){
		let data = [ ];
		for (let i = 0; i < numDatas; i++){
			let result = parseFunc(index);
			
			data.push(result.data);
			index = result.index;
		}
		
		return [
			data,
			index
		];
	}
}

//let ui = new UI("2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2");
let ui = new UI(document.body.innerText);
ui.run();
