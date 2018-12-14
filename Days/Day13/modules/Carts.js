/* Constants */
let Constants = require ("./Constants.js");
let {dataStructures} = Constants;

/* Dependencies */
let PQueue = require (dataStructures + "/PriorityQueue.js");
let Cart = require ("./Cart.js");

class Carts {
  constructor(grid){
      this._carts = this._getPQueue();
      this._grid = grid;
  }

  add(position, direction){
    let cart = new Cart(position, direction);
    this._carts.push(cart);
  }

  update(){
    this._each((cart) => {
      cart.update(this._grid);
    })
  }

  _each(f){
    // In order to keep everything in the correct ordering, will need to:
    //   1) Create a new, blank heap
    //   2) Pull data out of the current heap & call the function each time
    //   3) At the same time, push the data into the new heap
    //   4) Store the new heap as the carts heap

    let newHeap = this._getPQueue();
    while (this._carts.size() > 0) {
      let nextCart = this._carts.pop();
      f(nextCart);
      newHeap.push(nextCart);
    }
    this._carts = newHeap;
  }

  _getPQueue(){
    return new PQueue((cart1, cart2) =>{
      // 1) if one cart is below the other, the one higher up should come first
      // 2) take whichever one is closer to the left
      console.log(`Cart 1: ${cart1.currentRow}, Cart 2: ${cart2.currentRow}`);
      if (cart1.currentRow > cart2.currentRow)
        return false;
      else if (cart1.currentRow < cart2.currentRow)
        return true;

      return cart1.currentCol < cart2.currentCol;
    });
  }
}

module.exports = Carts;
