let Modules  = "../../Library/Modules";

let UI       = require ("./Modules/UI.js");
let File     = require (Modules + "/File.js");

let inputFile = "./Input/input.txt";

File.read(inputFile).then((data)=>{
  let ui = new UI(data);
  console.log("bots in range: ", ui.result);
});
