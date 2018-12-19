let modules = "../../Library/Modules";

let UI = require ("./Modules/UI.js");
let File = require (modules + "/File.js");

let FILE_INPUT = "./Input/Input.txt";

File.read(FILE_INPUT).then((data)=>{
  let ui = new UI(data);
  ui.run();

  console.log(ui.toString());
})
