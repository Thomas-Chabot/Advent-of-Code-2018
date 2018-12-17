let Droplet = require ("./Droplet.js");

class WaterSpring{
  constructor(grid, position){
    this._grid = grid;
    this._position = position;

    this._droplets = [ ];
    this._hasValidDrop = true;
  }

  get isValid(){ return this._hasValidDrop; }

  next(){
    this._spread();
    this._pushDown();
  }

  _each(f){
    for (let droplet of this._droplets)
      f(droplet);
  }
  _spread(){
    let droplet = new Droplet(this._grid, this._position.down);
    this._droplets.push(droplet);

    return droplet;
  }
  _pushDown(){
    let hasValidDrop = false;

    this._each((droplet)=>{
      if (droplet.drop())
        hasValidDrop = true;
    });

    this._hasValidDrop = hasValidDrop;
  }
}

module.exports = WaterSpring;
