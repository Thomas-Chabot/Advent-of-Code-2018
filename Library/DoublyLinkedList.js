class Node {
  constructor(data){
    this._data = data;
  }

  get data(){ return this._data; }
  get next(){ return this._next; }
  get prev(){ return this._prev; }

  set next(next){ this._next = next; }
  set prev(prev){ this._prev = prev; }
}

class DoublyLinkedList{
  constructor(){
    this._dummy = null;
    this._lastNode = null;
  }

  get(index){

  }

  set(index, data){

  }

  add(index, data){

  }

  remove(index){

  }
}
