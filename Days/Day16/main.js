let modules = "../../Library/Modules";

let File = require (modules + "/File.js");
let UI = require ("./Modules/UI.js");

let FILE_INPUT = "./Input/Input.txt";

File.read(FILE_INPUT).then((data)=>{
  let ui = new UI(data.replace(/\r/g, ""));
  ui.run();
});
