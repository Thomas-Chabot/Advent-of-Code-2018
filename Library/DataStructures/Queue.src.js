
function Queue(){

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  }

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  }

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item){
    queue.push(item);
  }

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  }

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }
  
  /* Returns true if the elements in the queue matches the elements
   * in the given array
   */
  this.equals = function(arr){
	let index = 0;
	for (let element of this){
		if (element !== arr[index])
			return false;
		index ++;
	}
	return index === arr.length;
  }
  
  /* Returns an iterator so that the Queue can be looped through */
  this[Symbol.iterator] = function(){
	let index = -1;
	return {
		next: ()=>{
			index ++;
			return {
				value: queue [offset + index],
				done: offset + index === queue.length
			};
		}
	}
  }
}
