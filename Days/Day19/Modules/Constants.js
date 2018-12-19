const libraryDir = "../../../Library"
const dataStructures = libraryDir + "/DataStructures";
const modules = libraryDir + "/modules";
const baseCode = "../../Day16/Modules";
const baseOperations = baseCode + "/Operation";
const operation = "./Operation";

// Converts from the Operation directory to this directory
const operationOffset = "../";

const DEBUG = false;
module.exports = {
  libraryDir,
  dataStructures,
  modules,

  baseCode,
  baseOperations,
  operation,
  operationOffset,

  DEBUG
};
