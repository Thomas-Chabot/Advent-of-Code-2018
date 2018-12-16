let library = "../../Library/Modules";
let input = "./input/input.txt";
let output = "./output";

let File = require (library + "/File.js");
let UI   = require ("./modules/UI.js");

File.read(input).then((data)=>{
  let ui = new UI(data);
  console.log(ui.grid.toString());

  ui.run();

  // exercise result code here
}, (err)=>console.log(err));
