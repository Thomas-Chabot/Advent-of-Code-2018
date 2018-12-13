let library = "../../Library";
let input = "./input/input.txt";
let output = "./output";

let File = require (library + "/File.js");
let UI   = require ("./modules/UI.js");

File.read(input).then((data)=>{
  console.log("H");
  let ui = new UI(data);
  console.log(ui.grid.toString());

  // exercise result code here
}, (err)=>console.log(err));
