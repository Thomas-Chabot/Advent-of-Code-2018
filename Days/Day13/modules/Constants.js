const libraryDir = "../../../Library"
const dataStructures = libraryDir + "/DataStructures";
const modules = libraryDir + "/modules";
const vectors = libraryDir + "/Vectors";

/* Depdencies */
let Direction = require (vectors + "/Direction.js");
let Rotation = require (vectors + "/Rotations.js");
let Point = require (vectors + "/Vector2.js");

/* Constants */
const TYPE_FLOOR = ".";
const TYPE_WALL  = "#";
const TYPE_CART  = "C";
let CART_TYPES = {
  'v': Direction.down,
  '^': Direction.up,
  '<': Direction.left,
  '>': Direction.right
};
let FLOOR_TYPES = {
  'v': true,
  '^': true,
  '<': true,
  '>': true,
  '|': true,
  '-': true,
  '/': true,
  '\\': true,
  '+': true
};

let CART_TURNS = [
  Rotation.left,
  Rotation.straight,
  Rotation.right
];

let POINT_OFFSET = new Point(0,0);
let GRID_EXTRA = new Point(0,0);

module.exports = {
  libraryDir,
  dataStructures,
  modules,
  vectors,

  TYPE_WALL,
  TYPE_FLOOR,
  TYPE_CART,

  CART_TYPES,
  FLOOR_TYPES,

  CART_TURNS,

  GRID_EXTRA,
  POINT_OFFSET
};
