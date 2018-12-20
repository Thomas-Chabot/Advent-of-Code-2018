let library = "../../Library/Modules";
let input = "./input/example.txt";

let File = require (library + "/File.js");
let UI   = require ("./modules/UI.js");

File.read(input).then((data)=>{
  let ui = new UI(data, 10, 10);
  console.log(ui.toString());

  ui.run(10);

  // exercise result code here
}, (err)=>console.log(err));
