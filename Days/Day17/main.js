let library = "../../Library/Modules";
let input = "./input/example.txt";
let output = "./output/example.txt";

let File = require (library + "/File.js");
let UI   = require ("./modules/UI.js");

File.read(input).then((data)=>{
  let ui = new UI(data);
//  console.log(ui.grid.toString());

//  ui.run();

  // exercise result code here
  File.write(output, ui.output);
}, (err)=>console.log(err));
