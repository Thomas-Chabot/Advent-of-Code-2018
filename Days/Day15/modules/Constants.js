const libraryDir = "../../../Library"
const dataStructures = libraryDir + "/DataStructures";
const modules = libraryDir + "/modules";

let HIT_POINTS = 200;
let ATTACK_POWER = 3;

let TYPE_ELF = "E";
let TYPE_GOBLIN = "G";
let TYPE_WALL = "#";
let TYPE_OPEN = ".";

module.exports = {
  libraryDir,
  dataStructures,
  modules,

  HIT_POINTS,
  ATTACK_POWER,

  TYPE_ELF,
  TYPE_GOBLIN,
  TYPE_WALL,
  TYPE_OPEN
};
