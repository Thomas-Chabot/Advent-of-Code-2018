class Node {
  constructor(data){
    this._data = data;
  }

  get data(){ return this._data; }
  get next(){ return this._next; }
  get prev(){ return this._prev; }

  set data(d){ this._data = d; }
  set next(next){ this._next = next; }
  set prev(prev){ this._prev = prev; }
}

class DoublyLinkedList{
  /* Constructor */
  constructor(){
    this._dummy = this._makeDummy();
    this._length = 0;
  }

  /* Public Methods */
  get(index){
    return this._getNodeAt(index).data;
  }

  set(index, data){
    this._getNodeAt(index).data = data;
  }

  add(index, data){
    let nextNode = this._getNodeAt(index);
    this._addBefore(nextNode, data);
  }

  remove(index){
    let node = this._getNodeAt(index);
    this._removeNode(node);
  }

  toString(){
    let stringForward = this._stringify((node)=>node.next);
    let stringBackward = this._stringify((node)=>node.prev);

    return `
      String Forward: ${stringForward},
      String Backward: ${stringBackward}
    `;
  }

  /* Private Methods */
  // Constructor Helpers - Make the dummy node
  _makeDummy(){
    let dummy = new Node(null);
    dummy.next = dummy;
    dummy.prev = dummy;

    return dummy;
  }

  // Stringify
  _stringify(getNextNode){
    let stringified = "";
    this._traverse((node)=>{
      stringified += node.data + ", ";
    }, getNextNode);
    return stringified;
  }

  // Main operations
  _addBefore(nextNode, data){
    let newNode = new Node(data);

    newNode.prev = nextNode.prev;
    newNode.next = nextNode;

    newNode.prev.next = newNode;
    newNode.next.prev = newNode;

    this._length ++;
  }
  _removeNode(node){
    node.prev.next = node.next;
    node.next.prev = node.prev;

    this._length --;

    return node.data;
  }

  // Node Traversals
  _each(f){
    this._traverse(f, (node)=>node.next);
  }
  _eachBackward(f){
    this._traverse(f, (node)=>node.prev);
  }
  _traverse(f, getNext){
    this._move(getNext(this._dummy), this._length, (node)=>{
      f(node);
      return getNext(node);
    })
  }

  // Get the node at a given index
  _getNodeAt(index){
    if (index < this._length / 2) {
      return this._moveForward(this._dummy.next, index);
    } else {
      return this._moveBackward(this._dummy, this._length - index)
    }

    return this._offset(this._dummy.next, index);
  }

  // Move forward / backward from a node, with a given offset
  _moveForward(originNode, offset){
    return this._move(originNode, offset, (node)=>node.next);
  }
  _moveBackward(originNode, offset){
    return this._move(originNode, offset, (node)=>node.prev);
  }
  _move(originNode, numMovements, getNextNode){
    let node = originNode;
    for (let i = 0; i < numMovements; i++)
      node = getNextNode(node);
    return node;
  }
}


// Testing Code
let list = new DoublyLinkedList();
list.add(0, "Test [1]");
list.add(1, "Test [2]");
list.add(0, "Test [0]");
list.add(3, "Test [3]");

console.log("After Additions:");
console.log(list.toString());

list.remove(2);
list.remove(1);

console.log("After Removals:");
console.log(list.toString());

list.set(0, "Test - Reset [0]");
list.set(1, "Test - Reset [1]");

console.log("After Setting:");
console.log(list.toString());

console.log (`Index 0 contains: ${list.get(0)}`)
console.log (`Index 1 contains: ${list.get(1)}`)
