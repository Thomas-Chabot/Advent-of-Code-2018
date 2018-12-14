class Queue{
	constructor(...data){
		this._queue = [...data];
		this._offset = 0;
	}
	
	getLength(){ return this._queue.length - this._offset; }
	isEmpty(){ return this.getLength() === 0; }
	enqueue(item){ this._queue.push(item); }
	
	peek(){
		return (this._queue.length > 0 ? queue[offset] : undefined);
	}
  
	dequeue(){
		// if the queue is empty, return immediately
		if (this._queue.length == 0) return undefined;

		// store the item at the front of the queue
		var item = this._queue[this._offset];

		// increment the offset and remove the free space if necessary
		if (++ this._offset * 2 >= this._queue.length){
		  this._queue  = this._queue.slice(this._offset);
		  this._offset = 0;
		}

		// return the dequeued item
		return item;
	}
	
	equals(arr){
		let index = 0;
		for (let element of this){
			if (element !== arr[index])
				return false;
			index ++;
		}
		return index === arr.length;
	}
	
    	[Symbol.iterator](){
		let index = -1;
		let queue = this._queue;
		let offset = this._offset;
		
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

module.exports = Queue;
