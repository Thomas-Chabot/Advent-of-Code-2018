// This class handles determining which op code number corresponds with which op code
let OpCodeValues = require ("./OpCodes.js");

class OpCodeData {
  constructor(){
    this._data = [ ];
  }

  store(index, possibleOpCodes){
    this._mergePossibleOpCodes(index, possibleOpCodes);
  }

  getOperator(opIndex){
    let opCode = this._data[opIndex];
    return OpCodeValues[opCode];
  }

  calculateOperatorIndices(){
    let results = [ ];
    let data = this._data.slice();

    let validIndices = this._getValidIndices(data);
    while (validIndices.length > 0){
      let checkIndex = validIndices.pop();
      let checkData  = data[checkIndex][0];
      results[checkIndex] = checkData;

      let validatedIndices = this._clearOperator(data, checkIndex, checkData);
      validIndices.push(...validatedIndices);
    }

    return results;
  }
  toString(){
    let results = "";
    for (let index in this._data){
      let data = this._data[index].toString();
      results += `${index}: ${data}\n`;
    }
    return results;
  }

  // Calculating Operator Indices
  _getValidIndices(data){
    let valid = [ ];
    for (let index in data){
      if (data[index].length === 1)
        valid.push(index);
    }
    return valid;
  }
  _clearOperator(data, ignoreIndex, operator){
    let valid = [ ];
    for (let index in data){
      if (index === ignoreIndex) continue;

      let array = data[index];
      let opIndex = array.indexOf(operator);
      if (opIndex === -1) continue;

      array.splice(opIndex, 1);
      if (array.length === 1)
        valid.push(index);
    }
    return valid;
  }

  // Adding new operator results
  _mergePossibleOpCodes(index, possibilities){
    if (!this._data[index])
      this._data[index] = possibilities;
    else {
      this._data[index] = this._intersect(this._data[index], possibilities);
    }
  }
  _intersect(arr1, arr2){
    let setA = new Set(arr1);
    let setB = new Set(arr2);
    let intersected = new Set([...setA].filter(x => setB.has(x)));
    return Array.from(intersected);
  }
}

module.exports = OpCodeData;
