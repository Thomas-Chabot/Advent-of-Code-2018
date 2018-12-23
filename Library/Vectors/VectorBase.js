class VectorBase {
  constructor(...coordinates){
    this._coordinates = coordinates;
  }

  getCoordinate(index){ return this._coordinates[index]; }
  add(otherPoint){
    return this._createFromMap((value,index)=>value + otherPoint.getCoordinate(index));
  }
  subtract(otherPoint){ return this.add(otherPoint.inverse()); }
  inverse(){
    return this._createFromMap((value)=>-value);
  }

  isGreaterThan(otherPoint){
    return this._compare(otherPoint, ((a,b)=>a > b));
  }
  isLessThan(otherPoint){
    return this._compare(otherPoint, ((a,b)=>a < b));
  }

  toString(){
    return `(${this._coordinates.join(", ")})`;
  }
  equals(otherPoint){
    return this._compare(otherPoint, ((a,b)=>a === b));
    return this._compare((value,index)=>value === otherPoint.getCoordinate(index));
  }

  get _numCoordinates(){ return this._coordinates.length; }

  _compare(otherPoint, f){
    if (this._numCoordinates !== otherPoint._numCoordinates) return false;
    return this._coordinates.every((value,index)=>{
      let otherValue = otherPoint.getCoordinate(index);
      return f(value, otherValue);
    });
  }
  _createFromMap(f){
    let newValues = this._coordinates.map(f);
    return this._new(newValues);
  }

  _new(){
    throw "Method Not Implemented";
  }
}

module.exports = VectorBase;
