const MULTIPLE = 23;
const STEPS_BACK = -7;
const STEPS_FORWARD = 2;

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

    return newNode;
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

class MarblesGame extends DoublyLinkedList {
  constructor(){
    super();

    this._length ++;
    this._dummy.data = 0;
    this._currentNode = this._dummy;
  }

  add(data){
    this._currentNode = this._addBefore(this._currentNode, data);
  }
  remove(){
    let removedValue = this._removeNode(this._currentNode);
    this._currentNode = this._currentNode.next;

    return removedValue;
  }

  offset(offset){
    if (offset > 0)
      this._currentNode = this._getOffsetForward(offset);
    else
      this._currentNode = this._getOffsetBackward(-offset);
  }

  toString(){
    let str = super.toString();
    str += `\nCurrent Node: ${this._currentNode.data}`;
    return str;
  }

  _getOffsetForward(offset){
    return this._moveForward(this._currentNode, offset);
  }
  _getOffsetBackward(offset){
    return this._moveBackward(this._currentNode, offset);
  }
}

class Player {
  constructor(playerId){
    this._playerId = playerId;
    this._points = 0;
  }

  get points(){ return this._points; }
  get playerId(){ return this._playerId; }

  addPoints(points){
    this._points += points;
  }
}

class Players {
  constructor(numPlayers){
    this._players = this._createPlayersArray(numPlayers);

    this._numPlayers = numPlayers;
    this._currentPlayer = 0;
  }

  get next(){
    let player = this._players [this._currentPlayer];
    this._currentPlayer = (this._currentPlayer + 1) % this._numPlayers;

    return player;
  }

  get highestScore(){
    let highest = 0;
    for (let player of this._players){
      if (player.points > highest)
        highest = player.points;
    }
    return highest;
  }

  _createPlayersArray(numPlayers){
    let players = [ ];
    for (let i = 0; i < numPlayers; i++)
      players.push (new Player(i));
    return players;
  }
}

class Game {
  constructor(numPlayers){
    this._game = new MarblesGame();
    this._players = new Players(numPlayers);
  }

  get highestScore(){ return this._players.highestScore; }

  next(marble){
    let player = this._players.next;

    if (marble % MULTIPLE === 0) {
      this._game.offset(STEPS_BACK);
      let removedMarble = this._game.remove();

      player.addPoints(marble);
      player.addPoints (removedMarble);
    } else {
      this._game.offset(STEPS_FORWARD);
      this._game.add(marble);
    }
  }

  toString(){ return this._game.toString(); }
}

function run(numPlayers, numMarbles) {
  let game = new Game(numPlayers);

  for (let marble = 1; marble < numMarbles; marble++) {
    game.next(marble);
  }

  return game.highestScore;
}

let answerPart1 = run(465, 71498);
let answerPart2 = run(465, 7149800);

console.log (`Part 1 Result: ${answerPart1}`);
console.log (`Part 2 Result: ${answerPart2}`);
