/* Returns a function that takes in a single argument, the module calling the function,
    and returns a boolean indicating if the module was called from the command line.
    
   If the result is true, the module was called via command line arguments;
   If the result is false, the module was called by require(module)
*/

function isMainModule(module){
  return require.main === module;
}

module.exports = isMainModule;
