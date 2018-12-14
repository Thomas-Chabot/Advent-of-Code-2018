let Queue = require ("./Queue.js");

class FixedSizeQueue extends Queue {
	constructor(maxSize, ...data){
		super(...data);
		this._sizeLimit = maxSize;
	}
	
	enqueue(item){
		super.enqueue(item);
		
		console.log(this.getLength(), this._sizeLimit)
		while (this.getLength() > this._sizeLimit)
			this.dequeue();
	}
}

module.exports = FixedSizeQueue;
