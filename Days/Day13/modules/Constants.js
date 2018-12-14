const libraryDir = "../../../Library"
const dataStructures = libraryDir + "/DataStructures";
const modules = libraryDir + "/modules";

/* Depdencies */
let Direction = require (libraryDir + "/Direction.js");
let Point = require (libraryDir + "/Point.js");

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
  '\\': true
};

let POINT_OFFSET = new Point(1,1);
let GRID_EXTRA = new Point(2,2);

module.exports = {
  libraryDir,
  dataStructures,
  modules,

  TYPE_WALL,
  TYPE_FLOOR,
  TYPE_CART,

  CART_TYPES,
  FLOOR_TYPES,

  GRID_EXTRA,
  POINT_OFFSET
};
