let library = "../../Library";
let input = "../input/input.txt";
let output = "../output";

let File = require (library + "/File.js");
let UI   = require ("./modules/UI.js");

File.read(input, (data)=>{
  let ui = new UI(data);
  
  // exercise result code here
});
