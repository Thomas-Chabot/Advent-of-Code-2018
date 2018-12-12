/*
  A simplified Trie implementation. At the current point, only supports add, get & search operations.
  Documentation:
    add(key : String, value : Any)
      Purpose: Adds a new value to the Trie.
      Arguments:
        key  String  The key to use for the new value. This will be the identifier for the value later on with get/search operations.
        value  Any   The value to add under the given key.
    get(key : String) : String
      Purpose : Returns the value that was added for the given key, or null if no value exists.
    search(length : Integer, getNextCharacterFunc(index : Integer) : Character) : String
      Purpose : Searches the Trie for a given key. This has the benefit of not needing every character right away, which can be faster
                  in case grabbing the value for the key requires additional resources.
      Arguments :
        length  Integer  The length of the key that will be used
        getNextCharacterFunc(index : Integer) : Character
          A function to get the next character in the sequence (to be used for the key).
          Will be passed in the current index, where 0 <= index < length,
            and should return a character to use for the next character in the key.
      Returns:
        The value associated with the given key sequence, or null if no value was found.
*/

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
		if (index === length){
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
		
		while (curNode && index < pathLength){
			let nextKey = getNextStepFunc(index);
		
			prevNode = curNode;
			curNode = curNode.getChild(nextKey);
			
			index++;
		}
		
		return {curNode, prevNode, index};
	}
}
