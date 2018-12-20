let library = "../../Library/Modules";
let input = "./input/example.txt";
let output = "./output/out{INDEX}.txt";

let File = require (library + "/File.js");
let Image = require (library + "/Image.js");
let UI   = require ("./modules/UI.js");
let Constants = require ("./modules/Constants.js");

let {TYPE_CART, TYPE_WALL, TYPE_FLOOR} = Constants;

let imageColors = {
  [TYPE_CART]: [255, 0, 0, 255],
  [TYPE_FLOOR]: [0, 0, 0, 255],
  [TYPE_WALL]: [255, 255, 255, 255]
}

File.read(input).then((data)=>{
  let ui = new UI(data);
  let index = 0;

  ui.run((grid)=>{
    index++;

    let filePath = output.replace("{INDEX}", index);
    return Image.write(filePath, grid, imageColors);
  });

  // exercise result code here
}, (err)=>console.log(err));
