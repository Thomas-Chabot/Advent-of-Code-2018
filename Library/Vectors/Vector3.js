let VectorBase = require ("./VectorBase.js");
let isMainModule = require ("../Modules/IsMainModule.js");

class Vector3 extends VectorBase {
  constructor(x,y,z){
    super(x, y, z);
  }

  get x(){ return this.getCoordinate(0); }
  get y(){ return this.getCoordinate(1); }
  get z(){ return this.getCoordinate(2); }

  distanceTo(other){
    return Math.abs(other.x - this.x) +
           Math.abs(other.y - this.y) +
           Math.abs(other.z - this.z);
  }

  _new(coords){ return new Vector3(...coords); }
}

function test(){
  let p1 = new Vector3(0,1,0);
  let p2 = new Vector3(1,0,0);
  let p3 = new Vector3(0,0,1);

  console.log(p1.toString());
  console.log(p2.toString());
  console.log(p3.toString());

  let p4 = p1.add(p2);
  let p5 = p2.subtract(p3);

  console.log(p4.toString());
  console.log(p5.toString());

  console.log(`Distance from ${p1} to ${p2}: ${p1.distanceTo(p2)}`);
  console.log(`Distance from ${p2} to ${p4}: ${p2.distanceTo(p4)}`);
  console.log(`Distance from ${p2} to ${p5}: ${p2.distanceTo(p5)}`);
}

if (isMainModule(module))
  test();

module.exports = Vector3;
